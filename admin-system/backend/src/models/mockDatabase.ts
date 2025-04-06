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
    }
  }

  // 查询文档
  where(condition: any) {
    return {
      get: async () => {
        try {
          console.log(`[Mock DB] 查询${this.name}集合:`, condition)

          // 简单的条件匹配
          const results = this.data.filter((item) => {
            for (const key in condition) {
              console.log(
                `[Mock DB] 比较字段 ${key}:`,
                item[key],
                '===',
                condition[key],
                item[key] === condition[key],
              )
              if (item[key] !== condition[key]) {
                return false
              }
            }
            return true
          })

          console.log('[Mock DB] 查询结果:', results)
          return { data: results }
        } catch (error) {
          console.error(`[Mock DB] 查询${this.name}集合出错:`, error)
          throw error
        }
      },
    }
  }

  // 根据ID获取文档
  doc(id: string) {
    return {
      get: async () => {
        console.log(`[Mock DB] 获取${this.name}文档:`, id)
        const doc = this.data.find((item) => item._id === id)
        return { data: doc || null }
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
