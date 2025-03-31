// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})

// 允许的文件类型
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']

// 获取文件类型
const getFileType = (filePath) => {
  const ext = filePath.split('.').pop().toLowerCase()
  const typeMap = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif'
  }
  return typeMap[ext] || null
}

// 云函数入口函数
exports.main = async (event, context) => {
  const { filePath, cloudPath } = event

  try {
    // 验证文件类型
    const fileType = getFileType(filePath)
    if (!fileType || !ALLOWED_TYPES.includes(fileType)) {
      return {
        success: false,
        error: `不支持的文件类型，仅支持 ${ALLOWED_TYPES.join(', ')}`,
        fileType: fileType || 'unknown'
      }
    }

    // 验证文件路径
    if (!filePath) {
      return {
        success: false,
        error: '文件路径不能为空'
      }
    }

    // 验证云存储路径
    if (!cloudPath) {
      return {
        success: false,
        error: '云存储路径不能为空'
      }
    }

    // 上传文件到云存储
    const uploadResult = await cloud.uploadFile({
      cloudPath,
      fileContent: filePath,
    })

    // 返回文件ID
    return {
      success: true,
      fileID: uploadResult.fileID,
      fileType
    }
  } catch (error) {
    console.error('文件上传失败:', error)
    
    // 处理特定错误类型
    if (error.errCode === -404011) {
      return {
        success: false,
        error: '文件不存在或无法访问'
      }
    }
    
    if (error.errCode === -404012) {
      return {
        success: false,
        error: '云存储空间不足'
      }
    }

    return {
      success: false,
      error: error.message || '文件上传失败',
      details: error
    }
  }
} 