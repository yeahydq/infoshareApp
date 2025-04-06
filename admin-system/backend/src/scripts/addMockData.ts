/**
 * 添加模拟数据脚本
 * 用于添加测试数据到云数据库
 * 执行命令: npx ts-node src/scripts/addMockData.ts
 */
import tcb from '@cloudbase/node-sdk'
import { config } from 'dotenv'
import path from 'path'
import crypto from 'crypto'

// 加载环境变量
config({ path: path.resolve(__dirname, '../../.env') })

// 定义集合名称
const collections = {
  PROFESSIONALS: 'professionals',
  USERS: 'users',
  BOOKINGS: 'bookings',
  TIME_SCHEDULES: 'timeSchedules',
  SERVICE_TYPES: 'serviceTypes',
  USER_ROLES: 'userRoles',
  ADMINS: 'admins',
}

// 哈希密码
const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex')
}

// 获取随机日期
const getRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// 初始化云开发
async function addMockData() {
  try {
    console.log('开始添加模拟数据...')

    // 检查环境变量
    if (!process.env.CLOUD_ENV || !process.env.SECRETID || !process.env.SECRETKEY) {
      throw new Error('缺少必要的环境变量: CLOUD_ENV, SECRETID, SECRETKEY')
    }

    // 初始化腾讯云
    const app = tcb.init({
      env: process.env.CLOUD_ENV,
      secretId: process.env.SECRETID,
      secretKey: process.env.SECRETKEY,
    })

    // 获取数据库引用
    const db = app.database()

    console.log('云环境连接成功:', process.env.CLOUD_ENV)

    // 添加模拟用户
    await addMockUsers(db)

    // 添加模拟专业人士
    await addMockProfessionals(db)

    // 添加模拟预约
    await addMockBookings(db)

    console.log('模拟数据添加完成！')
  } catch (error) {
    console.error('添加模拟数据失败:', error)
    process.exit(1)
  }
}

// 添加模拟用户
async function addMockUsers(db: any) {
  try {
    console.log('添加模拟用户...')

    const usersCollection = db.collection(collections.USERS)

    // 检查是否已存在用户
    const existingUsers = await usersCollection.count()

    if (existingUsers.total > 10) {
      console.log(`已存在 ${existingUsers.total} 个用户，无需添加更多`)
      return
    }

    // 模拟用户数据
    const mockUsers = [
      {
        username: 'user1',
        password: hashPassword('123456'),
        nickname: '张三',
        gender: '男',
        phone: '13800138001',
        email: 'user1@example.com',
        avatar: '',
        status: 'active',
      },
      {
        username: 'user2',
        password: hashPassword('123456'),
        nickname: '李四',
        gender: '女',
        phone: '13800138002',
        email: 'user2@example.com',
        avatar: '',
        status: 'active',
      },
      {
        username: 'user3',
        password: hashPassword('123456'),
        nickname: '王五',
        gender: '男',
        phone: '13800138003',
        email: 'user3@example.com',
        avatar: '',
        status: 'active',
      },
      {
        username: 'user4',
        password: hashPassword('123456'),
        nickname: '赵六',
        gender: '女',
        phone: '13800138004',
        email: 'user4@example.com',
        avatar: '',
        status: 'active',
      },
      {
        username: 'user5',
        password: hashPassword('123456'),
        nickname: '钱七',
        gender: '男',
        phone: '13800138005',
        email: 'user5@example.com',
        avatar: '',
        status: 'active',
      },
    ]

    // 添加模拟用户
    for (const user of mockUsers) {
      const result = await usersCollection.add({
        ...user,
        createTime: db.serverDate(),
        updateTime: db.serverDate(),
      })
      console.log(`添加用户成功: ${user.nickname}, ID: ${result.id}`)
    }

    console.log(`成功添加 ${mockUsers.length} 个模拟用户`)
  } catch (error) {
    console.error('添加模拟用户失败:', error)
    throw error
  }
}

