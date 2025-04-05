/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
// 测试数据初始化云函数
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true,
})

const db = cloud.database()
const _ = db.command

// 生成专业人士测试数据
function generateProfessionals(count = 100) {
  // 专业类别列表
  const professionalTypes = [
    'education', // 教育培训
    'repair', // 维修服务
    'it', // IT技术
    'design', // 设计服务
    'finance', // 金融财务
    'medical', // 医疗健康
    'legal', // 法律咨询
    'other' // 其他服务
  ]

  // 城市数据
  const cities = [
    {
      province: '广东省',
      city: '广州市',
      districts: ['天河区', '海珠区', '越秀区', '白云区', '黄埔区', '荔湾区']
    },
    {
      province: '广东省',
      city: '深圳市',
      districts: ['福田区', '南山区', '罗湖区', '宝安区', '龙岗区', '龙华区']
    },
    {
      province: '广东省', 
      city: '佛山市',
      districts: ['禅城区', '南海区', '顺德区', '三水区', '高明区']
    }
  ]

  // 创建随机专业人士数据函数
  function generateProfessionalData(id) {
    // 随机选择专业类别
    const categoryIndex = Math.floor(Math.random() * professionalTypes.length)
    const category = professionalTypes[categoryIndex]
    
    // 随机选择城市
    const cityIndex = Math.floor(Math.random() * cities.length)
    const city = cities[cityIndex]
    
    // 随机选择城区
    const districtIndex = Math.floor(Math.random() * city.districts.length)
    const district = city.districts[districtIndex]
    
    // 根据专业类别设置不同名称
    let name = `专业人士${id}`
    let serviceName = ''
    let tags = []
    let education = ''
    
    // 定义可能使用的数组
    const subjects = ['数学', '英语', '语文', '物理', '化学', '生物', '历史', '地理', '政治']
    const devices = ['电脑', '手机', '家电', '水管', '电路', '空调']
    const skills = ['Web开发', '移动开发', '小程序开发', '数据分析', '人工智能', '网络安全']
    const designTypes = ['平面设计', 'UI设计', '室内设计', '产品设计', '建筑设计', '工业设计']
    const financeTypes = ['会计', '理财', '税务', '审计', '投资', '保险']
    const medicalTypes = ['心理咨询', '营养师', '健康管理', '康复治疗', '中医养生', '护理']
    const legalTypes = ['婚姻家庭', '房产纠纷', '知识产权', '劳动争议', '合同纠纷', '企业法务']
    const otherTypes = ['摄影', '翻译', '搬家', '家政', '美容', '婚庆']
    
    // 临时变量
    let randomItem = '';
    
    switch (category) {
      case 'education':
        randomItem = subjects[Math.floor(Math.random() * subjects.length)]
        name = `${randomItem}老师${id}`
        serviceName = `${randomItem}一对一辅导`
        tags = [randomItem, '一对一', '辅导', '提分']
        education = ['本科', '硕士', '博士'][Math.floor(Math.random() * 3)]
        break
      case 'repair':
        randomItem = devices[Math.floor(Math.random() * devices.length)]
        name = `${randomItem}维修师${id}`
        serviceName = `${randomItem}维修服务`
        tags = [randomItem, '维修', '上门服务']
        education = ['中专', '大专', '本科'][Math.floor(Math.random() * 3)]
        break
      case 'it':
        randomItem = skills[Math.floor(Math.random() * skills.length)]
        name = `${randomItem}工程师${id}`
        serviceName = `${randomItem}技术咨询`
        tags = ['程序开发', randomItem, '技术支持']
        education = ['本科', '硕士', '博士'][Math.floor(Math.random() * 3)]
        break
      case 'design':
        randomItem = designTypes[Math.floor(Math.random() * designTypes.length)]
        name = `${randomItem}师${id}`
        serviceName = `${randomItem}服务`
        tags = [randomItem, '创意设计', '定制服务']
        education = ['大专', '本科', '硕士'][Math.floor(Math.random() * 3)]
        break
      case 'finance':
        randomItem = financeTypes[Math.floor(Math.random() * financeTypes.length)]
        name = `${randomItem}顾问${id}`
        serviceName = `${randomItem}咨询服务`
        tags = [randomItem, '财务规划', '咨询服务']
        education = ['本科', '硕士', '博士'][Math.floor(Math.random() * 3)]
        break
      case 'medical':
        randomItem = medicalTypes[Math.floor(Math.random() * medicalTypes.length)]
        name = `${randomItem}专家${id}`
        serviceName = `${randomItem}健康服务`
        tags = [randomItem, '健康管理', '专业咨询']
        education = ['本科', '硕士', '博士'][Math.floor(Math.random() * 3)]
        break
      case 'legal':
        randomItem = legalTypes[Math.floor(Math.random() * legalTypes.length)]
        name = `${randomItem}律师${id}`
        serviceName = `${randomItem}法律咨询`
        tags = [randomItem, '法律咨询', '专业解答']
        education = ['本科', '硕士', '博士'][Math.floor(Math.random() * 3)]
        break
      case 'other':
        randomItem = otherTypes[Math.floor(Math.random() * otherTypes.length)]
        name = `${randomItem}服务${id}`
        serviceName = `专业${randomItem}服务`
        tags = [randomItem, '上门服务', '专业服务']
        education = ['中专', '大专', '本科'][Math.floor(Math.random() * 3)]
        break
    }
    
    // 随机设置经验年限
    const experience = Math.floor(Math.random() * 15) + 1
    
    // 随机设置小时收费
    const hourlyRate = (Math.floor(Math.random() * 30) + 5) * 10
    
    // 随机设置评分
    const rating = (Math.floor(Math.random() * 20) + 30) / 10
    
    // 随机设置服务次数
    const serviceCount = Math.floor(Math.random() * 200)
    
    // 随机设置是否认证
    const verified = Math.random() > 0.3
    
    // 随机头像URL
    const avatarId = Math.floor(Math.random() * 100) + 1
    const avatarUrl = `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${avatarId}.jpg`
    
    // 创建专业人士对象
    return {
      _id: `test_professional_${id}`,
      _openid: `test_openid_${id}`,
      name,
      avatarUrl,
      category,
      professionalTypes: [category],
      experience,
      hourlyRate,
      rating,
      reviewCount: Math.floor(Math.random() * 100),
      serviceCount,
      verified,
      tags,
      education,
      province: city.province,
      city: city.city,
      district,
      serviceName,
      serviceDescription: `提供专业的${serviceName}，${experience}年从业经验，服务过${serviceCount}位客户。`,
      status: 'approved',
      createTime: db.serverDate({
        offset: -Math.floor(Math.random() * 10000000000)
      }),
      updateTime: db.serverDate({
        offset: -Math.floor(Math.random() * 1000000000)
      })
    }
  }
  
  // 生成指定数量的专业人士数据
  return Array.from({ length: count }, (_, i) => generateProfessionalData(i + 1))
}

