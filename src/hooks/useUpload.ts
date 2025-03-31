// TODO: 别忘加更改环境变量的 VITE_UPLOAD_BASEURL 地址。
import { getEnvBaseUploadUrl } from '@/utils'

const VITE_UPLOAD_BASEURL = `${getEnvBaseUploadUrl()}`
console.log('上传服务器地址:', VITE_UPLOAD_BASEURL)

// 定义上传配置接口
interface UploadConfig {
  maxSize?: number // 最大文件大小，单位MB
  allowedTypes?: string[] // 允许的文件类型
  maxRetries?: number // 最大重试次数
  isPreview?: boolean // 是否为预览模式（第四页）
}

// 定义上传响应接口
interface UploadResponse {
  code: number
  message: string
  data: string
}

interface CachedFile {
  tempFilePath: string
  formData: Record<string, any>
  timestamp: number
}

// 定义错误类型
interface UploadError {
  message: string
  code?: string
}

/**
 * useUpload 是一个定制化的请求钩子，用于处理上传图片。
 * @param formData 额外传递给后台的数据，如{name: '菲鸽'}
 * @param config 上传配置，包含文件大小限制、类型限制等
 * @returns 返回一个对象{loading, error, data, run}，包含请求的加载状态、错误信息、响应数据和手动触发请求的函数
 */
