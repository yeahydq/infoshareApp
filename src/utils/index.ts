import { pages, subPackages, tabBar } from '@/pages.json'
import { isMpWeixin } from './platform'

const getLastPage = () => {
  // getCurrentPages() 至少有1个元素，所以不再额外判断
  // const lastPage = getCurrentPages().at(-1)
  // 上面那个在低版本安卓中打包会报错，所以改用下面这个【虽然我加了 src/interceptions/prototype.ts，但依然报错】
  const pages = getCurrentPages()
  return pages[pages.length - 1]
}

/** 判断当前页面是否是 tabbar 页  */
export const getIsTabbar = () => {
  if (!tabBar) {
    return false
  }
  if (!tabBar.list.length) {
    // 通常有 tabBar 的话，list 不能有空，且至少有2个元素，这里其实不用处理
    return false
  }
  const lastPage = getLastPage()
  const currPath = lastPage.route
  return !!tabBar.list.find((e) => e.pagePath === currPath)
}

/**
 * 获取当前页面路由的 path 路径和 redirectPath 路径
 * path 如 '/pages/login/index'
 * redirectPath 如 '/pages/demo/base/route-interceptor'
 */
export const currRoute = () => {
  const lastPage = getLastPage()
  const currRoute = (lastPage as any).$page
  // console.log('lastPage.$page:', currRoute)
  // console.log('lastPage.$page.fullpath:', currRoute.fullPath)
  // console.log('lastPage.$page.options:', currRoute.options)
  // console.log('lastPage.options:', (lastPage as any).options)
  // 经过多端测试，只有 fullPath 靠谱，其他都不靠谱
  const { fullPath } = currRoute as { fullPath: string }
  // console.log(fullPath)
  // eg: /pages/login/index?redirect=%2Fpages%2Fdemo%2Fbase%2Froute-interceptor (小程序)
  // eg: /pages/login/index?redirect=%2Fpages%2Froute-interceptor%2Findex%3Fname%3Dfeige%26age%3D30(h5)
  return getUrlObj(fullPath)
}

const ensureDecodeURIComponent = (url: string) => {
  if (url.startsWith('%')) {
    return ensureDecodeURIComponent(decodeURIComponent(url))
  }
  return url
}
/**
 * 解析 url 得到 path 和 query
 * 比如输入url: /pages/login/index?redirect=%2Fpages%2Fdemo%2Fbase%2Froute-interceptor
 * 输出: {path: /pages/login/index, query: {redirect: /pages/demo/base/route-interceptor}}
 */
export const getUrlObj = (url: string) => {
  const [path, queryStr] = url.split('?')
  // console.log(path, queryStr)

  if (!queryStr) {
    return {
      path,
      query: {},
    }
  }
  const query: Record<string, string> = {}
  queryStr.split('&').forEach((item) => {
    const [key, value] = item.split('=')
    // console.log(key, value)
    query[key] = ensureDecodeURIComponent(value) // 这里需要统一 decodeURIComponent 一下，可以兼容h5和微信y
  })
  return { path, query }
}
/**
 * 得到所有的需要登录的 pages，包括主包和分包的
 * 这里设计得通用一点，可以传递 key 作为判断依据，默认是 needLogin, 与 route-block 配对使用
 * 如果没有传 key，则表示所有的 pages，如果传递了 key, 则表示通过 key 过滤
 */
export const getAllPages = (key = 'needLogin') => {
  // 这里处理主包
  const mainPages = [
    ...pages
      .filter((page) => !key || page[key])
      .map((page) => ({
        ...page,
        path: `/${page.path}`,
      })),
  ]
  // 这里处理分包
  const subPages: any[] = []
  subPackages.forEach((subPageObj) => {
    // console.log(subPageObj)
    const { root } = subPageObj

    subPageObj.pages
      .filter((page) => !key || page[key])
      .forEach((page: { path: string } & Record<string, any>) => {
        subPages.push({
          ...page,
          path: `/${root}/${page.path}`,
        })
      })
  })
  const result = [...mainPages, ...subPages]
  // console.log(`getAllPages by ${key} result: `, result)
  return result
}

/**
 * 得到所有的需要登录的 pages，包括主包和分包的
 * 只得到 path 数组
 */
export const getNeedLoginPages = (): string[] => getAllPages('needLogin').map((page) => page.path)

