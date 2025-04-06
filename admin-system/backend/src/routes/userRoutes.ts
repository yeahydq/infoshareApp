import express, { Request, Response } from 'express'
import { body, param, query } from 'express-validator'
import { validateRequest } from '../middlewares/validation'
import { requireAuth, requireAdmin } from '../middlewares/auth'
import { User } from '../models/User'

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

export default router
