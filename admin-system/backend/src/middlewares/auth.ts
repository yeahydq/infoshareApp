import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// 扩展Request类型，添加用户信息
// 使用模块增强（module augmentation）而不是命名空间
import 'express'
declare module 'express' {
  interface Request {
    user?: {
      id: string
      username: string
      role: string
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // 获取请求头中的Authorization
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      code: 401,
      message: '未授权，请先登录',
    })
  }

  // 提取token
  const token = authHeader.split(' ')[1]
  if (!token) {
    return res.status(401).json({
      code: 401,
      message: '未提供有效的令牌',
    })
  }

  try {
    // 验证token
    const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key'
    const decoded = jwt.verify(token, jwtSecret) as {
      id: string
      username: string
      role: string
    }

    // 将用户信息添加到请求对象
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({
      code: 401,
      message: '令牌无效或已过期',
    })
  }
}

// 验证管理员权限
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      code: 403,
      message: '权限不足，需要管理员权限',
    })
  }

  next()
}
