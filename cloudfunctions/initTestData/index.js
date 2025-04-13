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

// 计算结束时间（30分钟后）
function getEndTime(startTime) {
  const [hours, minutes] = startTime.split(':').map(Number)
  const date = new Date(2000, 0, 1, hours, minutes)
  date.setMinutes(date.getMinutes() + 30)
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

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
    'other', // 其他服务
  ]

  // 城市数据
  const cities = [
    {
      province: '广东省',
      city: '广州市',
      districts: ['天河区', '海珠区', '越秀区', '白云区', '黄埔区', '荔湾区'],
    },
    {
      province: '广东省',
      city: '深圳市',
      districts: ['福田区', '南山区', '罗湖区', '宝安区', '龙岗区', '龙华区'],
    },
    {
      province: '广东省',
      city: '佛山市',
      districts: ['禅城区', '南海区', '顺德区', '三水区', '高明区'],
    },
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
    let professionalTypesList = [] // 具体的专业类型名称列表
    let educationRanges = [] // 教育专业的辅导范围
    let skillPrices = {} // 各专业技能的价格设置
    let skillBillingTypes = {} // 各专业技能的计费方式

    // 定义可能使用的数组
    const subjects = ['数学', '英语', '语文', '物理', '化学', '生物', '历史', '地理', '政治']
    const devices = ['电脑', '手机', '家电', '水管', '电路', '空调']
    const skills = ['Web开发', '移动开发', '小程序开发', '数据分析', '人工智能', '网络安全']
    const designTypes = ['平面设计', 'UI设计', '室内设计', '产品设计', '建筑设计', '工业设计']
    const financeTypes = ['会计', '理财', '税务', '审计', '投资', '保险']
    const medicalTypes = ['心理咨询', '营养师', '健康管理', '康复治疗', '中医养生', '护理']
    const legalTypes = ['婚姻家庭', '房产纠纷', '知识产权', '劳动争议', '合同纠纷', '企业法务']
    const otherTypes = ['摄影', '翻译', '搬家', '家政', '美容', '婚庆']

    // 计费方式选项
    const billingTypes = ['小时', '次', '天', '周', '月', '项目']

    // 临时变量
    let randomItem = ''
    let typesArray = []

    switch (category) {
      case 'education':
        typesArray = subjects
        randomItem = subjects[Math.floor(Math.random() * subjects.length)]
        name = `${randomItem}老师${id}`
        serviceName = `${randomItem}一对一辅导`
        tags = [randomItem, '一对一', '辅导', '提分']
        education = ['本科', '硕士', '博士'][Math.floor(Math.random() * 3)]
        // 选择1-3个专业类型
        professionalTypesList = getRandomSubset(subjects, Math.floor(Math.random() * 3) + 1)
        // 随机设置教育辅导范围
        educationRanges = getRandomSubset(
          ['小学', '初中', '高中', '大学'],
          Math.floor(Math.random() * 3) + 1,
        )
        break
      case 'repair':
        typesArray = devices
        randomItem = devices[Math.floor(Math.random() * devices.length)]
        name = `${randomItem}维修师${id}`
        serviceName = `${randomItem}维修服务`
        tags = [randomItem, '维修', '上门服务']
        education = ['中专', '大专', '本科'][Math.floor(Math.random() * 3)]
        // 选择1-3个专业类型
        professionalTypesList = getRandomSubset(devices, Math.floor(Math.random() * 3) + 1)
        break
      case 'it':
        typesArray = skills
        randomItem = skills[Math.floor(Math.random() * skills.length)]
        name = `${randomItem}工程师${id}`
        serviceName = `${randomItem}技术咨询`
        tags = ['程序开发', randomItem, '技术支持']
        education = ['本科', '硕士', '博士'][Math.floor(Math.random() * 3)]
        // 选择1-3个专业类型
        professionalTypesList = getRandomSubset(skills, Math.floor(Math.random() * 3) + 1)
        break
      case 'design':
        typesArray = designTypes
        randomItem = designTypes[Math.floor(Math.random() * designTypes.length)]
        name = `${randomItem}师${id}`
        serviceName = `${randomItem}服务`
        tags = [randomItem, '创意设计', '定制服务']
        education = ['大专', '本科', '硕士'][Math.floor(Math.random() * 3)]
        // 选择1-3个专业类型
        professionalTypesList = getRandomSubset(designTypes, Math.floor(Math.random() * 3) + 1)
        break
      case 'finance':
        typesArray = financeTypes
        randomItem = financeTypes[Math.floor(Math.random() * financeTypes.length)]
        name = `${randomItem}顾问${id}`
        serviceName = `${randomItem}咨询服务`
        tags = [randomItem, '财务规划', '咨询服务']
        education = ['本科', '硕士', '博士'][Math.floor(Math.random() * 3)]
        // 选择1-3个专业类型
        professionalTypesList = getRandomSubset(financeTypes, Math.floor(Math.random() * 3) + 1)
        break
      case 'medical':
        typesArray = medicalTypes
        randomItem = medicalTypes[Math.floor(Math.random() * medicalTypes.length)]
        name = `${randomItem}专家${id}`
        serviceName = `${randomItem}健康服务`
        tags = [randomItem, '健康管理', '专业咨询']
        education = ['本科', '硕士', '博士'][Math.floor(Math.random() * 3)]
        // 选择1-3个专业类型
        professionalTypesList = getRandomSubset(medicalTypes, Math.floor(Math.random() * 3) + 1)
        break
      case 'legal':
        typesArray = legalTypes
        randomItem = legalTypes[Math.floor(Math.random() * legalTypes.length)]
        name = `${randomItem}律师${id}`
        serviceName = `${randomItem}法律咨询`
        tags = [randomItem, '法律咨询', '专业解答']
        education = ['本科', '硕士', '博士'][Math.floor(Math.random() * 3)]
        // 选择1-3个专业类型
        professionalTypesList = getRandomSubset(legalTypes, Math.floor(Math.random() * 3) + 1)
        break
      case 'other':
        typesArray = otherTypes
        randomItem = otherTypes[Math.floor(Math.random() * otherTypes.length)]
        name = `${randomItem}服务${id}`
        serviceName = `专业${randomItem}服务`
        tags = [randomItem, '上门服务', '专业服务']
        education = ['中专', '大专', '本科'][Math.floor(Math.random() * 3)]
        // 选择1-3个专业类型
        professionalTypesList = getRandomSubset(otherTypes, Math.floor(Math.random() * 3) + 1)
        break
    }

    // 设置每个专业技能的价格和计费方式
    professionalTypesList.forEach((skill) => {
      skillPrices[skill] = (Math.floor(Math.random() * 30) + 5) * 10 // 50-350的随机价格
      skillBillingTypes[skill] = billingTypes[Math.floor(Math.random() * billingTypes.length)] // 随机计费方式
    })

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

    // 用于随机获取数组子集的辅助函数
    function getRandomSubset(array, size) {
      const shuffled = [...array].sort(() => 0.5 - Math.random())
      return shuffled.slice(0, size)
    }

    // 生成随机街道名称
    function generateStreetName() {
      const streets = ['滨江', '江南', '珠江', '新港', '沙园', '盈丰', '东风', '新城', '西城', '富康']
      const suffix = ['街道', '社区', '镇']
      return `${streets[Math.floor(Math.random() * streets.length)]}${suffix[Math.floor(Math.random() * suffix.length)]}`
    }

    // 创建专业人士对象
    return {
      _id: `test_professional_${id}`,
      _openid: `test_openid_${id}`,
      name,
      avatarUrl,
      gender: Math.random() > 0.5 ? 'male' : 'female',
      phone: `1${Math.floor(Math.random() * 9) + 1}${Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('')}`,
      email: `test${id}@example.com`,
      idCard:
        Math.random() > 0.5 ? `${Math.floor(Math.random() * 899999999999) + 100000000000}` : '', // 随机生成身份证号或留空
      category,
      professionalTypes: professionalTypesList,
      educationRanges,
      skillPrices,
      skillBillingTypes,
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
      street: Math.random() > 0.3 ? generateStreetName() : '',
      serviceName,
      serviceDescription: `提供专业的${serviceName}，${experience}年从业经验，服务过${serviceCount}位客户。`,
      status: 'approved',
      createTime: db.serverDate({
        offset: -Math.floor(Math.random() * 10000000000),
      }),
      updateTime: db.serverDate({
        offset: -Math.floor(Math.random() * 1000000000),
      }),
      isTestData: true, // 标记为测试数据，便于后续清理
    }
  }

  // 生成指定数量的专业人士数据
  return Array.from({ length: count }, (_, i) => generateProfessionalData(i + 1))
}

