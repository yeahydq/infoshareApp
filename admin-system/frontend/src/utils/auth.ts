import axios from 'axios'
import { Router } from 'vue-router'

// 存储 token 的 key
const TOKEN_KEY = 'admin_token'
// 存储用户信息的 key
const USER_INFO_KEY = 'admin_user_info'

interface UserInfo {
  id: string
  username: string
  role: string
  [key: string]: any
}

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
  localStorage.removeItem(USER_INFO_KEY)
}

/**
 * 存储用户信息
 * @param userInfo 用户信息对象
 */
export const setUserInfo = (userInfo: UserInfo): void => {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo))
}

/**
 * 获取用户信息
 * @returns 用户信息对象或null
 */
export const getUserInfo = (): UserInfo | null => {
  const userInfo = localStorage.getItem(USER_INFO_KEY)
  return userInfo ? JSON.parse(userInfo) : null
}

/**
 * 判断用户是否已登录
 * @returns 是否已登录
 */
export const isLoggedIn = (): boolean => {
  return !!getToken()
}

/**
 * 设置路由守卫
 * @param router Vue Router 实例
 */
export const setupAuth = (router: Router): void => {
  // 全局前置守卫
  router.beforeEach((to, from, next) => {
    // 判断是否需要认证
    if (to.meta.requiresAuth) {
      // 判断是否已登录
      if (isLoggedIn()) {
        // 已登录，放行
        next()
      } else {
        // 未登录，重定向到登录页
        next({
          path: '/login',
          query: { redirect: to.fullPath },
        })
      }
    } else {
      // 不需要认证的页面直接放行
      next()
    }
  })
}

/**
 * 登录函数
 * @param username 用户名
 * @param password 密码
 * @returns 是否登录成功
 */
export const login = async (username: string, password: string): Promise<boolean> => {
  try {
    // 使用完整的API路径
    const response = await axios.post('/api/auth/login', { username, password })

    // 检查返回的数据结构 (后端返回格式 {code: 200, message: 'xxx', data: {...}})
    if (response.data && response.data.code === 200 && response.data.data) {
      const { token, admin } = response.data.data

      if (token && admin) {
        // 保存token和用户信息
        setToken(token)
        setUserInfo(admin)
        return true
      }
    }
    return false
  } catch (error) {
    console.error('登录失败', error)
    return false
  }
}

/**
 * 登出函数
 */
export const logout = (): void => {
  removeToken()
  // 使用window.location确保完全刷新页面状态
  window.location.href = '/login'
}

/**
 * 获取当前用户信息
 */
export async function fetchCurrentUser(): Promise<UserInfo | null> {
  try {
    const response = await axios.get('/api/auth/current')

    // 后端返回格式 {code: 200, message: 'xxx', data: {...}}
    if (response.data && response.data.code === 200 && response.data.data) {
      const user = response.data.data
      setUserInfo(user)
      return user
    }
    return null
  } catch (error) {
    console.error('获取用户信息失败', error)
    return null
  }
}
