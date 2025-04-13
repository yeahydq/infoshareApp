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

// 添加一个工具函数，用于移除对象中的空值
function removeEmptyValues(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  
  const result = {};
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    // 检查值是否为空（空字符串、null、undefined）
    if (value !== '' && value !== null && value !== undefined) {
      // 如果值是对象且不是日期或正则表达式等特殊对象，递归处理
      if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date) && !(value instanceof RegExp) && !(value._internalType)) {
        result[key] = removeEmptyValues(value);
      } else {
        result[key] = value;
      }
    } else {
      console.log(`[查询优化] 移除空值属性: ${key}`);
    }
  });
  
  return result;
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
          city = professionalInfo.selectedCity
          district=professionalInfo.selectedDistrict
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

  // 优化版本：直接通过 professionalDateIndex 查找专业人士
  if (type === 'findProfessionalsByIndex') {
    try {
      const { 
        date, 
        timeSlot = '', 
        professionalTypes = [], 
        serviceArea = {}, 
        page = 1, 
        pageSize = 20, 
        dateRange = false,
        sortType = 'update',
        sortOrder = 'desc',
        keyword = ''
      } = event
      
      if (!date) {
        return {
          code: 400,
          message: '缺少日期参数'
        }
      }
      
      // 确保所有查询参数都不是undefined
      const validTimeSlot = typeof timeSlot === 'string' ? timeSlot : ''
      const validPage = typeof page === 'number' && page > 0 ? page : 1
      const validPageSize = typeof pageSize === 'number' && pageSize > 0 ? pageSize : 20
      const validDateRange = typeof dateRange === 'boolean' ? dateRange : false
      const validKeyword = typeof keyword === 'string' ? keyword.trim() : ''
      
      // 确保professionalTypes是数组
      const validTypes = Array.isArray(professionalTypes) ? professionalTypes : []
      
      // 添加英文类型到中文类型的映射（以防前端传入英文）
      const typeMappings = {
        'education': '教育',
        'repair': '维修服务', 
        'other': '其他服务'
      }
      
      // 处理类型名称，支持英文和中文
      const mappedTypes = validTypes.map(type => {
        if (typeof type === 'string') {
          // 如果是英文ID，转为中文
          return typeMappings[type] || type
        }
        return type
      })
      
      console.log(`原始类型: ${JSON.stringify(validTypes)}, 映射后: ${JSON.stringify(mappedTypes)}`)
      
      // 确保serviceArea是对象且属性不是undefined
      const validServiceArea = typeof serviceArea === 'object' && serviceArea !== null ? serviceArea : {}
      const validCity = validServiceArea.city && typeof validServiceArea.city === 'string' ? validServiceArea.city.trim() : ''
      const validDistrict = validServiceArea.district && typeof validServiceArea.district === 'string' ? validServiceArea.district.trim() : ''
      
      // 日志优化，显示是否使用日期范围
      const searchMode = validDateRange ? '一周范围' : '单日'
      console.log(`[优化查询] 查询条件: 模式=${searchMode}, 起始日期=${date}, 时间段=${validTimeSlot || '全天'}, 页码=${validPage}, 每页=${validPageSize}`)
      console.log(`[优化查询] 服务区域: 城市=${validCity}, 区域=${validDistrict}`)
      console.log(`[优化查询] 专业类型: ${JSON.stringify(mappedTypes)}`)
      if (validKeyword) {
        console.log(`[优化查询] 关键词: ${validKeyword}`)
      }
      
      // 创建基本的查询条件
      const query = {}
      
      // 如果dateRange为true，查询一周范围内的日期
      if (validDateRange) {
        try {
          // 生成从date开始的未来7天日期范围
          let startDate = new Date(date)
          if (isNaN(startDate.getTime())) {
            console.error(`[优化查询] 无效的日期格式: ${date}，使用当前日期`)
            startDate = new Date() // 使用当前日期作为回退
          }
          
          const dateArray = []
          
          for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startDate)
            currentDate.setDate(startDate.getDate() + i)
            const year = currentDate.getFullYear()
            const month = String(currentDate.getMonth() + 1).padStart(2, '0')
            const day = String(currentDate.getDate()).padStart(2, '0')
            const formattedDate = `${year}-${month}-${day}`
            dateArray.push(formattedDate)
          }
          
          console.log(`[优化查询] 查询日期范围: ${dateArray[0]} 到 ${dateArray[dateArray.length - 1]}`)
          console.log(`[优化查询] 日期数组: ${JSON.stringify(dateArray)}`)
          
          // 使用in查询条件查询范围内的日期
          query.date = db.command.in(dateArray)
        } catch (dateError) {
          console.error('[优化查询] 处理日期范围出错:', dateError)
          // 回退到单日查询
          query.date = date
        }
      } else {
        // 使用单日查询
        query.date = date
      }
      
      // 添加专业类型条件
      if (mappedTypes && mappedTypes.length > 0) {
        query.professionalTypes = db.command.elemMatch(db.command.in(mappedTypes))
        console.log(`[优化查询] 添加专业类型筛选: ${mappedTypes.join(', ')}`)
      }
      
      // 添加服务区域条件
      if (validCity || validDistrict) {
        query.city = validCity
        query.district = validDistrict
        console.log(`[优化查询] 添加城市筛选: ${validCity}`)
        console.log(`[优化查询] 添加区域筛选: ${validDistrict}`)
      }
      
      // 移除查询条件中的空值
      const cleanedQuery = removeEmptyValues(query);
      console.log('[优化查询] 清理后的查询条件:', JSON.stringify(cleanedQuery));
      
      console.log('[优化查询] 执行查询:', JSON.stringify(cleanedQuery))
      
      // 计算分页参数
      const skipCount = (validPage - 1) * validPageSize
      
      // 从索引表中查询符合条件的专业人士ID，并使用分页
      const countResult = await db.collection('professionalDateIndex')
        .where(cleanedQuery)
        .count()
      
      const indexResult = await db.collection('professionalDateIndex')
        .where(cleanedQuery)
        .skip(skipCount)
        .limit(validPageSize)
        .orderBy('updateTime', 'desc')  // 按更新时间降序排列
        .get()
      
      console.log(`[优化查询] 查询结果: 找到${countResult.total}条总记录，当前页${indexResult.data.length}条记录`)
      
      if (indexResult.data.length === 0) {
        return {
          code: 0,
          data: [],
          success: true,
          total: countResult.total,
          page: validPage,
          pageSize: validPageSize,
          pageCount: Math.ceil(countResult.total / validPageSize)
        }
      }
      
      // 对于日期范围查询，我们需要去重专业人士ID，因为一个专业人士可能在不同日期都有可用时间
      let professionalIds = []
      if (validDateRange) {
        // 使用Set去重
        const uniqueIds = new Set()
        indexResult.data.forEach(item => {
          uniqueIds.add(item.professionalId)
        })
        professionalIds = Array.from(uniqueIds)
        console.log(`[优化查询] 一周内去重后有${professionalIds.length}个不同的专业人士ID`)
      } else {
        // 原有逻辑
        professionalIds = [...new Set(indexResult.data.map(item => item.professionalId))]
        console.log(`[优化查询] 当前页有${professionalIds.length}个不同的专业人士ID`)
      }
      
      // 创建日期索引数据的映射，用于后续筛选和排序
      const dateIndexMap = {}
      indexResult.data.forEach(item => {
        if (!dateIndexMap[item.professionalId]) {
          dateIndexMap[item.professionalId] = item
        }
      })
      
      // 如果指定了时间段，需要进一步过滤
      if (validTimeSlot) {
        // 查询这些专业人士的时间表，获取具体时间段
        const schedulesResult = await db.collection('timeSchedules')
          .where({
            professionalId: db.command.in(professionalIds)
          })
          .field({
            professionalId: true,
            slots: true
          })
          .get()
        
        console.log(`[优化查询] 查询到${schedulesResult.data.length}个专业人士的时间表进行时间段筛选`)
        
        // 过滤出符合时间段的专业人士ID
        const filteredIds = []
        schedulesResult.data.forEach(schedule => {
          // 确保该专业人士有slots数据
          if (!schedule.slots || !Array.isArray(schedule.slots)) return
          
          let matchingSlots = []
          
          if (validDateRange) {
            // 对于日期范围查询，检查一周内的任何日期是否有匹配的时间段
            const dateArray = []
            const startDate = new Date(date)
            
            // 确保生成的日期格式与数据库中存储的一致
            for (let i = 0; i < 7; i++) {
              const currentDate = new Date(startDate)
              currentDate.setDate(startDate.getDate() + i)
              const year = currentDate.getFullYear()
              const month = String(currentDate.getMonth() + 1).padStart(2, '0')
              const day = String(currentDate.getDate()).padStart(2, '0')
              const formattedDate = `${year}-${month}-${day}`
              dateArray.push(formattedDate)
            }
            
            console.log(`[时间段筛选] 检查日期范围: ${dateArray[0]} 到 ${dateArray[dateArray.length - 1]}`)
            
            // 找出该一周内的所有可用时间段
            matchingSlots = schedule.slots.filter(slot => {
              // 确保slot.date存在且是字符串
              if (!slot.date || typeof slot.date !== 'string') return false
              
              return dateArray.includes(slot.date) && slot.isBooked !== true
            })
          } else {
            // 对于单日查询，只检查指定日期
            matchingSlots = schedule.slots.filter(slot => {
              // 确保slot.date存在且是字符串
              if (!slot.date || typeof slot.date !== 'string') return false
              
              // 使用严格比较检查日期和预约状态
              return slot.date === date && slot.isBooked !== true
            })
          }
          
          // 根据时间段筛选
          const hasMatchingSlot = matchingSlots.some(slot => {
            const startHour = parseInt(slot.startTime.split(':')[0])
            
            if (validTimeSlot === 'morning') {
              // 上午 (9:00-12:00)
              return startHour >= 9 && startHour < 12
            } else if (validTimeSlot === 'afternoon') {
              // 下午 (14:00-18:00)
              return startHour >= 14 && startHour < 18
            } else {
              // 全天
              return true
            }
          })
          
          if (hasMatchingSlot) {
            filteredIds.push(schedule.professionalId)
          }
        })
        
        console.log(`[优化查询] 时间段筛选后剩余${filteredIds.length}个专业人士`)
        
        // 使用过滤后的ID列表
        professionalIds.length = 0
        professionalIds.push(...filteredIds)
      }
      
      // 保持原始索引表中的顺序
      const sortedIds = professionalIds.sort((a, b) => {
        const indexA = dateIndexMap[a] || {}
        const indexB = dateIndexMap[b] || {}
        const timeA = indexA.updateTime || new Date(0)
        const timeB = indexB.updateTime || new Date(0)
        // 降序排列，最新更新的排在前面
        return timeB - timeA
      })
      
      if (sortedIds.length === 0) {
        return {
          code: 0,
          success: true,
          data: [],
          total: countResult.total,
          hasMore: false
        }
      }
      
      // 新增：直接查询专业人士详细信息，避免前端再次调用云函数
      console.log(`[优化查询] 直接查询${sortedIds.length}个专业人士的详细信息`)
      
      // 使用已经验证的排序参数变量
      console.log(`[优化查询] 使用排序参数: 类型=${sortType || 'update'}, 顺序=${sortOrder || 'desc'}`)
      
      // 查询专业人士详细信息
      let professionalsResult
      try {
        professionalsResult = await db.collection('professionals')
          .where({
            _openid: db.command.in(sortedIds)
          })
          .get()
          
        console.log(`[优化查询] 获取到${professionalsResult.data.length}个专业人士详细信息`)
      } catch (profError) {
        console.error('[优化查询] 获取专业人士详细信息失败:', profError)
        // 如果查询失败，仍然返回ID列表，让前端能够进行后续处理
        return {
          code: 0,
          success: true,
          professionalIds: sortedIds,
          total: countResult.total,
          page: validPage,
          pageSize: validPageSize,
          count: sortedIds.length,
          onlyIds: true,
          error: '获取详细信息失败'
        }
      }
      
      // 构建ID到详细信息的映射
      const professionalMap = {}
      professionalsResult.data.forEach(prof => {
        professionalMap[prof._openid] = prof
      })
      
      // 按照sortedIds的顺序排列结果
      const orderedProfessionals = sortedIds
        .map(id => professionalMap[id])
        .filter(Boolean)  // 过滤掉可能不存在的记录
      
      return {
        code: 0,
        success: true,
        data: orderedProfessionals,
        professionalIds: sortedIds, // 保留ID列表以供前端参考
        total: countResult.total,
        page: validPage,
        pageSize: validPageSize,
        pageCount: Math.ceil(countResult.total / validPageSize),
        count: orderedProfessionals.length,
        hasMore: orderedProfessionals.length < countResult.total && validPage * validPageSize < countResult.total,
        filteredByTimeSlot: !!validTimeSlot,
        dateRangeMode: validDateRange,
        sortedByUpdateTime: true
      }
    } catch (error) {
      console.error('[优化查询] 查找专业人士出错:', error)
      return {
        code: 500,
        success: false,
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