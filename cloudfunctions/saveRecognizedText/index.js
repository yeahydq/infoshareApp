// 云函数入口文件
import cloud from 'wx-server-sdk'

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const recognizedTexts = db.collection('recognizedTexts')

// 云函数入口函数
export async function main(event, _context) {
  try {
    const { text, imageUrl } = event
    const wxContext = cloud.getWXContext()
    
    if (!text) {
      return {
        success: false,
        message: '未提供文本内容'
      }
    }
    
    // 保存到数据库
    const result = await recognizedTexts.add({
      data: {
        text: text,
        imageUrl: imageUrl,
        openid: wxContext.OPENID,
        createTime: db.serverDate()
      }
    })
    
    return {
      success: true,
      id: result._id,
      message: '保存成功'
    }
  } catch (error) {
    console.error('保存失败:', error)
    return {
      success: false,
      message: '保存失败: ' + error.message
    }
  }
} 