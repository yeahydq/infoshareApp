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
        professionalId,
        date,
        timeSlot,
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
async function createBookingOrder(event, context) {
  const wxContext = cloud.getWXContext()
  const { bookingData } = event
  const userId = wxContext.OPENID
  
  if (!userId) {
    return {
      success: false,
      message: '用户未登录'
    }
  }
  
  // 验证必要参数
  if (!bookingData || !bookingData.professionalId || !bookingData.date || !bookingData.timeSlot) {
    return {
      success: false,
      message: '缺少必要参数'
    }
  }
  
  try {
    // 检查时间段是否可用
    const availability = await checkTimeSlotAvailability(
      bookingData.professionalId,
      bookingData.date,
      bookingData.timeSlot
    )
    
    if (!availability.available) {
      return {
        success: false,
        message: availability.message
      }
    }
    
    // 获取专业人士信息
    const professional = await db.collection('professionals')
      .doc(bookingData.professionalId)
      .get()
      .then(res => res.data)
      .catch(() => null)
    
    if (!professional) {
      return {
        success: false,
        message: '未找到专业人士信息'
      }
    }
    
    // 获取用户信息
    const user = await db.collection('users')
      .where({
        _openid: userId
      })
      .get()
      .then(res => res.data[0])
      .catch(() => null)
    
    if (!user) {
      return {
        success: false,
        message: '未找到用户信息'
      }
    }
    
    // 计算价格（假设服务为30分钟，即0.5小时）
    const price = professional.hourlyRate ? professional.hourlyRate * 0.5 : 0
    
    // 创建订单
    const orderNo = generateOrderNo()
    const now = db.serverDate()
    
    const orderData = {
      _openid: userId,
      orderNo,
      userId,
      professionalId: bookingData.professionalId,
      professionalName: professional.name,
      professionalAvatar: professional.avatarUrl,
      serviceName: professional.serviceName || bookingData.serviceName,
      date: bookingData.date,
      timeSlot: bookingData.timeSlot,
      remark: bookingData.remark || '',
      price,
      status: 'pending', // pending, paid, completed, cancelled
      createdTime: now,
      updatedTime: now
    }
    
    const result = await db.collection('orders').add({
      data: orderData
    })
    
    // 返回订单信息
    return {
      success: true,
      message: '预约订单创建成功',
      orderId: result._id,
      orderNo
    }
  } catch (error) {
    console.error('创建预约订单出错:', error)
    return {
      success: false,
      message: '创建预约订单出错: ' + error.message
    }
  }
}

// 更新时间段已被预约状态
async function updateTimeSlotStatus(professionalId, date, timeSlot, isBooked = true) {
  try {
    await db.collection('timeSchedules')
      .where({
        professionalId,
        'slots.date': date,
        'slots.startTime': timeSlot
      })
      .update({
        data: {
          'slots.$.isBooked': isBooked
        }
      })
    return true
  } catch (error) {
    console.error('更新时间段状态出错:', error)
    return false
  }
}

// 云函数入口
exports.main = async (event, context) => {
  switch (event.action) {
    case 'getPayParams':
      // 获取支付参数（实际项目中需要接入微信支付）
      return {
        success: true,
        payParams: {
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
      return await createBookingOrder(event, context)
  }
} 