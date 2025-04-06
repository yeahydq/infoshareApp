import db, { collections } from './database'

export interface UserDocument {
  _id: string
  _openid: string
  avatarUrl?: string
  nickname?: string
  name?: string
  gender?: number
  phone?: string
  email?: string
  professionalId?: string
  professionalStatus?: 'pending' | 'approved' | 'rejected'
  createTime: Date
  updateTime: Date
  lastLoginTime?: Date
}

export interface UserQuery {
  page?: number
  pageSize?: number
  nickname?: string
  phone?: string
  isProfessional?: boolean
  createTimeStart?: Date
  createTimeEnd?: Date
}

export class User {
  // 获取用户列表
  static async getList(query: UserQuery = {}) {
    const {
      page = 1,
      pageSize = 10,
      nickname,
      phone,
      isProfessional,
      createTimeStart,
      createTimeEnd,
    } = query

    const collection = db.collection(collections.USERS)
    const _ = db.command

    // 构建查询条件
    const where: any = {}

    if (nickname) {
      where.nickname = db.RegExp({
        regexp: nickname,
        options: 'i',
      })
    }

    if (phone) {
      where.phone = db.RegExp({
        regexp: phone,
        options: 'i',
      })
    }

    if (isProfessional !== undefined) {
      if (isProfessional) {
        where.professionalId = _.exists(true)
      } else {
        where.professionalId = _.exists(false)
      }
    }

    if (createTimeStart && createTimeEnd) {
      where.createTime = _.and([_.gte(createTimeStart), _.lte(createTimeEnd)])
    } else if (createTimeStart) {
      where.createTime = _.gte(createTimeStart)
    } else if (createTimeEnd) {
      where.createTime = _.lte(createTimeEnd)
    }

    // 获取总数
    const countResult = await collection.where(where).count()
    const total = countResult.total

    // 获取数据
    const result = await collection
      .where(where)
      .orderBy('createTime', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get()

    return {
      list: result.data,
      pagination: {
        current: page,
        pageSize,
        total,
      },
    }
  }

  // 获取用户详情
  static async getDetail(id: string) {
    const collection = db.collection(collections.USERS)

    try {
      const result = await collection.doc(id).get()
      return result.data
    } catch (error) {
      console.error('获取用户详情错误:', error)
      throw error
    }
  }

  // 禁用/启用用户
  static async toggleStatus(id: string, enabled: boolean) {
    const collection = db.collection(collections.USERS)

    try {
      await collection.doc(id).update({
        data: {
          status: enabled ? 'active' : 'disabled',
          updateTime: db.serverDate(),
        },
      })

      return { success: true, message: enabled ? '用户已启用' : '用户已禁用' }
    } catch (error) {
      console.error('更新用户状态错误:', error)
      throw error
    }
  }
}
