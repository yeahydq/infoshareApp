import { CloudBase } from '@cloudbase/node-sdk'
import { Response } from '@/types/cloud'

const app = CloudBase.init({
  env: CloudBase.SYMBOL_CURRENT_ENV,
})

const db = app.database()
const _ = db.command

interface OrderCancelParams {
  orderId: string
  userId: string
  reason?: string
}

export async function main(event: any, context: any): Promise<Response> {
  const { orderId, userId, reason } = event as OrderCancelParams

  try {
    // 查询订单状态
    const order = await db
      .collection('orders')
      .where({
        _id: orderId,
        userId,
      })
      .get()

    if (!order.data.length) {
      return {
        code: 404,
        message: '订单不存在',
      }
    }

    const orderData = order.data[0]

    // 检查订单状态
    if (orderData.status !== 'pending') {
      return {
        code: 400,
        message: '订单状态不允许取消',
      }
    }

    // 更新订单状态
    await db.collection('orders').doc(orderId).update({
      status: 'cancelled',
      cancelReason: reason,
      cancelTime: db.serverDate(),
    })

    return {
      code: 0,
      message: 'success',
    }
  } catch (error) {
    console.error('取消订单失败:', error)
    return {
      code: -1,
      message: '取消订单失败',
      error,
    }
  }
}
