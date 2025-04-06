import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import db from '../models/database'

/**
 * 简单的密码哈希函数，用于替代bcrypt
 * @param password 原始密码
 * @returns 哈希后的密码
 */
const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex')
}

/**
 * 验证密码
 * @param password 原始密码
 * @param hashedPassword 哈希后的密码
 * @returns 密码是否匹配
 */
const verifyPassword = (password: string, hashedPassword: string): boolean => {
  const hash = crypto.createHash('sha256').update(password).digest('hex')
  console.log('[验证密码] 输入密码:', password)
  console.log('[验证密码] 计算哈希:', hash)
  console.log('[验证密码] 存储哈希:', hashedPassword)
  console.log('[验证密码] 比较结果:', hash === hashedPassword)
  return hash === hashedPassword
}

/**
 * 管理员登录
 */
export const login = async (username: string, password: string) => {
  try {
    console.log('[认证] 开始登录处理:', { username })

    // 验证请求数据
    if (!username || !password) {
      console.log('[认证] 登录失败: 用户名或密码为空')
      return {
        code: 400,
        message: '用户名和密码不能为空',
      }
    }

    try {
      // 查询管理员账号
      const adminsCollection = db.collection('admins')
      const admin = await adminsCollection
        .where({
          username: username,
        })
        .get()

      // 检查是否存在管理员账号
      if (!admin.data || admin.data.length === 0) {
        console.log('[认证] 登录失败: 用户不存在', { username })
        return {
          code: 401,
          message: '用户名或密码错误',
        }
      }

      const adminData = admin.data[0]

      // 创建一个临时条件，允许直接使用"admin"作为密码登录
      // 这仅用于开发和测试
      if (username === 'admin' && password === 'admin') {
        console.log('[认证] 开发模式：使用admin密码直接登录')
      } else {
        // 验证密码
        const isPasswordValid = verifyPassword(password, adminData.password)
        if (!isPasswordValid) {
          console.log('[认证] 登录失败: 密码错误', { username })
          return {
            code: 401,
            message: '用户名或密码错误',
          }
        }
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
      try {
        await adminsCollection.doc(adminData._id).update({
          data: {
            lastLoginTime: new Date(),
          },
        })
      } catch (updateError: any) {
        // 更新登录时间失败不影响登录流程，仅记录日志
        console.error('[认证] 更新最后登录时间失败:', updateError)
      }

      console.log('[认证] 登录成功:', { username, id: adminData._id })
      return {
        code: 200,
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
      }
    } catch (dbError: any) {
      console.error('[认证] 数据库操作失败:', dbError)
      return {
        code: 500,
        message: '登录失败，数据库操作错误',
        error: dbError.message || '未知数据库错误',
      }
    }
  } catch (error: any) {
    console.error('[认证] 登录过程发生错误:', error)
    return {
      code: 500,
      message: '登录失败，服务器错误',
      error: error.message || '未知错误',
    }
  }
}

/**
 * 获取当前用户信息
 */
export const getCurrentUser = async (id: string) => {
  try {
    console.log('[认证] 获取当前用户信息:', { userId: id })

    // 查询管理员信息
    try {
      const adminsCollection = db.collection('admins')
      const adminResult = await adminsCollection.doc(id).get()
      const adminData = adminResult.data

      if (!adminData) {
        console.log('[认证] 获取用户信息失败: 用户不存在', { userId: id })
        return {
          code: 404,
          message: '用户不存在',
        }
      }

      return {
        id: adminData._id,
        username: adminData.username,
        role: adminData.role || 'admin',
        name: adminData.name || adminData.username,
        email: adminData.email,
        avatar: adminData.avatar,
      }
    } catch (dbError: any) {
      console.error('[认证] 获取用户信息失败: 数据库错误', dbError)
      throw new Error('获取用户信息失败，数据库错误: ' + (dbError.message || '未知数据库错误'))
    }
  } catch (error: any) {
    console.error('[认证] 获取当前用户信息失败:', error)
    throw error
  }
}

/**
 * 修改密码
 */
export const changePassword = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        code: 401,
        message: '未授权',
      })
    }

    const { oldPassword, newPassword } = req.body

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        code: 400,
        message: '旧密码和新密码不能为空',
      })
    }

    try {
      // 查询管理员信息
      const adminsCollection = db.collection('admins')
      const adminResult = await adminsCollection.doc(req.user.id).get()
      const adminData = adminResult.data

      if (!adminData) {
        return res.status(404).json({
          code: 404,
          message: '用户不存在',
        })
      }

      // 验证旧密码
      const isPasswordValid = verifyPassword(oldPassword, adminData.password)
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
          updateTime: new Date(),
        },
      })

      return res.json({
        code: 200,
        message: '密码修改成功',
      })
    } catch (dbError: any) {
      console.error('[认证] 修改密码失败: 数据库错误', dbError)
      return res.status(500).json({
        code: 500,
        message: '修改密码失败，数据库错误',
        error: dbError.message || '未知数据库错误',
      })
    }
  } catch (error: any) {
    console.error('[认证] 修改密码失败:', error)
    return res.status(500).json({
      code: 500,
      message: '修改密码失败，服务器错误',
      error: error.message || '未知错误',
    })
  }
}
