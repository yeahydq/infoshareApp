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
      console.log('[专业人士] 开始获取列表, 参数:', params)

      const page = params.page || 1
      const pageSize = params.pageSize || 10

      // 使用真实数据库查询
      const collection = db.collection(collections.PROFESSIONALS)
      console.log('[专业人士] 获取到集合:', collections.PROFESSIONALS)

      // 构建查询条件
      const query = {}
      if (params.status) {
        query['status'] = params.status
      }
      console.log('[专业人士] 查询条件:', query)

      try {
        // 使用集合查询
        console.log('[专业人士] 执行分页查询')

        // 获取总数
        const countResult = await collection.where(query).count()
        console.log('[专业人士] 总数查询结果:', countResult)
        const total = countResult.total || 0

        // 获取分页数据
        const queryRef = collection.where(query)
        console.log('[专业人士] 创建查询引用成功')

        // 查询所有符合条件的数据（不进行分页，后面会手动处理）
        const res = await queryRef.orderBy('updateTime', 'desc').get()
        console.log('[专业人士] 查询结果:', res)

        // 处理结果
        let list = res.data || []
        console.log('[专业人士] 原始数据列表长度:', list.length)

        // 根据_openid去重，保留updateTime最新的记录
        const uniqueMap = new Map()
        for (const item of list) {
          const openid = item._openid
          if (!openid) continue // 跳过没有_openid的记录

          if (
            !uniqueMap.has(openid) ||
            (item.updateTime &&
              new Date(item.updateTime) > new Date(uniqueMap.get(openid).updateTime))
          ) {
            // 确保id字段存在
            uniqueMap.set(openid, {
              ...item,
              id: item.id || item._id, // 添加id字段
            })
          }
        }

        // 转换Map为数组
        list = Array.from(uniqueMap.values())
        console.log('[专业人士] 去重后数据列表长度:', list.length)

        // 如果数据库中没有数据，使用模拟数据
        if (list.length === 0) {
          console.log('[专业人士] 数据库中无数据，使用模拟数据')
          // 生成10个模拟数据
          const mockList = generateMockProfessionals(10).map((item) => ({
            ...item,
            id: item.id,
            _id: item.id,
            status: item.status || 'pending',
            professionalTypes: [item.serviceType],
            createTime: item.createTime,
            updateTime: new Date().toISOString(),
          }))

          // 根据status过滤
          list = params.status ? mockList.filter((item) => item.status === params.status) : mockList

          console.log('[专业人士] 生成的模拟数据:', list)
        }

        // 手动执行分页
        const skipCount = (page - 1) * pageSize
        const limitCount = pageSize
        const paginatedList = list.slice(skipCount, skipCount + limitCount)
        console.log(
          `[专业人士] 应用分页: skip=${skipCount}, limit=${limitCount}, 结果长度=${paginatedList.length}`,
        )

        // 返回去重和分页后的结果
        return {
          list: paginatedList,
          pagination: {
            total: list.length,
            page,
            pageSize,
            totalPages: Math.ceil(list.length / pageSize),
          },
        }
      } catch (queryError) {
        console.error('[专业人士] 查询出错:', queryError)
        console.error(
          '[专业人士] 错误堆栈:',
          queryError instanceof Error ? queryError.stack : '未知错误',
        )
        throw queryError
      }
    } catch (error) {
      console.error('[专业人士] 获取列表失败:', error)
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
      console.log('[专业人士] 开始获取详情, ID:', id)
      // 查询数据库
      const collection = db.collection(collections.PROFESSIONALS)
      const res = await collection.doc(id).get()
      console.log('[专业人士] 详情查询结果:', res)

      // 将cloud://格式的URL转换为https://格式
      const convertCloudUrl = (url: string) => {
        if (!url) return ''

        // 直接返回原始URL，不再进行转换
        return url
      }

      // 处理可能包含多个URL的字段
      const convertMultiCloudUrls = (urlString: string) => {
        if (!urlString) return ''

        // 直接返回原始URL，不再进行转换
        return urlString
      }

      // 兼容不同的返回数据格式
      if (res.data) {
        if (Array.isArray(res.data) && res.data.length > 0) {
          console.log('[专业人士] 找到详情数据(数组格式)')
          const data = res.data[0]

          // 转换各种证书URL
          if (data.idCardFront) data.idCardFront = convertCloudUrl(data.idCardFront)
          if (data.idCardBack) data.idCardBack = convertCloudUrl(data.idCardBack)
          if (data.qualification) data.qualification = convertMultiCloudUrls(data.qualification)
          if (data.education) data.education = convertMultiCloudUrls(data.education)
          if (data.professional) data.professional = convertMultiCloudUrls(data.professional)
          if (data.honor) data.honor = convertMultiCloudUrls(data.honor)
          if (data.avatarUrl) data.avatarUrl = convertCloudUrl(data.avatarUrl)

          // 确保fileInfo中的URL也被转换
          if (data.fileInfo) {
            Object.keys(data.fileInfo).forEach((key) => {
              if (data.fileInfo[key] && data.fileInfo[key].url) {
                data.fileInfo[key].url = convertCloudUrl(data.fileInfo[key].url)
              }
            })
          }

          // 确保包含id字段
          return {
            ...data,
            id: data.id || data._id, // 优先使用已有id，否则使用_id
          }
        } else if (typeof res.data === 'object' && res.data !== null) {
          console.log('[专业人士] 找到详情数据(对象格式)')
          const data = res.data

          // 转换各种证书URL
          if (data.idCardFront) data.idCardFront = convertCloudUrl(data.idCardFront)
          if (data.idCardBack) data.idCardBack = convertCloudUrl(data.idCardBack)
          if (data.qualification) data.qualification = convertMultiCloudUrls(data.qualification)
          if (data.education) data.education = convertMultiCloudUrls(data.education)
          if (data.professional) data.professional = convertMultiCloudUrls(data.professional)
          if (data.honor) data.honor = convertMultiCloudUrls(data.honor)
          if (data.avatarUrl) data.avatarUrl = convertCloudUrl(data.avatarUrl)

          // 确保fileInfo中的URL也被转换
          if (data.fileInfo) {
            Object.keys(data.fileInfo).forEach((key) => {
              if (data.fileInfo[key] && data.fileInfo[key].url) {
                data.fileInfo[key].url = convertCloudUrl(data.fileInfo[key].url)
              }
            })
          }

          // 确保包含id字段
          return {
            ...data,
            id: data.id || data._id, // 优先使用已有id，否则使用_id
          }
        }
      }

      // 如果没找到数据，返回模拟数据
      console.log(`[专业人士] 未找到ID为 ${id} 的专业人士，使用模拟数据`)
      const mockData = generateMockProfessionalDetail(id)
      console.log('[专业人士] 生成的模拟数据:', mockData)
      return mockData
    } catch (error) {
      console.error('[专业人士] 获取详情失败:', error)
      console.error('[专业人士] 错误堆栈:', error instanceof Error ? error.stack : '未知错误')

      // 出错时也返回模拟数据
      console.log('[专业人士] 查询出错，使用模拟数据')
      const mockData = generateMockProfessionalDetail(id)
      console.log('[专业人士] 生成的模拟数据:', mockData)
      return mockData
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

      throw new Error(`未找到ID为 ${id} 的专业人士`)
    } catch (error) {
      console.error('审核专业人士申请失败:', error)
      throw error
    }
  }
}

