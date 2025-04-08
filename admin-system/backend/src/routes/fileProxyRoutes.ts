/**
 * 文件代理路由
 * 用于处理云存储文件的访问
 */
import { Request, Response } from 'express'
import tcb from '@cloudbase/node-sdk'
import dotenv from 'dotenv'

dotenv.config()

// 初始化云开发环境
const app = tcb.init({
  env: process.env.TCB_ENV_ID,
  secretId: process.env.TCB_SECRET_ID,
  secretKey: process.env.TCB_SECRET_KEY,
})

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

      // 从cloud://格式的URL中提取文件路径
      const filePath = fileUrl.replace(/^cloud:\/\/[^/]+\//, '')

      try {
        // 获取临时访问URL
        const result = await app.getTempFileURL({
          fileList: [filePath],
        })

        if (result.fileList && result.fileList[0] && result.fileList[0].tempFileURL) {
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
