// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true,
})

const db = cloud.database()

// 检查申请状态
async function checkApplication(event, context) {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  
  try {
    // 查询用户的所有申请记录，按更新时间倒序排序
    const applicationRes = await db.collection('professionals')
      .where({
        _openid: openId
      })
      .orderBy('updateTime', 'desc')
      .get()
    
    // 查询用户信息，获取最新的专业人员状态
    const userRes = await db.collection('UserList')
      .where({
        _openid: openId
      })
      .get()
    
    // 合并信息，确保状态一致
    let hasApplication = false
    let application = null
    let userInfo = null
    
    if (userRes.data && userRes.data.length > 0) {
      userInfo = userRes.data[0]
      console.log('查询到用户信息:', userInfo)
    }
    
    if (applicationRes.data && applicationRes.data.length > 0) {
      // 获取最新的申请记录
      application = applicationRes.data[0]
      hasApplication = true
      console.log('查询到最新申请记录:', application)
      
      // 如果存在多条记录，将旧记录标记为已废弃
      if (applicationRes.data.length > 1) {
        console.log(`发现${applicationRes.data.length}条记录，将旧记录标记为已废弃`)
        const oldRecords = applicationRes.data.slice(1)
        for (const oldRecord of oldRecords) {
          await db.collection('professionals').doc(oldRecord._id).update({
            data: {
              status: 'deprecated',
              deprecatedBy: application._id,
              deprecatedTime: db.serverDate()
            }
          })
        }
      }
      
      // 如果用户表中的professionalId与最新申请记录不一致，更新用户表
      if (userInfo && (!userInfo.professionalId || userInfo.professionalId !== application._id)) {
        console.log('更新用户表中的专业人员ID')
        await db.collection('UserList').doc(userInfo._id).update({
          data: {
            professionalId: application._id,
            professionalStatus: application.status || 'pending',
            updateTime: db.serverDate()
          }
        })
      }
      
      // 查询userRoles表，确保角色信息存在且只保留最新的
      const roleRes = await db.collection('userRoles')
        .where({
          _openid: openId,
          professionalId: application._id
        })
        .get()
      
      if (roleRes.data && roleRes.data.length === 0 && application._id) {
        // 如果角色不存在，创建角色记录
        console.log('创建专业人员角色记录')
        await db.collection('userRoles').add({
          data: {
            _openid: openId,
            professionalId: application._id,
            role: 'professional',
            status: application.status || 'pending',
            createTime: db.serverDate(),
            updateTime: db.serverDate()
          }
        })
      } else if (roleRes.data && roleRes.data.length > 1) {
        // 如果存在多个角色记录，只保留最新的
        console.log('清理旧的角色记录')
        const oldRoles = roleRes.data.slice(1)
        for (const oldRole of oldRoles) {
          await db.collection('userRoles').doc(oldRole._id).update({
            data: {
              status: 'deprecated',
              deprecatedBy: roleRes.data[0]._id,
              deprecatedTime: db.serverDate()
            }
          })
        }
      }
    } else if (userInfo && userInfo.professionalId) {
      // 用户表中有professionalId但在professionals表中未找到记录
      // 可能是数据不一致，尝试按ID查询
      console.log('通过ID查询申请记录:', userInfo.professionalId)
      const professionalByIdRes = await db.collection('professionals')
        .where({
          _id: userInfo.professionalId
        })
        .get()
      
      if (professionalByIdRes.data && professionalByIdRes.data.length > 0) {
        // 找到记录，但可能是权限问题导致的不匹配
        application = professionalByIdRes.data[0]
        hasApplication = true
        console.log('通过ID查询到申请记录:', application)
      } else {
        // 清除用户表中的错误记录
        console.log('未找到对应的申请记录，清除用户表中的错误数据')
        await db.collection('UserList').doc(userInfo._id).update({
          data: {
            professionalId: null,
            professionalStatus: null,
            updateTime: db.serverDate()
          }
        })
      }
    }
    
    return {
      success: true,
      hasApplication: hasApplication,
      application: application,
      userInfo: userInfo
    }
  } catch (error) {
    console.error('查询申请记录失败:', error)
    return {
      success: false,
      message: '查询申请记录失败',
      error: error.message
    }
  }
}

