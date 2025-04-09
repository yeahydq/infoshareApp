import { Request, Response } from 'express'
import axios from 'axios'

/**
 * 云存储控制器
 * 提供云存储相关API，包括获取预签名URL等功能
 */

// 初始化云环境配置
const CLOUD_ENV_ID = process.env.TCB_ENV_ID || ''
const SECRET_ID = process.env.TCB_SECRET_ID || ''
const SECRET_KEY = process.env.TCB_SECRET_KEY || ''

// 检查必要的配置
const checkRequiredConfig = (): boolean => {
  if (!CLOUD_ENV_ID) {
    console.error('环境ID未配置，请在环境变量中设置TCB_ENV_ID')
  }
  if (!SECRET_ID) {
    console.error('密钥ID未配置，请在环境变量中设置TCB_SECRET_ID')
  }
  if (!SECRET_KEY) {
    console.error('密钥未配置，请在环境变量中设置TCB_SECRET_KEY')
  }

  return Boolean(CLOUD_ENV_ID && SECRET_ID && SECRET_KEY)
}

/**
 * 解析cloud://格式的文件路径
 */
interface ParsedCloudUrl {
  envId: string
  bucket: string
  filePath: string
  fullPath: string
}

const parseCloudUrl = (cloudUrl: string): ParsedCloudUrl => {
  if (!cloudUrl || !cloudUrl.startsWith('cloud://')) {
    throw new Error('无效的云存储URL格式')
  }

  try {
    // 去掉cloud://前缀
    const path = cloudUrl.substring(8)

    // 找到第一个点，分隔环境ID和文件路径
    const dotIndex = path.indexOf('.')
    if (dotIndex === -1) {
      throw new Error('无效的云存储URL格式，缺少环境分隔符')
    }

    // 提取环境ID
    const envId = path.substring(0, dotIndex)

    // 剩余部分为文件路径
    const remaining = path.substring(dotIndex + 1)

    // 找到第一个斜杠，分隔存储桶和文件路径
    const slashIndex = remaining.indexOf('/')
    if (slashIndex === -1) {
      throw new Error('无效的云存储URL格式，缺少文件路径')
    }

    // 提取存储桶名
    const bucket = remaining.substring(0, slashIndex)

    // 提取文件路径
    const filePath = remaining.substring(slashIndex + 1)

    return {
      envId,
      bucket,
      filePath,
      fullPath: `${bucket}/${filePath}`,
    }
  } catch (error) {
    console.error('解析云存储URL失败:', error)
    throw error
  }
}

/**
 * 记录权限信息，用于调试
 */
const logPermissionInfo = (): void => {
  // 记录权限信息但不泄露敏感信息
  const redactedSecretId = SECRET_ID ? SECRET_ID.substring(0, 4) + '****' : 'Not Set'
  const redactedSecretKey = SECRET_KEY ? '********' : 'Not Set'

  console.log('云环境配置信息:')
  console.log(`- 环境ID: ${CLOUD_ENV_ID || 'Not Set'}`)
  console.log(`- 密钥ID: ${redactedSecretId}`)
  console.log(`- 密钥: ${redactedSecretKey}`)
}

/**
 * 获取预签名URL
 */
export const getSignedUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { url } = req.body

    console.log('请求获取预签名URL:', url)

    // 参数验证
    if (!url) {
      res.status(400).json({
        code: 400,
        message: '缺少url参数',
      })
      return
    }

    // 检查必要配置
    if (!checkRequiredConfig()) {
      res.status(500).json({
        code: 500,
        message: '云环境配置不完整，请检查后端配置',
      })
      return
    }

    // 记录权限信息
    logPermissionInfo()

    // 解析云存储URL
    const parsedUrl = parseCloudUrl(url)
    console.log('解析的云存储URL:', parsedUrl)

    // 构建直接访问URL（测试用，可能无效）
    const directUrl = `https://${parsedUrl.bucket}-${parsedUrl.envId}.tcb.qcloud.la/${parsedUrl.filePath}`

    // 尝试获取临时访问URL（这需要在实际环境中集成云开发SDK或调用云API）
    // 以下代码演示了如何调用，但可能需要根据实际环境调整
    try {
      console.log('尝试直接构建访问URL')

      // 如果集成了云开发SDK，可以使用以下代码获取真正的临时访问URL
      // const tcbAdmin = require('tcb-admin-node');
      // const app = tcbAdmin.init({
      //   secretId: SECRET_ID,
      //   secretKey: SECRET_KEY,
      //   env: CLOUD_ENV_ID
      // });
      //
      // const result = await app.getTempFileURL({
      //   fileList: [url]
      // });
      //
      // if (result.fileList && result.fileList[0] && result.fileList[0].tempFileURL) {
      //   directUrl = result.fileList[0].tempFileURL;
      // }

      // 返回测试URL
      res.json({
        code: 0,
        data: {
          url: directUrl,
          isTestUrl: true, // 标记这是测试URL
        },
        message: '已返回测试URL，需要集成真实云服务SDK获取实际预签名URL',
      })
    } catch (error) {
      console.error('获取临时URL失败:', error)

      // 返回构建的URL作为回退选项
      res.json({
        code: 0,
        data: {
          url: directUrl,
          isTestUrl: true,
        },
        message: '获取临时URL失败，返回测试URL',
      })
    }
  } catch (error: any) {
    console.error('获取签名URL失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取签名URL失败: ' + (error.message || '未知错误'),
    })
  }
}

/**
 * 测试云存储访问权限
 * 验证是否能够访问指定的云存储文件
 */
export const testCloudAccess = async (req: Request, res: Response): Promise<void> => {
  try {
    const { url } = req.body

    if (!url) {
      res.status(400).json({
        code: 400,
        message: '缺少url参数',
      })
      return
    }

    console.log('测试云存储访问权限:', url)

    // 检查必要配置
    if (!checkRequiredConfig()) {
      res.status(500).json({
        code: 500,
        message: '云环境配置不完整，请检查后端配置',
      })
      return
    }

    // 记录环境信息
    console.log('测试环境信息:')
    console.log(`- Node.js版本: ${process.version}`)
    console.log(`- 操作系统: ${process.platform} ${process.arch}`)

    // 解析云存储URL
    const parsedUrl = parseCloudUrl(url)

    // 构建测试结果
    const results = {
      parseResult: parsedUrl,
      directAccess: {
        success: false,
        url: '',
        error: null as any,
      },
      signedAccess: {
        success: false,
        url: '',
        error: null as any,
      },
    }

    // 构建直接访问URL
    const directUrl = `https://${parsedUrl.bucket}-${parsedUrl.envId}.tcb.qcloud.la/${parsedUrl.filePath}`
    results.directAccess.url = directUrl

    // 测试直接访问（通过HEAD请求检查是否可访问）
    try {
      await axios.head(directUrl, { timeout: 5000 })
      results.directAccess.success = true
    } catch (error: any) {
      results.directAccess.success = false
      results.directAccess.error = {
        message: error.message,
        status: error.response?.status,
      }
    }

    // 返回测试结果
    res.json({
      code: 0,
      data: results,
    })
  } catch (error: any) {
    console.error('测试云存储访问失败:', error)
    res.status(500).json({
      code: 500,
      message: '测试云存储访问失败: ' + (error.message || '未知错误'),
    })
  }
}
