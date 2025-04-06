import db, { collections } from './database'
import { generateMockData } from '../utils/mockDataGenerator'

// 预约状态类型
type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

// 预约列表查询参数
interface BookingListParams {
  page?: number
  pageSize?: number
  status?: string
  professionalId?: string
  userId?: string
  startDate?: string
  endDate?: string
}

export interface BookingDocument {
  _id: string
  _openid: string
  orderNo: string
  userOpenId: string
  professionalOpenId: string
  date: string
  startTime: string
  endTime: string
  remark?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createTime: Date
  updateTime: Date
}

export interface BookingQuery {
  page?: number
  pageSize?: number
  status?: string
  orderNo?: string
  userOpenId?: string
  professionalOpenId?: string
  dateStart?: string
  dateEnd?: string
  createTimeStart?: Date
  createTimeEnd?: Date
}

export class Booking {
  /**
   * 获取预约列表
   * @param params 查询参数
   * @returns 预约列表和分页信息
   */
  static async getList(params: BookingListParams) {
    try {
      const page = params.page || 1
      const pageSize = params.pageSize || 10

      // 模拟数据
      const statuses: BookingStatus[] = ['pending', 'confirmed', 'cancelled', 'completed']
      const mockBookings = Array.from({ length: 50 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - Math.floor(Math.random() * 30))

        return {
          id: `booking_${i + 1}`,
          userId: `user_${Math.floor(Math.random() * 20) + 1}`,
          userName: `用户${Math.floor(Math.random() * 20) + 1}`,
          professionalId: `prof_${Math.floor(Math.random() * 10) + 1}`,
          professionalName: `专业人士${Math.floor(Math.random() * 10) + 1}`,
          serviceType: ['医疗健康', '法律咨询', '心理咨询', '教育培训', '财务规划'][
            Math.floor(Math.random() * 5)
          ],
          bookingDate: d.toISOString().slice(0, 10),
          timeSlot: `${Math.floor(Math.random() * 12) + 8}:00-${Math.floor(Math.random() * 12) + 9}:00`,
          status: statuses[Math.floor(Math.random() * 4)],
          createTime: new Date(Date.now() - i * 3600000).toISOString(),
          remark: i % 5 === 0 ? '有特殊需求，请提前准备' : '',
        }
      })

      // 过滤
      let filteredBookings = [...mockBookings]

      if (params.status) {
        filteredBookings = filteredBookings.filter((booking) => booking.status === params.status)
      }

      if (params.professionalId) {
        filteredBookings = filteredBookings.filter(
          (booking) => booking.professionalId === params.professionalId,
        )
      }

      if (params.userId) {
        filteredBookings = filteredBookings.filter((booking) => booking.userId === params.userId)
      }

      if (params.startDate && params.endDate) {
        filteredBookings = filteredBookings.filter(
          (booking) =>
            booking.bookingDate >= params.startDate! && booking.bookingDate <= params.endDate!,
        )
      } else if (params.startDate) {
        filteredBookings = filteredBookings.filter(
          (booking) => booking.bookingDate >= params.startDate!,
        )
      } else if (params.endDate) {
        filteredBookings = filteredBookings.filter(
          (booking) => booking.bookingDate <= params.endDate!,
        )
      }

      // 分页
      const total = filteredBookings.length
      const list = filteredBookings.slice((page - 1) * pageSize, page * pageSize)

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
      console.error('获取预约列表失败:', error)
      throw error
    }
  }

  /**
   * 获取预约详情
   * @param id 预约ID
   * @returns 预约详情
   */
  static async getDetail(id: string) {
    try {
      // 模拟数据
      const idNumber = parseInt(id.replace('booking_', '')) || 1
      const statuses: BookingStatus[] = ['pending', 'confirmed', 'cancelled', 'completed']
      const d = new Date()
      d.setDate(d.getDate() - Math.floor(Math.random() * 30))

      return {
        id,
        userId: `user_${(idNumber % 20) + 1}`,
        userName: `用户${(idNumber % 20) + 1}`,
        userPhone: `1381234${((idNumber % 20) + 1).toString().padStart(4, '0')}`,
        professionalId: `prof_${(idNumber % 10) + 1}`,
        professionalName: `专业人士${(idNumber % 10) + 1}`,
        professionalPhone: `1387654${((idNumber % 10) + 1).toString().padStart(4, '0')}`,
        serviceType: ['医疗健康', '法律咨询', '心理咨询', '教育培训', '财务规划'][idNumber % 5],
        bookingDate: d.toISOString().slice(0, 10),
        timeSlot: `${(idNumber % 12) + 8}:00-${(idNumber % 12) + 9}:00`,
        status: statuses[idNumber % 4],
        price: Math.floor(Math.random() * 500) + 100,
        createTime: new Date(Date.now() - idNumber * 3600000).toISOString(),
        updateTime: new Date(Date.now() - idNumber * 1800000).toISOString(),
        remark: idNumber % 5 === 0 ? '有特殊需求，请提前准备' : '',
        statusHistory: [
          {
            status: 'pending',
            time: new Date(Date.now() - idNumber * 3600000).toISOString(),
            operator: 'system',
          },
          ...(idNumber % 4 > 0
            ? [
                {
                  status: 'confirmed',
                  time: new Date(Date.now() - idNumber * 2400000).toISOString(),
                  operator: 'admin',
                  remark: '已确认',
                },
              ]
            : []),
          ...(idNumber % 4 > 1
            ? [
                {
                  status: idNumber % 4 === 2 ? 'cancelled' : 'completed',
                  time: new Date(Date.now() - idNumber * 1200000).toISOString(),
                  operator: 'admin',
                  remark: idNumber % 4 === 2 ? '已取消' : '已完成',
                },
              ]
            : []),
        ],
      }
    } catch (error) {
      console.error('获取预约详情失败:', error)
      throw error
    }
  }

  /**
   * 更新预约状态
   * @param id 预约ID
   * @param status 新状态
   * @param remark 备注
   * @returns 更新结果
   */
  static async updateStatus(id: string, status: BookingStatus, remark?: string) {
    try {
      // 模拟更新
      return {
        id,
        status,
        remark,
        updateTime: new Date().toISOString(),
      }
    } catch (error) {
      console.error('更新预约状态失败:', error)
      throw error
    }
  }
}
