import db, { collections } from './database'
import { generateMockData } from '../utils/mockDataGenerator'

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
  status: 'pending' | 'approved' | 'rejected' | 'disabled'
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

// 专业人士状态类型
type ProfessionalStatus = 'pending' | 'approved' | 'rejected' | 'disabled'

// 专业人士列表查询参数
interface ProfessionalListParams {
  page?: number
  pageSize?: number
  query?: string
  status?: string
  serviceType?: string
}

export class Professional {
  /**
   * 获取专业人士列表
   * @param params 查询参数
   * @returns 专业人士列表和分页信息
   */
  static async getList(params: ProfessionalListParams) {
    try {
      const page = params.page || 1
      const pageSize = params.pageSize || 10

      // 使用真实数据库查询
      const collection = db.collection(collections.PROFESSIONALS)

      // 构建查询条件
      const query = {}
      if (params.status) {
        query['status'] = params.status
      }

      // 获取总数
      const countResult = await collection.where(query).count()
      const total = countResult.total || 0

      // 分页查询数据
      const res = await collection
        .where(query)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .get()

      // 处理结果
      const list = res.data || []

      // 如果没有数据，则返回空数组
      if (list.length === 0) {
        console.log('没有找到专业人士数据')

        // 使用模拟数据（仅开发环境）
        if (process.env.NODE_ENV === 'development') {
          console.log('使用模拟数据')
          const statuses: ProfessionalStatus[] = ['pending', 'approved', 'rejected', 'disabled']
          const serviceTypes = [
            '医疗健康',
            '法律咨询',
            '心理咨询',
            '教育培训',
            '财务规划',
            '职业规划',
            '生活指导',
          ]

          const mockProfessionals = Array.from({ length: 5 }, (_, i) => {
            const status = statuses[Math.floor(Math.random() * 4)]
            const serviceType = serviceTypes[Math.floor(Math.random() * serviceTypes.length)]

            return {
              id: `prof_${i + 1}`,
              name: `专业人士${i + 1}`,
              avatar: '',
              phone: `1387654${i.toString().padStart(4, '0')}`,
              email: `pro${i + 1}@example.com`,
              serviceType,
              title: `${serviceType}顾问`,
              yearsOfExperience: Math.floor(Math.random() * 20) + 1,
              status,
              createTime: new Date(Date.now() - i * 86400000).toISOString(),
            }
          })

          return {
            list: mockProfessionals,
            pagination: {
              total: mockProfessionals.length,
              page,
              pageSize,
              totalPages: Math.ceil(mockProfessionals.length / pageSize),
            },
          }
        }
      }

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
      console.error('获取专业人士列表失败:', error)
      // 出错时返回模拟数据（开发环境）
      if (process.env.NODE_ENV === 'development') {
        console.log('查询出错，使用模拟数据')
        const mockProfessionals = generateMockProfessionals(5)
        return {
          list: mockProfessionals,
          pagination: {
            total: mockProfessionals.length,
            page: params.page || 1,
            pageSize: params.pageSize || 10,
            totalPages: 1,
          },
        }
      }
      throw error
    }
  }

  /**
   * 获取专业人士详情
   * @param id 专业人士ID
   * @returns 专业人士详情
   */
  static async getDetail(id: string) {
    try {
      // 查询数据库
      const collection = db.collection(collections.PROFESSIONALS)
      const res = await collection.doc(id).get()

      if (res.data && res.data.length > 0) {
        return res.data[0]
      }

      console.log(`未找到ID为 ${id} 的专业人士`)

      // 开发环境下使用模拟数据
      if (process.env.NODE_ENV === 'development') {
        console.log('使用模拟详情数据')
        // 模拟数据
        const idNumber = parseInt(id.replace('prof_', '')) || 1
        const statuses: ProfessionalStatus[] = ['pending', 'approved', 'rejected', 'disabled']
        const serviceTypes = [
          '医疗健康',
          '法律咨询',
          '心理咨询',
          '教育培训',
          '财务规划',
          '职业规划',
          '生活指导',
        ]
        const serviceType = serviceTypes[idNumber % serviceTypes.length]

        return {
          id,
          name: `专业人士${idNumber}`,
          avatar: '',
          phone: `1387654${idNumber.toString().padStart(4, '0')}`,
          email: `pro${idNumber}@example.com`,
          serviceType,
          title: `${serviceType}顾问`,
          yearsOfExperience: (idNumber % 20) + 1,
          qualification: `${serviceType}专业${(idNumber % 10) + 1}年从业经验`,
          certificate: `${serviceType}行业认证`,
          introduction: `我是一名专业的${serviceType}顾问，有着${(idNumber % 20) + 1}年的从业经验，专注于帮助客户解决${serviceType}相关的问题。`,
          serviceDescription: `提供专业的${serviceType}咨询服务，包括但不限于...(详细服务内容)`,
          status: statuses[idNumber % 4],
          pricePerHour: ((idNumber % 10) + 1) * 100,
          rating: ((idNumber % 5) + 3) / 2 + 3, // 3-5分
          reviewCount: idNumber * 5,
          createTime: new Date(Date.now() - idNumber * 86400000).toISOString(),
          updateTime:
            idNumber % 2 === 0
              ? new Date(Date.now() - idNumber * 43200000).toISOString()
              : undefined,
          rejectReason: idNumber % 4 === 2 ? '提供的资质证书不符合要求，请重新提交' : undefined,
        }
      }

      return null
    } catch (error) {
      console.error('获取专业人士详情失败:', error)

      // 开发环境下使用模拟数据
      if (process.env.NODE_ENV === 'development') {
        console.log('查询出错，使用模拟详情数据')
        return generateMockProfessionalDetail(id)
      }

      throw error
    }
  }