// 获取申请数据
async function getApplication(event, context) {
  const { OPENID } = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command

  try {
    // 查询用户的申请记录，按更新时间倒序排序
    const { data } = await db
      .collection('professionals')
      .where({
        _openid: OPENID,
        status: _.neq('deprecated') // 排除已废弃的记录
      })
      .orderBy('updateTime', 'desc')
      .limit(1)
      .get()

    if (data && data.length > 0) {
      const application = data[0]
      console.log('获取到最新的申请记录:', application)
      
      // 处理文件路径，确保返回完整的云存储路径
      const fileFields = [
        'idCardFront',
        'idCardBack',
        'qualification',
        'education',
        'professional',
        'honor'
      ]

      for (const field of fileFields) {
        if (application[field]) {
          // 如果是多个文件（逗号分隔）
          if (application[field].includes(',')) {
            application[field] = application[field].split(',').map(fileID => {
              return fileID.startsWith('cloud://') ? fileID : `cloud://${fileID}`
            }).join(',')
          } else {
            // 单个文件
            application[field] = application[field].startsWith('cloud://') 
              ? application[field] 
              : `cloud://${application[field]}`
          }
        } else {
          application[field] = ''
        }
      }

      return {
        success: true,
        application: application
      }
    }

    return {
      success: false,
      message: '未找到申请记录',
    }
  } catch (error) {
    console.error('获取申请数据失败:', error)
    return {
      success: false,
      message: '获取申请数据失败',
      error: error.message,
    }
  }
}

// 更新文件
async function updateFiles(event, context) {
  const { OPENID } = cloud.getWXContext()
  const { professionalId, updatedFiles, basicInfo, serviceInfo } = event
  
  try {
    if (!professionalId) {
      return {
        success: false,
        message: '缺少专业人员ID'
      }
    }
    
    // 验证专业人员ID归属于当前用户
    const professionalRes = await db.collection('professionals')
      .where({
        _id: professionalId,
        _openid: OPENID
      })
      .get()
    
    if (!professionalRes.data || professionalRes.data.length === 0) {
      return {
        success: false,
        message: '未找到对应的专业人员记录或无权限更新'
      }
    }
    
    const professional = professionalRes.data[0]
    const currentFileInfo = professional.fileInfo || {}
    const updateData = {}
    const fileInfoUpdates = {}
    
    // 1. 更新基本信息
    if (basicInfo) {
      console.log('更新基本信息:', basicInfo)
      // 更新第一步的信息字段
      const basicInfoFields = [
        'name', 'gender', 'phone', 'email', 'idCard', 
        'professionalTypes', 'educationRanges', 'skillPrices', 'skillBillingTypes'
      ]
      
      basicInfoFields.forEach(field => {
        if (basicInfo[field] !== undefined) {
          updateData[field] = basicInfo[field]
        }
      })
    }
    
    // 2. 更新服务信息
    if (serviceInfo) {
      console.log('更新服务信息:', serviceInfo)
      // 更新第二步的信息字段
      const serviceInfoFields = [
        'skillTags', 'serviceArea', 'serviceDescription', 'experience',
        'selectedCity', 'selectedDistrict', 'selectedStreet'
      ]
      
      serviceInfoFields.forEach(field => {
        if (serviceInfo[field] !== undefined) {
          updateData[field] = serviceInfo[field]
        }
      })
    }
    
    // 3. 处理文件更新
    if (updatedFiles) {
      console.log('更新文件:', updatedFiles)
      
      // 处理文件更新
      for (const field in updatedFiles) {
        if (!updatedFiles[field]) continue
        
        console.log(`更新文件字段 ${field}:`, updatedFiles[field])
        
        // 更新主字段值（文件ID或逗号分隔的文件ID列表）
        updateData[field] = updatedFiles[field]
        
        // 更新文件元数据
        if (updatedFiles[field].includes(',')) {
          // 多文件情况
          const fileIDs = updatedFiles[field].split(',').filter(id => id.trim())
          fileInfoUpdates[`fileInfo.${field}`] = {
            type: 'multiple',
            files: fileIDs.map(id => ({
              fileID: id,
              uploadTime: Date.now(),
              description: `${field} for ${professional.name} (updated)`
            }))
          }
        } else {
          // 单文件情况
          fileInfoUpdates[`fileInfo.${field}`] = {
            type: 'single',
            fileID: updatedFiles[field],
            uploadTime: Date.now(),
            description: `${field} for ${professional.name} (updated)`
          }
        }
      }
    }
    
    // 如果没有要更新的内容
    if (Object.keys(updateData).length === 0 && Object.keys(fileInfoUpdates).length === 0) {
      return {
        success: false,
        message: '没有提供要更新的内容'
      }
    }
    
    // 添加修改时间和状态
    updateData.updateTime = db.serverDate()
    updateData.status = 'pending' // 修改后重新进入审核状态
    
    // 执行更新操作
    const updateResult = await db.collection('professionals').doc(professionalId).update({
      data: {
        ...updateData,
        ...fileInfoUpdates
      }
    })
    
    // 同时更新用户表中的专业人员状态为待审核
    try {
      const userRes = await db.collection('UserList')
        .where({
          _openid: OPENID
        })
        .get()
      
      if (userRes.data && userRes.data.length > 0) {
        await db.collection('UserList').doc(userRes.data[0]._id).update({
          data: {
            professionalStatus: 'pending',
            updateTime: db.serverDate()
          }
        })
        console.log('用户专业人员状态已更新为待审核')
      }
    } catch (userError) {
      console.error('更新用户专业人员状态失败:', userError)
      // 不中断主流程
    }
    
    // 同时更新userRoles表中的角色状态
    try {
      const roleRes = await db.collection('userRoles')
        .where({
          _openid: OPENID,
          professionalId: professionalId
        })
        .get()
      
      if (roleRes.data && roleRes.data.length > 0) {
        await db.collection('userRoles').doc(roleRes.data[0]._id).update({
          data: {
            status: 'pending',
            updateTime: db.serverDate()
          }
        })
        console.log('用户角色状态已更新为待审核')
      }
    } catch (roleError) {
      console.error('更新用户角色状态失败:', roleError)
      // 不中断主流程
    }
    
    if (updateResult.stats.updated > 0) {
      return {
        success: true,
        message: '资料修改成功，等待重新审核',
        updated: Object.keys(updateData)
      }
    } else {
      throw new Error('修改信息失败')
    }
  } catch (error) {
    console.error('更新资料失败:', error)
    return {
      success: false,
      message: '更新失败，请稍后重试',
      error: error.message
    }
  }
}

