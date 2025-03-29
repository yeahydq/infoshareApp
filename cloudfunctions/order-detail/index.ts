import { CloudBase } from '@cloudbase/node-sdk'
import { Response } from '@/types/cloud'

const app = CloudBase.init({
  env: CloudBase.SYMBOL_CURRENT_ENV,
})

const db = app.database()

interface OrderDetailParams {
  orderId: string
  userId: string
}

export async function main(event: any, context: any): Promise<Response> {
  const { orderId, userId } = event as OrderDetailParams

  try {
    // 查询订单详情
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

    // 查询关联的课程信息
    const course = await db.collection('courses').doc(order.data[0].courseId).get()

    // 查询关联的教师信息
    const teacher = await db.collection('teachers').doc(order.data[0].teacherId).get()

    return {
      code: 0,
      message: 'success',
      data: {
        ...order.data[0],
        course: course.data[0],
        teacher: teacher.data[0],
      },
    }
  } catch (error) {
    console.error('获取订单详情失败:', error)
    return {
      code: -1,
      message: '获取订单详情失败',
      error,
    }
  }
}
