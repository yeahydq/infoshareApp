// 云函数入口文件
/* eslint-disable @typescript-eslint/no-var-requires */
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

/* eslint-disable @typescript-eslint/no-unused-vars */
// db仅在需要查询数据库时使用
const db = cloud.database()
/* eslint-enable @typescript-eslint/no-unused-vars */

// 处理文件ID格式，清理混合的前缀
function normalizeFileID(fileID) {
  console.log('正在处理文件:', { fileID })
  
  // 如果fileID以http://tmp/开头，这不是一个有效的云存储路径，而是临时文件路径
  if (fileID && typeof fileID === 'string' && fileID.startsWith('http://tmp/')) {
    console.log('临时文件路径不需要下载:', fileID)
    return {
      isCloudFile: false,
      fileID: fileID
    }
  }
  
  // 如果fileID以cloud://http://开头，这是错误的混合格式
  if (fileID && typeof fileID === 'string' && fileID.startsWith('cloud://http://')) {
    // 去掉cloud://前缀，保留http://开头的路径
    const normalizedFileID = fileID.replace('cloud://', '')
    console.log('修正后的文件路径:', normalizedFileID)
    return {
      isCloudFile: false,
      fileID: normalizedFileID
    }
  }
  
  // 如果是正常的cloud://格式
  if (fileID && typeof fileID === 'string' && fileID.startsWith('cloud://')) {
    console.log('云存储文件路径:', fileID)
    return {
      isCloudFile: true,
      fileID: fileID
    }
  }
  
  // 其他情况，假设是云存储ID但没有前缀
  console.log('假设为云存储文件，添加前缀:', fileID)
  return {
    isCloudFile: true,
    fileID: fileID
  }
}

// 获取文件临时链接
async function getTempFileURL(fileIDs) {
  try {
    if (!fileIDs || (Array.isArray(fileIDs) && fileIDs.length === 0)) {
      return {
        success: false,
        message: '无效的文件ID'
      }
    }
    
    // 将单个ID转换为数组
    const fileIDArray = Array.isArray(fileIDs) ? fileIDs : [fileIDs]
    
    // 处理cloud://前缀
    const processedFileIDs = fileIDArray.map(fileID => {
      if (typeof fileID === 'string' && fileID.startsWith('cloud://')) {
        return fileID
      } else if (typeof fileID === 'string') {
        return `cloud://${fileID}`
      }
      return fileID
    })
    
    // 调用云存储API获取临时URL
    const result = await cloud.getTempFileURL({
      fileList: processedFileIDs
    })
    
    // 处理结果
    const tempFileURLs = result.fileList.map(file => ({
      fileID: file.fileID,
      tempFileURL: file.tempFileURL,
      status: file.status,
      errMsg: file.errMsg
    }))
    
    return {
      success: true,
      fileList: tempFileURLs,
      errMsg: result.errMsg
    }
  } catch (error) {
    console.error('获取临时文件链接失败:', error)
    return {
      success: false,
      message: '获取临时文件链接失败',
      error: error.message
    }
  }
}

// 读取数据库中有效的文件信息
async function getFileInfo(fileID) {
  try {
    // 先尝试获取临时链接
    return await getTempFileURL(fileID)
  } catch (err) {
    console.error('下载文件时出错:', err)
    return {
      success: false,
      error: err.message || '下载文件时出错'
    }
  }
}

// 处理头像下载请求
// userID参数保留以备将来扩展
/* eslint-disable @typescript-eslint/no-unused-vars */
async function handleAvatarDownload(fileID, userID) {
  try {
    // 下载头像文件
    const fileInfo = await getFileInfo(fileID)
    
    if (!fileInfo.success) {
      return {
        success: false,
        error: fileInfo.error
      }
    }
    
    return {
      success: true,
      tempFileURL: fileInfo.tempFileURL,
      isLocalFile: fileInfo.isLocalFile || false
    }
  } catch (err) {
    console.error('处理头像下载请求时出错:', err)
    return {
      success: false,
      error: err.message || '处理头像下载请求时出错'
    }
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

// 检查文件是否存在
async function fileExists(cloudPath) {
  try {
    const result = await getTempFileURL(cloudPath)
    return result.success
  } catch (err) {
    console.error('检查文件存在时出错:', err)
    return false
  }
}

// 云函数入口函数
// context参数保留以备将来扩展
/* eslint-disable @typescript-eslint/no-unused-vars */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log('正在处理文件:', event)
  
  const { type, fileID, userID, action, fileIDs } = event

  // 根据请求类型进行处理
  if (type === 'avatar') {
    // 处理头像下载
    return await handleAvatarDownload(fileID, userID || wxContext.OPENID)
  } else if (type === 'file') {
    // 处理普通文件下载
    return await getFileInfo(fileID)
  } else if (type === 'check') {
    // 检查文件是否存在
    const exists = await fileExists(fileID)
    return {
      exists
    }
  } else if (action === 'getTempFileURL') {
    return await getTempFileURL(fileIDs)
  }

  return {
    success: false,
    error: '无效的请求类型'
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */ 