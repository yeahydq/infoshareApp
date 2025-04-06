import express, { Request, Response } from 'express'
import { body, param, query } from 'express-validator'
import { validateRequest } from '../middlewares/validation'
import { requireAuth, requireAdmin } from '../middlewares/auth'
import { Booking } from '../models/Booking'

const router = express.Router()

/**
 * @route GET /api/bookings
 * @desc 获取所有预约记录
 * @access Private (Admin)
 */
router.get(
  '/',
  requireAuth,
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('status').optional().isString(),
    query('professionalId').optional().isString(),
    query('userId').optional().isString(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const result = await Booking.getList(req.query)
      res.json({
        code: 200,
        message: '获取预约列表成功',
        data: result.list,
        pagination: result.pagination,
      })
    } catch (error: any) {
      console.error('获取预约列表失败:', error)
      res.status(500).json({
        code: 500,
        message: '获取预约列表失败',
        error: error.message,
      })
    }
  },
)

/**
 * @route GET /api/bookings/:id
 * @desc 获取预约详情
 * @access Private (Admin)
 */
router.get(
  '/:id',
  requireAuth,
  [param('id').isString()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const booking = await Booking.getDetail(req.params.id)

      if (!booking) {
        return res.status(404).json({
          code: 404,
          message: '预约不存在',
        })
      }

      res.json({
        code: 200,
        message: '获取预约详情成功',
        data: booking,
      })
    } catch (error: any) {
      console.error('获取预约详情失败:', error)
      res.status(500).json({
        code: 500,
        message: '获取预约详情失败',
        error: error.message,
      })
    }
  },
)

/**
 * @route PUT /api/bookings/:id/status
 * @desc 更新预约状态
 * @access Private (Admin)
 */
router.post(
  '/:id/status',
  requireAuth,
  [
    param('id').isString(),
    body('status').isIn(['pending', 'confirmed', 'cancelled', 'completed']),
    body('remark').optional().isString(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { status, remark } = req.body
      const result = await Booking.updateStatus(req.params.id, status, remark)

      res.json({
        code: 200,
        message: '更新预约状态成功',
        data: result,
      })
    } catch (error: any) {
      console.error('更新预约状态失败:', error)
      res.status(500).json({
        code: 500,
        message: '更新预约状态失败',
        error: error.message,
      })
    }
  },
)

export default router