/**
 * 生成模拟专业人士详情数据
 * @param id 专业人士ID
 * @returns 模拟的专业人士详情
 */
function generateMockProfessionalDetail(id: string) {
  return {
    _id: id,
    id: id,
    name: `模拟专业人士${id.substring(id.length - 4)}`,
    avatarUrl: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
    gender: Math.random() > 0.5 ? 'male' : 'female',
    phone: `1${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10000000000)
      .toString()
      .padStart(9, '0')}`,
    email: `test${id.substring(id.length - 4)}@example.com`,
    professionalTypes: ['心理咨询', '教育指导', '职业规划'].slice(
      0,
      Math.floor(Math.random() * 3) + 1,
    ),
    experience: `${Math.floor(Math.random() * 10) + 1}年`,
    serviceDescription: '这是一段模拟的服务描述，用于测试专业人士详情页面的显示效果。',
    status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)] as any,
    createTime: new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
    ).toISOString(),
    updateTime: new Date().toISOString(),
    // 添加证书和身份证图片
    idCardFront: 'https://img.freepik.com/free-vector/id-card-template_23-2147495264.jpg',
    idCardBack: 'https://img.freepik.com/free-vector/id-card-template_23-2147495264.jpg',
    qualification:
      'https://img.freepik.com/free-vector/elegant-certificate-template-with-frame_23-2147494832.jpg',
    education:
      'https://img.freepik.com/free-vector/elegant-diploma-template-with-golden-details_23-2148774992.jpg',
    professional:
      'https://img.freepik.com/free-vector/professional-certification-template-flat-design_23-2149207293.jpg',
    honor:
      'https://img.freepik.com/free-vector/elegant-certificate-achievement-template-flat-style_23-2147947124.jpg',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    serviceArea: '广东省深圳市南山区',
    fileInfo: {
      idCardFront: {
        url: 'https://img.freepik.com/free-vector/id-card-template_23-2147495264.jpg',
      },
      idCardBack: { url: 'https://img.freepik.com/free-vector/id-card-template_23-2147495264.jpg' },
      qualification: {
        url: 'https://img.freepik.com/free-vector/elegant-certificate-template-with-frame_23-2147494832.jpg',
      },
    },
  }
}

// 生成模拟专业人士列表数据
function generateMockProfessionals(count: number) {
  const result = []
  for (let i = 0; i < count; i++) {
    const id = `mock_pro_${i + 1}`
    result.push({
      id,
      _id: id,
      name: `模拟专业人士${i + 1}`,
      serviceType: ['心理咨询', '教育指导', '职业规划'][i % 3],
      status: ['pending', 'approved', 'rejected'][i % 3],
      phone: `1${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10000000000)
        .toString()
        .padStart(9, '0')}`,
      email: `test${i + 1}@example.com`,
      createTime: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      avatarUrl: `https://randomuser.me/api/portraits/${i % 2 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
    })
  }
  return result
}
