import { Router } from 'vue-router'

// 存储 token 的 key
const TOKEN_KEY = 'admin_token'
// 存储用户信息的 key
const USER_INFO_KEY = 'admin_info'

/**
 * 存储 token 到 localStorage
 * @param token JWT token
 */
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

/**
 * 获取 token
 * @returns token字符串或null
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * 移除 token
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * 存储用户信息
 * @param userInfo 用户信息对象
 */
export const setUserInfo = (userInfo: Record<string, any>): void => {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo))
}

/**
 * 获取用户信息
 * @returns 用户信息对象或null
 */
export const getUserInfo = (): Record<string, any> | null => {
  const userInfoStr = localStorage.getItem(USER_INFO_KEY)
  if (!userInfoStr) return null

  try {
    return JSON.parse(userInfoStr)
  } catch (error) {
    console.error('解析用户信息失败', error)
    return null
  }
}

/**
 * 移除用户信息
 */
export const removeUserInfo = (): void => {
  localStorage.removeItem(USER_INFO_KEY)
}

/**
 * 清除所有认证信息
 */
export const clearAuth = (): void => {
  removeToken()
  removeUserInfo()
}

/**
 * 判断用户是否已登录
 * @returns 是否已登录
 */
export const isAuthenticated = (): boolean => {
  return !!getToken()
}

/**
 * 设置路由守卫
 * @param router Vue Router 实例
 */
export const setupAuth = (router: Router): void => {
  router.beforeEach((to, from, next) => {
    // 不需要登录的路由
    const publicRoutes = ['/login']

    // 检查是否需要登录
    const requiresAuth = !publicRoutes.includes(to.path)

    // 如果需要登录但未登录，重定向到登录页
    if (requiresAuth && !isAuthenticated()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      })
    } else if (to.path === '/login' && isAuthenticated()) {
      // 已登录时访问登录页，重定向到首页
      next({ path: '/' })
    } else {
      // 正常导航
      next()
    }
  })
}
