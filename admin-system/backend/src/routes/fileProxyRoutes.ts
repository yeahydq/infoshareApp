/**
 * 文件代理路由
 * 用于处理云存储文件的访问
 */
import { Request, Response } from 'express'
import * as tcb from '@cloudbase/node-sdk'
import dotenv from 'dotenv'

dotenv.config()

// 初始化云环境配置
const CLOUD_ENV_ID = process.env.TCB_ENV_ID || ''
const SECRET_ID = process.env.TCB_SECRET_ID || ''
const SECRET_KEY = process.env.TCB_SECRET_KEY || ''

/**
 * 初始化tcb应用实例
 * 根据官方文档使用简化方式初始化
 * https://cloud.tencent.com/document/product/876/19374
 */
const getTcbApp = () => {
  // 根据是否有环境参数决定初始化方式
  if (CLOUD_ENV_ID && SECRET_ID && SECRET_KEY) {
    return tcb.init({
      secretId: SECRET_ID,
      secretKey: SECRET_KEY,
      env: CLOUD_ENV_ID,
    })
  }

  // 使用官方文档的简化方式初始化
  return tcb.init()
}

/**
 * 处理云存储文件的请求
 * @param req 请求对象
 * @param res 响应对象
 */
export async function handleCloudFile(req: Request, res: Response) {
  try {
    const fileUrl = req.query.url as string

    if (!fileUrl) {
      return res.status(400).send('Missing file URL')
    }

    console.log('[文件代理] 请求访问文件:', fileUrl)

    // 如果是云存储URL，获取临时访问URL
    if (fileUrl.startsWith('cloud://')) {
      console.log('[文件代理] 检测到云存储文件:', fileUrl)

      try {
        // 获取tcb应用实例
        const app = getTcbApp()

        // 获取临时访问URL，直接使用完整的cloud://格式URL
        const result = await app.getTempFileURL({
          fileList: [fileUrl.trim()],
        })

        if (result.fileList && result.fileList.length > 0 && result.fileList[0].tempFileURL) {
          const tempUrl = result.fileList[0].tempFileURL
          console.log('[文件代理] 获取到临时访问URL:', tempUrl)
          return res.redirect(tempUrl)
        } else {
          console.error('[文件代理] 获取临时URL失败:', result)
          return res.status(500).send('Failed to get temporary URL')
        }
      } catch (error) {
        console.error('[文件代理] 获取临时URL时出错:', error)
        return res.status(500).send('Error getting temporary URL')
      }
    }

    // 如果已经是http/https URL，直接重定向
    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      return res.redirect(fileUrl)
    }

    // 不支持的URL格式
    return res.status(400).send('Unsupported URL format')
  } catch (error) {
    console.error('[文件代理] 处理文件请求失败:', error)
    res.status(500).send('Internal Server Error')
  }
}
