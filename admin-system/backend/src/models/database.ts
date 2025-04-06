import cloudbase from '@cloudbase/node-sdk'

// 创建云开发实例
const app = cloudbase.init({
  env: process.env.CLOUD_ENV || 'production-xxx',
  secretId: process.env.SECRETID,
  secretKey: process.env.SECRETKEY,
})

// 获取数据库实例
const db = app.database()

// 定义集合名称
export const collections = {
  PROFESSIONALS: 'professionals',
  USERS: 'UserList',
  ORDERS: 'orders',
  TIME_SCHEDULES: 'timeSchedules',
  USER_ROLES: 'userRoles',
}

export default db
