import express, { Request, Response } from 'express'
import { body, param, query } from 'express-validator'
import { Professional } from '../models/Professional'
import { validateRequest } from '../middlewares/validation'
import { requireAuth } from '../middlewares/auth'

const router = express.Router()

// 获取专业人士列表
router.get(
  '/',
  requireAuth,
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('status').optional().isString(),
    query('name').optional().isString(),
    query('phone').optional().isString(),
    query('professionalType').optional().isString(),
    query('createTimeStart').optional().isISO8601(),
    query('createTimeEnd').optional().isISO8601(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const result = await Professional.getList(req.query)
      res.json({
        code: 200,
        message: '获取专业人士列表成功',
        data: result.list,
        pagination: result.pagination,
      })
    } catch (error: any) {
      console.error('获取专业人士列表失败:', error)
      res.status(500).json({
        code: 500,
        message: '获取专业人士列表失败',
        error: error.message,
      })
    }
  },
)

// 获取专业人士详情
router.get(
  '/:id',
  requireAuth,
  [param('id').isString()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const professionalId = req.params.id
      console.log('[路由] 获取专业人士详情, ID:', professionalId)

      // 获取专业人士详情
      const professional = await Professional.getDetail(professionalId)

      if (!professional) {
        return res.status(404).json({
          code: 404,
          message: '未找到该专业人士',
        })
      }

      console.log('[路由] 成功获取专业人士详情')
      // 返回成功响应
      return res.json({
        code: 0,
        message: '获取专业人士详情成功',
        data: professional,
      })
    } catch (error) {
      console.error('[路由] 获取专业人士详情失败:', error)
      return res.status(500).json({
        code: 500,
        message: '获取专业人士详情失败',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  },
)

// 审核专业人士申请
router.post(
  '/:id/review',
  requireAuth,
  [
    param('id').isString(),
    body('status').isIn(['approved', 'rejected']),
    body('rejectReason').optional().isString(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { status, rejectReason } = req.body

      const result = await Professional.review(req.params.id, status, rejectReason)

      res.json({
        code: 0,
        ...result,
      })
    } catch (error: any) {
      console.error('审核专业人士申请失败:', error)
      res.status(500).json({
        code: 500,
        message: '审核专业人士申请失败',
        error: error.message,
      })
    }
  },
)

export default router
