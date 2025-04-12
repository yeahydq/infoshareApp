/**
 * 云存储工具函数
 * 用于处理云存储URL，将云存储路径转换为可访问的临时URL
 */

/**
 * 处理云存储URL为临时URL
 * @param urls 需要处理的云存储URL数组
 * @returns 处理结果，包含临时URL映射
 */
export async function processCloudUrls(urls: string[]): Promise<{
  success: boolean
  data: {
    urlMapping: Record<string, string>
  }
  message?: string
}> {
  if (!urls || urls.length === 0) {
    return {
      success: true,
      data: {
        urlMapping: {},
      },
    }
  }

  // 直接生成模拟URL映射，不调用云函数
  console.log('[处理云存储URL] 使用本地替代URL:', urls)

  // 生成替代URL映射
  const mockUrlMapping: Record<string, string> = {}
  urls.forEach((url, index) => {
    // 根据URL类型选择不同的替代图片
    if (url.includes('idCardFront')) {
      mockUrlMapping[url] = 'https://randomuser.me/api/portraits/men/86.jpg'
    } else if (url.includes('idCardBack')) {
      mockUrlMapping[url] = 'https://randomuser.me/api/portraits/men/87.jpg'
    } else if (url.includes('education')) {
      mockUrlMapping[url] = 'https://randomuser.me/api/portraits/men/88.jpg'
    } else if (url.includes('professional')) {
      mockUrlMapping[url] = 'https://randomuser.me/api/portraits/men/89.jpg'
    } else if (url.includes('qualification')) {
      mockUrlMapping[url] = 'https://randomuser.me/api/portraits/men/90.jpg'
    } else if (url.includes('honor')) {
      mockUrlMapping[url] = 'https://randomuser.me/api/portraits/men/91.jpg'
    } else if (url.includes('avatar')) {
      mockUrlMapping[url] = 'https://randomuser.me/api/portraits/men/85.jpg'
    } else {
      // 默认图片
      mockUrlMapping[url] = `https://randomuser.me/api/portraits/men/${92 + (index % 8)}.jpg`
    }
  })

  console.log('[处理云存储URL] 生成的替代URL映射:', mockUrlMapping)

  return {
    success: true,
    data: {
      urlMapping: mockUrlMapping,
    },
    message: '使用替代URL',
  }
}

/**
 * 清理云存储URL，用于在浏览器环境中提供替代文本
 * @param url 云存储URL
 * @param placeholder 替代文本
 * @returns 处理后的文本
 */
export function cleanCloudUrl(url: string, placeholder = '暂无图片'): string {
  if (!url) return placeholder
  if (url.startsWith('cloud://')) return placeholder
  return url
}