  /**
   * 审核专业人士申请
   * @param id 专业人士ID
   * @param status 审核状态 (approved|rejected)
   * @param rejectReason 拒绝原因
   * @returns 审核结果
   */
  static async review(id: string, status: 'approved' | 'rejected', rejectReason?: string) {
    try {
      const collection = db.collection(collections.PROFESSIONALS)

      // 准备更新的数据
      const updateData: any = {
        status,
        updateTime: db.serverDate(),
      }

      // 如果是拒绝，添加拒绝原因
      if (status === 'rejected' && rejectReason) {
        updateData.rejectReason = rejectReason
      } else {
        // 如果是通过，清除拒绝原因
        updateData.rejectReason = ''
      }

      // 更新数据库
      await collection.doc(id).update(updateData)

      // 获取更新后的数据
      const res = await collection.doc(id).get()

      if (res.data && res.data.length > 0) {
        return res.data[0]
      }

      // 开发环境使用模拟数据
      if (process.env.NODE_ENV === 'development') {
        console.log('使用模拟审核数据')
        return {
          id,
          status,
          rejectReason: status === 'rejected' ? rejectReason : undefined,
          updateTime: new Date().toISOString(),
        }
      }

      throw new Error(`未找到ID为 ${id} 的专业人士`)
    } catch (error) {
      console.error('审核专业人士申请失败:', error)

      // 开发环境使用模拟数据
      if (process.env.NODE_ENV === 'development') {
        console.log('审核出错，使用模拟数据')
        return {
          id,
          status,
          rejectReason: status === 'rejected' ? rejectReason : undefined,
          updateTime: new Date().toISOString(),
        }
      }

      throw error
    }
  }
}

// 生成模拟专业人士数据的辅助函数
function generateMockProfessionals(count: number) {
  const statuses: ProfessionalStatus[] = ['pending', 'approved', 'rejected', 'disabled']
  const serviceTypes = [
    '医疗健康',
    '法律咨询',
    '心理咨询',
    '教育培训',
    '财务规划',
    '职业规划',
    '生活指导',
  ]

  return Array.from({ length: count }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * 4)]
    const serviceType = serviceTypes[Math.floor(Math.random() * serviceTypes.length)]

    return {
      id: `prof_${i + 1}`,
      name: `专业人士${i + 1}`,
      avatar: '',
      phone: `1387654${i.toString().padStart(4, '0')}`,
      email: `pro${i + 1}@example.com`,
      serviceType,
      title: `${serviceType}顾问`,
      yearsOfExperience: Math.floor(Math.random() * 20) + 1,
      status,
      createTime: new Date(Date.now() - i * 86400000).toISOString(),
    }
  })
}

// 生成模拟专业人士详情数据的辅助函数
function generateMockProfessionalDetail(id: string) {
  const idNumber = parseInt(id.replace('prof_', '')) || 1
  const statuses: ProfessionalStatus[] = ['pending', 'approved', 'rejected', 'disabled']
  const serviceTypes = [
    '医疗健康',
    '法律咨询',
    '心理咨询',
    '教育培训',
    '财务规划',
    '职业规划',
    '生活指导',
  ]
  const serviceType = serviceTypes[idNumber % serviceTypes.length]

  return {
    id,
    name: `专业人士${idNumber}`,
    avatar: '',
    phone: `1387654${idNumber.toString().padStart(4, '0')}`,
    email: `pro${idNumber}@example.com`,
    serviceType,
    title: `${serviceType}顾问`,
    yearsOfExperience: (idNumber % 20) + 1,
    qualification: `${serviceType}专业${(idNumber % 10) + 1}年从业经验`,
    certificate: `${serviceType}行业认证`,
    introduction: `我是一名专业的${serviceType}顾问，有着${(idNumber % 20) + 1}年的从业经验，专注于帮助客户解决${serviceType}相关的问题。`,
    serviceDescription: `提供专业的${serviceType}咨询服务，包括但不限于...(详细服务内容)`,
    status: statuses[idNumber % 4],
    pricePerHour: ((idNumber % 10) + 1) * 100,
    rating: ((idNumber % 5) + 3) / 2 + 3, // 3-5分
    reviewCount: idNumber * 5,
    createTime: new Date(Date.now() - idNumber * 86400000).toISOString(),
    updateTime:
      idNumber % 2 === 0 ? new Date(Date.now() - idNumber * 43200000).toISOString() : undefined,
    rejectReason: idNumber % 4 === 2 ? '提供的资质证书不符合要求，请重新提交' : undefined,
  }
}
