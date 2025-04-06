/**
 * 数据库初始化脚本
 * 用于初始化腾讯云数据库，创建必要的集合和初始数据
 * 执行命令: npx ts-node src/scripts/initDatabase.ts
 */
import tcb from '@cloudbase/node-sdk'
import crypto from 'crypto'
import { config } from 'dotenv'
import path from 'path'
import fs from 'fs'

// 加载环境变量
config({ path: path.resolve(__dirname, '../../.env') })

// 哈希密码
const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex')
}

// 定义集合名称
const collections = {
  PROFESSIONALS: 'professionals',
  USERS: 'users',
  BOOKINGS: 'bookings',
  TIME_SCHEDULES: 'timeSchedules',
  USER_ROLES: 'userRoles',
  ADMINS: 'admins',
  SERVICE_TYPES: 'serviceTypes',
}

// 初始化云开发
async function initDatabase() {
  try {
    console.log('开始初始化数据库...')

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

    // 创建所有集合
    await createCollections(db)

    // 初始化管理员账号
    await initAdmin(db)

    // 初始化服务类型和角色
    await initServiceTypes(db)
    await initRoles(db)

    // 初始化专业人士数据
    await initProfessionals(db)

    console.log('数据库初始化完成！')
  } catch (error) {
    console.error('初始化数据库失败:', error)
    process.exit(1)
  }
}

// 创建集合
async function createCollections(db: any) {
  try {
    console.log('正在创建集合...')

    // 需要创建的集合列表
    const collectionsToCreate = Object.values(collections)

    // 直接尝试创建每个集合，忽略"集合已存在"的错误
    for (const collectionName of collectionsToCreate) {
      try {
        console.log(`创建集合: ${collectionName}`)
        await db.createCollection(collectionName)
        console.log(`集合创建成功: ${collectionName}`)
      } catch (error: any) {
        // 如果集合已存在，忽略错误
        if (error.message && error.message.includes('already exists')) {
          console.log(`集合已存在: ${collectionName}`)
        } else {
          console.error(`创建集合 ${collectionName} 失败:`, error)
        }
      }
    }

    console.log('集合创建完成。')
  } catch (error) {
    console.error('创建集合失败:', error)
    throw error
  }
}

// 初始化管理员账号
async function initAdmin(db: any) {
  try {
    console.log('正在初始化管理员账号...')

    const adminsCollection = db.collection(collections.ADMINS)

    // 检查是否已存在管理员账号
    const adminUsername = process.env.ADMIN_USERNAME || 'admin'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456'
    const adminName = process.env.ADMIN_NAME || '系统管理员'

    const existingAdmin = await adminsCollection.where({ username: adminUsername }).get()

    if (existingAdmin.data && existingAdmin.data.length > 0) {
      console.log(`管理员账号 ${adminUsername} 已存在，无需创建`)
      return
    }

    // 创建管理员账号
    const adminData = {
      username: adminUsername,
      password: hashPassword(adminPassword),
      role: 'admin',
      name: adminName,
      email: 'admin@example.com',
      avatar: '',
      createTime: db.serverDate(),
      updateTime: db.serverDate(),
    }

    const result = await adminsCollection.add(adminData)
    console.log(`管理员账号创建成功，ID: ${result.id}`)
    console.log(`用户名: ${adminUsername}, 密码: ${adminPassword}`)
  } catch (error) {
    console.error('初始化管理员账号失败:', error)
    throw error
  }
}

// 初始化服务类型
async function initServiceTypes(db: any) {
  try {
    console.log('正在初始化服务类型...')

    const serviceTypes = [
      { name: '医疗健康', icon: 'MedicalInstrument', status: 'active' },
      { name: '法律咨询', icon: 'DocumentChecked', status: 'active' },
      { name: '心理咨询', icon: 'Chat', status: 'active' },
      { name: '教育培训', icon: 'School', status: 'active' },
      { name: '财务规划', icon: 'Money', status: 'active' },
      { name: '职业规划', icon: 'OfficeBuilding', status: 'active' },
      { name: '生活指导', icon: 'House', status: 'active' },
    ]

    // 创建服务类型集合（如果还没有）
    const serviceTypesCollection = db.collection(collections.SERVICE_TYPES)

    // 检查是否已存在服务类型
    const existingTypes = await serviceTypesCollection.count()

    if (existingTypes.total > 0) {
      console.log(`已存在 ${existingTypes.total} 个服务类型，无需创建`)
      return
    }

    // 添加服务类型
    for (const serviceType of serviceTypes) {
      await serviceTypesCollection.add({
        ...serviceType,
        createTime: db.serverDate(),
        updateTime: db.serverDate(),
      })
    }

    console.log(`成功创建 ${serviceTypes.length} 个服务类型`)
  } catch (error) {
    console.error('初始化服务类型失败:', error)
    throw error
  }
}

