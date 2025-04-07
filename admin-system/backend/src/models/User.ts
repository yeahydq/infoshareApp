import db, { collections } from './database'
import { generateMockData } from '../utils/mockDataGenerator'

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

// 用户状态类型
type UserStatus = 'active' | 'disabled'

// 用户列表查询参数
interface UserListParams {
  page?: number
  pageSize?: number
  query?: string
  status?: string
}

export class User {
  /**
   * 获取用户列表
   * @param params 查询参数
   * @returns 用户列表和分页信息
   */
  static async getList(params: UserListParams) {
    try {
      const page = params.page || 1
      const pageSize = params.pageSize || 10

      // 使用真实数据库查询
      const collection = db.collection(collections.USERS)
      console.log('[用户] 获取到集合:', collections.USERS)

      // 构建查询条件
      const query = {}
      if (params.status) {
        query['status'] = params.status
      }
      if (params.query) {
        // 支持模糊搜索用户昵称或手机号
        query['$or'] = [
          { nickname: db.RegExp({ regexp: params.query, options: 'i' }) },
          { phone: db.RegExp({ regexp: params.query, options: 'i' }) },
        ]
      }
      console.log('[用户] 查询条件:', query)

      // 获取总数
      const countResult = await collection.where(query).count()
      console.log('[用户] 总数查询结果:', countResult)
      const total = countResult.total || 0

      // 获取分页数据
      const queryRef = collection.where(query)
      console.log('[用户] 创建查询引用成功')

      // 应用分页
      const skipCount = (page - 1) * pageSize
      const limitCount = pageSize
      console.log(`[用户] 应用分页: skip=${skipCount}, limit=${limitCount}`)

      // 执行分页查询
      const res = await queryRef.skip(skipCount).limit(limitCount).get()
      console.log('[用户] 查询结果:', res)

      // 处理结果
      const list = res.data || []
      console.log('[用户] 数据列表长度:', list.length)

      // 返回实际查询结果
      return {
        list,
        pagination: {
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
      }
    } catch (error) {
      console.error('获取用户列表失败:', error)
      throw error
    }
  }

  /**
   * 获取用户详情
   * @param id 用户ID
   * @returns 用户详情
   */
  static async getDetail(id: string) {
    try {
      // 查询数据库
      const collection = db.collection(collections.USERS)
      console.log('[用户] 查询详情, ID:', id)

      const res = await collection.doc(id).get()
      console.log('[用户] 详情查询结果:', res)

      if (res.data) {
        if (Array.isArray(res.data) && res.data.length > 0) {
          console.log('[用户] 找到用户详情(数组格式)')
          return res.data[0]
        } else if (typeof res.data === 'object' && res.data !== null) {
          console.log('[用户] 找到用户详情(对象格式)')
          return res.data
        }
      }

      console.log(`[用户] 未找到ID为 ${id} 的用户`)
      return null
    } catch (error) {
      console.error('获取用户详情失败:', error)
      throw error
    }
  }

  /**
   * 更新用户状态
   * @param id 用户ID
   * @param status 新状态
   * @returns 更新结果
   */
  static async updateStatus(id: string, status: UserStatus) {
    try {
      // 更新数据库
      const collection = db.collection(collections.USERS)
      console.log(`[用户] 更新状态: ID=${id}, 状态=${status}`)

      // 准备更新的数据
      const updateData = {
        status,
        updateTime: db.serverDate(),
      }

      // 执行更新
      await collection.doc(id).update(updateData)
      console.log('[用户] 状态更新成功')

      // 获取更新后的用户数据
      const res = await collection.doc(id).get()

      if (res.data) {
        if (Array.isArray(res.data) && res.data.length > 0) {
          return res.data[0]
        } else if (typeof res.data === 'object' && res.data !== null) {
          return res.data
        }
      }

      throw new Error(`未找到ID为 ${id} 的用户`)
    } catch (error) {
      console.error('更新用户状态失败:', error)
      throw error
    }
  }
}