export default function useUpload<T = string>(
  formData: Record<string, any> = {},
  config: UploadConfig = {},
) {
  const {
    maxSize = 10, // 默认最大10MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif'], // 默认允许的图片类型
    maxRetries = 3, // 默认最大重试3次
    isPreview = false, // 是否为预览模式
  } = config

  const loading = ref(false)
  const error = ref<UploadError | null>(null)
  const data = ref<T>()
  const retryCount = ref(0)

  // 检查文件大小
  const checkFileSize = (fileSize: number) => {
    const sizeInMB = fileSize / (1024 * 1024)
    if (sizeInMB > maxSize) {
      throw new Error(`文件大小不能超过${maxSize}MB`)
    }
  }

  // 检查文件类型
  const checkFileType = (fileType: string) => {
    // 获取文件扩展名
    const ext = fileType.toLowerCase()
    const allowedExts = ['jpg', 'jpeg', 'png', 'gif']

    if (!allowedExts.includes(ext)) {
      throw new Error(`不支持的文件类型，仅支持 ${allowedExts.join(', ')}`)
    }
  }

  // 压缩图片
  const compressImage = (filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      // 获取图片信息
      uni.getImageInfo({
        src: filePath,
        success: (imageInfo) => {
          console.log('原始图片信息:', imageInfo)

          // 如果图片尺寸小于指定阈值，不压缩
          const MIN_COMPRESS_SIZE = 200 * 1024 // 200KB
          const MAX_WIDTH = 1024 // 最大宽度1024px

          // 检查文件大小（有些平台无法直接获取size，此时忽略此检查）
          // @ts-expect-error - 某些平台的 imageInfo 可能包含 size 属性
          if (imageInfo.size && imageInfo.size < MIN_COMPRESS_SIZE) {
            console.log('图片小于200KB，不压缩')
            resolve(filePath)
            return
          }

          // 计算压缩比例
          const quality = 80 // 默认压缩质量
          let targetWidth = imageInfo.width

          // 如果宽度大于最大宽度，进行缩放
          if (imageInfo.width > MAX_WIDTH) {
            targetWidth = MAX_WIDTH
          }

          // 使用uni.compressImage进行压缩
          uni.compressImage({
            src: filePath,
            quality,
            width: targetWidth.toString(), // 转换为字符串
            success: (res) => {
              console.log('图片压缩成功:', res.tempFilePath)
              resolve(res.tempFilePath)
            },
            fail: (err) => {
              console.error('图片压缩失败:', err)
              // 压缩失败使用原图
              resolve(filePath)
            },
          })
        },
        fail: (err) => {
          console.error('获取图片信息失败:', err)
          // 获取图片信息失败使用原图
          resolve(filePath)
        },
      })
    })
  }

  // 缓存文件到本地
  const cacheFile = async (filePath: string, formData: any) => {
    try {
      // 压缩图片
      const compressedFilePath = await compressImage(filePath)

      // 生成缓存键
      const cacheKey = `file_${Date.now()}_${Math.random().toString(36).substr(2)}`

      // 缓存文件信息
      const cachedFile: CachedFile = {
        tempFilePath: compressedFilePath,
        formData,
        timestamp: Date.now(),
      }

      // 获取现有缓存
      const existingCache = uni.getStorageSync('cachedFiles') || {}

      // 更新缓存
      uni.setStorageSync('cachedFiles', {
        ...existingCache,
        [cacheKey]: cachedFile,
      })

      // 返回缓存键
      data.value = cacheKey as T
      loading.value = false
    } catch (err) {
      handleError(err)
    }
  }

  const run = (
    options: {
      success?: (tempFilePath: string) => void
      fail?: (error: any) => void
    } = {},
  ) => {
    console.log('开始选择图片上传, 附加数据:', formData)
    loading.value = true
    error.value = null
    retryCount.value = 0

    // #ifdef MP-WEIXIN
    uni.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: async (res) => {
        console.log('选择图片成功:', res)
        const file = res.tempFiles[0]
        try {
          checkFileSize(file.size)
          // 从文件名获取扩展名
          const ext = file.tempFilePath.split('.').pop().toLowerCase()
          checkFileType(ext)

          // 返回临时文件路径给回调函数，如果有的话
          if (options.success) {
            options.success(file.tempFilePath)
          }

          if (isPreview) {
            // 预览模式下，先压缩再上传到云函数
            const compressedFilePath = await compressImage(file.tempFilePath)
            uploadToCloud(compressedFilePath, formData)
          } else {
            // 非预览模式下缓存到本地（会在缓存前压缩）
            cacheFile(file.tempFilePath, formData)
          }
        } catch (err) {
          handleError(err)
          if (options.fail) {
            options.fail(err)
          }
        }
      },
      fail: (err) => {
        handleError(err)
        if (options.fail) {
          options.fail(err)
        }
      },
    })
    // #endif

    // #ifndef MP-WEIXIN
    uni.chooseImage({
      count: 1,
      success: async (res) => {
        console.log('选择图片成功:', res)
        const tempFilePath = res.tempFilePaths[0]
        try {
          // 从文件名获取扩展名
          const ext = tempFilePath.split('.').pop().toLowerCase()
          checkFileType(ext)

          // 返回临时文件路径给回调函数，如果有的话
          if (options.success) {
            options.success(tempFilePath)
          }

          if (isPreview) {
            // 预览模式下，先压缩再上传到云函数
            const compressedFilePath = await compressImage(tempFilePath)
            uploadToCloud(compressedFilePath, formData)
          } else {
            // 非预览模式下缓存到本地（会在缓存前压缩）
            cacheFile(tempFilePath, formData)
          }
        } catch (err) {
          handleError(err)
          if (options.fail) {
            options.fail(err)
          }
        }
      },
      fail: (err) => {
        handleError(err)
        if (options.fail) {
          options.fail(err)
        }
      },
    })
    // #endif
  }

  const handleError = (err: any) => {
    console.error('上传错误:', err)
    loading.value = false // 确保在错误时关闭加载状态
    error.value = {
      message: err.message || '上传失败',
      code: err.code || 'UNKNOWN_ERROR',
    } as UploadError
  }

  // 上传到腾讯云
  const uploadToCloud = async (filePath: string, formData: any) => {
    try {
      // 生成唯一的云存储路径
      const cloudPath = `uploads/${Date.now()}-${Math.random().toString(36).substr(2)}.${filePath.split('.').pop()}`

      // 调用云函数上传文件
      const result = await uni.cloud.callFunction({
        name: 'uploadFile',
        data: {
          filePath,
          cloudPath,
          ...formData,
        },
      })

      if (result.result && result.result.fileID) {
        data.value = result.result.fileID as T
        loading.value = false
      } else {
        throw new Error('上传失败：未获取到文件ID')
      }
    } catch (err) {
      handleError(err)
    }
  }

  return { loading, error, data, run }
}