// 初始化专业人士测试数据
async function initProfessionals() {
  try {
    // 检查是否已有测试数据
    const { total } = await db
      .collection('professionals')
      .where({
        _id: db.RegExp({
          regexp: '^test_professional_',
          options: 'i',
        }),
      })
      .count()

    if (total > 0) {
      console.log(`数据库中已存在${total}条专业人士测试数据`)
      return {
        success: true,
        message: `数据库中已存在${total}条专业人士测试数据`,
        count: total,
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
        batch.map((data) => db.collection('professionals').add({ data })),
      )

      const batchSuccess = importResults.filter((res) => res._id).length
      importedCount += batchSuccess

      console.log(`第${i + 1}批导入完成，成功${batchSuccess}条`)
    }

    return {
      success: true,
      message: `成功导入${importedCount}条专业人士测试数据`,
      count: importedCount,
    }
  } catch (error) {
    console.error('初始化专业人士测试数据失败:', error)
    return {
      success: false,
      message: `初始化专业人士测试数据失败: ${error.message}`,
      error: error,
    }
  }
}

// 清理专业人士测试数据
async function clearProfessionals() {
  try {
    // 获取测试数据的ID列表
    const { data } = await db
      .collection('professionals')
      .where({
        _id: db.RegExp({
          regexp: '^test_professional_',
          options: 'i',
        }),
      })
      .field({
        _id: true,
      })
      .get()

    if (!data || data.length === 0) {
      console.log('没有专业人士测试数据需要清理')
      return {
        success: true,
        message: '没有专业人士测试数据需要清理',
        count: 0,
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
        batch.map((item) => db.collection('professionals').doc(item._id).remove()),
      )

      const batchRemoved = removeResults.reduce(
        (total, result) =>
          total + (result.stats && result.stats.removed ? result.stats.removed : 0),
        0,
      )

      removedCount += batchRemoved
      console.log(`第${i + 1}批清理完成，成功删除${batchRemoved}条`)
    }

    return {
      success: true,
      message: `成功清理${removedCount}条专业人士测试数据`,
      count: removedCount,
    }
  } catch (error) {
    console.error('清理专业人士测试数据失败:', error)
    return {
      success: false,
      message: `清理专业人士测试数据失败: ${error.message}`,
      error: error,
    }
  }
}

