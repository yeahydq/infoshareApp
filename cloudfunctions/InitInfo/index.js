// 云函数入口文件
import { init, DYNAMIC_CURRENT_ENV, database, getWXContext } from 'wx-server-sdk'

init({
  env: DYNAMIC_CURRENT_ENV,
  traceUser: true,
})
const db = database()

// 云函数入口函数
export async function main(event, context) {
  const wxContext = getWXContext()
  const openId = wxContext.OPENID

  // 用户保存自己的委托
  if (event.type === 'INIT') {
    const dbname = 'UserList'
    return await db
      .collection(dbname)
      .where({
        _openid: openId,
      })
      .field({
        _openid: true,
        nickName: true,
        phone: true,
        address: true,
        manager: true,
        avatarUrl: true,
        city: true,
        country: true,
        gender: true,
      })
      .get()
  }

  // 查询是否为管理员
  if (event.type === 'ADMIN') {
    const dbname = 'AdminStator'
    return await db
      .collection(dbname)
      .where({
        _openid: openId,
      })
      .count()
  }
}
