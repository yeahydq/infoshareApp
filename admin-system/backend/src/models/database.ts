import { init } from '@cloudbase/node-sdk'
import { config } from 'dotenv'
import path from 'path'
import mockDb, { collections as mockCollections } from './mockDatabase'

// 加载环境变量
config({ path: path.resolve(__dirname, '../../.env') })

// 检查是否使用模拟数据库
const USE_MOCK_DB = process.env.USE_MOCK_DB === 'true' || process.env.NODE_ENV === 'development'

// 输出当前数据库模式
console.log(`[数据库] 使用${USE_MOCK_DB ? '模拟' : '云端'}数据库`)

// 从环境变量获取配置
const envId = process.env.TCB_ENV_ID || 'cloud1-1g5as078be815144'
const secretId = process.env.TCB_SECRET_ID
const secretKey = process.env.TCB_SECRET_KEY

// 初始化数据库
let db: any = mockDb

// 如果不使用模拟数据库，则初始化腾讯云数据库
if (!USE_MOCK_DB) {
  try {
    // 初始化数据库连接
    const app = init({
      env: envId,
      secretId: secretId,
      secretKey: secretKey,
    })

    // 获取数据库实例
    db = app.database()

    console.log('[数据库] 云端数据库连接配置:', {
      env: process.env.TCB_ENV_ID,
      hasSecretId: !!process.env.TCB_SECRET_ID,
      hasSecretKey: !!process.env.TCB_SECRET_KEY,
    })
  } catch (error) {
    console.error('[数据库] 云端数据库连接失败，回退到模拟数据库:', error)
    db = mockDb
  }
}

// 集合名称枚举
export const collections = {
  PROFESSIONALS: 'professionals',
  USERS: 'users',
  BOOKINGS: 'bookings',
  TIME_SCHEDULES: 'timeSchedules',
  USER_ROLES: 'userRoles',
  ADMINS: 'admins',
  SERVICE_TYPES: 'serviceTypes',
} as const

export default db