// 格式化日期为YYYY-MM-DD格式
function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 初始化时间安排测试数据
async function initTimeSchedules(startBatch = 0, startDateBatch = 0) {
  try {
    const startTime = new Date() // 为函数添加本地计时器
    console.log(`开始初始化时间安排测试数据... 从时间批次${startBatch}和日期批次${startDateBatch}开始`)

    // 查询所有测试专业人士
    const professionalResult = await db
      .collection('professionals')
      .where({
        isTestData: true,
      })
      .field({
        _id: true,
        _openid: true,
        name: true,
        professionalTypes: true,
        city: true,
        district: true,
        province: true,
        street: true, // 新增街道字段
      })
      .get()

    if (!professionalResult.data || professionalResult.data.length === 0) {
      return {
        success: false,
        message: '未找到测试专业人士，请先初始化专业人士数据',
      }
    }

    // 生成当前日期和未来90天的日期范围
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dateRange = []
    for (let i = 0; i < 90; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dateRange.push(formatDate(date))
    }

    // 提取未来7天的日期范围
    const nextWeekRange = dateRange.slice(0, 7)
    console.log(`当前日期: ${dateRange[0]}, 未来一周日期范围: ${nextWeekRange[0]} 到 ${nextWeekRange[6]}`)

    // 时间段设置
    const timeSlots = [
      '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
    ]

    // 新结构：每个专业人士一条记录，包含所有时间slots
    const timeSchedulesData = []
    // 生成日期索引数据
    const dateIndexes = []

    // 每个专业人士生成随机时间安排
    professionalResult.data.forEach((professional, index) => {
      // 为每个专业人士创建日期哈希映射，跟踪哪些日期有可用时间
      const availableDatesMap = {}
      
      // 新结构：为每个专业人士创建一条记录，包含所有slots
      const professionalSchedule = {
        professionalId: professional._openid,
        slots: [],
        updateTime: new Date(),
        isTestData: true
      }

      // 确定是否该专业人士应在未来一周内可预约 (50%的专业人士会在一周内可预约)
      const shouldBeAvailableInNextWeek = index % 2 === 0
      
      if (shouldBeAvailableInNextWeek) {
        // 为该专业人士在未来一周内随机选择1-3天
        const daysInNextWeekCount = Math.floor(Math.random() * 3) + 1 // 1-3天
        console.log(`专业人士${professional.name}(ID:${professional._openid})将在未来一周内有${daysInNextWeekCount}天可预约`)
        
        // 随机选择未来一周内的几天
        const selectedWeekDays = []
        while (selectedWeekDays.length < daysInNextWeekCount && selectedWeekDays.length < nextWeekRange.length) {
          const randomIndex = Math.floor(Math.random() * nextWeekRange.length)
          const date = nextWeekRange[randomIndex]
          if (!selectedWeekDays.includes(date)) {
            selectedWeekDays.push(date)
            // 为日期添加记录到可用日期映射
            availableDatesMap[date] = true
            
            // 为每个日期随机选择3-8个时间段
            const slotsCount = Math.floor(Math.random() * 6) + 3 // 3-8
            const selectedSlots = timeSlots
              .sort(() => 0.5 - Math.random()) // 随机打乱
              .slice(0, slotsCount) // 取前几个
              .sort() // 重新排序

            // 创建时间安排记录 - 新结构
            selectedSlots.forEach(startTime => {
              const endTime = getEndTime(startTime)
              professionalSchedule.slots.push({
                date,
                startTime,
                endTime,
                isBooked: false
              })
            })
          }
        }
      }

      // 为所有专业人士生成未来30-60天内随机10-20天的时间安排
      const randomDaysCount = Math.floor(Math.random() * 11) + 10 // 10-20
      const startOffset = Math.floor(Math.random() * 10) + 7 // 7-16天后开始，避开第一周
      const endOffset = startOffset + 60

      // 随机选择日期
      const selectedDates = []
      while (selectedDates.length < randomDaysCount && (startOffset + selectedDates.length) < endOffset) {
        const index = startOffset + selectedDates.length
        if (index < dateRange.length) {
          const date = dateRange[index]
          if (!availableDatesMap[date]) { // 避免重复添加已选择的日期
            selectedDates.push(date)
            // 为日期添加记录到可用日期映射
            availableDatesMap[date] = true
            
            // 随机选择3-8个时间段
            const slotsCount = Math.floor(Math.random() * 6) + 3 // 3-8
            const selectedSlots = timeSlots
              .sort(() => 0.5 - Math.random()) // 随机打乱
              .slice(0, slotsCount) // 取前几个
              .sort() // 重新排序

            // 创建时间安排记录 - 新结构
            selectedSlots.forEach(startTime => {
              const endTime = getEndTime(startTime)
              professionalSchedule.slots.push({
                date,
                startTime,
                endTime,
                isBooked: false
              })
            })
          }
        }
      }

      // 为此专业人士创建日期索引记录
      Object.keys(availableDatesMap).forEach(date => {
        dateIndexes.push({
          professionalId: professional._openid,
          date,
          professionalTypes: professional.professionalTypes || ['其他'],
          city: professional.city || '未知',
          district: professional.district || '未知',
          province: professional.province || '未知',
          isTestData: true,
          createTime: new Date(),
          updateTime: new Date()
        })
      })
      
      // 只有当有时间段时才添加该专业人士的记录
      if (professionalSchedule.slots.length > 0) {
        timeSchedulesData.push(professionalSchedule)
      }
    })

    if (timeSchedulesData.length === 0) {
      return {
        success: false,
        message: '未生成任何时间安排数据',
      }
    }

    // 批量导入数据（分批导入，每批最多10条）
    const batchSize = 10
    const timeScheduleBatches = []
    const dateIndexBatches = []

    for (let i = 0; i < timeSchedulesData.length; i += batchSize) {
      timeScheduleBatches.push(timeSchedulesData.slice(i, i + batchSize))
    }

    for (let i = 0; i < dateIndexes.length; i += batchSize) {
      dateIndexBatches.push(dateIndexes.slice(i, i + batchSize))
    }

    console.log(`将分${timeScheduleBatches.length}批导入${timeSchedulesData.length}条时间安排数据`)
    console.log(`将分${dateIndexBatches.length}批导入${dateIndexes.length}条日期索引数据`)

    // 如果已经完成时间安排数据的导入，直接开始导入日期索引数据
    if (startBatch >= timeScheduleBatches.length) {
      console.log('时间安排数据已导入完成，开始导入日期索引数据')
      
      // 导入日期索引数据
      let dateCompletedBatches = 0
      for (let i = startDateBatch; i < dateIndexBatches.length; i++) {
        await db.collection('professionalDateIndex').add({
          data: dateIndexBatches[i]
        })
        dateCompletedBatches++
        console.log(`完成第${i + 1}/${dateIndexBatches.length}批日期索引数据导入`)
        
        // 每2批检查一次是否接近超时（只给1.5秒运行时间）
        if (dateCompletedBatches % 2 === 0 && (new Date().getTime() - startTime.getTime() > 1500)) {
          return {
            success: true,
            message: '成功导入部分日期索引数据，需要继续',
            completed: false,
            nextTimeScheduleBatch: timeScheduleBatches.length,
            nextDateIndexBatch: i + 1,
            totalTimeBatches: timeScheduleBatches.length,
            totalDateBatches: dateIndexBatches.length,
            progress: `时间安排数据: ${timeScheduleBatches.length}/${timeScheduleBatches.length}, 日期索引数据: ${i + 1}/${dateIndexBatches.length}`
          }
        }
      }
      
      return {
        success: true,
        message: `成功初始化${timeSchedulesData.length}条时间安排数据和${dateIndexes.length}条日期索引数据`,
        completed: true,
        count: timeSchedulesData.length,
        indexCount: dateIndexes.length
      }
    }
    
    // 导入时间安排数据
    let timeCompletedBatches = 0
    for (let i = startBatch; i < timeScheduleBatches.length; i++) {
      await db.collection('timeSchedules').add({
        data: timeScheduleBatches[i]
      })
      timeCompletedBatches++
      console.log(`完成第${i + 1}/${timeScheduleBatches.length}批时间安排数据导入`)
      
      // 每2批检查一次是否接近超时（只给1.5秒运行时间）
      if (timeCompletedBatches % 2 === 0 && (new Date().getTime() - startTime.getTime() > 1500)) {
        return {
          success: true,
          message: '成功导入部分时间安排数据，需要继续',
          completed: false,
          nextTimeScheduleBatch: i + 1,
          nextDateIndexBatch: startDateBatch,
          totalTimeBatches: timeScheduleBatches.length,
          totalDateBatches: dateIndexBatches.length,
          progress: `时间安排数据: ${i + 1}/${timeScheduleBatches.length}, 日期索引数据: ${startDateBatch}/${dateIndexBatches.length}`
        }
      }
    }

    // 如果时间允许，开始导入日期索引数据
    console.log('时间安排数据导入完成，开始导入日期索引数据')
    let dateCompletedBatches = 0
    
    // 检查是否还有足够时间开始导入日期索引数据
    if ((new Date().getTime() - startTime.getTime() > 1800)) {
      return {
        success: true,
        message: '成功导入时间安排数据，需要继续导入日期索引数据',
        completed: false,
        nextTimeScheduleBatch: timeScheduleBatches.length, // 标记时间安排数据已完成
        nextDateIndexBatch: 0, // 从第一批日期索引开始
        totalTimeBatches: timeScheduleBatches.length,
        totalDateBatches: dateIndexBatches.length,
        progress: `时间安排数据: ${timeScheduleBatches.length}/${timeScheduleBatches.length}, 日期索引数据: 0/${dateIndexBatches.length}`
      }
    }
    
    // 尝试导入一些日期索引数据
    for (let i = startDateBatch; i < dateIndexBatches.length; i++) {
      await db.collection('professionalDateIndex').add({
        data: dateIndexBatches[i]
      })
      dateCompletedBatches++
      console.log(`完成第${i + 1}/${dateIndexBatches.length}批日期索引数据导入`)
      
      // 每批检查一次是否接近超时（给云函数留出足够时间返回）
      if ((new Date().getTime() - startTime.getTime() > 1500)) {
        return {
          success: true,
          message: '成功导入部分日期索引数据，需要继续',
          completed: false,
          nextTimeScheduleBatch: timeScheduleBatches.length,
          nextDateIndexBatch: i + 1,
          totalTimeBatches: timeScheduleBatches.length,
          totalDateBatches: dateIndexBatches.length,
          progress: `时间安排数据: ${timeScheduleBatches.length}/${timeScheduleBatches.length}, 日期索引数据: ${i + 1}/${dateIndexBatches.length}`
        }
      }
    }

    return {
      success: true,
      message: `成功初始化${timeSchedulesData.length}条时间安排数据和${dateIndexes.length}条日期索引数据`,
      completed: true,
      count: timeSchedulesData.length,
      indexCount: dateIndexes.length
    }
  } catch (error) {
    console.error('初始化时间安排测试数据失败:', error)
    return {
      success: false,
      message: `初始化时间安排测试数据失败: ${error.message}`,
      error: error,
    }
  }
}

