import { useUserStore } from '@/store'

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