// 添加模拟专业人士
async function addMockProfessionals(db: any) {
  try {
    console.log('添加模拟专业人士...')

    const professionalsCollection = db.collection(collections.PROFESSIONALS)

    // 检查是否已存在专业人士
    const existingProfessionals = await professionalsCollection.count()

    if (existingProfessionals.total > 10) {
      console.log(`已存在 ${existingProfessionals.total} 个专业人士，无需添加更多`)
      return
    }

    // 获取服务类型
    const serviceTypesCollection = db.collection(collections.SERVICE_TYPES)
    const serviceTypesResult = await serviceTypesCollection.get()
    const serviceTypes = serviceTypesResult.data || []

    // 如果没有服务类型，使用默认值
    const serviceTypesList =
      serviceTypes.length > 0
        ? serviceTypes
        : [
            { name: '医疗健康' },
            { name: '法律咨询' },
            { name: '心理咨询' },
            { name: '教育培训' },
            { name: '财务规划' },
          ]

    // 模拟专业人士数据
    const mockProfessionals = [
      {
        name: '王医生',
        gender: '男',
        phone: '13900139001',
        email: 'doctor1@example.com',
        avatar: '',
        serviceType: serviceTypesList[0].name,
        title: '主任医师',
        organization: '北京协和医院',
        introduction: '从事心内科临床工作20年，擅长冠心病、高血压、心律失常等疾病的诊断与治疗。',
        certifications: ['医师资格证', '医师执业证'],
        status: 'active',
        reviewStatus: 'approved',
        fees: 500,
        rating: 4.8,
        reviewCount: 120,
      },
      {
        name: '李律师',
        gender: '女',
        phone: '13900139002',
        email: 'lawyer1@example.com',
        avatar: '',
        serviceType: serviceTypesList[1].name,
        title: '资深律师',
        organization: '中国律师事务所',
        introduction: '执业15年，专注婚姻家庭、继承纠纷等民事案件，有丰富的诉讼和调解经验。',
        certifications: ['律师资格证', '律师执业证'],
        status: 'active',
        reviewStatus: 'approved',
        fees: 600,
        rating: 4.7,
        reviewCount: 95,
      },
      {
        name: '张心理咨询师',
        gender: '女',
        phone: '13900139003',
        email: 'psycho1@example.com',
        avatar: '',
        serviceType: serviceTypesList[2].name,
        title: '心理咨询师',
        organization: '心灵港湾咨询中心',
        introduction: '国家二级心理咨询师，擅长情绪管理、压力舒缓、人际关系等方面的咨询。',
        certifications: ['心理咨询师证书'],
        status: 'active',
        reviewStatus: 'approved',
        fees: 400,
        rating: 4.9,
        reviewCount: 150,
      },
      {
        name: '赵老师',
        gender: '男',
        phone: '13900139004',
        email: 'teacher1@example.com',
        avatar: '',
        serviceType: serviceTypesList[3].name,
        title: '高级讲师',
        organization: '未来教育培训学校',
        introduction: '从事教育培训工作10年，擅长高中数学教学，注重思维方法的培养。',
        certifications: ['教师资格证'],
        status: 'active',
        reviewStatus: 'approved',
        fees: 300,
        rating: 4.6,
        reviewCount: 80,
      },
      {
        name: '钱理财师',
        gender: '男',
        phone: '13900139005',
        email: 'finance1@example.com',
        avatar: '',
        serviceType: serviceTypesList[4].name,
        title: '理财规划师',
        organization: '财富管理有限公司',
        introduction: '持有CFP认证，专注个人和家庭理财规划，为客户提供资产配置和保险规划服务。',
        certifications: ['理财规划师证书', 'CFP证书'],
        status: 'active',
        reviewStatus: 'approved',
        fees: 800,
        rating: 4.5,
        reviewCount: 60,
      },
    ]

    // 添加模拟专业人士
    for (const professional of mockProfessionals) {
      const result = await professionalsCollection.add({
        ...professional,
        createTime: db.serverDate(),
        updateTime: db.serverDate(),
      })
      console.log(`添加专业人士成功: ${professional.name}, ID: ${result.id}`)
    }

    console.log(`成功添加 ${mockProfessionals.length} 个模拟专业人士`)
  } catch (error) {
    console.error('添加模拟专业人士失败:', error)
    throw error
  }
}

// 添加模拟预约
async function addMockBookings(db: any) {
  try {
    console.log('添加模拟预约...')

    const bookingsCollection = db.collection(collections.BOOKINGS)

    // 检查是否已存在预约
    const existingBookings = await bookingsCollection.count()

    if (existingBookings.total > 10) {
      console.log(`已存在 ${existingBookings.total} 个预约，无需添加更多`)
      return
    }

    // 获取用户
    const usersCollection = db.collection(collections.USERS)
    const usersResult = await usersCollection.limit(5).get()
    const users = usersResult.data || []

    // 获取专业人士
    const professionalsCollection = db.collection(collections.PROFESSIONALS)
    const professionalsResult = await professionalsCollection.limit(5).get()
    const professionals = professionalsResult.data || []

    // 如果没有足够的用户或专业人士，退出
    if (users.length === 0 || professionals.length === 0) {
      console.log('没有足够的用户或专业人士数据，无法创建预约')
      return
    }

    // 预约状态
    const statusOptions = ['pending', 'confirmed', 'completed', 'cancelled']

    // 生成随机预约
    const mockBookings = []
    const now = new Date()
    const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000)
    const fourWeeksLater = new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000)

    // 每个专业人士和用户组合生成几个预约
    for (let i = 0; i < professionals.length; i++) {
      const professional = professionals[i]

      for (let j = 0; j < users.length; j++) {
        const user = users[j]

        // 为每个组合创建1-3个预约
        const bookingCount = Math.floor(Math.random() * 3) + 1

        for (let k = 0; k < bookingCount; k++) {
          // 随机预约日期
          const bookingDate = getRandomDate(fourWeeksAgo, fourWeeksLater)
          const formattedDate = bookingDate.toISOString().split('T')[0]

          // 生成随机时间段
          const hours = Math.floor(Math.random() * 8) + 9 // 9点到16点
          const minutes = [0, 30][Math.floor(Math.random() * 2)] // 0分或30分
          const timeSlot = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

          // 随机状态
          const status = statusOptions[Math.floor(Math.random() * statusOptions.length)]

          mockBookings.push({
            userId: user._id,
            userName: user.nickname,
            professionalId: professional._id,
            professionalName: professional.name,
            serviceType: professional.serviceType,
            fees: professional.fees,
            date: formattedDate,
            timeSlot: timeSlot,
            duration: 60, // 默认60分钟
            status: status,
            notes: '无特殊要求',
            contactPhone: user.phone,
            contactEmail: user.email,
          })
        }
      }
    }

    // 添加模拟预约
    for (const booking of mockBookings) {
      const result = await bookingsCollection.add({
        ...booking,
        createTime: db.serverDate(),
        updateTime: db.serverDate(),
      })
      console.log(
        `添加预约成功: ${booking.userName} - ${booking.professionalName}, ID: ${result.id}`,
      )
    }

    console.log(`成功添加 ${mockBookings.length} 个模拟预约`)
  } catch (error) {
    console.error('添加模拟预约失败:', error)
    throw error
  }
}

// 执行添加模拟数据
addMockData()
