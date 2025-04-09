import { init } from '@cloudbase/node-sdk'
import { config } from 'dotenv'
import path from 'path'
import fs from 'fs'
import mockDb from './mockDatabase'

// 设置环境变量
const envPath = path.resolve(__dirname, '../../.env')
console.log('尝试加载环境变量文件:', envPath)
console.log('该文件是否存在:', fs.existsSync(envPath))

// 加载环境变量
config({ path: envPath })

// 检查是否使用模拟数据库
const USE_MOCK_DB = process.env.USE_MOCK_DB === 'true'

// 输出当前数据库模式
console.log(`[数据库] 使用${USE_MOCK_DB ? '模拟' : '云端'}数据库`)

// 从环境变量获取配置
const envId = process.env.TCB_ENV_ID || 'cloud1-1g5as078be815144'
const secretId = process.env.TCB_SECRET_ID
const secretKey = process.env.TCB_SECRET_KEY

// 输出环境变量信息(不含敏感信息)
console.log('[数据库] 环境变量:', {
  envPath,
  envId,
  hasSecretId: !!secretId,
  hasSecretKey: !!secretKey,
  USE_MOCK_DB,
})

// 尝试检查是否有USE_MOCK_DB环境变量，并打印其值
console.log('[数据库] 环境变量USE_MOCK_DB:', process.env.USE_MOCK_DB)

// 初始化数据库
let db: any

if (!USE_MOCK_DB) {
  try {
    // 初始化数据库连接
    const app = init({
      env: envId,
      secretId: secretId,
      secretKey: secretKey,
    })

    db = app.database()
    console.log('[数据库] 云端数据库连接成功')
    console.log('[数据库] 云端数据库连接配置:', {
      env: envId,
      hasSecretId: !!secretId,
      hasSecretKey: !!secretKey,
    })
  } catch (error) {
    console.error('[数据库] 云端数据库连接失败:', error)
    // 失败时也使用模拟数据
    db = mockDb
  }
} else {
  console.log('[数据库] 使用模拟数据库')
  db = mockDb
}

// 集合名称枚举
export const collections = {
  PROFESSIONALS: 'professionals',
  USERS: 'UserList',
  BOOKINGS: 'bookings',
  TIME_SCHEDULES: 'timeSchedules',
  USER_ROLES: 'userRoles',
  ADMINS: 'admins',
  SERVICE_TYPES: 'serviceTypes',
} as const

export default db
