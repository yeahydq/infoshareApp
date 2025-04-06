import db, { collections } from './database'

export interface ProfessionalDocument {
  _id: string
  _openid: string
  name: string
  gender: string
  phone: string
  email?: string
  idCard?: string
  professionalTypes: string[]
  educationRanges?: string[]
  skillPrices?: Record<string, number>
  skillBillingTypes?: Record<string, string>
  skillTags?: string[]
  serviceArea?: string
  serviceDescription?: string
  experience?: string
  selectedCity?: string
  selectedDistrict?: string
  selectedStreet?: string
  idCardFront?: string
  idCardBack?: string
  qualification?: string
  education?: string
  professional?: string
  honor?: string
  fileInfo?: Record<string, any>
  status: 'pending' | 'approved' | 'rejected' | 'deprecated'
  createTime: Date
  updateTime: Date
  agreement?: boolean
}

export interface ProfessionalQuery {
  page?: number
  pageSize?: number
  status?: string
  name?: string
  phone?: string
  professionalType?: string
  createTimeStart?: Date
  createTimeEnd?: Date
}

export class Professional {
  // 获取专业人士列表
  static async getList(query: ProfessionalQuery = {}) {
    const {
      page = 1,
      pageSize = 10,
      status,
      name,
      phone,
      professionalType,
      createTimeStart,
      createTimeEnd,
    } = query

    const collection = db.collection(collections.PROFESSIONALS)
    const _ = db.command

    // 构建查询条件
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (name) {
      where.name = db.RegExp({
        regexp: name,
        options: 'i',
      })
    }

    if (phone) {
      where.phone = db.RegExp({
        regexp: phone,
        options: 'i',
      })
    }

    if (professionalType) {
      where.professionalTypes = _.all([professionalType])
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

  // 获取专业人士详情
  static async getDetail(id: string) {
    const collection = db.collection(collections.PROFESSIONALS)

    try {
      const result = await collection.doc(id).get()
      return result.data
    } catch (error) {
      console.error('获取专业人士详情错误:', error)
      throw error
    }
  }

  // 审核专业人士
  static async review(id: string, status: 'approved' | 'rejected', rejectReason?: string) {
    const collection = db.collection(collections.PROFESSIONALS)
    const userCollection = db.collection(collections.USERS)
    const roleCollection = db.collection(collections.USER_ROLES)

    try {
      // 更新专业人士状态
      const professional = await collection.doc(id).get()
      if (!professional.data) {
        throw new Error('专业人士不存在')
      }

      const updateData: any = {
        status,
        updateTime: db.serverDate(),
      }

      if (status === 'rejected' && rejectReason) {
        updateData.rejectReason = rejectReason
      }

      // 更新专业人士表
      await collection.doc(id).update({
        data: updateData,
      })

      // 更新用户表中的专业人士状态
      const openid = professional.data._openid
      const userResult = await userCollection
        .where({
          _openid: openid,
        })
        .get()

      if (userResult.data && userResult.data.length > 0) {
        await userCollection.doc(userResult.data[0]._id).update({
          data: {
            professionalStatus: status,
            updateTime: db.serverDate(),
          },
        })
      }

      // 更新角色表
      const roleResult = await roleCollection
        .where({
          _openid: openid,
          professionalId: id,
        })
        .get()

      if (roleResult.data && roleResult.data.length > 0) {
        await roleCollection.doc(roleResult.data[0]._id).update({
          data: {
            status,
            updateTime: db.serverDate(),
          },
        })
      }

      return { success: true, message: status === 'approved' ? '审核通过' : '已拒绝申请' }
    } catch (error) {
      console.error('审核专业人士错误:', error)
      throw error
    }
  }
}
