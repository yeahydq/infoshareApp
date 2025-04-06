import db, { collections } from './database'
import { generateMockData } from '../utils/mockDataGenerator'

export class Dashboard {
  /**
   * 获取仪表盘统计数据
   * @returns 统计数据对象
   */
  static async getStats() {
    try {
      // 在模拟模式下生成随机数据
      return generateMockData({
        userCount: { total: Math.floor(Math.random() * 1000) + 500 },
        professionalCount: { total: Math.floor(Math.random() * 200) + 100 },
        bookingCount: { total: Math.floor(Math.random() * 2000) + 1000 },
        newUserCount: { today: Math.floor(Math.random() * 50) + 10 },
        newBookingCount: { today: Math.floor(Math.random() * 100) + 20 },
        pendingReviewCount: { total: Math.floor(Math.random() * 20) + 5 },
      })
    } catch (error) {
      console.error('获取仪表盘统计数据失败:', error)
      throw error
    }
  }

  /**
   * 获取用户增长趋势
   * @param period 时间周期 (week|month|year)
   * @returns 用户增长趋势数据
   */
  static async getUserTrend(period: string = 'month') {
    try {
      // 生成模拟数据
      const count = period === 'week' ? 7 : period === 'month' ? 30 : 12
      const trend = Array.from({ length: count }, (_, i) => ({
        date:
          period === 'year'
            ? `${new Date().getFullYear() - 1 + Math.floor(i / 12)}/${(i % 12) + 1}`
            : `${new Date().toISOString().slice(0, 10)}`,
        count: Math.floor(Math.random() * 50) + 5,
      }))

      return trend
    } catch (error) {
      console.error('获取用户增长趋势失败:', error)
      throw error
    }
  }

  /**
   * 获取预约趋势
   * @param period 时间周期 (week|month|year)
   * @returns 预约趋势数据
   */
  static async getBookingTrend(period: string = 'month') {
    try {
      // 生成模拟数据
      const count = period === 'week' ? 7 : period === 'month' ? 30 : 12
      const trend = Array.from({ length: count }, (_, i) => ({
        date:
          period === 'year'
            ? `${new Date().getFullYear() - 1 + Math.floor(i / 12)}/${(i % 12) + 1}`
            : `${new Date().toISOString().slice(0, 10)}`,
        count: Math.floor(Math.random() * 30) + 2,
      }))

      return trend
    } catch (error) {
      console.error('获取预约趋势失败:', error)
      throw error
    }
  }

  /**
   * 获取专业人士分布数据
   * @returns 专业人士分布数据
   */
  static async getProfessionalDistribution() {
    try {
      // 生成模拟数据
      return [
        { type: '医疗健康', count: Math.floor(Math.random() * 50) + 20 },
        { type: '法律咨询', count: Math.floor(Math.random() * 40) + 15 },
        { type: '心理咨询', count: Math.floor(Math.random() * 30) + 10 },
        { type: '教育培训', count: Math.floor(Math.random() * 60) + 30 },
        { type: '财务规划', count: Math.floor(Math.random() * 25) + 10 },
        { type: '职业规划', count: Math.floor(Math.random() * 35) + 15 },
        { type: '生活指导', count: Math.floor(Math.random() * 20) + 5 },
      ]
    } catch (error) {
      console.error('获取专业人士分布数据失败:', error)
      throw error
    }
  }
}
