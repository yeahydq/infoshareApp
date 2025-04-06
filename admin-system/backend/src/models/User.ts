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

      // 模拟数据
      const mockUsers = Array.from({ length: 30 }, (_, i) => ({
        id: `user_${i + 1}`,
        username: `user${i + 1}`,
        nickname: `用户${i + 1}`,
        avatar: '',
        phone: `1381234${i.toString().padStart(4, '0')}`,
        email: `user${i + 1}@example.com`,
        status: i % 10 === 0 ? 'disabled' : 'active',
        createTime: new Date(Date.now() - i * 86400000).toISOString(),
      }))

      // 过滤
      let filteredUsers = [...mockUsers]
      if (params.query) {
        const query = params.query.toLowerCase()
        filteredUsers = filteredUsers.filter(
          (user) =>
            user.username.toLowerCase().includes(query) ||
            user.nickname.toLowerCase().includes(query) ||
            user.phone.includes(query) ||
            user.email.toLowerCase().includes(query),
        )
      }

      if (params.status) {
        filteredUsers = filteredUsers.filter((user) => user.status === params.status)
      }

      // 分页
      const total = filteredUsers.length
      const list = filteredUsers.slice((page - 1) * pageSize, page * pageSize)

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
      // 模拟数据
      const idNumber = parseInt(id.replace('user_', '')) || 1

      return {
        id,
        username: `user${idNumber}`,
        nickname: `用户${idNumber}`,
        avatar: '',
        phone: `1381234${idNumber.toString().padStart(4, '0')}`,
        email: `user${idNumber}@example.com`,
        status: idNumber % 10 === 0 ? 'disabled' : 'active',
        registerTime: new Date(Date.now() - idNumber * 86400000).toISOString(),
        lastLoginTime: new Date(Date.now() - idNumber * 3600000).toISOString(),
      }
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
      // 模拟更新
      return {
        id,
        status,
        updateTime: new Date().toISOString(),
      }
    } catch (error) {
      console.error('更新用户状态失败:', error)
      throw error
    }
  }
}