// 清理时间安排测试数据
async function clearTimeSchedules() {
  try {
    // 删除所有标记为测试数据的时间安排
    const result = await db
      .collection('timeSchedules')
      .where({
        isTestData: true,
      })
      .remove()

    const removedCount = result.stats.removed || 0

    // 如果没有删除记录，尝试使用professionalId匹配
    if (removedCount === 0) {
      console.log('没有找到标记为isTestData的记录，尝试使用professionalId匹配')
      const resultByProfId = await db
        .collection('timeSchedules')
        .where({
          professionalId: db.RegExp({
            regexp: '^test_openid_',
            options: 'i',
          }),
        })
        .remove()

      const removedByProfId = resultByProfId.stats.removed || 0

      return {
        success: true,
        message: `成功清理${removedByProfId}条时间安排测试数据（通过professionalId匹配）`,
        count: removedByProfId,
      }
    }

    return {
      success: true,
      message: `成功清理${removedCount}条时间安排测试数据`,
      count: removedCount,
    }
  } catch (error) {
    console.error('清理时间安排测试数据失败:', error)
    return {
      success: false,
      message: `清理时间安排测试数据失败: ${error.message}`,
      error: error,
    }
  }
}

// 清理专业人士日期索引测试数据
async function clearProfessionalDateIndex() {
  try {
    // 删除所有标记为测试数据的索引记录
    const result = await db
      .collection('professionalDateIndex')
      .where({
        isTestData: true,
      })
      .remove()

    const removedCount = result.stats.removed || 0

    // 如果没有删除记录，尝试使用professionalId匹配
    if (removedCount === 0) {
      console.log('没有找到标记为isTestData的索引记录，尝试使用professionalId匹配')
      const resultByProfId = await db
        .collection('professionalDateIndex')
        .where({
          professionalId: db.RegExp({
            regexp: '^test_openid_',
            options: 'i',
          }),
        })
        .remove()

      const removedByProfId = resultByProfId.stats.removed || 0

      return {
        success: true,
        message: `成功清理${removedByProfId}条日期索引测试数据（通过professionalId匹配）`,
        count: removedByProfId,
      }
    }

    return {
      success: true,
      message: `成功清理${removedCount}条日期索引测试数据`,
      count: removedCount,
    }
  } catch (error) {
    console.error('清理日期索引测试数据失败:', error)
    return {
      success: false,
      message: `清理日期索引测试数据失败: ${error.message}`,
      error: error,
    }
  }
}

