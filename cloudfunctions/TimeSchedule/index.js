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
      const { timeSchedule } = event
      const { selectedDays, selectedSlots, slots } = timeSchedule
      
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
      
      // 检查是否已存在记录
      const existingSchedule = await db.collection('timeSchedules').where({
        professionalId: wxContext.OPENID
      }).get()
      
      if (existingSchedule.data.length > 0) {
        // 更新记录
        await db.collection('timeSchedules').where({
          professionalId: wxContext.OPENID
        }).update({
          data: {
            slots: processedSlots,
            updateTime: new Date()
          }
        })
      } else {
        // 创建新记录
        await db.collection('timeSchedules').add({
          data: {
            professionalId: wxContext.OPENID,
            slots: processedSlots,
            updateTime: new Date()
          }
        })
      }
      
      return {
        code: 0,
        message: '更新成功'
      }
    } catch (error) {
      return {
        code: 500,
        message: '更新失败',
        error: error.message
      }
    }
  }

  return {
    code: 400,
    message: '无效的请求类型'
  }
} 