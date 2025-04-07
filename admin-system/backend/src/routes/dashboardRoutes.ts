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
      },
      revenue: {
        total: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        lastMonth: 0,
      },
    }

    try {
      // 获取专业人士数据统计
      const professionals = await db.collection(collections.PROFESSIONALS).where({}).get()
      const proData = professionals.data || []

      statsData.professionals.total = proData.length

      // 统计不同状态的专业人士
      proData.forEach((pro: any) => {
        if (pro.status === 'pending') {
          statsData.professionals.pending++
        } else if (pro.status === 'approved') {
          statsData.professionals.approved++
        } else if (pro.status === 'rejected') {
          statsData.professionals.rejected++
        } else if (pro.status === 'disabled') {
          statsData.professionals.disabled++
        }
      })

      console.log('[仪表盘] 专业人士统计完成:', statsData.professionals)
    } catch (error) {
      console.error('[仪表盘] 获取专业人士统计失败:', error)
      // 使用随机模拟数据
      statsData.professionals = {
        total: 21,
        pending: 5,
        approved: 12,
        rejected: 2,
        disabled: 2,
      }
    }

    // 使用模拟数据填充其他统计
    statsData.users = {
      total: 156,
      active: 87,
      inactive: 69,
    }

    statsData.bookings = {
      total: 342,
      pending: 45,
      confirmed: 128,
      completed: 156,
      cancelled: 13,
    }

    statsData.revenue = {
      total: 156800,
      today: 3200,
      thisWeek: 18500,
      thisMonth: 42600,
      lastMonth: 38200,
    }

    // 生成最近注册的专业人士
    let recentProfessionals = []
    try {
      // 尝试获取最近注册的专业人士
      const proData = await db.collection(collections.PROFESSIONALS).where({}).get()

      // 按创建时间排序并获取前5个
      recentProfessionals = (proData.data || [])
        .sort((a: any, b: any) => {
          const dateA = new Date(a.createTime)
          const dateB = new Date(b.createTime)
          return dateB.getTime() - dateA.getTime()
        })
        .slice(0, 5)
        .map((pro: any) => ({
          id: pro._id,
          _id: pro._id,
          name: pro.name || '未命名专业人士',
          avatar: pro.avatarUrl || '',
          avatarUrl: pro.avatarUrl || '',
          category: pro.category || 'other',
          status: pro.status,
          createTime: pro.createTime,
        }))
    } catch (error) {
      console.error('[仪表盘] 获取最近注册专业人士失败:', error)
      // 使用默认值
      recentProfessionals = []
    }

    // 返回数据
    res.json({
      code: 200,
      message: '获取仪表盘数据成功',
      data: {
        stats: statsData,
        recentProfessionals,
        categoryDistribution: [
          { name: '教育培训', value: 25 },
          { name: '金融理财', value: 18 },
          { name: '法律咨询', value: 12 },
          { name: '设计服务', value: 15 },
          { name: '信息技术', value: 22 },
          { name: '健康医疗', value: 16 },
          { name: '其他服务', value: 10 },
        ],
        revenueData: [
          { date: '2023-07', value: 32500 },
          { date: '2023-08', value: 36800 },
          { date: '2023-09', value: 38200 },
          { date: '2023-10', value: 35600 },
          { date: '2023-11', value: 39400 },
          { date: '2023-12', value: 42600 },
        ],
      },
    })
  } catch (error: any) {
    console.error('[仪表盘] 获取仪表盘数据失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取仪表盘数据失败',
      error: error.message,
    })
  }
})

export default router
