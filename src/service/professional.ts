import { useUserStore } from '@/store'
import request from '@/utils/request'

// 检查用户专业人士状态的通用方法
export async function checkProfessionalStatus() {
  const userStore = useUserStore()
  try {
    const { result } = await uni.cloud.callFunction({
      name: 'profRegister',
      data: {
        action: 'checkApplication',
      },
    })

    console.log('检查专业人士状态结果:', result)

    // 更新用户信息
    if (result && result.hasApplication) {
      const latestStatus = result.application.status
      if (latestStatus !== userStore.userInfo.professionalStatus) {
        userStore.setUserInfo({
          ...userStore.userInfo,
          professionalStatus: latestStatus,
          updateTime: new Date().getTime(),
        })
      }
    }

    // 返回结果，供各组件使用
    return {
      isRegistered: result && result.hasApplication,
      isApproved: result && result.hasApplication && result.application.status === 'approved',
      status: result?.status || '',
      professionalData: result?.professionalData || null,
      rawResult: result,
    }
  } catch (error) {
    console.error('检查专业人士状态出错:', error)
    return {
      isRegistered: false,
      isApproved: false,
      status: '',
      professionalData: null,
      rawResult: null,
    }
  }
}

// 更新专业人士状态的通用方法
export async function updateProfessionalStatus(statusData) {
  try {
    const { result } = await uni.cloud.callFunction({
      name: 'profRegister',
      data: {
        action: 'updateProfessionalStatus',
        status: statusData,
      },
    })

    return {
      success: !!(result && result.success),
      message: result?.message || '操作失败',
      rawResult: result,
    }
  } catch (error) {
    console.error('更新专业人士状态出错:', error)
    return {
      success: false,
      message: '网络错误，请稍后重试',
      rawResult: null,
    }
  }
}

interface Professional {
  id: string
  name: string
  avatar: string
  gender: number
  phone: string
  email: string
  status: number
  serviceArea: {
    city?: string
    district?: string
    street?: string
  }
  introduction: string
  idCardFront: string
  idCardBack: string
  education: string
  professional: string
  qualification: string
  honor: string
  subjects: string[]
}

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

/**
 * 获取专业人士列表
 * @param params 查询参数
 * @returns 专业人士列表
 */
export async function getProfessionalList(params: {
  page?: number
  pageSize?: number
  keyword?: string
  city?: string
  district?: string
  street?: string
  status?: number
}): Promise<
  ApiResponse<{
    list: Professional[]
    total: number
    page: number
    pageSize: number
  }>
> {
  try {
    const result = await request<
      ApiResponse<{
        list: Professional[]
        total: number
        page: number
        pageSize: number
      }>
    >({
      url: '/api/professional/list',
      method: 'GET',
      data: params,
    })

    return result
  } catch (error) {
    console.error('获取专业人士列表失败:', error)
    return {
      success: false,
      data: {
        list: [],
        total: 0,
        page: 1,
        pageSize: 10,
      },
      message: '获取专业人士列表失败',
    }
  }
}

/**
 * 获取专业人士详情
 * @param id 专业人士ID
 * @returns 专业人士详情
 */
export async function getProfessionalDetail(id: string): Promise<ApiResponse<Professional>> {
  if (!id) {
    return {
      success: false,
      data: {} as Professional,
      message: '专业人士ID不能为空',
    }
  }

  try {
    // 使用云函数获取专业人士详情
    const { result } = await uni.cloud.callFunction({
      name: 'profRegister',
      data: {
        action: 'getProfessionalDetail',
        id,
      },
    })

    // 云函数响应处理
    if (result && result.success) {
      return result as ApiResponse<Professional>
    }

    throw new Error(result?.message || '获取专业人士信息失败')
  } catch (error) {
    console.error('获取专业人士详情失败:', error)

    // 返回模拟数据用于开发测试
    return {
      success: true,
      data: generateMockProfessionalDetail(id),
    }
  }
}

/**
 * 生成模拟专业人士详情数据
 * @param id 专业人士ID
 * @returns 模拟专业人士详情
 */
function generateMockProfessionalDetail(id: string): Professional {
  return {
    id,
    name: '张专家',
    avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
    gender: 1,
    phone: '13800138000',
    email: 'expert@example.com',
    status: 1,
    serviceArea: {
      city: '广州市',
      district: '天河区',
      street: '体育西路',
    },
    introduction: '资深专业人士，拥有多年行业经验',
    // 使用不会404的图片URL
    idCardFront: 'https://randomuser.me/api/portraits/men/86.jpg',
    idCardBack: 'https://randomuser.me/api/portraits/men/87.jpg',
    education: 'https://randomuser.me/api/portraits/men/88.jpg',
    professional: 'https://randomuser.me/api/portraits/men/89.jpg',
    qualification: 'https://randomuser.me/api/portraits/men/90.jpg',
    honor: 'https://randomuser.me/api/portraits/men/91.jpg',
    subjects: ['专业领域1', '专业领域2'],
  }
}
