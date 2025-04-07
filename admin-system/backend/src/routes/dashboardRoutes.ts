import express, { Request, Response } from 'express'
import { requireAuth, requireAdmin } from '../middlewares/auth'
import { query } from 'express-validator'
import { validateRequest } from '../middlewares/validation'
import { Dashboard } from '../models/Dashboard'
import db, { collections } from '../models/database'

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

// 获取仪表盘数据
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    console.log('[仪表盘] 开始获取仪表盘数据')

    // 统计数据
    const statsData = {
      professionals: {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        disabled: 0,
      },
      users: {
        total: 0,
        active: 0,
        inactive: 0,
      },
      bookings: {
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
        thisWeek: 0,
      },
      revenue: {
        total: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        lastMonth: 0,
      },
    }

    // 获取专业人士统计数据
    const professionals = await db.collection('professionals').get()
    statsData.professionals.total = professionals.data.length
    statsData.professionals.pending = professionals.data.filter(
      (p: any) => p.status === 'pending',
    ).length
    statsData.professionals.approved = professionals.data.filter(
      (p: any) => p.status === 'approved',
    ).length
    statsData.professionals.rejected = professionals.data.filter(
      (p: any) => p.status === 'rejected',
    ).length
    statsData.professionals.disabled = professionals.data.filter(
      (p: any) => p.status === 'disabled',
    ).length

    // 获取用户统计数据
    const users = await db.collection('UserList').get()
    statsData.users.total = users.data.length
    statsData.users.active = users.data.filter((u: any) => u.status === 'active').length
    statsData.users.inactive = users.data.filter((u: any) => u.status === 'inactive').length

    // 获取预约统计数据
    const bookings = await db.collection('bookings').get()
    statsData.bookings.total = bookings.data.length
    statsData.bookings.pending = bookings.data.filter((b: any) => b.status === 'pending').length
    statsData.bookings.confirmed = bookings.data.filter((b: any) => b.status === 'confirmed').length
    statsData.bookings.completed = bookings.data.filter((b: any) => b.status === 'completed').length
    statsData.bookings.cancelled = bookings.data.filter((b: any) => b.status === 'cancelled').length

    // 获取最近的专业人士
    const recentProfessionals = await db
      .collection('professionals')
      .orderBy('createTime', 'desc')
      .limit(5)
      .get()

    // 生成最近7天的预约趋势数据
    const today = new Date()
    const bookingTrend = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      return {
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 10), // 临时使用随机数据
      }
    }).reverse()

    // 返回数据
    res.json({
      code: 0,
      message: '获取仪表盘数据成功',
      data: {
        stats: statsData,
        recentProfessionals: recentProfessionals.data.map((p: any) => ({
          id: p._id,
          name: p.name,
          avatar: p.avatarUrl,
          createTime: p.createTime,
        })),
        bookingTrend,
      },
    })
  } catch (error) {
    console.error('[仪表盘] 获取数据失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取仪表盘数据失败',
      data: null,
    })
  }
})

export default router
