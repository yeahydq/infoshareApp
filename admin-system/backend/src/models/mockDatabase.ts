/**
 * 模拟数据库服务
 * 用于开发和测试，替代腾讯云数据库
 */
interface MockDoc {
  _id: string
  [key: string]: any
}

class MockCollection {
  private data: MockDoc[] = []
  private name: string

  constructor(name: string) {
    this.name = name

    // 初始化模拟数据
    if (name === 'admins') {
      // admin密码: 8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918
      this.data = [
        {
          _id: '1',
          username: 'admin',
          // 修正密码哈希值，确保与"admin"的SHA-256哈希匹配
          password: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // admin
          role: 'admin',
          name: '系统管理员',
          email: 'admin@example.com',
          avatar: '',
          createTime: new Date('2023-01-01').toISOString(),
          updateTime: new Date('2023-01-01').toISOString(),
          lastLoginTime: null,
        },
      ]

      // 控制台输出初始账号密码
      console.log('[模拟数据库] 初始管理员账号已创建:')
      console.log('  用户名: admin')
      console.log('  密码: admin')
    } else if (name === 'professionals') {
      // 初始化专业人士测试数据
      this.initProfessionalData()
    }
  }

  // 初始化专业人士测试数据
  private initProfessionalData() {
    const createProfessional = (index: number, status: string, category: string) => {
      const statusMap: { [key: string]: string } = {
        pending: '待审核',
        approved: '已通过',
        rejected: '已拒绝',
        disabled: '已禁用',
      }

      const categories = ['education', 'finance', 'legal', 'design', 'it', 'health', 'other']
      const categoryNames: { [key: string]: string } = {
        education: '教育培训',
        finance: '金融理财',
        legal: '法律咨询',
        design: '设计服务',
        it: '信息技术',
        health: '健康医疗',
        other: '其他服务',
      }

      const professionalTypeMap: { [key: string]: string[] } = {
        education: ['语文教学', '数学教学', '英语教学', '物理教学', '化学教学'],
        finance: ['理财规划', '投资顾问', '税务咨询', '资产管理', '财务分析'],
        legal: ['民事诉讼', '婚姻家庭', '劳动法律', '合同审核', '知识产权'],
        design: ['平面设计', '室内设计', '建筑设计', '产品设计', 'UI/UX设计'],
        it: ['软件开发', '网络安全', '数据分析', '系统集成', '人工智能'],
        health: ['内科医生', '外科医生', '心理咨询', '营养师', '理疗师'],
        other: ['搬家服务', '美容服务', '旅游顾问', '婚庆服务', '宠物护理'],
      }

      const selectedCategory = category || categories[index % categories.length]
      const professionalTypes = professionalTypeMap[selectedCategory] || ['未分类服务']

      const experience = Math.floor(Math.random() * 15) + 1
      const hourlyRate = (Math.floor(Math.random() * 10) + 5) * 50
      const rating = Math.round((Math.random() * 2 + 3) * 10) / 10 // 3.0-5.0
      const reviewCount = Math.floor(Math.random() * 100) + 1
      const serviceCount = Math.floor(Math.random() * 200) + 1

      return {
        _id: `test_professional_${index}`,
        _openid: `test_openid_${index}`,
        name: `${professionalTypes[0]}专家${index}`,
        avatarUrl: `https://randomuser.me/api/portraits/${index % 2 ? 'men' : 'women'}/${(index * 5) % 99}.jpg`,
        gender: index % 3 === 0 ? 'female' : 'male',
        phone: `1${Math.floor(10000000000 + Math.random() * 90000000000)}`,
        email: `test${index}@example.com`,
        idCard: index % 2 === 0 ? `${Math.floor(100000000000 + Math.random() * 900000000000)}` : '',
        category: selectedCategory,
        professionalTypes: [professionalTypes[0], professionalTypes[1] || professionalTypes[0]],
        educationRanges: selectedCategory === 'education' ? ['小学', '初中', '高中'] : [],
        skillPrices: {
          [professionalTypes[0]]: hourlyRate,
          [professionalTypes[1] || professionalTypes[0]]: hourlyRate + 50,
        },
        skillBillingTypes: {
          [professionalTypes[0]]: '按小时',
          [professionalTypes[1] || professionalTypes[0]]: index % 2 === 0 ? '按项目' : '按次',
        },
        experience,
        hourlyRate,
        rating,
        reviewCount,
        serviceCount,
        verified: index % 2 === 0,
        tags: [
          '专业',
          index % 2 === 0 ? '经验丰富' : '技术精湛',
          index % 3 === 0 ? '高效' : '服务好',
        ],
        education: index % 3 === 0 ? '本科' : index % 3 === 1 ? '硕士' : '博士',
        province: '广东省',
        city: index % 3 === 0 ? '深圳市' : index % 3 === 1 ? '广州市' : '佛山市',
        district:
          index % 5 === 0
            ? '福田区'
            : index % 5 === 1
              ? '南山区'
              : index % 5 === 2
                ? '宝安区'
                : index % 5 === 3
                  ? '龙岗区'
                  : '龙华区',
        serviceName: `${professionalTypes[0]}服务`,
        serviceDescription: `提供专业的${professionalTypes[0]}服务，${experience}年从业经验，服务过${serviceCount}位客户。`,
        status,
        rejectReason: status === 'rejected' ? '提供的资质证书不符合要求，请重新提交' : undefined,
        createTime: new Date(Date.now() - Math.random() * 10000000000),
        updateTime: new Date(Date.now() - Math.random() * 1000000000),
        isTestData: true,
      }
    }

    // 创建不同状态的专业人士数据
    const professionals = []
    for (let i = 0; i < 7; i++) {
      professionals.push(createProfessional(i, 'approved', '')) // 已通过
    }
    for (let i = 7; i < 10; i++) {
      professionals.push(createProfessional(i, 'pending', '')) // 待审核
    }
    for (let i = 10; i < 12; i++) {
      professionals.push(createProfessional(i, 'rejected', '')) // 已拒绝
    }
    for (let i = 12; i < 14; i++) {
      professionals.push(createProfessional(i, 'disabled', '')) // 已禁用
    }

    // 添加一些特定类别的专业人士，确保覆盖所有类别
    professionals.push(createProfessional(20, 'approved', 'education'))
    professionals.push(createProfessional(21, 'approved', 'finance'))
    professionals.push(createProfessional(22, 'approved', 'legal'))
    professionals.push(createProfessional(23, 'approved', 'design'))
    professionals.push(createProfessional(24, 'approved', 'it'))
    professionals.push(createProfessional(25, 'approved', 'health'))
    professionals.push(createProfessional(26, 'approved', 'other'))

    this.data = professionals
    console.log(`[模拟数据库] 专业人士测试数据已初始化，共${professionals.length}条记录`)
  }

