import axios from 'axios'

// 用户列表接口参数
export interface UserListParams {
  page?: number
  pageSize?: number
  query?: string
  status?: string
}

// 获取用户列表
export const getUserList = async (params: UserListParams = {}) => {
  try {
    const response = await axios.get('/api/users', { params })
    return response.data
  } catch (error) {
    console.error('获取用户列表失败:', error)
    throw error
  }
}

// 获取用户详情
export const getUserDetail = async (id: string) => {
  try {
    const response = await axios.get(`/api/users/${id}`)
    return response.data
  } catch (error) {
    console.error('获取用户详情失败:', error)
    throw error
  }
}

// 禁用/启用用户
export const updateUserStatus = async (id: string, status: string) => {
  try {
    const response = await axios.post(`/api/users/${id}/status`, { status })
    return response.data
  } catch (error) {
    console.error('更新用户状态失败:', error)
    throw error
  }
}