// 一次性加载专业人士日期索引数据
async function loadProfessionalDateIndex() {
  try {
    console.log('开始一次性加载专业人士日期索引数据')

    // 检查timeSchedules集合是否有测试数据
    const timeSchedulesCount = await db
      .collection('timeSchedules')
      .where({ isTestData: true })
      .count()
    
    console.log(`找到${timeSchedulesCount.total}条时间安排测试数据`)
    
    let generationMode = 'fromExisting'
    if (timeSchedulesCount.total === 0) {
      console.log('没有找到时间安排测试数据，将直接生成日期索引数据')
      generationMode = 'generateNew'
    }

    // 查询所有测试专业人士
    const professionalResult = await db
      .collection('professionals')
      .where({
        isTestData: true,
      })
      .field({
        _id: true,
        _openid: true,
        name: true,
        professionalTypes: true,
        city: true,
        district: true,
        province: true,
      })
      .get()

    if (!professionalResult.data || professionalResult.data.length === 0) {
      console.error('未找到测试专业人士，请先初始化专业人士数据')
      return {
        success: false,
        message: '错误：未找到测试专业人士，请先初始化专业人士数据',
      }
    }

    console.log(`找到${professionalResult.data.length}个测试专业人士`)

    // 生成当前日期和未来90天的日期范围
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dateRange = []
    for (let i = 0; i < 90; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dateRange.push(formatDate(date))
    }

    const allDateIndexes = []
    // 专业人士ID到信息的映射
    const professionalMap = {}
    professionalResult.data.forEach(p => {
      professionalMap[p._openid] = p
    })
    
    if (generationMode === 'fromExisting') {
      // 从已有时间安排数据生成
      console.log('从已有时间安排数据生成日期索引')
      
      // 由于数据可能很多，我们采用按专业人士ID分组查询
      const professionalIds = professionalResult.data.map(p => p._openid)
      console.log(`将处理${professionalIds.length}个专业人士ID`)

      // 为每个专业人士查询时间安排数据
      for (const profId of professionalIds) {
        try {
          console.log(`处理专业人士ID: ${profId}`)
          
          // 查询该专业人士的所有时间安排
          const timeSchedules = await db
            .collection('timeSchedules')
            .where({
              professionalId: profId,
              isTestData: true
            })
            .field({
              date: true
            })
            .get()
          
          if (!timeSchedules.data || timeSchedules.data.length === 0) {
            console.log(`专业人士 ${profId} 没有时间安排数据`)
            continue
          }
          
          console.log(`找到${timeSchedules.data.length}条时间安排数据`)
          
          // 提取不重复的日期
          const availableDatesMap = {}
          timeSchedules.data.forEach(ts => {
            if (ts && ts.date) {
              availableDatesMap[ts.date] = true
            }
          })
          
          const uniqueDatesCount = Object.keys(availableDatesMap).length
          console.log(`找到${uniqueDatesCount}个不重复日期`)
          
          // 获取专业人士信息
          const prof = professionalMap[profId]
          if (!prof) {
            console.error(`未找到专业人士信息: ${profId}`)
            continue
          }
          
          // 为此专业人士创建日期索引记录
          Object.keys(availableDatesMap).forEach(date => {
            allDateIndexes.push({
              professionalId: profId,
              date,
              professionalTypes: prof.professionalTypes || ['其他'],
              city: prof.city || '未知',
              district: prof.district || '未知',
              province: prof.province || '未知',
              isTestData: true,
              createTime: new Date(),
            })
          })
        } catch (err) {
          console.error(`处理专业人士${profId}时出错:`, err)
        }
      }
    } else {
      // 直接生成新数据
      console.log('直接生成新的日期索引数据')
      
      // 为每个专业人士生成随机日期
      for (const prof of professionalResult.data) {
        try {
          const profId = prof._openid
          console.log(`为专业人士${profId}生成日期索引数据`)
          
          // 随机挑选未来10-20天的日期
          const daysCount = Math.floor(Math.random() * 11) + 10 // 10-20天
          const startOffset = Math.floor(Math.random() * 10) // 0-9天后开始
          
          const selectedDates = new Set()
          for (let i = 0; i < daysCount; i++) {
            const dateIndex = startOffset + i
            if (dateIndex < dateRange.length) {
              selectedDates.add(dateRange[dateIndex])
            }
          }
          
          console.log(`为专业人士${profId}生成了${selectedDates.size}个日期`)
          
          // 创建日期索引记录
          selectedDates.forEach(date => {
            allDateIndexes.push({
              professionalId: profId,
              date,
              professionalTypes: prof.professionalTypes || ['其他'],
              city: prof.city || '未知',
              district: prof.district || '未知',
              province: prof.province || '未知',
              isTestData: true,
              createTime: new Date(),
            })
          })
        } catch (err) {
          console.error(`生成专业人士${prof._openid}的日期索引时出错:`, err)
        }
      }
    }
    
    // 检查是否已有professionalDateIndex数据
    const existingCount = await db
      .collection('professionalDateIndex')
      .where({ isTestData: true })
      .count()
    
    console.log(`已存在${existingCount.total}条专业人士日期索引数据`)
    
    if (existingCount.total > 0) {
      console.log(`清除已存在的${existingCount.total}条专业人士日期索引数据`)
      const clearResult = await clearProfessionalDateIndex()
      console.log('清除结果:', clearResult)
    }

    if (allDateIndexes.length === 0) {
      console.error('未能生成任何日期索引数据')
      return {
        success: false,
        message: '错误：未能生成任何日期索引数据',
      }
    }

    console.log(`准备一次性导入${allDateIndexes.length}条专业人士日期索引数据`)
    
    // 考虑到云数据库限制，我们需要分批导入，但每批数量可以较大
    const batchSize = 100
    const batches = []
    
    for (let i = 0; i < allDateIndexes.length; i += batchSize) {
      batches.push(allDateIndexes.slice(i, i + batchSize))
    }
    
    console.log(`将分${batches.length}批导入数据`)
    
    // 批量导入数据
    let imported = 0
    for (let i = 0; i < batches.length; i++) {
      try {
        const batch = batches[i]
        const result = await db.collection('professionalDateIndex').add({ data: batch })
        
        if (result && result._id) {
          imported += batch.length
          console.log(`完成第${i + 1}/${batches.length}批，已导入${imported}/${allDateIndexes.length}条`)
        } else {
          console.error(`第${i + 1}批导入失败:`, result)
        }
      } catch (err) {
        console.error(`第${i + 1}批导入出错:`, err)
      }
    }

    // 导入完成后验证数据
    const finalCount = await db
      .collection('professionalDateIndex')
      .where({ isTestData: true })
      .count()
    
    console.log(`验证结果: 数据库中有${finalCount.total}条专业人士日期索引数据`)

    return {
      success: true,
      message: `成功导入${imported}条专业人士日期索引数据 (验证结果: ${finalCount.total})`,
      count: imported,
      verifiedCount: finalCount.total,
      generationMode
    }
  } catch (error) {
    console.error('一次性加载专业人士日期索引数据失败:', error)
    return {
      success: false,
      message: `一次性加载专业人士日期索引数据失败: ${error.message}`,
      error: error.toString(),
      stack: error.stack
    }
  }
}

