import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// 扩展Request类型
declare module 'express' {
  interface Request {
    user?: {
      id: string
      username: string
      role: string
    }
  }
}

// 验证Token中间件
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // 获取Authorization头部
  const authHeader = req.headers.authorization

  try {
    // 检查是否提供了Authorization头部
    if (!authHeader) {
      console.log('认证失败: 未提供Authorization头部')
      return res.status(401).json({
        code: 401,
        message: '未授权，请先登录',
      })
    }

    // 检查格式是否为"Bearer xxx"
    const parts = authHeader.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      console.log('认证失败: Authorization头部格式错误', authHeader)
      return res.status(401).json({
        code: 401,
        message: '无效的授权格式',
      })
    }

    const token = parts[1]

    // 验证JWT令牌
    const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key'
    const decoded = jwt.verify(token, jwtSecret)

    // 将用户信息添加到请求对象
    req.user = decoded as {
      id: string
      username: string
      role: string
    }

    // 继续执行
    next()
  } catch (error: any) {
    console.error('JWT验证失败:', error)
    return res.status(401).json({
      code: 401,
      message: '无效的令牌',
      error: error.message || '未知错误',
    })
  }
}

// 验证管理员权限中间件
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 检查是否已通过认证
    if (!req.user) {
      console.log('管理员验证失败: 缺少用户信息')
      return res.status(401).json({
        code: 401,
        message: '未授权，请先登录',
      })
    }

    // 检查用户角色是否为管理员
    if (req.user.role !== 'admin') {
      console.log('管理员验证失败: 用户角色不是admin', req.user.role)
      return res.status(403).json({
        code: 403,
        message: '权限不足，需要管理员权限',
      })
    }

    // 继续执行
    next()
  } catch (error: any) {
    console.error('验证管理员权限失败:', error)
    return res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: error.message || '未知错误',
    })
  }
}