// 初始化专业人士测试数据
async function initProfessionals() {
  try {
    // 检查是否已有测试数据
    const { total } = await db.collection('professionals')
      .where({
        _id: db.RegExp({
          regexp: '^test_professional_',
          options: 'i'
        })
      })
      .count()
    
    if (total > 0) {
      console.log(`数据库中已存在${total}条专业人士测试数据`)
      return {
        success: true,
        message: `数据库中已存在${total}条专业人士测试数据`,
        count: total
      }
    }
    
    // 生成测试数据
    const professionals = generateProfessionals(100)
    console.log(`生成了${professionals.length}条专业人士测试数据`)
    
    // 批量导入数据
    let importedCount = 0
    const batchSize = 20
    const batches = []
    
    // 将数据分成若干批次
    for (let i = 0; i < professionals.length; i += batchSize) {
      batches.push(professionals.slice(i, i + batchSize))
    }
    
    // 批量导入
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]
      console.log(`正在导入第${i + 1}批数据(${batch.length}条)`)
      
      // 使用Promise.all处理一批数据的插入
      const importResults = await Promise.all(
        batch.map(data => db.collection('professionals').add({ data }))
      )
      
      const batchSuccess = importResults.filter(res => res._id).length
      importedCount += batchSuccess
      
      console.log(`第${i + 1}批导入完成，成功${batchSuccess}条`)
    }
    
    return {
      success: true,
      message: `成功导入${importedCount}条专业人士测试数据`,
      count: importedCount
    }
  } catch (error) {
    console.error('初始化专业人士测试数据失败:', error)
    return {
      success: false,
      message: `初始化专业人士测试数据失败: ${error.message}`,
      error: error
    }
  }
}

