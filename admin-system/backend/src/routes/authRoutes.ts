import express from 'express'
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
    body('password').notEmpty().withMessage('密码不能为空'),
  ],
  validateRequest,
  login,
)

/**
 * @route GET /api/auth/me
 * @desc 获取当前登录管理员信息
 * @access Private
 */
router.get('/me', requireAuth, requireAdmin, getCurrentUser)

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
