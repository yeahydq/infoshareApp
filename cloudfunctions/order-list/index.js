/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
// 预约订单列表查询云函数
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true,
})

const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 获取用户订单列表
async function getUserOrders(event, wxContext) {
  const { status = 'all', page = 1, pageSize = 10 } = event
  const userId = wxContext.OPENID
  
  if (!userId) {
    return {
      success: false,
      message: '用户未登录'
    }
  }
  
  try {
    const query = {
      _openid: userId
    }
    
    // 按状态筛选
    if (status !== 'all') {
      query.status = status
    }
    
    // 查询总数
    const countResult = await db.collection('orders')
      .where(query)
      .count()
    
    const total = countResult.total
    
    // 分页查询
    const orders = await db.collection('orders')
      .where(query)
      .orderBy('createdTime', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get()
    
    return {
      success: true,
      data: orders.data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    }
  } catch (error) {
    console.error('获取用户订单列表出错:', error)
    return {
      success: false,
      message: '获取订单列表失败: ' + error.message
    }
  }
}

// 获取专业人士的订单列表
async function getProfessionalOrders(event, wxContext) {
  const { status = 'all', page = 1, pageSize = 10 } = event
  const professionalId = wxContext.OPENID
  
  if (!professionalId) {
    return {
      success: false,
      message: '用户未登录'
    }
  }
  
  try {
    // 查询用户是否是专业人士
    const professional = await db.collection('professionals')
      .where({
        _openid: professionalId
      })
      .get()
    
    if (professional.data.length === 0) {
      return {
        success: false,
        message: '当前用户不是专业人士'
      }
    }
    
    const query = {
      professionalId
    }
    
    // 按状态筛选
    if (status !== 'all') {
      query.status = status
    }
    
    // 查询总数
    const countResult = await db.collection('orders')
      .where(query)
      .count()
    
    const total = countResult.total
    
    // 分页查询
    const orders = await db.collection('orders')
      .where(query)
      .orderBy('createdTime', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get()
    
    return {
      success: true,
      data: orders.data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    }
  } catch (error) {
    console.error('获取专业人士订单列表出错:', error)
    return {
      success: false,
      message: '获取订单列表失败: ' + error.message
    }
  }
}

// 云函数入口
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { type = 'user' } = event
  
  switch (type) {
    case 'user':
      // 获取用户订单列表
      return await getUserOrders(event, wxContext)
    
    case 'professional':
      // 获取专业人士订单列表
      return await getProfessionalOrders(event, wxContext)
    
    default:
      return {
        success: false,
        message: '无效的查询类型'
      }
  }
} 