const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID

  // 获取时间安排
  if (event.type === 'get') {
    try {
      const result = await db.collection('timeSchedules')
        .where({
          professionalId: openId
        })
        .get()
      
      return {
        code: 0,
        data: result.data[0] || null
      }
    } catch (error) {
      return {
        code: -1,
        message: '获取时间安排失败',
        error
      }
    }
  }

  // 更新时间安排
  if (event.type === 'update') {
    try {
      const { timeSchedule } = event
      
      // 检查是否已存在时间安排
      const existResult = await db.collection('timeSchedules')
        .where({
          professionalId: openId
        })
        .get()

      if (existResult.data.length > 0) {
        // 更新现有记录
        const result = await db.collection('timeSchedules')
          .doc(existResult.data[0]._id)
          .update({
            data: {
              slots: timeSchedule.selectedSlots.map(slot => ({
                startTime: slot,
                endTime: new Date(`2000-01-01 ${slot}`).getTime() + 30 * 60 * 1000,
                date: new Date().toISOString().split('T')[0]
              })),
              updateTime: db.serverDate()
            }
          })
        
        return {
          code: 0,
          message: '更新成功'
        }
      } else {
        // 创建新记录
        const result = await db.collection('timeSchedules')
          .add({
            data: {
              professionalId: openId,
              slots: timeSchedule.selectedSlots.map(slot => ({
                startTime: slot,
                endTime: new Date(`2000-01-01 ${slot}`).getTime() + 30 * 60 * 1000,
                date: new Date().toISOString().split('T')[0]
              })),
              updateTime: db.serverDate()
            }
          })
        
        return {
          code: 0,
          message: '创建成功'
        }
      }
    } catch (error) {
      return {
        code: -1,
        message: '保存时间安排失败',
        error
      }
    }
  }

  return {
    code: -1,
    message: '无效的操作类型'
  }
} 