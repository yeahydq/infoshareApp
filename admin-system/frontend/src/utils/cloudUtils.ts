// 缓存云文件的临时URL
const tempCloudURLs: Record<string, string> = {}

// 临时URL请求状态缓存，避免同一URL重复请求
const pendingRequests: Record<string, Promise<string>> = {}

/**
 * 使用API获取云存储文件的临时URL
 * @param {string} cloudUrl - cloud://格式的URL
 * @returns {Promise<string>} 临时URL
 */
const fetchTempFileURL = async (cloudUrl: string): Promise<string> => {
  try {
    // 清理URL，去除可能的空白字符
    const cleanUrl = cloudUrl.trim()

    if (!cleanUrl.startsWith('cloud://')) {
      return cleanUrl
    }

    // 如果已有相同URL的请求正在进行中，则复用该请求
    if (typeof pendingRequests[cleanUrl] !== 'undefined') {
      console.log(`已有相同URL的请求进行中，复用请求: ${cleanUrl}`)
      return pendingRequests[cleanUrl]
    }

    console.log(`请求临时URL API: ${cleanUrl}`)
    // 创建请求Promise并存储到pendingRequests
    const requestPromise = new Promise<string>((resolve, reject) => {
      // 使用普通函数包装异步操作
      const fetchUrl = async () => {
        try {
          // 调用后端API获取临时URL
          const response = await fetch('/api/cloud/getSignedUrl', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: cleanUrl }),
          })

          if (!response.ok) {
            throw new Error(`获取临时URL失败: ${response.statusText}`)
          }

          const data = await response.json()

          if (data.code === 0 && data.data && data.data.url) {
            console.log(`API获取临时URL成功: ${data.data.url}`)
            // 保存到缓存
            tempCloudURLs[cleanUrl] = data.data.url
            resolve(data.data.url)
          } else {
            throw new Error(data.message || '获取临时URL失败')
          }
        } catch (error) {
          console.error('获取临时URL失败:', error)
          // 如果API请求失败，回退到本地生成的URL
          if (cleanUrl.startsWith('cloud://')) {
            const fallbackUrl = constructCloudUrl(cleanUrl)
            console.log(`API获取失败，使用本地生成的URL: ${fallbackUrl}`)
            tempCloudURLs[cleanUrl] = fallbackUrl
            resolve(fallbackUrl)
          } else {
            resolve(cleanUrl)
          }
        } finally {
          // 请求完成后，从pendingRequests中删除
          if (typeof pendingRequests[cleanUrl] !== 'undefined') {
            delete pendingRequests[cleanUrl]
          }
        }
      }

      // 执行异步函数
      fetchUrl()
    })

    // 存储请求Promise
    pendingRequests[cleanUrl] = requestPromise

    return requestPromise
  } catch (error) {
    console.error('获取临时URL过程中发生错误:', error)
    return cloudUrl
  }
}

/**
 * 直接从云存储URL构建可能的临时URL
 * 这是一个临时解决方案，作为API调用失败的备选方案
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
export const processCloudUrl = async (url: string): Promise<string> => {
  if (!url) return ''

  // 如果是云存储路径
  if (url.startsWith('cloud://')) {
    // 先检查缓存
    if (tempCloudURLs[url]) {
      console.log(`从缓存获取云文件临时链接: ${url} -> ${tempCloudURLs[url]}`)
      return tempCloudURLs[url]
    }

    // 直接通过API获取临时URL
    try {
      const tempUrl = await fetchTempFileURL(url)
      return tempUrl
    } catch (error) {
      console.error(`获取云文件临时链接失败: ${url}`, error)
      // 如果获取失败，返回代理URL作为备选方案
      return `/proxy/cloud-file?url=${encodeURIComponent(url)}`
    }
  }

  return url
}

/**
 * 处理可能包含多个逗号分隔的URL
 */
export const processMultiUrls = async (urlString: string): Promise<string> => {
  if (!urlString) return ''

  if (urlString.includes(',')) {
    const urls = urlString.split(',')
    const processedUrls = await Promise.all(urls.map((url) => processCloudUrl(url.trim())))
    return processedUrls.join(',')
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

      // 获取临时URL
      return await fetchTempFileURL(url)
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

    // 如果是cloud://格式，获取临时URL
    if (cloudUrl.startsWith('cloud://')) {
      console.log('检测到cloud://格式URL，尝试获取临时URL')

      // 强制绕过缓存重新获取
      delete tempCloudURLs[cloudUrl]

      const tempUrl = await fetchTempFileURL(cloudUrl)
      console.log('获取临时URL成功:', tempUrl)

      // 缓存并应用
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

/**
 * 处理来自fileInfo对象的URL
 * 支持从fileInfo.field.url或直接访问字段获取URL
 * @param {Object} data - 包含url信息的对象
 * @param {string} field - 要获取的字段名
 * @returns {string} 处理后的URL
 */
export const getFileInfoUrl = (data: any, field: string): string => {
  if (!data) return ''

  // 获取URL
  let url = ''

  // 优先从fileInfo对象中获取URL
  if (data.fileInfo && data.fileInfo[field] && data.fileInfo[field].url) {
    url = data.fileInfo[field].url
  } else {
    // 如果不存在fileInfo或对应字段，则尝试直接从顶层对象获取
    url = data[field] || ''
  }

  return url
}
