import axios from 'axios'

// 预约列表接口参数
export interface BookingListParams {
  page?: number
  pageSize?: number
  status?: string
  professionalId?: string
  userId?: string
  startDate?: string
  endDate?: string
}

// 获取预约列表
export const getBookingList = async (params: BookingListParams = {}) => {
  try {
    const response = await axios.get('/api/bookings', { params })
    return response.data
  } catch (error) {
    console.error('获取预约列表失败:', error)
    throw error
  }
}

// 获取预约详情
export const getBookingDetail = async (id: string) => {
  try {
    const response = await axios.get(`/api/bookings/${id}`)
    return response.data
  } catch (error) {
    console.error('获取预约详情失败:', error)
    throw error
  }
}

// 更新预约状态
export const updateBookingStatus = async (id: string, status: string, remark?: string) => {
  try {
    const response = await axios.post(`/api/bookings/${id}/status`, {
      status,
      remark,
    })
    return response.data
  } catch (error) {
    console.error('更新预约状态失败:', error)
    throw error
  }
}
