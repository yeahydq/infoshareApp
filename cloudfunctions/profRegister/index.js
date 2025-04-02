// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true,
})

const db = cloud.database()

// 上传文件到云存储
const uploadToCloud = async (fileList, openId) => {
  if (!fileList || fileList.length === 0) return []
  
  const uploadTasks = []
  const timestamp = Date.now()
  
  for (let i = 0; i < fileList.length; i++) {
    const filePath = fileList[i]
    if (!filePath || filePath.startsWith('cloud://')) continue
    
    const fileExtension = filePath.substring(filePath.lastIndexOf('.') + 1)
    const cloudPath = `professional/${openId}/${timestamp}_${i}.${fileExtension}`
    
    try {
      const uploadTask = cloud.uploadFile({
        cloudPath,
        filePath: filePath,
      })
      uploadTasks.push(uploadTask)
    } catch (error) {
      console.error('上传文件失败:', error)
    }
  }
  
  try {
    const uploadResults = await Promise.all(uploadTasks)
    return uploadResults.map(result => result.fileID)
  } catch (error) {
    console.error('批量上传文件失败:', error)
    return []
  }
}

// 处理单个图片路径
const handleImagePath = async (imagePath, openId, fileType) => {
  if (!imagePath) return ''
  
  // 已经是云存储路径，直接返回
  if (imagePath.startsWith('cloud://')) return imagePath
  
  const timestamp = Date.now()
  const fileExtension = imagePath.substring(imagePath.lastIndexOf('.') + 1)
  const cloudPath = `professional/${openId}/${fileType}_${timestamp}.${fileExtension}`
  
  try {
    const result = await cloud.uploadFile({
      cloudPath,
      filePath: imagePath,
    })
    return result.fileID
  } catch (error) {
    console.error(`上传${fileType}图片失败:`, error)
    return ''
  }
}

// 处理多张图片（逗号分隔的字符串）
const handleMultipleImages = async (imagesStr, openId, fileType) => {
  if (!imagesStr) return ''
  
  // 如果已经是云存储路径（以cloud://开头）的字符串，直接返回
  if (imagesStr.startsWith('cloud://')) return imagesStr
  
  const imagePaths = imagesStr.split(',')
  const uploadedPaths = []
  
  for (let i = 0; i < imagePaths.length; i++) {
    const imagePath = imagePaths[i].trim()
    if (!imagePath) continue
    
    const uploadedPath = await handleImagePath(imagePath, openId, `${fileType}_${i}`)
    if (uploadedPath) {
      uploadedPaths.push(uploadedPath)
    }
  }
  
  return uploadedPaths.join(',')
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  
  // 检查用户是否已有申请
  if (event.action === 'checkApplication') {
    try {
      // 查询professionals集合，检查是否有当前用户的申请记录
      const { data } = await db.collection('professionals')
        .where({
          _openid: openId
        })
        .orderBy('createTime', 'desc')
        .limit(1)
        .get()
      
      if (data && data.length > 0) {
        // 找到申请记录
        return {
          success: true,
          hasApplication: true,
          application: data[0],
          message: '已找到申请记录'
        }
      } else {
        // 未找到申请记录
        return {
          success: true,
          hasApplication: false,
          message: '未找到申请记录'
        }
      }
    } catch (error) {
      console.error('检查申请记录出错:', error)
      return {
        success: false,
        message: '检查申请记录失败',
        error: error.message
      }
    }
  }
  
  // 提交申请
  try {
    // 提取表单数据
    const {
      // 第一步数据
      name,
      gender,
      phone,
      email,
      idCard,
      professionalTypes,
      educationRanges,
      skillPrices,
      skillBillingTypes,
      
      // 第二步数据
      skillTags,
      serviceArea,
      serviceDescription,
      experience,
      selectedCity,
      selectedDistrict,
      selectedStreet,
      
      // 第三步数据
      idCardFront,
      idCardBack,
      qualification,
      education,
      professional,
      honor,
      
      // 第四步数据
      agreement
    } = event
    
    // 验证基本数据
    if (!name || !phone || !professionalTypes || professionalTypes.length === 0) {
      return {
        success: false,
        message: '缺少必要的注册信息'
      }
    }
    
    // 处理图片上传到云存储
    const idCardFrontCloud = await handleImagePath(idCardFront, openId, 'idCardFront')
    const idCardBackCloud = await handleImagePath(idCardBack, openId, 'idCardBack')
    const qualificationCloud = await handleImagePath(qualification, openId, 'qualification')
    const educationCloud = await handleMultipleImages(education, openId, 'education')
    const professionalCloud = await handleMultipleImages(professional, openId, 'professional')
    const honorCloud = await handleMultipleImages(honor, openId, 'honor')
    
    // 构建专业人员数据对象
    const professionalData = {
      _openid: openId,
      name,
      gender,
      phone,
      email: email || '',
      idCard: idCard || '',
      professionalTypes,
      educationRanges: educationRanges || [],
      skillPrices: skillPrices || {},
      skillBillingTypes: skillBillingTypes || {},
      
      skillTags: skillTags || [],
      serviceArea: serviceArea || '',
      serviceDescription: serviceDescription || '',
      experience: experience || '',
      selectedCity: selectedCity || '',
      selectedDistrict: selectedDistrict || '',
      selectedStreet: selectedStreet || '',
      
      // 使用云存储路径替代临时文件路径
      idCardFront: idCardFrontCloud,
      idCardBack: idCardBackCloud,
      qualification: qualificationCloud,
      education: educationCloud,
      professional: professionalCloud,
      honor: honorCloud,
      
      status: 'pending', // 状态：待审核
      createTime: db.serverDate(),
      updateTime: db.serverDate(),
      agreement: agreement || false
    }
    
    // 保存到数据库
    const result = await db.collection('professionals').add({
      data: professionalData
    })
    
    // 保存成功后，创建用户的角色记录
    if (result._id) {
      // 创建角色记录
      await db.collection('userRoles').add({
        data: {
          _openid: openId,
          userId: openId,
          professionalId: result._id,
          role: 'professional',
          status: 'pending',
          createTime: db.serverDate()
        }
      })
      
      // 同时更新用户表中的专业人员状态
      try {
        // 查询用户记录
        const userRes = await db.collection('UserList')
          .where({
            _openid: openId
          })
          .get()
        
        if (userRes.data && userRes.data.length > 0) {
          // 用户存在，更新用户记录
          await db.collection('UserList').doc(userRes.data[0]._id).update({
            data: {
              professionalStatus: 'pending',
              professionalId: result._id,
              updateTime: db.serverDate()
            }
          })
          console.log('用户专业人员状态更新成功')
        } else {
          console.log('未找到用户记录，无法更新专业人员状态')
        }
      } catch (userError) {
        console.error('更新用户专业人员状态失败:', userError)
        // 不中断主流程，即使更新用户表失败
      }
      
      return {
        success: true,
        message: '专业人员注册信息提交成功，等待审核',
        professionalId: result._id
      }
    } else {
      throw new Error('保存专业人员信息失败')
    }
  } catch (error) {
    console.error('提交专业人员注册信息出错:', error)
    return {
      success: false,
      message: '提交失败，请稍后重试',
      error: error.message
    }
  }
} 