/**
 * 辅助函数：处理继续导入逻辑
 * 将本函数复制到小程序客户端使用
 * @param {Object} result 云函数返回结果
 * @returns {Promise} 完成所有导入的Promise
 */
function handleContinue(result) {
  // 如果导入已完成或发生错误，直接返回结果
  if (!result || !result.success || result.completed === true) {
    return Promise.resolve(result);
  }

  // 如果需要继续导入，构造参数进行下一次调用
  console.log(`继续导入数据: ${result.progress}`);
  const callParams = {
    action: result.action,
    collection: result.collection,
    timeScheduleBatch: result.nextTimeScheduleBatch,
    dateIndexBatch: result.nextDateIndexBatch
  };

  // 调用云函数并递归处理结果
  return wx.cloud.callFunction({
    name: 'initTestData',
    data: callParams
  }).then(res => handleContinue(res.result));
}

// 快速导入少量测试数据（时间安排和日期索引）
async function quickImportTestData() {
  try {
    console.log('开始快速导入少量测试数据')
    
    // 检查是否有专业人士测试数据
    const professionalsCount = await db
      .collection('professionals')
      .where({ isTestData: true })
      .count()
    
    if (professionalsCount.total === 0) {
      console.log('没有找到专业人士测试数据，先初始化专业人士数据')
      await initProfessionals()
    }
    
    // 查询专业人士数据（限制为20个以提高速度）
    const professionals = await db
      .collection('professionals')
      .where({ isTestData: true })
      .limit(20)
      .get()
    
    if (!professionals.data || professionals.data.length === 0) {
      return {
        success: false,
        message: '找不到专业人士数据，无法生成测试数据'
      }
    }
    
    console.log(`找到${professionals.data.length}个专业人士，准备生成测试数据`)
    
    // 清理已有的时间安排和日期索引数据
    console.log('清理已有的测试数据')
    await clearTimeSchedules()
    await clearProfessionalDateIndex()
    
    // 生成日期范围（仅生成未来30天）
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dateRange = []
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dateRange.push(formatDate(date))
    }
    
    // 提取未来7天的日期范围
    const nextWeekRange = dateRange.slice(0, 7)
    console.log(`当前日期: ${dateRange[0]}, 未来一周日期范围: ${nextWeekRange[0]} 到 ${nextWeekRange[6]}`)
    
    // 时间段设置（简化为4个时间段）
    const timeSlots = ['09:00', '11:00', '14:00', '16:00']
    
    // 存储所有要插入的数据 - 新结构
    const timeSchedulesData = []
    const dateIndexes = []
    
    // 为每个专业人士生成时间安排和日期索引
    professionals.data.forEach((prof, index) => {
      // 确定是否该专业人士应在未来一周内可预约 (50%的专业人士会在一周内可预约)
      const shouldBeAvailableInNextWeek = index % 2 === 0
      
      // 每个专业人士一条记录，包含所有slots
      const professionalSchedule = {
        professionalId: prof._openid,
        slots: [],
        updateTime: new Date(),
        isTestData: true
      }
      
      // 每个专业人士随机选择5-10天
      const daysCount = Math.floor(Math.random() * 6) + 5
      const availableDatesMap = {}
      
      if (shouldBeAvailableInNextWeek) {
        // 为该专业人士在未来一周内随机选择1-2天
        const daysInNextWeekCount = Math.floor(Math.random() * 2) + 1 // 1-2天
        console.log(`专业人士${prof.name}(ID:${prof._openid})将在未来一周内有${daysInNextWeekCount}天可预约`)
        
        // 随机选择未来一周内的几天
        const selectedWeekDays = []
        while (selectedWeekDays.length < daysInNextWeekCount && selectedWeekDays.length < nextWeekRange.length) {
          const randomIndex = Math.floor(Math.random() * nextWeekRange.length)
          const date = nextWeekRange[randomIndex]
          if (!selectedWeekDays.includes(date)) {
            selectedWeekDays.push(date)
            // 为日期添加记录到可用日期映射
            availableDatesMap[date] = true
            
            // 为每个日期随机选择2-3个时间段
            const slotsCount = Math.floor(Math.random() * 2) + 2 // 2-3
            const selectedSlots = timeSlots
              .sort(() => 0.5 - Math.random())
              .slice(0, slotsCount)
              .sort()
            
            // 创建时间安排记录 - 新结构
            selectedSlots.forEach(startTime => {
              const endTime = getEndTime(startTime)
              professionalSchedule.slots.push({
                date,
                startTime,
                endTime,
                isBooked: false
              })
            })
          }
        }
      }
      
      // 随机选择日期（避开已选择的一周内日期）
      const remainingDaysCount = daysCount - Object.keys(availableDatesMap).length
      if (remainingDaysCount > 0) {
        for (let i = 0; i < remainingDaysCount; i++) {
          const dateIndex = Math.floor(Math.random() * dateRange.length)
          const date = dateRange[dateIndex]
          
          // 避免重复添加已选择的日期
          if (!availableDatesMap[date]) {
            availableDatesMap[date] = true
            
            // 为每个日期随机选择2-3个时间段
            const slotsCount = Math.floor(Math.random() * 2) + 2 // 2-3
            const selectedSlots = timeSlots
              .sort(() => 0.5 - Math.random())
              .slice(0, slotsCount)
              .sort()
            
            // 创建时间安排记录 - 新结构
            selectedSlots.forEach(startTime => {
              const endTime = getEndTime(startTime)
              professionalSchedule.slots.push({
                date,
                startTime,
                endTime,
                isBooked: false
              })
            })
          }
        }
      }
      
      // 为此专业人士创建日期索引记录
      Object.keys(availableDatesMap).forEach(date => {
        dateIndexes.push({
          professionalId: prof._openid,
          date,
          professionalTypes: prof.professionalTypes || ['其他'],
          city: prof.city || '未知',
          district: prof.district || '未知',
          updateTime: new Date(),
          isTestData: true
        })
      })
      
      // 只有当有时间段时才添加该专业人士的记录
      if (professionalSchedule.slots.length > 0) {
        timeSchedulesData.push(professionalSchedule)
      }
    })
    
    // 批量导入数据
    console.log(`将导入${timeSchedulesData.length}个专业人士的时间安排数据，共${timeSchedulesData.reduce((total, item) => total + item.slots.length, 0)}个时间段`)
    console.log(`将导入${dateIndexes.length}条日期索引数据`)
    
    // 清理现有测试数据
    await clearTimeSchedules()
    await clearProfessionalDateIndex()
    
    // 导入时间安排数据
    for (const schedule of timeSchedulesData) {
      try {
        await db.collection('timeSchedules').add({
          data: schedule
        })
        console.log(`成功导入专业人士${schedule.professionalId}的时间安排，包含${schedule.slots.length}个时间段`)
      } catch (err) {
        console.error(`导入专业人士${schedule.professionalId}的时间安排失败:`, err)
      }
    }
    
    // 分批导入日期索引数据
    const indexBatchSize = 100
    const indexBatches = []
    
    for (let i = 0; i < dateIndexes.length; i += indexBatchSize) {
      indexBatches.push(dateIndexes.slice(i, i + indexBatchSize))
    }
    
    let importedIndexes = 0
    for (let i = 0; i < indexBatches.length; i++) {
      try {
        await db.collection('professionalDateIndex').add({
          data: indexBatches[i]
        })
        importedIndexes += indexBatches[i].length
        console.log(`完成第${i + 1}/${indexBatches.length}批日期索引数据导入，已导入${importedIndexes}/${dateIndexes.length}条`)
      } catch (err) {
        console.error(`导入第${i + 1}批日期索引数据失败:`, err)
      }
    }
    
    return {
      success: true,
      message: `成功导入${timeSchedulesData.length}条时间安排数据和${importedIndexes}条日期索引数据`,
      timeSchedules: {
        count: timeSchedulesData.length,
        totalSlots: timeSchedulesData.reduce((total, item) => total + item.slots.length, 0)
      },
      dateIndexes: {
        count: importedIndexes
      }
    }
  } catch (error) {
    console.error('快速导入测试数据失败:', error)
    return {
      success: false,
      message: `快速导入测试数据失败: ${error.message}`,
      error: error.toString()
    }
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取操作类型
  const { action = 'init', collection = 'all', timeScheduleBatch = 0, dateIndexBatch = 0, quickMode = false } = event

  // 执行操作
  switch (action) {
    case 'init':
      // 快速模式，一次性导入少量数据
      if (quickMode === true) {
        return await quickImportTestData()
      }
      
      // 初始化测试数据
      if (collection === 'all' || collection === 'professionals') {
        const profResult = await initProfessionals()
        let timeResult = null

        // 如果初始化专业人士成功，同时初始化时间安排
        if (profResult.success && (collection === 'all' || collection === 'timeSchedules')) {
          timeResult = await initTimeSchedules(timeScheduleBatch, dateIndexBatch)
          
          // 如果需要继续导入，返回后续批次信息
          if (timeResult.success && !timeResult.completed) {
            return {
              ...timeResult,
              professionals: profResult,
              action: 'init',
              collection: 'timeSchedules'
            }
          }
        }

        return {
          professionals: profResult,
          timeSchedules: timeResult,
        }
      } else if (collection === 'timeSchedules') {
        const timeResult = await initTimeSchedules(timeScheduleBatch, dateIndexBatch)
        
        // 如果需要继续导入，返回后续批次信息
        if (timeResult.success && !timeResult.completed) {
          return {
            ...timeResult,
            action: 'init',
            collection: 'timeSchedules'
          }
        }
        
        return {
          timeSchedules: timeResult,
        }
      } else if (collection === 'professionalDateIndex') {
        // 直接加载专业人士日期索引数据
        const dateIndexResult = await loadProfessionalDateIndex()
        return {
          professionalDateIndex: dateIndexResult
        }
      }
      return {
        message: '未指定要初始化的集合',
      }

    case 'clear':
      // 清理测试数据
      if (collection === 'all' || collection === 'professionals') {
        const profResult = await clearProfessionals()
        let timeResult = null
        let dateIndexResult = null

        // 同时清理时间安排数据
        if (collection === 'all' || collection === 'timeSchedules') {
          timeResult = await clearTimeSchedules()
          // 同时清理专业人士日期索引数据
          dateIndexResult = await clearProfessionalDateIndex()
        }

        return {
          professionals: profResult,
          timeSchedules: timeResult,
          professionalDateIndex: dateIndexResult
        }
      } else if (collection === 'timeSchedules') {
        const timeResult = await clearTimeSchedules()
        // 同时清理专业人士日期索引数据
        const dateIndexResult = await clearProfessionalDateIndex()
        return {
          timeSchedules: timeResult,
          professionalDateIndex: dateIndexResult
        }
      }
      return {
        message: '未指定要清理的集合',
      }

    default:
      return {
        success: false,
        message: `不支持的操作: ${action}`,
      }
  }
}
