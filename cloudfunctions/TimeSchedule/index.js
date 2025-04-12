/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

const db = cloud.database()

// 计算结束时间（30分钟后）
function getEndTime(startTime) {
  const [hours, minutes] = startTime.split(':').map(Number)
  const date = new Date(2000, 0, 1, hours, minutes)
  date.setMinutes(date.getMinutes() + 30)
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { type } = event

  // 获取时间安排
  if (type === 'get') {
    try {
      const result = await db.collection('timeSchedules')
        .where({
          professionalId: wxContext.OPENID
        })
        .get()

      if (result.data.length > 0) {
        return {
          code: 0,
          data: result.data[0]
        }
      } else {
        return {
          code: 0,
          data: null,
          message: '未找到时间安排'
        }
      }
    } catch (error) {
      return {
        code: 500,
        message: '获取时间安排失败',
        error: error.message
      }
    }
  }

  // 获取专业人士的时间安排（用于预约页面）
  if (type === 'getProfessionalSlots') {
    try {
      const { professionalId, date } = event
      
      if (!professionalId) {
        return {
          code: 400,
          message: '缺少专业人士ID'
        }
      }
      
      // 获取专业人士的openid - 前端传入的就是openid
      const professionalOpenId = professionalId
      console.log(`专业人士OpenID: ${professionalOpenId}`)
      
      // 查询专业人士的时间安排
      const result = await db.collection('timeSchedules')
        .where({
          professionalId: professionalOpenId
        })
        .get()
      
      console.log(`查询时间安排: professionalOpenId=${professionalOpenId}`)
      console.log(`查询结果数量: ${result.data.length}`)
      
      if (result.data.length === 0) {
        return {
          code: 0,
          data: [],
          message: '未找到该专业人士的时间安排'
        }
      }
      
      const timeSchedule = result.data[0]
      
      // 确保slots字段存在
      if (!timeSchedule.slots || !Array.isArray(timeSchedule.slots)) {
        return {
          code: 0,
          data: [],
          message: '专业人士未设置可用时间段'
        }
      }
      
      // 如果指定了日期，过滤出该日期的时间段
      if (date) {
        const dateSlots = timeSchedule.slots
          .filter(slot => slot.date === date)
          .filter(slot => slot.isBooked !== true) // 过滤掉已预约的时间段
          .map(slot => slot.startTime)
          .sort() // 按时间排序
        
        console.log(`专业人士${professionalOpenId}在${date}的可用时间段数量:`, dateSlots.length)
        
        return {
          code: 0,
          data: dateSlots
        }
      }
      
      // 如果没有指定日期，返回所有有可用时间段的日期
      const availableDates = [...new Set(timeSchedule.slots
        .filter(slot => slot.isBooked !== true) // 使用更安全的比较方式
        .map(slot => slot.date))]
        .sort() // 按日期排序
      
      console.log(`专业人士${professionalOpenId}的可用日期数量:`, availableDates.length)
      
      return {
        code: 0,
        data: availableDates
      }
    } catch (error) {
      console.error('获取专业人士时间安排失败:', error)
      return {
        code: 500,
        message: '获取专业人士时间安排失败',
        error: error.message
      }
    }
  }

  // 更新时间安排
  if (type === 'update') {
    try {
      const { timeSchedule, professionalTypes = [], serviceArea = {} } = event
      const { selectedDays, selectedSlots, slots } = timeSchedule
      
      // 记录前端传入的筛选条件，仅用于日志
      if (professionalTypes && professionalTypes.length > 0) {
        console.log(`前端传入的专业类型筛选: ${JSON.stringify(professionalTypes)}`)
      }
      
      if (serviceArea && Object.keys(serviceArea).length > 0) {
        console.log(`前端传入的服务区域筛选: ${JSON.stringify(serviceArea)}`)
      }
      
      // 检查是否已有提供的slots
      let processedSlots = slots || []
      
      // 如果没有提供预处理的slots，则从selectedSlots转换
      if (!slots || slots.length === 0) {
        processedSlots = []
        // 从selectedSlots中生成slots
        Object.keys(selectedSlots).forEach(date => {
          const times = selectedSlots[date]
          if (!times || times.length === 0) return
          
          times.forEach(time => {
            processedSlots.push({
              date,
              startTime: time,
              endTime: getEndTime(time),
              isBooked: false // 添加预约状态字段
            })
          })
        })
      }
      
      // 获取专业人士信息以便更新timeSchedules表
      let professionalInfo = {}
      let types = []
      let city = ''
      let district = ''
      
      try {
        // 查询专业人士信息
        const professionalResult = await db.collection('professionals').where({
          _openid: wxContext.OPENID
        }).get()
        
        if (professionalResult.data.length > 0) {
          professionalInfo = professionalResult.data[0]
          console.log('获取到专业人士信息:', JSON.stringify(professionalInfo))
          
          // 从数据库记录中提取专业类型 - 始终使用数据库中的完整类型
          types = professionalInfo.professionalTypes || []
          console.log(`专业人士类型(来自数据库): ${JSON.stringify(types)}`)
          
          // 从数据库记录中提取服务区域 - 始终使用数据库中的完整区域信息
          if (professionalInfo.serviceArea) {
            if (typeof professionalInfo.serviceArea === 'object') {
              // 如果是对象格式
              city = (professionalInfo.serviceArea.city || '').trim()
              district = (professionalInfo.serviceArea.district || '').trim()
            } else if (typeof professionalInfo.serviceArea === 'string') {
              // 如果是字符串格式，尝试解析
              try {
                const areaObj = JSON.parse(professionalInfo.serviceArea)
                if (areaObj && typeof areaObj === 'object') {
                  city = (areaObj.city || '').trim()
                  district = (areaObj.district || '').trim()
                } else {
                  city = professionalInfo.serviceArea.trim()
                }
              } catch (e) {
                // 如果解析失败，直接使用字符串
                city = professionalInfo.serviceArea.trim()
              }
            }
          }
          
          console.log(`专业人士服务区域(来自数据库): 城市='${city}', 区域='${district}'`)
        } else {
          console.log('未找到专业人士信息')
        }
      } catch (error) {
        console.error('获取专业人士信息失败:', error)
      }
      
      // 检查是否已存在记录
      const existingSchedule = await db.collection('timeSchedules').where({
        professionalId: wxContext.OPENID
      }).get()
      
      // 构建要保存的数据 - 仅保存slots和updateTime
      const scheduleData = {
        professionalId: wxContext.OPENID,
        slots: processedSlots,
        updateTime: new Date()
      }
      
      // 更新timeSchedules表
      if (existingSchedule.data.length > 0) {
        // 更新记录
        await db.collection('timeSchedules').where({
          professionalId: wxContext.OPENID
        }).update({
          data: scheduleData
        })
      } else {
        // 创建新记录
        await db.collection('timeSchedules').add({
          data: scheduleData
        })
      }
      
      // 提取所有日期用于索引
      const uniqueDates = [...new Set(processedSlots.map(slot => slot.date))]
      
      // 为每个日期创建专业人士日期索引记录
      for (const date of uniqueDates) {
        // 检查是否已存在索引记录
        const existingIndex = await db.collection('professionalDateIndex').where({
          professionalId: wxContext.OPENID,
          date: date
        }).get()
        
        // 构建索引数据 - 包含professionalId, date, city, district, types
        const indexData = {
          professionalId: wxContext.OPENID,
          date: date,
          professionalTypes: types || [],
          city: city || '',
          district: district || '',
          updateTime: new Date()
        }
        
        console.log(`创建索引记录: ${JSON.stringify(indexData)}`)
        
        if (existingIndex.data.length > 0) {
          // 更新记录
          await db.collection('professionalDateIndex').where({
            professionalId: wxContext.OPENID,
            date: date
          }).update({
            data: indexData
          })
        } else {
          // 创建新记录
          await db.collection('professionalDateIndex').add({
            data: indexData
          })
        }
      }
      
      // 删除不再有效的日期索引
      if (existingSchedule.data.length > 0) {
        const oldSchedule = existingSchedule.data[0]
        if (oldSchedule.slots && Array.isArray(oldSchedule.slots)) {
          const oldDates = [...new Set(oldSchedule.slots.map(slot => slot.date))]
          const datesToRemove = oldDates.filter(date => !uniqueDates.includes(date))
          
          for (const dateToRemove of datesToRemove) {
            await db.collection('professionalDateIndex').where({
              professionalId: wxContext.OPENID,
              date: dateToRemove
            }).remove()
          }
        }
      }
      
      return {
        code: 0,
        message: '更新成功',
        data: {
          city,
          district,
          professionalTypes: types,
          dates: uniqueDates
        }
      }
    } catch (error) {
      console.error('更新时间安排失败:', error)
      return {
        code: 500,
        message: '更新失败',
        error: error.message
      }
    }
  }

  // 通过日期和其他条件查找专业人士
  if (type === 'findProfessionalsByTime') {
    try {
      const { date, timeSlot, professionalTypes = [], serviceArea = {} } = event
      
      if (!date) {
        return {
          code: 400,
          message: '缺少日期参数'
        }
      }
      
      console.log(`查询条件: 日期=${date}, 时间段=${timeSlot || '全天'}`)
      console.log(`服务区域: ${JSON.stringify(serviceArea)}`)
      console.log(`专业类型: ${JSON.stringify(professionalTypes)}`)
      
      // 创建基本的查询条件
      const query = {
        date: date
      }
      
      // 添加专业类型条件
      // 注意：professionalTypes字段在数据库中是数组，我们需要查找"数组中包含任意一个指定类型"的记录
      if (professionalTypes && professionalTypes.length > 0) {
        // 使用云数据库的数组查询操作符
        // 如果professionalTypes = ['education', 'repair']
        // 我们需要找到professionalTypes数组中包含'education'或'repair'的记录
        query.professionalTypes = db.command.elemMatch(db.command.in(professionalTypes))
        console.log(`添加专业类型筛选: ${professionalTypes.join(', ')}`)
      }
      
      // 添加服务区域条件 - 仅在有值时添加，避免筛选条件太严格
      if (serviceArea && typeof serviceArea === 'object') {
        if (serviceArea.city && serviceArea.city.trim()) {
          query.city = serviceArea.city.trim()
          console.log(`添加城市筛选: ${serviceArea.city}`)
          
          if (serviceArea.district && serviceArea.district.trim()) {
            query.district = serviceArea.district.trim()
            console.log(`添加区域筛选: ${serviceArea.district}`)
          }
        }
      }
      
      console.log('执行查询:', JSON.stringify(query))
      
      // 首先从日期索引表中查询符合条件的专业人士ID
      const indexResult = await db.collection('professionalDateIndex')
        .where(query)
        .get()
      
      console.log(`查询结果: 找到${indexResult.data.length}条匹配记录`)
      
      // 提取专业人士ID
      const professionalIds = [...new Set(indexResult.data.map(item => item.professionalId))]
      
      console.log(`找到${professionalIds.length}个不同的专业人士ID`)
      
      if (professionalIds.length === 0) {
        return {
          code: 0,
          data: [],
          count: 0
        }
      }
      
      // 查询这些专业人士的时间表，获取具体时间段和更新时间
      const schedulesResult = await db.collection('timeSchedules')
        .where({
          professionalId: db.command.in(professionalIds)
        })
        .field({
          professionalId: true,
          slots: true,
          updateTime: true
        })
        .get()
      
      console.log(`查询到${schedulesResult.data.length}个专业人士的时间表`)
      
      // 处理时间段筛选
      const filteredResults = schedulesResult.data.filter(schedule => {
        // 确保该专业人士有slots数据
        if (!schedule.slots || !Array.isArray(schedule.slots)) {
          return false
        }
        
        // 找出该日期的所有时间段
        const dateSlots = schedule.slots.filter(slot => 
          slot.date === date && !slot.isBooked
        )
        
        // 如果没有指定时间段，只要有该日期的任意时间段即可
        if (!timeSlot) {
          return dateSlots.length > 0
        }
        
        // 根据时间段筛选
        return dateSlots.some(slot => {
          const startHour = parseInt(slot.startTime.split(':')[0])
          
          if (timeSlot === 'morning') {
            // 上午 (9:00-12:00)
            return startHour >= 9 && startHour < 12
          } else if (timeSlot === 'afternoon') {
            // 下午 (14:00-18:00)
            return startHour >= 14 && startHour < 18
          } else {
            // 全天
            return true
          }
        })
      })
      
      console.log(`时间段筛选后剩余${filteredResults.length}个专业人士`)
      
      // 创建专业人士ID到updateTime的映射
      const updateTimeMap = {}
      filteredResults.forEach(item => {
        updateTimeMap[item.professionalId] = item.updateTime || new Date(0)
      })
      
      // 获取符合条件的专业人士ID
      const filteredIds = filteredResults.map(item => item.professionalId)
      
      // 按更新时间排序
      const sortedIds = filteredIds.sort((a, b) => {
        const timeA = updateTimeMap[a] || new Date(0)
        const timeB = updateTimeMap[b] || new Date(0)
        // 降序排列，最新更新的排在前面
        return timeB - timeA
      })
      
      return {
        code: 0,
        data: sortedIds,
        count: sortedIds.length,
        sortedByUpdateTime: true
      }
    } catch (error) {
      console.error('查找专业人士出错:', error)
      return {
        code: 500,
        message: '查找专业人士失败',
        error: error.message
      }
    }
  }

  return {
    code: 400,
    message: '无效的请求类型'
  }
} 