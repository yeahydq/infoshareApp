import express from 'express'
import { body } from 'express-validator'
import { validateRequest } from '../middlewares/validation'
import { requireAuth, requireAdmin } from '../middlewares/auth'

const router = express.Router()

/**
 * @route GET /api/users
 * @desc 获取用户列表
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
    console.error('获取用户列表失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取用户列表失败，服务器错误',
    })
  }
})

/**
 * @route GET /api/users/:id
 * @desc 获取用户详情
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
        username: 'user_' + id,
        nickname: '用户' + id,
        avatar: '',
        status: 'active',
      },
    })
  } catch (error) {
    console.error('获取用户详情失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取用户详情失败，服务器错误',
    })
  }
})

/**
 * @route PUT /api/users/:id/status
 * @desc 更新用户状态
 * @access Private (Admin)
 */
router.put(
  '/:id/status',
  requireAuth,
  requireAdmin,
  [body('status').isIn(['active', 'disabled']).withMessage('状态值无效')],
  validateRequest,
  async (req, res) => {
    try {
      const { id } = req.params
      const { status } = req.body

      // 临时返回成功，后续实现
      res.json({
        code: 0,
        message: '用户状态已更新',
        data: {
          id,
          status,
        },
      })
    } catch (error) {
      console.error('更新用户状态失败:', error)
      res.status(500).json({
        code: 500,
        message: '更新用户状态失败，服务器错误',
      })
    }
  },
)

export default router
