import express, { Request, Response } from 'express'
import { requireAuth, requireAdmin } from '../middlewares/auth'
import { query } from 'express-validator'
import { validateRequest } from '../middlewares/validation'
import { Dashboard } from '../models/Dashboard'

const router = express.Router()

/**
 * @route GET /api/dashboard/summary
 * @desc 获取仪表盘摘要数据
 * @access Private (Admin)
 */
router.get('/summary', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    // 临时返回模拟数据，后续实现真实数据获取
    res.json({
      code: 0,
      data: {
        userCount: 120,
        professionalCount: 45,
        pendingReviewCount: 8,
        bookingCount: 230,
        recentBookings: [
          {
            id: 'b001',
            professionalName: '王医生',
            userName: '张三',
            serviceDate: '2023-04-15',
            serviceTime: '10:00-11:00',
            status: 'confirmed',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'b002',
            professionalName: '李律师',
            userName: '李四',
            serviceDate: '2023-04-15',
            serviceTime: '14:00-15:00',
            status: 'pending',
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'b003',
            professionalName: '赵老师',
            userName: '王五',
            serviceDate: '2023-04-16',
            serviceTime: '09:00-10:00',
            status: 'confirmed',
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          },
        ],
        topProfessionals: [
          {
            id: 'p001',
            name: '王医生',
            avatar: '',
            bookingCount: 48,
            serviceType: '医疗健康',
          },
          {
            id: 'p002',
            name: '李律师',
            avatar: '',
            bookingCount: 36,
            serviceType: '法律咨询',
          },
          {
            id: 'p003',
            name: '赵老师',
            avatar: '',
            bookingCount: 29,
            serviceType: '教育培训',
          },
        ],
        serviceTypeDistribution: [
          { name: '医疗健康', value: 25 },
          { name: '法律咨询', value: 20 },
          { name: '教育培训', value: 15 },
          { name: '金融理财', value: 12 },
          { name: '心理咨询', value: 10 },
          { name: '职业规划', value: 8 },
          { name: '其他服务', value: 10 },
        ],
      },
    })
  } catch (error) {
    console.error('获取仪表盘数据失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取仪表盘数据失败，服务器错误',
    })
  }
})

// 获取仪表盘统计数据
router.get('/stats', requireAuth, async (req: Request, res: Response) => {
  try {
    const stats = await Dashboard.getStats()
    res.json({
      code: 200,
      message: '获取统计数据成功',
      data: stats,
    })
  } catch (error: any) {
    console.error('获取仪表盘统计数据失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取统计数据失败',
      error: error.message,
    })
  }
})

// 获取用户增长趋势
router.get(
  '/users/trend',
  requireAuth,
  [query('period').optional().isIn(['week', 'month', 'year']).withMessage('期间参数无效')],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const period = (req.query.period as string) || 'month'
      const trend = await Dashboard.getUserTrend(period)
      res.json({
        code: 200,
        message: '获取用户增长趋势成功',
        data: trend,
      })
    } catch (error: any) {
      console.error('获取用户增长趋势失败:', error)
      res.status(500).json({
        code: 500,
        message: '获取用户增长趋势失败',
        error: error.message,
      })
    }
  },
)

// 获取预约趋势
router.get(
  '/bookings/trend',
  requireAuth,
  [query('period').optional().isIn(['week', 'month', 'year']).withMessage('期间参数无效')],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const period = (req.query.period as string) || 'month'
      const trend = await Dashboard.getBookingTrend(period)
      res.json({
        code: 200,
        message: '获取预约趋势成功',
        data: trend,
      })
    } catch (error: any) {
      console.error('获取预约趋势失败:', error)
      res.status(500).json({
        code: 500,
        message: '获取预约趋势失败',
        error: error.message,
      })
    }
  },
)

// 获取专业人士分布
router.get('/professionals/distribution', requireAuth, async (req: Request, res: Response) => {
  try {
    const distribution = await Dashboard.getProfessionalDistribution()
    res.json({
      code: 200,
      message: '获取专业人士分布成功',
      data: distribution,
    })
  } catch (error: any) {
    console.error('获取专业人士分布失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取专业人士分布失败',
      error: error.message,
    })
  }
})

export default router
