// 添加缺少的import
import { useUserStore } from '@/store'

// 获取专业人士详情
export const getProfessionalDetail = async (id) => {
  try {
    console.log('调用获取专业人士详情API, ID:', id)
    
    // 调用云函数获取专业人士详情
    const { result } = await uni.cloud.callFunction({
      name: 'profRegister',
      data: {
        action: 'getProfessionalDetail',
        id,
      },
    })

    console.log('专业人士详情API返回数据:', result)
    
    // 如果返回成功
    if (result.success) {
      // 打印专业人士状态信息
      console.log('专业人士状态(API):', result.data?.status, '类型:', typeof result.data?.status)
      
      return {
        success: true,
        data: result.data || {},
      }
    } else {
      return {
        success: false,
        message: result.message || '获取专业人士详情失败',
      }
    }
  } catch (error) {
    console.error('获取专业人士详情出错:', error)
    return {
      success: false,
      message: '网络错误，请稍后重试',
    }
  }
}

// 检查用户专业人士状态的通用方法
export const checkProfessionalStatus = async () => {
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
export const updateProfessionalStatus = async (statusData) => {
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