// 清理专业人士测试数据
async function clearProfessionals() {
  try {
    // 获取测试数据的ID列表
    const { data } = await db.collection('professionals')
      .where({
        _id: db.RegExp({
          regexp: '^test_professional_',
          options: 'i'
        })
      })
      .field({
        _id: true
      })
      .get()
    
    if (!data || data.length === 0) {
      console.log('没有专业人士测试数据需要清理')
      return {
        success: true,
        message: '没有专业人士测试数据需要清理',
        count: 0
      }
    }
    
    console.log(`找到${data.length}条专业人士测试数据需要清理`)
    
    // 批量删除数据
    let removedCount = 0
    const batchSize = 20
    const batches = []
    
    // 将ID列表分成若干批次
    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize))
    }
    
    // 批量删除
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]
      console.log(`正在清理第${i + 1}批数据(${batch.length}条)`)
      
      // 使用Promise.all处理一批数据的删除
      const removeResults = await Promise.all(
        batch.map(item => db.collection('professionals').doc(item._id).remove())
      )
      
      const batchRemoved = removeResults.reduce((total, result) => 
        total + (result.stats && result.stats.removed ? result.stats.removed : 0), 0)
      
      removedCount += batchRemoved
      console.log(`第${i + 1}批清理完成，成功删除${batchRemoved}条`)
    }
    
    return {
      success: true,
      message: `成功清理${removedCount}条专业人士测试数据`,
      count: removedCount
    }
  } catch (error) {
    console.error('清理专业人士测试数据失败:', error)
    return {
      success: false,
      message: `清理专业人士测试数据失败: ${error.message}`,
      error: error
    }
  }
}

