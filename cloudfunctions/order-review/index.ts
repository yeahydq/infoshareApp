import { CloudBase } from '@cloudbase/node-sdk'
import { Response } from '@/types/cloud'

const app = CloudBase.init({
  env: CloudBase.SYMBOL_CURRENT_ENV,
})

const db = app.database()

interface OrderReviewParams {
  orderId: string
  userId: string
  rating: number
  content: string
  images?: string[]
  isAnonymous: boolean
}

export async function main(event: any, context: any): Promise<Response> {
  const { orderId, userId, rating, content, images, isAnonymous } = event as OrderReviewParams

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
    if (orderData.status !== 'completed') {
      return {
        code: 400,
        message: '订单状态不允许评价',
      }
    }

    // 检查是否已评价
    if (orderData.hasReview) {
      return {
        code: 400,
        message: '订单已评价',
      }
    }

    // 创建评价记录
    const reviewData = {
      orderId,
      userId,
      rating,
      content,
      images,
      isAnonymous,
      createTime: db.serverDate(),
    }

    await db.collection('reviews').add(reviewData)

    // 更新订单状态
    await db.collection('orders').doc(orderId).update({
      hasReview: true,
      reviewTime: db.serverDate(),
    })

    // 更新课程评分
    const courseRef = db.collection('courses').doc(orderData.courseId)
    const course = await courseRef.get()
    const courseData = course.data[0]

    const newRating =
      ((courseData.rating || 0) * (courseData.reviewCount || 0) + rating) /
      ((courseData.reviewCount || 0) + 1)

    await courseRef.update({
      rating: newRating,
      reviewCount: _.inc(1),
    })

    return {
      code: 0,
      message: 'success',
    }
  } catch (error) {
    console.error('提交评价失败:', error)
    return {
      code: -1,
      message: '提交评价失败',
      error,
    }
  }
}
