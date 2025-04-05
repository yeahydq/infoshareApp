/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
// 预约订单创建云函数
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true,
})

const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 生成订单号
function generateOrderNo() {
  const now = new Date()
  const year = now.getFullYear().toString().slice(2)
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const hour = now.getHours().toString().padStart(2, '0')
  const minute = now.getMinutes().toString().padStart(2, '0')
  const second = now.getSeconds().toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  
  return `BO${year}${month}${day}${hour}${minute}${second}${random}`
}

// 检查时间段是否可用
async function checkTimeSlotAvailability(professionalId, date, timeSlot) {
  try {
    // 检查专业人士的可用时间段
    const timeSchedule = await db.collection('timeSchedules')
      .where({
        professionalId,
        'slots.date': date,
        'slots.startTime': timeSlot
      })
      .get()
    
    if (timeSchedule.data.length === 0) {
      return {
        available: false,
        message: '该时间段不在专业人士的可用时间内'
      }
    }
    
    // 检查该时间段是否已被预约
    const existingBooking = await db.collection('orders')
      .where({
        professionalOpenId: professionalId,
        date,
        startTime: timeSlot,
        status: _.neq('cancelled')
      })
      .count()
    
    if (existingBooking.total > 0) {
      return {
        available: false,
        message: '该时间段已被预约'
      }
    }
    
    return {
      available: true
    }
  } catch (error) {
    console.error('检查时间段可用性出错:', error)
    return {
      available: false,
      message: '检查时间段可用性出错'
    }
  }
}

// 创建预约订单
async function createBooking(event, context) {
  const wxContext = cloud.getWXContext()
  const userOpenId = wxContext.OPENID
  const { bookingData } = event
  
  // 记录请求数据，便于调试
  console.log('预约请求数据:', bookingData)
  
  try {
    // 验证必要参数
    if (!bookingData || !bookingData.professionalId || !bookingData.date || !bookingData.timeSlot) {
      return {
        code: 400,
        message: '预约信息不完整'
      }
    }
    
    const { professionalId, date, timeSlot, remark } = bookingData
    
    // 1. 确认professionalId是否为openid
    // 注意：从前端传过来的professionalId始终视为openid
    const professionalOpenId = professionalId
    console.log(`专业人士OpenID: ${professionalOpenId}`)
    
    // 2. 验证时间段是否可预约
    try {
      const timeScheduleRes = await db.collection('timeSchedules')
        .where({
          professionalId: professionalOpenId // 使用openid查询
        })
        .get()
      
      if (timeScheduleRes.data.length === 0) {
        return {
          code: 404,
          message: '未找到该专业人士的时间安排'
        }
      }
      
      const timeSchedule = timeScheduleRes.data[0]
      
      // 查找对应的时间段
      const targetSlot = timeSchedule.slots.find(slot => 
        slot.date === date && slot.startTime === timeSlot && !slot.isBooked
      )
      
      if (!targetSlot) {
        return {
          code: 400,
          message: '该时间段不可预约或已被预约'
        }
      }
      
      // 计算时间段索引
      const slotIndex = timeSchedule.slots.findIndex(slot => 
        slot.date === date && slot.startTime === timeSlot
      )
      
      // 3. 创建订单记录
      const orderNo = generateOrderNo()
      const orderData = {
        _openid: userOpenId, // 预约用户的openid
        orderNo, // 订单编号
        userOpenId: userOpenId, // 用户openid
        professionalOpenId: professionalOpenId, // 专业人士openid，这是主要的关联字段
        date,
        startTime: timeSlot,
        endTime: targetSlot.endTime,
        remark: remark || '',
        status: 'pending', // 订单状态：待确认
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      }
      
      const orderRes = await db.collection('orders').add({
        data: orderData
      })
      
      if (!orderRes._id) {
        throw new Error('创建订单失败')
      }
      
      // 4. 更新时间段为已预约
      const updateSlotCmd = {}
      updateSlotCmd[`slots.${slotIndex}.isBooked`] = true
      updateSlotCmd[`slots.${slotIndex}.bookedBy`] = userOpenId
      updateSlotCmd[`slots.${slotIndex}.orderId`] = orderRes._id
      updateSlotCmd[`slots.${slotIndex}.bookTime`] = db.serverDate()
      
      await db.collection('timeSchedules').doc(timeSchedule._id).update({
        data: updateSlotCmd
      })
      
      // 5. 返回成功信息
      return {
        code: 0,
        message: '预约成功',
        data: {
          orderId: orderRes._id,
          orderNo: orderNo
        }
      }
    } catch (error) {
      console.error('预约失败:', error)
      return {
        code: 500,
        message: '预约失败，请稍后重试',
        error: error.message
      }
    }
  } catch (error) {
    console.error('预约处理出错:', error)
    return {
      code: 500,
      message: '服务器错误，请稍后重试',
      error: error.message
    }
  }
}

// 云函数入口
exports.main = async (event, context) => {
  const { action } = event
  
  switch (action) {
    case 'getPayParams':
      // 获取支付参数（实际项目中需要接入微信支付）
      return {
        code: 0,
        message: '获取支付参数成功',
        data: {
          // 模拟支付参数
          timeStamp: Date.now().toString(),
          nonceStr: Math.random().toString(36).substring(2),
          package: 'prepay_id=mock_prepay_id',
          signType: 'MD5',
          paySign: 'mock_pay_sign'
        }
      }
    
    default:
      // 默认创建预约订单
      return await createBooking(event, context)
  }
} 