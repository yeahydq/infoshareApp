/**
 * 文件代理路由
 * 用于处理云存储文件的访问
 */
import { Request, Response } from 'express'

/**
 * 处理云存储文件的请求
 * @param req 请求对象
 * @param res 响应对象
 */
export function handleCloudFile(req: Request, res: Response) {
  try {
    const fileUrl = req.query.url as string

    if (!fileUrl) {
      return res.status(400).send('Missing file URL')
    }

    console.log('[文件代理] 请求访问文件:', fileUrl)

    // 如果是云存储URL，返回模拟图片
    if (fileUrl.startsWith('cloud://')) {
      console.log('[文件代理] 检测到云存储文件:', fileUrl)

      // 根据文件类型返回不同的示例图片
      let redirectUrl = ''

      if (fileUrl.includes('idCardFront') || fileUrl.includes('idCardBack')) {
        redirectUrl = 'https://img.freepik.com/free-vector/id-card-template_23-2147495264.jpg'
      } else if (fileUrl.includes('qualification')) {
        redirectUrl =
          'https://img.freepik.com/free-vector/elegant-certificate-template-with-frame_23-2147494832.jpg'
      } else if (fileUrl.includes('education')) {
        redirectUrl =
          'https://img.freepik.com/free-vector/elegant-diploma-template-with-golden-details_23-2148774992.jpg'
      } else if (fileUrl.includes('professional')) {
        redirectUrl =
          'https://img.freepik.com/free-vector/professional-certification-template-flat-design_23-2149207293.jpg'
      } else if (fileUrl.includes('honor')) {
        redirectUrl =
          'https://img.freepik.com/free-vector/elegant-certificate-achievement-template-flat-style_23-2147947124.jpg'
      } else if (fileUrl.includes('avatar')) {
        redirectUrl = 'https://randomuser.me/api/portraits/men/32.jpg'
      } else {
        redirectUrl = 'https://via.placeholder.com/800x600?text=Image+Preview'
      }

      console.log('[文件代理] 重定向到:', redirectUrl)
      return res.redirect(redirectUrl)
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