/**
 * 得到所有的需要登录的 pages，包括主包和分包的
 * 只得到 path 数组
 */
export const needLoginPages: string[] = getAllPages('needLogin').map((page) => page.path)

/**
 * 根据微信小程序当前环境，判断应该获取的 baseUrl
 */
export const getEnvBaseUrl = () => {
  // 请求基准地址
  let baseUrl = import.meta.env.VITE_SERVER_BASEURL

  // 微信小程序端环境区分
  if (isMpWeixin) {
    const {
      miniProgram: { envVersion },
    } = uni.getAccountInfoSync()

    switch (envVersion) {
      case 'develop':
        baseUrl = import.meta.env.VITE_SERVER_BASEURL__WEIXIN_DEVELOP || baseUrl
        break
      case 'trial':
        baseUrl = import.meta.env.VITE_SERVER_BASEURL__WEIXIN_TRIAL || baseUrl
        break
      case 'release':
        baseUrl = import.meta.env.VITE_SERVER_BASEURL__WEIXIN_RELEASE || baseUrl
        break
    }
  }

  return baseUrl
}

/**
 * 根据微信小程序当前环境，判断应该获取的 UPLOAD_BASEURL
 */
export const getEnvBaseUploadUrl = () => {
  // 请求基准地址
  let baseUploadUrl = import.meta.env.VITE_UPLOAD_BASEURL

  // 微信小程序端环境区分
  if (isMpWeixin) {
    const {
      miniProgram: { envVersion },
    } = uni.getAccountInfoSync()

    switch (envVersion) {
      case 'develop':
        baseUploadUrl = import.meta.env.VITE_UPLOAD_BASEURL__WEIXIN_DEVELOP || baseUploadUrl
        break
      case 'trial':
        baseUploadUrl = import.meta.env.VITE_UPLOAD_BASEURL__WEIXIN_TRIAL || baseUploadUrl
        break
      case 'release':
        baseUploadUrl = import.meta.env.VITE_UPLOAD_BASEURL__WEIXIN_RELEASE || baseUploadUrl
        break
    }
  }

  return baseUploadUrl
}

/**
 * 将数据持久化缓存
 * @param key 键值
 * @param value 数值
 */
export function saveDataToDB<T>(key: string, value: T): void {
  if (typeof value === 'object') {
    uni.setStorageSync(key, JSON.stringify(value))
  } else {
    uni.setStorageSync(key, value)
  }
}

/**
 * 从持久化缓存读取数据
 * @param key
 */
export function getDataFromDB<T>(key: string): T | null {
  const data = uni.getStorageSync(key)
  if (data) {
    try {
      return typeof data === 'string' ? JSON.parse(data) : data
    } catch (e) {
      return data as unknown as T
    }
  }
  return null
}

/**
 * 移除持久化缓存数据
 * @param key
 */
export function removeDataFromDB(key: string) {
  uni.removeStorageSync(key)
}

/**
 * 生成一个随机的唯一 ID
 */
export function generateUid(): string {
  return Math.random().toString(36).substring(2, 10)
}

/**
 * 获取上一页的路径
 * @returns 上一页的路径
 */
export function getPrevPageRoute(): string {
  const pages = getCurrentPages()
  if (pages.length >= 2) {
    const prevPage = pages[pages.length - 2]
    return prevPage.route || ''
  }
  return ''
}

// 用于缓存临时头像URL映射的键
export const AVATAR_TEMP_URL_MAP_KEY = 'avatar_temp_url_map'

// 获取临时头像URL映射
export function getAvatarTempUrlMap(): Record<string, string> {
  return getDataFromDB<Record<string, string>>(AVATAR_TEMP_URL_MAP_KEY) || {}
}

// 保存临时头像URL映射
export function saveAvatarTempUrlMap(map: Record<string, string>): void {
  saveDataToDB(AVATAR_TEMP_URL_MAP_KEY, map)
}

// 获取临时头像URL
export function getAvatarTempUrl(cloudPath: string): string | null {
  const map = getAvatarTempUrlMap()
  return map[cloudPath] || null
}

// 保存临时头像URL
export function saveAvatarTempUrl(cloudPath: string, tempUrl: string): void {
  const map = getAvatarTempUrlMap()
  map[cloudPath] = tempUrl
  saveAvatarTempUrlMap(map)
}