  // 查询文档
  where(condition: any) {
    // 保存查询条件
    const filteredData = this.data.filter((item) => {
      for (const key in condition) {
        if (item[key] !== condition[key]) {
          return false
        }
      }
      return true
    })

    let skipCount = 0
    let limitCount = filteredData.length

    return {
      // 分页方法 - 跳过指定数量记录
      skip: (count: number) => {
        console.log(`[Mock DB] 跳过${count}条记录`)
        skipCount = count
        return this // 返回当前对象以支持链式调用
      },

      // 分页方法 - 限制返回记录数
      limit: (count: number) => {
        console.log(`[Mock DB] 限制返回${count}条记录`)
        limitCount = count
        return this // 返回当前对象以支持链式调用
      },

      // 获取查询结果
      get: async () => {
        try {
          console.log(`[Mock DB] 查询${this.name}集合:`, condition)
          console.log(`[Mock DB] 分页参数: skip=${skipCount}, limit=${limitCount}`)

          // 应用分页
          const results = filteredData.slice(skipCount, skipCount + limitCount)

          console.log('[Mock DB] 查询结果:', results)
          return { data: results }
        } catch (error) {
          console.error(`[Mock DB] 查询${this.name}集合出错:`, error)
          throw error
        }
      },

      // 获取记录总数
      count: async () => {
        console.log(`[Mock DB] 计算${this.name}集合记录总数`)
        return { total: filteredData.length }
      },
    }
  }

  // 获取所有记录数量
  count() {
    return Promise.resolve({ total: this.data.length })
  }

  // 根据ID获取文档
  doc(id: string) {
    return {
      get: async () => {
        console.log(`[Mock DB] 获取${this.name}文档:`, id)
        const doc = this.data.find((item) => item._id === id)
        // 修改返回格式，确保与腾讯云数据库的格式兼容
        return { data: doc ? [doc] : [] }
      },
      update: async ({ data }: { data: any }) => {
        console.log(`[Mock DB] 更新${this.name}文档:`, id, data)
        const index = this.data.findIndex((item) => item._id === id)
        if (index >= 0) {
          this.data[index] = { ...this.data[index], ...data, updateTime: new Date().toISOString() }
          return { updated: 1, id }
        }
        return { updated: 0, id }
      },
    }
  }

  // 添加文档
  add(document: any) {
    return new Promise<{ id: string }>((resolve) => {
      const id = Math.random().toString(36).substring(2, 15)
      const newDoc = { _id: id, ...document, createTime: new Date().toISOString() }
      this.data.push(newDoc)
      console.log(`[Mock DB] 添加${this.name}文档:`, newDoc)
      resolve({ id })
    })
  }
}

class MockDatabase {
  private collections: Map<string, MockCollection> = new Map()

  // 获取集合
  collection(name: string) {
    if (!this.collections.has(name)) {
      this.collections.set(name, new MockCollection(name))
    }
    return this.collections.get(name) as MockCollection
  }

  // 模拟服务器日期
  serverDate() {
    return new Date()
  }
}

// 创建并导出模拟数据库实例
const mockDb = new MockDatabase()

// 定义集合名称
export const collections = {
  PROFESSIONALS: 'professionals',
  USERS: 'users',
  ORDERS: 'orders',
  TIME_SCHEDULES: 'timeSchedules',
  USER_ROLES: 'userRoles',
  ADMINS: 'admins',
}

export default mockDb
