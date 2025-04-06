import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import db from '../models/database'

// 简单的密码哈希函数，用于替代bcrypt
const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex')
}

// 验证密码
const verifyPassword = (password: string, hashedPassword: string): boolean => {
  const hash = crypto.createHash('sha256').update(password).digest('hex')
  return hash === hashedPassword
}

// 管理员登录
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body

    // 查询管理员账号
    const adminsCollection = db.collection('admins')
    const admin = await adminsCollection
      .where({
        username: username,
      })
      .get()

    // 检查是否存在管理员账号
    if (!admin.data || admin.data.length === 0) {
      return res.status(401).json({
        code: 401,
        message: '用户名或密码错误',
      })
    }

    const adminData = admin.data[0]

    // 验证密码
    const isPasswordValid = verifyPassword(password, adminData.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        code: 401,
        message: '用户名或密码错误',
      })
    }

    // 生成JWT令牌
    const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key'
    const token = jwt.sign(
      {
        id: adminData._id,
        username: adminData.username,
        role: adminData.role || 'admin',
      },
      jwtSecret,
      { expiresIn: '24h' },
    )

    // 更新最后登录时间
    await adminsCollection.doc(adminData._id).update({
      data: {
        lastLoginTime: db.serverDate(),
      },
    })

    return res.json({
      code: 0,
      message: '登录成功',
      data: {
        token,
        admin: {
          id: adminData._id,
          username: adminData.username,
          role: adminData.role || 'admin',
          name: adminData.name || adminData.username,
        },
      },
    })
  } catch (error) {
    console.error('登录失败:', error)
    return res.status(500).json({
      code: 500,
      message: '登录失败，服务器错误',
      error: error.message,
    })
  }
}

// 获取当前用户信息
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        code: 401,
        message: '未授权',
      })
    }

    // 查询管理员信息
    const adminsCollection = db.collection('admins')
    const admin = await adminsCollection.doc(req.user.id).get()

    if (!admin.data) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在',
      })
    }

    return res.json({
      code: 0,
      data: {
        id: admin.data._id,
        username: admin.data.username,
        role: admin.data.role || 'admin',
        name: admin.data.name || admin.data.username,
        email: admin.data.email,
        avatar: admin.data.avatar,
      },
    })
  } catch (error) {
    console.error('获取当前用户信息失败:', error)
    return res.status(500).json({
      code: 500,
      message: '获取当前用户信息失败，服务器错误',
      error: error.message,
    })
  }
}

// 修改密码
export const changePassword = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        code: 401,
        message: '未授权',
      })
    }

    const { oldPassword, newPassword } = req.body

    // 查询管理员信息
    const adminsCollection = db.collection('admins')
    const admin = await adminsCollection.doc(req.user.id).get()

    if (!admin.data) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在',
      })
    }

    // 验证旧密码
    const isPasswordValid = verifyPassword(oldPassword, admin.data.password)
    if (!isPasswordValid) {
      return res.status(400).json({
        code: 400,
        message: '旧密码错误',
      })
    }

    // 生成新密码的哈希值
    const hashedPassword = hashPassword(newPassword)

    // 更新密码
    await adminsCollection.doc(req.user.id).update({
      data: {
        password: hashedPassword,
        updateTime: db.serverDate(),
      },
    })

    return res.json({
      code: 0,
      message: '密码修改成功',
    })
  } catch (error) {
    console.error('修改密码失败:', error)
    return res.status(500).json({
      code: 500,
      message: '修改密码失败，服务器错误',
      error: error.message,
    })
  }
}
