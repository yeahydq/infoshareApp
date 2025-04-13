// 修复professionalDateIndex数据的云函数
/* eslint-disable @typescript-eslint/no-var-requires */
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true,
})

const db = cloud.database()

// 格式化日期为YYYY-MM-DD格式
function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 云函数入口函数
exports.main = async (event, _context) => {
  try {
    console.log('开始修复professionalDateIndex数据', event)
    
    // 清理现有的日期索引数据
    console.log('清理现有的日期索引数据')
    const clearResult = await db
      .collection('professionalDateIndex')
      .where({
        isTestData: true
      })
      .remove()
    
    console.log(`清理结果: 删除了${clearResult.stats.removed || 0}条数据`)
    
    // 查询专业人士数据（使用全部数据或限制数量）
    const limit = event?.limit || 100  // 通过event参数控制处理数量
    const professionals = await db
      .collection('professionals')
      .where({ isTestData: true })
      .limit(limit)
      .get()
    
    if (!professionals.data || professionals.data.length === 0) {
      return {
        success: false,
        message: '找不到专业人士数据，无法生成测试数据'
      }
    }
    
    console.log(`找到${professionals.data.length}个专业人士，准备生成日期索引数据`)
    
    // 生成日期范围（未来30天）
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dateRange = []
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dateRange.push(formatDate(date))
    }
    
    // 存储所有要插入的数据
    const dateIndexes = []
    
    // 为每个专业人士生成随机日期索引
    for (const prof of professionals.data) {
      // 每个专业人士随机选择5-10天
      const daysCount = Math.floor(Math.random() * 6) + 5
      
      // 随机选择日期
      const availableDates = new Set()
      for (let i = 0; i < daysCount; i++) {
        const dateIndex = Math.floor(Math.random() * dateRange.length)
        availableDates.add(dateRange[dateIndex])
      }
      
      console.log(`为专业人士 ${prof.name}(${prof._openid}) 生成了${availableDates.size}个日期`)
      
      // 创建日期索引记录
      Array.from(availableDates).forEach(date => {
        dateIndexes.push({
          professionalId: prof._openid,
          date,
          professionalTypes: prof.professionalTypes || ['其他'],
          city: prof.city ? prof.city.split(' ')[0] || prof.city : '未知',
          district: prof.district || (prof.city && prof.city.split(' ')[1]) || '未知',
          province: prof.province || '未知',
          isTestData: true,
          createTime: new Date()
        })
      })
    }
    
    if (dateIndexes.length === 0) {
      return {
        success: false,
        message: '未能生成任何日期索引数据'
      }
    }
    
    console.log(`生成了${dateIndexes.length}条日期索引数据，准备一次性导入`)
    
    // 一次性导入所有数据
    try {
      const result = await db.collection('professionalDateIndex').add({ data: dateIndexes })
      console.log('一次性导入结果:', result)
      
      // 验证数据
      const finalCount = await db
        .collection('professionalDateIndex')
        .where({ isTestData: true })
        .count()
      
      return {
        success: true,
        message: `成功修复professionalDateIndex数据，已导入${dateIndexes.length}条记录（验证：${finalCount.total}条）`,
        count: dateIndexes.length,
        verifiedCount: finalCount.total
      }
    } catch (err) {
      console.error('一次性导入失败，错误:', err)
      
      // 如果一次性导入失败，提示用户修改方案
      return {
        success: false,
        message: `一次性导入${dateIndexes.length}条记录失败，可能超出了云数据库单次写入限制。请考虑使用较小的数据量，或联系开发人员修改为分批导入。`,
        error: err.toString()
      }
    }
  } catch (error) {
    console.error('修复professionalDateIndex数据失败:', error)
    return {
      success: false,
      message: `修复失败: ${error.message}`,
      error: error.toString()
    }
  }
} 