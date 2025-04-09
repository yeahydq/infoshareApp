// 缓存云文件的临时URL
const tempCloudURLs: Record<string, string> = {}

/**
 * 直接从云存储URL构建可能的临时URL
 * 这是一个临时解决方案，模拟微信小程序的 getTempFileURL 功能
 */
const constructCloudUrl = (cloudUrl: string): string => {
  try {
    if (!cloudUrl.startsWith('cloud://')) return cloudUrl

    // 解析云存储URL
    // 格式: cloud://环境ID.存储桶/文件路径
    const cloudPath = cloudUrl.substring(8) // 去掉"cloud://"
    const envEndIndex = cloudPath.indexOf('.')

    if (envEndIndex === -1) return cloudUrl

    const envId = cloudPath.substring(0, envEndIndex)
    const remainingPath = cloudPath.substring(envEndIndex + 1)

    // 找到第一个斜杠之后的路径作为文件路径
    const filePathStartIndex = remainingPath.indexOf('/')

    if (filePathStartIndex === -1) return cloudUrl

    const bucketName = remainingPath.substring(0, filePathStartIndex)
    const filePath = remainingPath.substring(filePathStartIndex + 1)

    // 构建临时URL
    // 这里使用的URL格式可能需要根据实际情况调整
    return `https://${bucketName}-${envId}.tcb.qcloud.la/${filePath}`
  } catch (error) {
    console.error('构建云URL失败:', error)
    return cloudUrl
  }
}

/**
 * 处理云存储路径，将cloud://格式的URL转为可访问的URL
 */
export const processCloudUrl = (url: string): string => {
  if (!url) return ''

  // 如果是云存储路径
  if (url.startsWith('cloud://')) {
    // 先检查缓存
    if (tempCloudURLs[url]) {
      console.log(`从缓存获取云文件临时链接: ${url} -> ${tempCloudURLs[url]}`)
      return tempCloudURLs[url]
    }

    // 异步获取临时URL（不阻塞当前函数）
    setTimeout(() => {
      console.log(`开始构建云文件临时链接: ${url}`)
      try {
        const tempUrl = constructCloudUrl(url)
        console.log(`构建临时URL成功: ${url} -> ${tempUrl}`)

        // 保存到缓存
        tempCloudURLs[url] = tempUrl

        // 触发刷新（可选，需要配合组件实现）
        document.dispatchEvent(new CustomEvent('forceRefreshImages', { detail: { url } }))
      } catch (err) {
        console.error(`构建云文件临时链接失败: ${url}`, err)
      }
    }, 0)

    // 先返回一个代理URL作为临时显示
    return `/proxy/cloud-file?url=${encodeURIComponent(url)}`
  }

  return url
}

/**
 * 处理可能包含多个逗号分隔的URL
 */
export const processMultiUrls = (urlString: string): string => {
  if (!urlString) return ''

  if (urlString.includes(',')) {
    return urlString
      .split(',')
      .map((url) => processCloudUrl(url.trim()))
      .join(',')
  }

  return processCloudUrl(urlString)
}

/**
 * 获取云存储文件的临时URL
 */
export const getSignedUrl = async (url: string): Promise<string> => {
  try {
    // 如果是云存储路径
    if (url.startsWith('cloud://')) {
      // 先检查缓存
      if (tempCloudURLs[url]) {
        return tempCloudURLs[url]
      }

      // 构建临时URL
      const tempUrl = constructCloudUrl(url)
      tempCloudURLs[url] = tempUrl
      return tempUrl
    }

    // 如果是代理URL，提取原始cloud://地址
    if (url.startsWith('/proxy/cloud-file')) {
      const urlObj = new URL(url, window.location.origin)
      const urlParam = urlObj.searchParams.get('url')
      if (urlParam) {
        const cloudUrl = decodeURIComponent(urlParam)
        return getSignedUrl(cloudUrl)
      }
    }

    return url
  } catch (error) {
    console.error('获取临时URL失败:', error)
    return url
  }
}

/**
 * 处理图片加载错误，尝试获取临时URL
 */
export const handleImageError = async (event: Event, fallbackUrl?: string): Promise<void> => {
  const imgElement = event.target as HTMLImageElement
  if (!imgElement || !imgElement.src) return

  try {
    const originalUrl = imgElement.src
    console.log('图片加载失败，尝试获取临时URL:', originalUrl)

    // 获取临时URL
    let cloudUrl = originalUrl

    // 如果是代理URL，则提取原始cloud://地址
    if (originalUrl.includes('/proxy/cloud-file')) {
      const urlObj = new URL(originalUrl, window.location.origin)
      const urlParam = urlObj.searchParams.get('url')
      if (urlParam) {
        cloudUrl = decodeURIComponent(urlParam)
      }
    }

    // 如果是cloud://格式，直接构建临时URL
    if (cloudUrl.startsWith('cloud://')) {
      console.log('检测到cloud://格式URL，尝试直接构建临时URL')
      const tempUrl = constructCloudUrl(cloudUrl)
      console.log('构建临时URL:', tempUrl)

      // 缓存并返回
      tempCloudURLs[cloudUrl] = tempUrl
      imgElement.src = tempUrl
      return
    }

    // 使用备用URL
    if (fallbackUrl) {
      imgElement.src = fallbackUrl
    } else {
      // 默认使用一个占位图
      imgElement.src = '/assets/placeholder-image.png'
    }
  } catch (error) {
    console.error('处理图片加载错误失败:', error)
    // 使用备用URL
    if (fallbackUrl) {
      imgElement.src = fallbackUrl
    } else {
      // 默认使用一个占位图
      imgElement.src = '/assets/placeholder-image.png'
    }
  }
}