// 提交申请
async function submitApplication(event, context) {
  const { OPENID } = cloud.getWXContext()
  
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
      
      // 第三步数据 - 已在小程序端转换为云文件ID
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
    
    // 日志记录接收的文件数据
    console.log('接收到的文件数据:')
    console.log('idCardFront:', idCardFront)
    console.log('idCardBack:', idCardBack)
    console.log('qualification:', qualification)
    console.log('education:', education)
    console.log('professional:', professional)
    console.log('honor:', honor)
    
    // 校验文件路径，确保都是云存储ID
    const fileFields = ['idCardFront', 'idCardBack', 'qualification', 'education', 'professional', 'honor']
    for (const field of fileFields) {
      if (event[field] && !event[field].startsWith('cloud://')) {
        console.warn(`警告: ${field} 不是云存储ID: ${event[field]}`)
      }
    }
    
    // 创建文件信息对象
    const fileInfo = {}
    for (const field of fileFields) {
      if (event[field]) {
        // 处理多个文件的情况
        if (event[field].includes(',')) {
          const fileIDs = event[field].split(',').filter(id => id.trim());
          fileInfo[field] = {
            type: 'multiple',
            files: fileIDs.map(id => ({
              fileID: id,
              uploadTime: Date.now(),
              description: `${field} for ${name}`
            }))
          }
        } else {
          // 单个文件
          fileInfo[field] = {
            type: 'single',
            fileID: event[field],
            uploadTime: Date.now(),
            description: `${field} for ${name}`
          }
        }
      }
    }
    
    // 构建专业人员数据对象
    const professionalData = {
      _openid: OPENID,
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
      
      // 文件已在小程序端上传，这里接收的是云存储ID
      idCardFront: idCardFront || '',
      idCardBack: idCardBack || '',
      qualification: qualification || '',
      education: education || '',
      professional: professional || '',
      honor: honor || '',
      
      // 文件元数据，包含详细的文件信息
      fileInfo: fileInfo,
      
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
          _openid: OPENID,
          userId: OPENID,
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
            _openid: OPENID
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

// 云函数入口函数
exports.main = async (event, context) => {
  const { action } = event

  switch (action) {
    case 'submit':
      return await submitApplication(event, context)
    case 'checkApplication':
      return await checkApplication(event, context)
    case 'updateFiles':
      return await updateFiles(event, context)
    case 'getApplication':
      return await getApplication(event, context)
    default:
      return {
        success: false,
        message: '未知的操作类型'
      }
  }
} 