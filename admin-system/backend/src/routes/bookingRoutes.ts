import express from 'express'
import { body } from 'express-validator'
import { validateRequest } from '../middlewares/validation'
import { requireAuth, requireAdmin } from '../middlewares/auth'

const router = express.Router()

/**
 * @route GET /api/bookings
 * @desc 获取所有预约记录
 * @access Private (Admin)
 */
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    // 临时返回空数据，后续实现
    res.json({
      code: 0,
      data: {
        total: 0,
        list: [],
      },
    })
  } catch (error) {
    console.error('获取预约列表失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取预约列表失败，服务器错误',
    })
  }
})

/**
 * @route GET /api/bookings/:id
 * @desc 获取预约详情
 * @access Private (Admin)
 */
router.get('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    // 临时返回空数据，后续实现
    res.json({
      code: 0,
      data: {
        id,
        professionalId: 'prof_123',
        professionalName: '专业人士1',
        userId: 'user_456',
        userName: '用户1',
        serviceDate: '2023-04-10',
        serviceTime: '10:00-11:00',
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('获取预约详情失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取预约详情失败，服务器错误',
    })
  }
})

/**
 * @route PUT /api/bookings/:id/status
 * @desc 更新预约状态
 * @access Private (Admin)
 */
router.put(
  '/:id/status',
  requireAuth,
  requireAdmin,
  [
    body('status')
      .isIn(['pending', 'confirmed', 'canceled', 'completed'])
      .withMessage('状态值无效'),
    body('remark').optional().isString().withMessage('备注必须是字符串'),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { id } = req.params
      const { status, remark } = req.body

      // 临时返回成功，后续实现
      res.json({
        code: 0,
        message: '预约状态已更新',
        data: {
          id,
          status,
          remark: remark || null,
        },
      })
    } catch (error) {
      console.error('更新预约状态失败:', error)
      res.status(500).json({
        code: 500,
        message: '更新预约状态失败，服务器错误',
      })
    }
  },
)

export default router
