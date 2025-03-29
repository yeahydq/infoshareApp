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
              endTime: getEndTime(time)
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