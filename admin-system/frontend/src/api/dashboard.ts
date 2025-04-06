import axios from 'axios'

// 获取仪表盘统计数据
export const getDashboardStats = async () => {
  try {
    const response = await axios.get('/api/dashboard/stats')
    return response.data
  } catch (error) {
    console.error('获取仪表盘统计数据失败:', error)
    throw error
  }
}

// 获取用户增长趋势
export const getUserGrowthTrend = async (period: string = 'month') => {
  try {
    const response = await axios.get('/api/dashboard/users/trend', {
      params: { period },
    })
    return response.data
  } catch (error) {
    console.error('获取用户增长趋势失败:', error)
    throw error
  }
}

// 获取预约趋势
export const getBookingTrend = async (period: string = 'month') => {
  try {
    const response = await axios.get('/api/dashboard/bookings/trend', {
      params: { period },
    })
    return response.data
  } catch (error) {
    console.error('获取预约趋势失败:', error)
    throw error
  }
}

// 获取专业人士分布数据
export const getProfessionalDistribution = async () => {
  try {
    const response = await axios.get('/api/dashboard/professionals/distribution')
    return response.data
  } catch (error) {
    console.error('获取专业人士分布数据失败:', error)
    throw error
  }
}