// 初始化角色
async function initRoles(db: any) {
  try {
    console.log('正在初始化用户角色...')

    const roles = [
      {
        code: 'admin',
        name: '系统管理员',
        permissions: ['*'],
        description: '系统管理员，拥有所有权限',
      },
      {
        code: 'operator',
        name: '运营人员',
        permissions: [
          'professional.read',
          'professional.approve',
          'user.read',
          'booking.read',
          'booking.update',
        ],
        description: '运营人员，负责日常操作和审核',
      },
      {
        code: 'viewer',
        name: '数据查看员',
        permissions: ['professional.read', 'user.read', 'booking.read'],
        description: '数据查看员，只有查看权限',
      },
    ]

    const rolesCollection = db.collection(collections.USER_ROLES)

    // 检查是否已存在角色
    const existingRoles = await rolesCollection.count()

    if (existingRoles.total > 0) {
      console.log(`已存在 ${existingRoles.total} 个角色，无需创建`)
      return
    }

    // 添加角色
    for (const role of roles) {
      await rolesCollection.add({
        ...role,
        createTime: db.serverDate(),
        updateTime: db.serverDate(),
      })
    }

    console.log(`成功创建 ${roles.length} 个角色`)
  } catch (error) {
    console.error('初始化角色失败:', error)
    throw error
  }
}

// 初始化专业人士数据
async function initProfessionals(db: any) {
  try {
    console.log('正在初始化专业人士数据...')

    const professionalsCollection = db.collection(collections.PROFESSIONALS)

    // 获取服务类型
    const serviceTypesCollection = db.collection(collections.SERVICE_TYPES)
    const serviceTypesRes = await serviceTypesCollection.get()
    const serviceTypes = serviceTypesRes.data || []

    // 检查是否已存在专业人士数据
    const existingProfessionals = await professionalsCollection.count()

    if (existingProfessionals.total > 0) {
      console.log(`已存在 ${existingProfessionals.total} 条专业人士数据，无需创建`)
      return
    }

    // 模拟专业人士数据
    const professionals = [
      {
        name: '张三',
        gender: '男',
        phone: '13800138001',
        email: 'zhangsan@example.com',
        professionalTypes: ['医疗健康'],
        serviceDescription: '专注于心理健康咨询，提供个人心理评估和咨询服务。',
        experience: '8年',
        selectedCity: '广州市',
        selectedDistrict: '天河区',
        status: 'approved',
        createTime: db.serverDate(),
        updateTime: db.serverDate(),
        agreement: true,
      },
      {
        name: '李四',
        gender: '女',
        phone: '13900139001',
        email: 'lisi@example.com',
        professionalTypes: ['法律咨询'],
        serviceDescription: '专业合同法律师，擅长处理商业合同纠纷。',
        experience: '10年',
        selectedCity: '深圳市',
        selectedDistrict: '南山区',
        status: 'approved',
        createTime: db.serverDate(),
        updateTime: db.serverDate(),
        agreement: true,
      },
      {
        name: '王五',
        gender: '男',
        phone: '13700137001',
        email: 'wangwu@example.com',
        professionalTypes: ['教育培训'],
        serviceDescription: '高中数学老师，专注于高考数学培训。',
        experience: '5年',
        selectedCity: '北京市',
        selectedDistrict: '海淀区',
        status: 'pending',
        createTime: db.serverDate(),
        updateTime: db.serverDate(),
        agreement: true,
      },
      {
        name: '赵六',
        gender: '女',
        phone: '13600136001',
        email: 'zhaoliu@example.com',
        professionalTypes: ['财务规划'],
        serviceDescription: '资深理财顾问，提供个人和家庭财务规划服务。',
        experience: '12年',
        selectedCity: '上海市',
        selectedDistrict: '浦东新区',
        status: 'approved',
        createTime: db.serverDate(),
        updateTime: db.serverDate(),
        agreement: true,
      },
      {
        name: '钱七',
        gender: '男',
        phone: '13500135001',
        email: 'qianqi@example.com',
        professionalTypes: ['职业规划'],
        serviceDescription: '职业发展顾问，帮助客户规划职业发展路径。',
        experience: '7年',
        selectedCity: '广州市',
        selectedDistrict: '越秀区',
        status: 'rejected',
        rejectReason: '提供的资质证书不完整，请重新提交。',
        createTime: db.serverDate(),
        updateTime: db.serverDate(),
        agreement: true,
      },
    ]

    // 添加专业人士数据
    for (const professional of professionals) {
      const result = await professionalsCollection.add(professional)
      console.log(`添加专业人士成功: ${professional.name}, ID: ${result.id}`)
    }

    console.log(`成功创建 ${professionals.length} 条专业人士数据`)
  } catch (error) {
    console.error('初始化专业人士数据失败:', error)
    throw error
  }
}

// 执行初始化
initDatabase()
