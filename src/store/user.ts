import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 扩展用户信息接口，添加专业人员状态相关字段
interface IUserInfo {
  nickName: string
  avatar: string
  openid?: string
  avatarUrl?: string
  phone?: string
  address?: string
  professionalStatus?: 'pending' | 'approved' | 'rejected' | '' // 专业人员审核状态
  professionalId?: string // 专业人员ID
  [key: string]: any
}

const initState: IUserInfo = {
  nickName: '',
  avatar: '',
  professionalStatus: '', // 空字符串是有效的值，符合类型定义
  professionalId: '',
}

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<IUserInfo>({ ...initState })

    const setUserInfo = (val: Partial<IUserInfo>) => {
      userInfo.value = { ...userInfo.value, ...val }
    }

    const clearUserInfo = () => {
      userInfo.value = { ...initState }
    }
    // 一般没有reset需求，不需要的可以删除
    const reset = () => {
      userInfo.value = { ...initState }
    }

    // 计算用户是否是专业人员（有professionalId）
    const isProfessional = computed(() => !!userInfo.value.professionalId)

    // 计算用户专业人员状态
    const professionalStatus = computed(() => userInfo.value.professionalStatus || '')

    // 判断用户是否已登录
    const isLogined = computed(() => !!userInfo.value.openid)

    return {
      userInfo,
      setUserInfo,
      clearUserInfo,
      isLogined,
      isProfessional,
      professionalStatus,
      reset,
    }
  },
  {
    // 如果需要持久化就写 true, 不需要持久化就写 false（或者去掉这个配置项）
    persist: true,
  },
)
