import { CustomRequestOptions } from '@/interceptors/request'
import { useUserStore } from '@/store/user'

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: any
  hideErrorToast?: boolean
  params?: Record<string, unknown>
  query?: Record<string, unknown>
}

interface ResponseData<T = any> {
  code: number
  message: string
  data: T
}

// 基础请求配置
const baseURL = import.meta.env.VITE_API_BASE_URL || ''

// 请求拦截器
const requestInterceptor = (options: RequestOptions) => {
  const userStore = useUserStore()
  const token = userStore.userInfo?.token

  // 添加token到header
  if (token) {
    options.header = {
      ...options.header,
      Authorization: `Bearer ${token}`,
    }
  }

  // 添加基础URL
  options.url = baseURL + options.url

  return options
}

// 响应拦截器
const responseInterceptor = <T>(response: any): T => {
  const { statusCode, data } = response

  // 状态码 2xx，参考 axios 的设计
  if (statusCode >= 200 && statusCode < 300) {
    return data
  } else if (statusCode === 401) {
    // 401错误  -> 清理用户信息，跳转到登录页
    // userStore.clearUserInfo()
    // uni.navigateTo({ url: '/pages/login/login' })
    throw response
  } else {
    // 其他错误 -> 根据后端错误信息轻提示
    const error = new Error(data.message || '请求失败')
    ;(error as any).response = response
    throw error
  }
}

/**
 * 统一请求方法
 * @param url 请求地址
 * @param options 请求参数
 * @returns Promise
 */
export default function request<T = unknown>(
  url: string | RequestOptions,
  options?: Omit<RequestOptions, 'url'> & {
    params?: Record<string, unknown>
    headers?: Record<string, unknown>
  },
): Promise<T> {
  // 处理参数
  let requestOptions: RequestOptions
  if (typeof url === 'string') {
    requestOptions = {
      url,
      ...options,
    }
  } else {
    requestOptions = url
  }

  // 处理参数格式
  if (requestOptions.params) {
    requestOptions.query = requestOptions.params
    delete requestOptions.params
  }

  if (requestOptions.headers) {
    requestOptions.header = requestOptions.headers
    delete requestOptions.headers
  }

  // 请求拦截
  const interceptedOptions = requestInterceptor(requestOptions)

  // 发起请求
  return new Promise<T>((resolve, reject) => {
    uni.request({
      ...interceptedOptions,
      dataType: 'json',
      // #ifndef MP-WEIXIN
      responseType: 'json',
      // #endif
      success(res) {
        try {
          const data = responseInterceptor<T>(res)
          resolve(data)
        } catch (error) {
          // 处理错误提示
          if (!requestOptions.hideErrorToast) {
            uni.showToast({
              icon: 'none',
              title: (error as Error).message || '请求错误',
            })
          }
          reject(error)
        }
      },
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      },
    })
  })
}
