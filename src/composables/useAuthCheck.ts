import { useUserStore } from '@/store'
import { login } from '@/service/auth'

export function useAuthCheck() {
  const userStore = useUserStore()

  const checkLogin = () => {
    return new Promise((resolve, reject) => {
      if (!userStore.userInfo?.openid) {
        uni.showModal({
          title: '提示',
          content: '请先登录后再进行注册',
          success: (res) => {
            if (res.confirm) {
              login()
                .then(resolve)
                .catch((err) => {
                  console.error('登录失败:', err)
                  uni.showToast({
                    title: '登录失败，请重试',
                    icon: 'none',
                    duration: 2000,
                  })
                  reject(err)
                })
            } else {
              reject(new Error('用户取消登录'))
            }
          },
        })
      } else {
        resolve(true)
      }
    })
  }

  return {
    checkLogin,
    isLoggedIn: computed(() => !!userStore.userInfo?.openid),
  }
}
