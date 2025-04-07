import express, { Request, Response } from 'express'
import { body, param, query } from 'express-validator'
import { validateRequest } from '../middlewares/validation'
import { requireAuth, requireAdmin } from '../middlewares/auth'
import { User } from '../models/User'
import { Booking } from '../models/Booking'

const router = express.Router()

/**
 * @route GET /api/users
 * @desc 获取用户列表
 * @access Private (Admin)
 */
router.get(
  '/',
  requireAuth,
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('query').optional().isString(),
    query('status').optional().isString(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const result = await User.getList(req.query)
      res.json({
        code: 200,
        message: '获取用户列表成功',
        data: result.list,
        pagination: result.pagination,
      })
    } catch (error: any) {
      console.error('获取用户列表失败:', error)
      res.status(500).json({
        code: 500,
        message: '获取用户列表失败',
        error: error.message,
      })
    }
  },
)

/**
 * @route GET /api/users/:id
 * @desc 获取用户详情
 * @access Private (Admin)
 */
router.get(
  '/:id',
  requireAuth,
  [param('id').isString()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const user = await User.getDetail(req.params.id)

      if (!user) {
        return res.status(404).json({
          code: 404,
          message: '用户不存在',
        })
      }

      res.json({
        code: 200,
        message: '获取用户详情成功',
        data: user,
      })
    } catch (error: any) {
      console.error('获取用户详情失败:', error)
      res.status(500).json({
        code: 500,
        message: '获取用户详情失败',
        error: error.message,
      })
    }
  },
)

/**
 * @route PUT /api/users/:id/status
 * @desc 更新用户状态
 * @access Private (Admin)
 */
router.post(
  '/:id/status',
  requireAuth,
  [param('id').isString()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const result = await User.updateStatus(req.params.id, req.body.status)

      res.json({
        code: 200,
        message: '更新用户状态成功',
        data: result,
      })
    } catch (error: any) {
      console.error('更新用户状态失败:', error)
      res.status(500).json({
        code: 500,
        message: '更新用户状态失败',
        error: error.message,
      })
    }
  },
)

// 获取用户预约记录
router.get('/:userId/bookings', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params
    console.log(`[用户预约] 开始获取用户 ${userId} 的预约记录`)

    // 获取用户的预约记录
    const bookings = await Booking.getList({
      userId,
      page: 1,
      pageSize: 100,
    })

    console.log(`[用户预约] 获取到预约记录: ${bookings.list.length} 条`)
    res.json({
      code: 0,
      message: '获取预约记录成功',
      data: bookings.list,
    })
  } catch (error) {
    console.error('[用户预约] 获取预约记录失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取预约记录失败',
      data: null,
    })
  }
})

// 获取用户操作日志
router.get('/:userId/logs', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params
    console.log(`[用户日志] 开始获取用户 ${userId} 的操作日志`)

    // 模拟操作日志数据
    const mockLogs = [
      {
        time: new Date().toISOString(),
        action: '登录',
        details: '用户登录系统',
        ip: '127.0.0.1',
      },
      {
        time: new Date(Date.now() - 3600000).toISOString(),
        action: '修改资料',
        details: '更新了个人头像',
        ip: '127.0.0.1',
      },
      {
        time: new Date(Date.now() - 7200000).toISOString(),
        action: '预约',
        details: '预约了专业人士服务',
        ip: '127.0.0.1',
      },
    ]

    console.log(`[用户日志] 返回模拟日志数据: ${mockLogs.length} 条`)
    res.json({
      code: 0,
      message: '获取操作日志成功',
      data: mockLogs,
    })
  } catch (error) {
    console.error('[用户日志] 获取操作日志失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取操作日志失败',
      data: null,
    })
  }
})

export default router
