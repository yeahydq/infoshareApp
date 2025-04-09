import db, { collections } from './database'
import { generateMockData } from '../utils/mockDataGenerator'
import * as tcb from '@cloudbase/node-sdk'

// 初始化云环境配置
const CLOUD_ENV_ID = process.env.TCB_ENV_ID || ''
const SECRET_ID = process.env.TCB_SECRET_ID || ''
const SECRET_KEY = process.env.TCB_SECRET_KEY || ''

// 使用和cloudController相同的方式初始化tcb应用实例
const getTcbApp = () => {
  // 根据是否有环境参数决定初始化方式
  if (CLOUD_ENV_ID && SECRET_ID && SECRET_KEY) {
    return tcb.init({
      secretId: SECRET_ID,
      secretKey: SECRET_KEY,
      env: CLOUD_ENV_ID,
    })
  }

  // 使用官方文档的简化方式初始化
  return tcb.init()
}

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
   * @param criteria 查询条件
   * @returns 专业人士列表
   */
  static async getList(params: any) {
    try {
      // 检查是否使用模拟数据库
      const useMockDb = process.env.USE_MOCK_DB === 'true'

      if (useMockDb) {
        console.log('[专业人士] 使用模拟数据库')
        return this.generateMockData(params)
      }

      console.log('[专业人士] 使用真实数据库')
      const collection = db.collection(collections.PROFESSIONALS)

      const { pageSize = 10, pageNumber = 1, searchText = '' } = params
      const skip = (pageNumber - 1) * pageSize

      let query = {}
      if (searchText) {
        // 构建模糊搜索条件
        query = {
          name: db.RegExp({
            regexp: searchText,
            options: 'i',
          }),
        }
      }

      // 首先获取所有匹配的记录，按updateTime降序排序
      const allRecordsResult = await collection.where(query).orderBy('updateTime', 'desc').get()

      console.log('[专业人士] 获取到所有记录数量:', allRecordsResult.data?.length || 0)

      // 按_openid分组，保留每组最新的记录（已经按updateTime降序排序了）
      const latestByOpenid = new Map<string, any>()
      if (allRecordsResult.data && allRecordsResult.data.length > 0) {
        allRecordsResult.data.forEach((record) => {
          // 如果记录有_openid字段，且这个_openid还没有记录或当前记录更新
          if (record._openid && !latestByOpenid.has(record._openid)) {
            latestByOpenid.set(record._openid, record)
          }
        })
      }

      // 转换回数组
      const filteredList = Array.from(latestByOpenid.values())
      console.log('[专业人士] 去重后记录数量:', filteredList.length)

      // 计算总数
      const total = filteredList.length

      // 手动分页
      const paginatedList = filteredList.slice(skip, skip + pageSize)

      console.log('[专业人士] 分页后记录数量:', paginatedList.length)

      return {
        total,
        list: paginatedList,
        pageSize,
        pageNumber,
      }
    } catch (error) {
      console.error('[Professional模型] 获取专业人士列表失败:', error)
      // 出错时返回模拟数据
      return this.generateMockData(params)
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

      // 检查是否使用模拟数据库
      const useMockDb = process.env.USE_MOCK_DB === 'true'
      if (useMockDb) {
        console.log('[专业人士] 使用模拟数据')
        return generateMockProfessionalDetail(id)
      }

      // 查询数据库
      const collection = db.collection(collections.PROFESSIONALS)
      const res = await collection.doc(id).get()
      console.log('[专业人士] 详情查询结果:', res)

      // 兼容不同的返回数据格式
      if (res.data) {
        let professionalData

        if (Array.isArray(res.data) && res.data.length > 0) {
          professionalData = res.data[0]

          // 如果有_openid，检查是否有更新的记录
          if (professionalData._openid) {
            console.log(`[专业人士] 检查是否有更新的记录，openid: ${professionalData._openid}`)

            // 查询同一个openid的所有记录，按更新时间降序
            const latestResult = await collection
              .where({
                _openid: professionalData._openid,
              })
              .orderBy('updateTime', 'desc')
              .limit(1)
              .get()

            if (latestResult.data && latestResult.data.length > 0) {
              const latestRecord = latestResult.data[0]

              // 如果找到的最新记录与当前记录不同，使用最新记录
              if (latestRecord._id !== professionalData._id) {
                console.log(`[专业人士] 找到更新的记录: ${latestRecord._id}`)
                professionalData = latestRecord
              }
            }
          }
        } else if (typeof res.data === 'object' && res.data !== null) {
          professionalData = res.data

          // 如果有_openid，检查是否有更新的记录
          if (professionalData._openid) {
            console.log(`[专业人士] 检查是否有更新的记录，openid: ${professionalData._openid}`)

            // 查询同一个openid的所有记录，按更新时间降序
            const latestResult = await collection
              .where({
                _openid: professionalData._openid,
              })
              .orderBy('updateTime', 'desc')
              .limit(1)
              .get()

            if (latestResult.data && latestResult.data.length > 0) {
              const latestRecord = latestResult.data[0]

              // 如果找到的最新记录与当前记录不同，使用最新记录
              if (latestRecord._id !== professionalData._id) {
                console.log(`[专业人士] 找到更新的记录: ${latestRecord._id}`)
                professionalData = latestRecord
              }
            }
          }
        }

        if (professionalData) {
          // 将cloud://格式的URL转换为https://格式
          const convertCloudUrl = async (url: string) => {
            if (!url) return ''

            // 检查URL是否是cloud://开头
            if (url.startsWith('cloud://')) {
              try {
                console.log('[专业人士] 转换云存储URL:', url)
                // 获取临时访问URL
                const app = getTcbApp()
                const result = await app.getTempFileURL({
                  fileList: [url],
                })

                console.log('[专业人士] 获取临时URL结果:', result)

                if (result.fileList && result.fileList.length > 0) {
                  const fileInfo = result.fileList[0] as any
                  if (fileInfo.tempFileURL) {
                    console.log('[专业人士] 转换成功:', fileInfo.tempFileURL)
                    return fileInfo.tempFileURL
                  }
                }

                console.warn('[专业人士] 无法获取临时URL，返回原始URL:', url)
                return url
              } catch (error) {
                console.error('[专业人士] 转换URL失败:', error)
                return url
              }
            }

            // 如果不是cloud://开头，直接返回
            return url
          }

          // 处理可能包含多个URL的字段
          const convertMultiCloudUrls = async (urlString: string) => {
            if (!urlString) return ''

            // 检查是否包含cloud://开头的URL
            if (urlString.includes('cloud://')) {
              try {
                // 分割URL字符串，可能是逗号分隔的多个URL
                const urls = urlString.split(',').map((url) => url.trim())
                const convertedUrls = await Promise.all(
                  urls.map(async (url) => await convertCloudUrl(url)),
                )
                return convertedUrls.join(',')
              } catch (error) {
                console.error('[专业人士] 转换多个URL失败:', error)
                return urlString
              }
            }

            // 如果不包含cloud://，直接返回
            return urlString
          }

          // 转换各种证书URL
          if (professionalData.idCardFront)
            professionalData.idCardFront = await convertCloudUrl(professionalData.idCardFront)
          if (professionalData.idCardBack)
            professionalData.idCardBack = await convertCloudUrl(professionalData.idCardBack)
          if (professionalData.qualification)
            professionalData.qualification = await convertMultiCloudUrls(
              professionalData.qualification,
            )
          if (professionalData.education)
            professionalData.education = await convertMultiCloudUrls(professionalData.education)
          if (professionalData.professional)
            professionalData.professional = await convertMultiCloudUrls(
              professionalData.professional,
            )
          if (professionalData.honor)
            professionalData.honor = await convertMultiCloudUrls(professionalData.honor)
          if (professionalData.avatarUrl)
            professionalData.avatarUrl = await convertCloudUrl(professionalData.avatarUrl)

          // 确保fileInfo中的URL也被转换
          if (professionalData.fileInfo) {
            for (const key of Object.keys(professionalData.fileInfo)) {
              if (professionalData.fileInfo[key] && professionalData.fileInfo[key].url) {
                professionalData.fileInfo[key].url = await convertCloudUrl(
                  professionalData.fileInfo[key].url,
                )
              }
            }
          }

          // 确保包含id字段
          return {
            ...professionalData,
            id: professionalData.id || professionalData._id, // 优先使用已有id，否则使用_id
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

  /**
   * 生成模拟数据用于测试
   * @param params 查询参数
   * @returns 模拟数据
   */
  static generateMockData({
    pageSize = 10,
    pageNumber = 1,
    searchText = '',
  }: {
    pageSize?: number
    pageNumber?: number
    searchText?: string
    [key: string]: any
  }) {
    console.log('[专业人士] 使用模拟数据')

    // 生成模拟专业人士数据
    const total = 100
    const mockList = Array(Math.min(total, pageSize))
      .fill(0)
      .map((_, index) => {
        const id = `mock-${(pageNumber - 1) * pageSize + index + 1}`
        return {
          id,
          _id: id,
          name: searchText
            ? `${searchText}测试${index + 1}`
            : `专业人士${(pageNumber - 1) * pageSize + index + 1}`,
          avatarUrl:
            'https://randomuser.me/api/portraits/men/' + Math.floor(Math.random() * 100) + '.jpg',
          gender: Math.random() > 0.5 ? '男' : '女',
          phone: '1' + Math.floor(Math.random() * 10000000000),
          email: `test${index}@example.com`,
          status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)],
          verifyStatus: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)],
          professionalTypes: ['医生', '律师', '会计师'][Math.floor(Math.random() * 3)],
          createTime: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          updateTime: new Date().toISOString(),
          isDeleted: false,
        }
      })

    return {
      total,
      list: mockList,
      pageSize,
      pageNumber,
    }
  }

  /**
   * 通过ID获取专业人士详情
   */
  static async getById(id: string) {
    try {
      console.log(`[专业人士] 获取ID为 ${id} 的专业人士详情`)

      // 检查是否使用模拟数据
      const useMockDb = process.env.USE_MOCK_DB === 'true'
      if (useMockDb) {
        console.log('[专业人士] 使用模拟数据')
        return generateMockProfessionalDetail(id)
      }

      // 查找指定ID的记录
      const collection = db.collection(collections.PROFESSIONALS)
      const res = await collection.doc(id).get()

      if (res.data) {
        let professionalData

        if (Array.isArray(res.data) && res.data.length > 0) {
          professionalData = res.data[0]

          // 如果有_openid，检查是否有更新的记录
          if (professionalData._openid) {
            console.log(`[专业人士] 检查是否有更新的记录，openid: ${professionalData._openid}`)

            // 查询同一个openid的所有记录，按更新时间降序
            const latestResult = await collection
              .where({
                _openid: professionalData._openid,
              })
              .orderBy('updateTime', 'desc')
              .limit(1)
              .get()

            if (latestResult.data && latestResult.data.length > 0) {
              const latestRecord = latestResult.data[0]

              // 如果找到的最新记录与当前记录不同，使用最新记录
              if (latestRecord._id !== professionalData._id) {
                console.log(`[专业人士] 找到更新的记录: ${latestRecord._id}`)
                professionalData = latestRecord
              }
            }
          }
        } else if (typeof res.data === 'object' && res.data !== null) {
          professionalData = res.data

          // 如果有_openid，检查是否有更新的记录
          if (professionalData._openid) {
            console.log(`[专业人士] 检查是否有更新的记录，openid: ${professionalData._openid}`)

            // 查询同一个openid的所有记录，按更新时间降序
            const latestResult = await collection
              .where({
                _openid: professionalData._openid,
              })
              .orderBy('updateTime', 'desc')
              .limit(1)
              .get()

            if (latestResult.data && latestResult.data.length > 0) {
              const latestRecord = latestResult.data[0]

              // 如果找到的最新记录与当前记录不同，使用最新记录
              if (latestRecord._id !== professionalData._id) {
                console.log(`[专业人士] 找到更新的记录: ${latestRecord._id}`)
                professionalData = latestRecord
              }
            }
          }
        }

        if (professionalData) {
          // 确保包含id字段
          return {
            ...professionalData,
            id: professionalData.id || professionalData._id, // 优先使用已有id，否则使用_id
          }
        }
      }

      console.log(`[专业人士] 未找到ID为 ${id} 的专业人士，使用模拟数据`)
      return generateMockProfessionalDetail(id)
    } catch (error) {
      console.error('[Professional模型] 获取专业人士详情失败:', error)
      // 出错时返回模拟数据
      return generateMockProfessionalDetail(id)
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
      education: {
        url: 'https://img.freepik.com/free-vector/elegant-diploma-template-with-golden-details_23-2148774992.jpg',
      },
      professional: {
        url: 'https://img.freepik.com/free-vector/professional-certification-template-flat-design_23-2149207293.jpg',
      },
      honor: {
        url: 'https://img.freepik.com/free-vector/elegant-certificate-achievement-template-flat-style_23-2147947124.jpg',
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
