import db, { collections } from './database'

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
  // 获取预约列表
  static async getList(query: BookingQuery = {}) {
    const {
      page = 1,
      pageSize = 10,
      status,
      orderNo,
      userOpenId,
      professionalOpenId,
      dateStart,
      dateEnd,
      createTimeStart,
      createTimeEnd,
    } = query

    const collection = db.collection(collections.ORDERS)
    const _ = db.command

    // 构建查询条件
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (orderNo) {
      where.orderNo = orderNo
    }

    if (userOpenId) {
      where.userOpenId = userOpenId
    }

    if (professionalOpenId) {
      where.professionalOpenId = professionalOpenId
    }

    if (dateStart && dateEnd) {
      where.date = _.and([_.gte(dateStart), _.lte(dateEnd)])
    } else if (dateStart) {
      where.date = _.gte(dateStart)
    } else if (dateEnd) {
      where.date = _.lte(dateEnd)
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

    // 获取关联的用户和专业人士信息
    const bookingList = result.data || []
    if (bookingList.length === 0) {
      return {
        list: [],
        pagination: {
          current: page,
          pageSize,
          total,
        },
      }
    }

    // 收集需要查询的用户和专业人士ID
    const userIds = [...new Set(bookingList.map((booking) => booking.userOpenId))]
    const professionalIds = [...new Set(bookingList.map((booking) => booking.professionalOpenId))]

    // 查询用户信息
    const usersResult = await db
      .collection(collections.USERS)
      .where({
        _openid: _.in(userIds),
      })
      .get()

    const usersMap = (usersResult.data || []).reduce(
      (map, user) => {
        map[user._openid] = user
        return map
      },
      {} as Record<string, any>,
    )

    // 查询专业人士信息
    const professionalsResult = await db
      .collection(collections.PROFESSIONALS)
      .where({
        _openid: _.in(professionalIds),
      })
      .get()

    const professionalsMap = (professionalsResult.data || []).reduce(
      (map, professional) => {
        map[professional._openid] = professional
        return map
      },
      {} as Record<string, any>,
    )

    // 合并信息
    const enrichedList = bookingList.map((booking) => {
      const user = usersMap[booking.userOpenId] || {}
      const professional = professionalsMap[booking.professionalOpenId] || {}

      return {
        ...booking,
        userInfo: {
          name: user.name || user.nickname || '未知用户',
          avatarUrl: user.avatarUrl || '',
          phone: user.phone || '',
        },
        professionalInfo: {
          name: professional.name || '未知专业人士',
          phone: professional.phone || '',
          professionalTypes: professional.professionalTypes || [],
        },
      }
    })

    return {
      list: enrichedList,
      pagination: {
        current: page,
        pageSize,
        total,
      },
    }
  }

  // 获取预约详情
  static async getDetail(id: string) {
    const collection = db.collection(collections.ORDERS)

    try {
      const result = await collection.doc(id).get()
      if (!result.data) {
        throw new Error('预约记录不存在')
      }

      const booking = result.data

      // 获取用户信息
      const userResult = await db
        .collection(collections.USERS)
        .where({
          _openid: booking.userOpenId,
        })
        .get()

      const user = (userResult.data && userResult.data[0]) || {}

      // 获取专业人士信息
      const professionalResult = await db
        .collection(collections.PROFESSIONALS)
        .where({
          _openid: booking.professionalOpenId,
        })
        .get()

      const professional = (professionalResult.data && professionalResult.data[0]) || {}

      // 合并信息
      return {
        ...booking,
        userInfo: {
          name: user.name || user.nickname || '未知用户',
          avatarUrl: user.avatarUrl || '',
          phone: user.phone || '',
          email: user.email || '',
        },
        professionalInfo: {
          name: professional.name || '未知专业人士',
          phone: professional.phone || '',
          email: professional.email || '',
          professionalTypes: professional.professionalTypes || [],
          serviceDescription: professional.serviceDescription || '',
        },
      }
    } catch (error) {
      console.error('获取预约详情错误:', error)
      throw error
    }
  }

  // 更新预约状态
  static async updateStatus(id: string, status: 'confirmed' | 'completed' | 'cancelled') {
    const collection = db.collection(collections.ORDERS)

    try {
      await collection.doc(id).update({
        data: {
          status,
          updateTime: db.serverDate(),
        },
      })

      return { success: true, message: '预约状态已更新' }
    } catch (error) {
      console.error('更新预约状态错误:', error)
      throw error
    }
  }
}
