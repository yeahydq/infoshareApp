/**
 * 专业人士测试数据文件
 * 包含100条模拟专业人士数据，用于开发环境测试
 */

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

// 创建随机专业人士数据
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
    createTime: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
    updateTime: new Date(Date.now() - Math.floor(Math.random() * 1000000000))
  }
}

// 生成100条专业人士数据
const professionals = Array.from({ length: 100 }, (_, i) => generateProfessionalData(i + 1))

export default professionals 