/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

// 获取专业人士列表
async function getProfessionalList(event, context) {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command
  const $ = db.command.aggregate
  
  try {
    // 获取参数
    const { 
      page = 1, 
      pageSize = 10, 
      keyword = '', 
      category = '', 
      province = '', 
      city = '', 
      sortType = 'default',
      sortOrder = 'desc',
      onlyAvailable = true  // 默认只返回有可用时间的专业人士
    } = event
    
    console.log('接收的筛选参数:', event)
    console.log('onlyAvailable参数:', onlyAvailable)
    
    // 验证排序方向，只允许asc或desc
    const validSortOrder = sortOrder === 'asc' ? 'asc' : 'desc'
    console.log('排序方向:', validSortOrder)
    
    // 构建查询条件
    let query = {
      status: 'approved' // 只获取已审核通过的专业人士
    }
    
    // 添加分类筛选
    if (category) {
      query.category = category
    }
    
    // 添加地区筛选
    if (province) {
      query.province = province
      
      if (city) {
        query.city = city
      }
    }
    
    // 添加关键词搜索
    if (keyword) {
      // 在名称、介绍等字段中搜索关键词
      query = {
        ...query,
        $or: [
          { name: db.RegExp({ regexp: keyword, options: 'i' }) },
          { introduction: db.RegExp({ regexp: keyword, options: 'i' }) },
          { tags: db.RegExp({ regexp: keyword, options: 'i' }) }
        ]
      }
    }
    
    // 获取总数
    const countResult = await db.collection('professionals')
      .where(query)
      .count()
    
    const total = countResult.total
    
    // 查询构建器
    let queryBuilder = db.collection('professionals').where(query)
    
    // 确定排序方式并执行查询
    let professionals
    if (sortType === 'rating') {
      // 按评分排序
      professionals = await db.collection('professionals')
        .where(query)
        .orderBy('rating', validSortOrder)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .get()
    } else if (sortType === 'price') {
      // 按价格排序
      professionals = await db.collection('professionals')
        .where(query)
        .orderBy('hourlyRate', validSortOrder)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .get()
    } else {
      // 默认排序：按更新时间
      professionals = await db.collection('professionals')
        .where(query)
        .orderBy('updateTime', 'desc')
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .get()
    }
    
    // 补充用户信息
    const professionalList = professionals.data || []
    
    // 获取所有专业人士的openid
    const openids = professionalList.map(item => item._openid).filter(Boolean)
    
    // 查询对应的用户信息
    let userInfoMap = {}
    if (openids.length > 0) {
      // 由于where in查询最多支持50个值，这里做批量查询
      const batchSize = 50
      const batches = []
      
      for (let i = 0; i < openids.length; i += batchSize) {
        const batchOpenids = openids.slice(i, i + batchSize)
        batches.push(
          db.collection('UserList')
            .where({
              _openid: _.in(batchOpenids)
            })
            .field({
              _openid: true,
              name: true,
              avatarUrl: true,
              nickname: true
            })
            .get()
        )
      }
      
      const userInfoResults = await Promise.all(batches)
      
      // 合并所有批次的结果
      const userInfoList = userInfoResults.reduce((acc, res) => {
        return acc.concat(res.data)
      }, [])
      
      // 构建openid到用户信息的映射
      userInfoMap = userInfoList.reduce((map, user) => {
        map[user._openid] = user
        return map
      }, {})
    }
    
    // 如果需要检查专业人士的可用时间
    let professionalsWithAvailability = professionalList
    
    // 确保onlyAvailable是布尔值
    const shouldFilterAvailability = onlyAvailable === true || onlyAvailable === 'true'
    
    if (shouldFilterAvailability) {
      console.log('正在过滤只有可用时间段的专业人士')
      
      // 查询每个专业人士是否有可用时间段
      const now = new Date()
      const professionalIds = professionalList.map(p => p._openid)
      
      if (professionalIds.length === 0) {
        console.log('没有符合条件的专业人士')
        return {
          success: true,
          data: [],
          total: 0,
          page: Number(page),
          pageSize: Number(pageSize),
          totalPages: 0,
          hasMore: false
        }
      }
      
      // 批量查询每个专业人士的时间安排
      const timeScheduleResults = await db.collection('timeSchedules')
        .where({
          professionalId: _.in(professionalIds)
        })
        .get()
      
      console.log('查询到的时间安排数量:', timeScheduleResults.data.length)
      
      // 构建专业人士ID到时间安排的映射
      const timeScheduleMap = timeScheduleResults.data.reduce((map, schedule) => {
        map[schedule.professionalId] = schedule
        return map
      }, {})
      
      // 检查每个专业人士未来7天是否有可用时间段
      professionalsWithAvailability = []
      
      for (const professional of professionalList) {
        const proId = professional._openid
        const timeSchedule = timeScheduleMap[proId]
        
        // 如果没有时间安排记录，则跳过该专业人士
        if (!timeSchedule || !timeSchedule.slots || timeSchedule.slots.length === 0) {
          console.log(`专业人士 ${proId} 没有时间安排记录`)
          continue
        }
        
        // 检查未来7天是否有可用时间段
        const hasAvailableSlots = timeSchedule.slots.some(slot => {
          // 检查日期是否在未来7天内
          const slotDate = new Date(slot.date)
          const daysFromNow = Math.floor((slotDate - now) / (1000 * 60 * 60 * 24))
          
          // 只检查未来7天的记录，且未被预约的时间段
          return daysFromNow >= 0 && daysFromNow <= 7 && !slot.isBooked
        })
        
        // 如果有可用时间段，添加到结果列表
        if (hasAvailableSlots) {
          console.log(`专业人士 ${proId} 有可用时间段`)
          professionalsWithAvailability.push(professional)
        } else {
          console.log(`专业人士 ${proId} 没有可用时间段`)
        }
      }
      
      console.log('过滤后的专业人士数量:', professionalsWithAvailability.length)
    }
    
    // 合并用户信息到专业人士信息
    const enrichedProfessionals = professionalsWithAvailability.map(professional => {
      const userInfo = userInfoMap[professional._openid] || {}
      
      return {
        ...professional,
        name: professional.name || userInfo.name || userInfo.nickname || '未知专家',
        avatarUrl: professional.avatarUrl || userInfo.avatarUrl || '',
        // 其他可能需要合并的字段
      }
    })
    
    const filteredTotal = shouldFilterAvailability ? enrichedProfessionals.length : total
    const filteredTotalPages = Math.ceil(filteredTotal / pageSize)
    
    return {
      success: true,
      data: enrichedProfessionals,
      total: filteredTotal,
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages: filteredTotalPages,
      hasMore: (page * pageSize) < filteredTotal
    }
  } catch (error) {
    console.error('获取专业人士列表失败:', error)
    return {
      success: false,
      message: '获取专业人士列表失败',
      error: error.message
    }
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  const { action } = event
  
  // 根据action调用不同的处理方法
  switch (action) {
    case 'checkApplication':
      return await checkApplication(event, context)
    case 'getApplication':
      return await getApplication(event, context)
    case 'updateFiles':
      return await updateFiles(event, context)
    case 'submitApplication':
      return await submitApplication(event, context)
    case 'getProfessionalList':
      return await getProfessionalList(event, context)
    default:
      return {
        success: false,
        message: '未知的操作类型'
      }
  }
} 