import express, { Request, Response } from 'express'
import { login, getCurrentUser, changePassword } from '../controllers/AuthController'
import { requireAuth, requireAdmin } from '../middlewares/auth'
import { validateRequest } from '../middlewares/validation'
import { body } from 'express-validator'

const router = express.Router()

/**
 * @route POST /api/auth/login
 * @desc 管理员登录
 * @access Public
 */
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('用户名不能为空'),
    body('password').isLength({ min: 5 }).withMessage('密码长度不能少于5位'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const result = await login(req.body.username, req.body.password)
      res.status(result.code === 200 ? 200 : result.code).json(result)
    } catch (error: any) {
      console.error('登录失败:', error)
      res.status(401).json({
        code: 401,
        message: '登录失败: ' + error.message,
      })
    }
  },
)

/**
 * @route GET /api/auth/current
 * @desc 获取当前登录管理员信息
 * @access Private
 */
router.get('/current', requireAuth, async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        code: 401,
        message: '未授权',
      })
    }

    const userInfo = await getCurrentUser(req.user.id)
    res.json({
      code: 200,
      message: '获取当前用户信息成功',
      data: userInfo,
    })
  } catch (error: any) {
    console.error('获取当前用户信息失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取当前用户信息失败: ' + error.message,
    })
  }
})

/**
 * @route PUT /api/auth/change-password
 * @desc 修改密码
 * @access Private
 */
router.put(
  '/change-password',
  requireAuth,
  requireAdmin,
  [
    body('oldPassword').notEmpty().withMessage('旧密码不能为空'),
    body('newPassword')
      .notEmpty()
      .withMessage('新密码不能为空')
      .isLength({ min: 6 })
      .withMessage('新密码长度不能少于6个字符'),
  ],
  validateRequest,
  changePassword,
)

export default router