// 初始化专业人士时间安排数据
async function initTimeSchedules() {
  try {
    // 检查是否已有时间安排数据
    const { total } = await db.collection('timeSchedules')
      .where({
        professionalId: db.RegExp({
          regexp: '^test_openid_',
          options: 'i'
        })
      })
      .count()
    
    if (total > 0) {
      console.log(`数据库中已存在${total}条时间安排测试数据`)
      return {
        success: true,
        message: `数据库中已存在${total}条时间安排测试数据`,
        count: total
      }
    }
    
    // 获取所有测试专业人士ID
    const { data: professionals } = await db.collection('professionals')
      .where({
        _id: db.RegExp({
          regexp: '^test_professional_',
          options: 'i'
        })
      })
      .field({
        _id: true,
        _openid: true
      })
      .get()
    
    if (!professionals || professionals.length === 0) {
      return {
        success: false,
        message: '没有找到专业人士测试数据',
        count: 0
      }
    }
    
    console.log(`找到${professionals.length}条专业人士测试数据，为其创建时间安排`)
    
    // 创建时间安排数据
    const now = new Date()
    const timeSchedules = []
    
    // 为未来7天生成时间段
    for (const professional of professionals) {
      const slots = []
      
      // 为未来7天的每一天生成时间段
      for (let i = 0; i < 7; i++) {
        const date = new Date(now)
        date.setDate(now.getDate() + i)
        
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        
        // 生成上午和下午的时间段
        const timeSlots = []
        
        // 上午9:00-12:00，每30分钟一个时间段
        for (let hour = 9; hour < 12; hour++) {
          timeSlots.push(`${String(hour).padStart(2, '0')}:00`)
          timeSlots.push(`${String(hour).padStart(2, '0')}:30`)
        }
        
        // 下午14:00-18:00，每30分钟一个时间段
        for (let hour = 14; hour < 18; hour++) {
          timeSlots.push(`${String(hour).padStart(2, '0')}:00`)
          timeSlots.push(`${String(hour).padStart(2, '0')}:30`)
        }
        
        // 随机选择可用时间段
        const availableSlots = timeSlots.filter(() => Math.random() > 0.3)
        
        // 添加到slots数组
        for (const startTime of availableSlots) {
          const [hours, minutes] = startTime.split(':').map(Number)
          const date = new Date(2000, 0, 1, hours, minutes)
          date.setMinutes(date.getMinutes() + 30)
          const endTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
          
          slots.push({
            date: dateStr,
            startTime,
            endTime,
            isBooked: false
          })
        }
      }
      
      // 创建时间安排记录
      timeSchedules.push({
        professionalId: professional._openid,
        slots,
        updateTime: db.serverDate()
      })
    }
    
    // 批量导入数据
    let importedCount = 0
    const batchSize = 20
    const batches = []
    
    // 将数据分成若干批次
    for (let i = 0; i < timeSchedules.length; i += batchSize) {
      batches.push(timeSchedules.slice(i, i + batchSize))
    }
    
    // 批量导入
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]
      console.log(`正在导入第${i + 1}批时间安排数据(${batch.length}条)`)
      
      // 使用Promise.all处理一批数据的插入
      const importResults = await Promise.all(
        batch.map(data => db.collection('timeSchedules').add({ data }))
      )
      
      const batchSuccess = importResults.filter(res => res._id).length
      importedCount += batchSuccess
      
      console.log(`第${i + 1}批导入完成，成功${batchSuccess}条`)
    }
    
    return {
      success: true,
      message: `成功导入${importedCount}条时间安排测试数据`,
      count: importedCount
    }
  } catch (error) {
    console.error('初始化时间安排测试数据失败:', error)
    return {
      success: false,
      message: `初始化时间安排测试数据失败: ${error.message}`,
      error: error
    }
  }
}

// 清理时间安排测试数据
async function clearTimeSchedules() {
  try {
    // 删除所有测试专业人士的时间安排
    const result = await db.collection('timeSchedules')
      .where({
        professionalId: db.RegExp({
          regexp: '^test_openid_',
          options: 'i'
        })
      })
      .remove()
    
    const removedCount = result.stats.removed || 0
    
    return {
      success: true,
      message: `成功清理${removedCount}条时间安排测试数据`,
      count: removedCount
    }
  } catch (error) {
    console.error('清理时间安排测试数据失败:', error)
    return {
      success: false,
      message: `清理时间安排测试数据失败: ${error.message}`,
      error: error
    }
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取操作类型
  const { action = 'init', collection = 'all' } = event
  
  // 执行操作
  switch (action) {
    case 'init':
      // 初始化测试数据
      if (collection === 'all' || collection === 'professionals') {
        const profResult = await initProfessionals()
        let timeResult = null
        
        // 如果初始化专业人士成功，同时初始化时间安排
        if (profResult.success && (collection === 'all' || collection === 'timeSchedules')) {
          timeResult = await initTimeSchedules()
        }
        
        return {
          professionals: profResult,
          timeSchedules: timeResult
        }
      } else if (collection === 'timeSchedules') {
        const timeResult = await initTimeSchedules()
        return {
          timeSchedules: timeResult
        }
      }
      return {
        message: '未指定要初始化的集合'
      }
      
    case 'clear':
      // 清理测试数据
      if (collection === 'all' || collection === 'professionals') {
        const profResult = await clearProfessionals()
        let timeResult = null
        
        // 同时清理时间安排数据
        if (collection === 'all' || collection === 'timeSchedules') {
          timeResult = await clearTimeSchedules()
        }
        
        return {
          professionals: profResult,
          timeSchedules: timeResult
        }
      } else if (collection === 'timeSchedules') {
        const timeResult = await clearTimeSchedules()
        return {
          timeSchedules: timeResult
        }
      }
      return {
        message: '未指定要清理的集合'
      }
      
    default:
      return {
        success: false,
        message: `不支持的操作: ${action}`
      }
  }
} 