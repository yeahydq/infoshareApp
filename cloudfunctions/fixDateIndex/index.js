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

// 分批导入数据
async function batchImportData(collection, dataArray, batchSize = 100) {
  console.log(`准备分批导入数据，总数据量:${dataArray.length}，批次大小:${batchSize}`)
  
  const totalBatches = Math.ceil(dataArray.length / batchSize)
  let successCount = 0
  
  for (let i = 0; i < totalBatches; i++) {
    const start = i * batchSize
    const end = Math.min(start + batchSize, dataArray.length)
    const batchData = dataArray.slice(start, end)
    
    try {
      const result = await collection.add({ data: batchData })
      successCount += batchData.length
      console.log(`导入批次${i+1}/${totalBatches}成功，本批数据量:${batchData.length}`)
    } catch (error) {
      console.error(`导入批次${i+1}/${totalBatches}失败:`, error)
      throw new Error(`批次${i+1}导入失败: ${error.message}`)
    }
  }
  
  return successCount
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
      // 跳过无效的专业人士数据
      if (!prof || !prof._openid) {
        console.log('跳过无效的专业人士数据')
        continue
      }
      
      // 每个专业人士随机选择5-10天
      const daysCount = Math.floor(Math.random() * 6) + 5
      
      // 随机选择日期
      const availableDates = new Set()
      for (let i = 0; i < daysCount; i++) {
        const dateIndex = Math.floor(Math.random() * dateRange.length)
        availableDates.add(dateRange[dateIndex])
      }
      
      // 确保professionalTypes是数组
      const professionalTypes = Array.isArray(prof.professionalTypes) ? 
                               prof.professionalTypes : 
                               (typeof prof.professionalTypes === 'string' ? [prof.professionalTypes] : ['其他'])
      
      // 安全地提取城市和区域信息
      let city = '未知'
      let district = '未知'
      
      // 处理城市和区域
      if (prof.city && typeof prof.city === 'string') {
        const cityParts = prof.city.split(' ').filter(Boolean)
        if (cityParts.length > 0) {
          city = cityParts[0]
          if (cityParts.length > 1) {
            district = cityParts[1]
          }
        }
      } else if (prof.selectedCity && typeof prof.selectedCity === 'string') {
        city = prof.selectedCity
      }
      
      // 如果district未设置但有selectedDistrict
      if (district === '未知' && prof.selectedDistrict && typeof prof.selectedDistrict === 'string') {
        district = prof.selectedDistrict
      }
      
      const profName = prof.name || '未命名专业人士'
      console.log(`为专业人士 ${profName}(${prof._openid}) 生成了${availableDates.size}个日期`)
      
      // 创建日期索引记录
      Array.from(availableDates).forEach(date => {
        dateIndexes.push({
          professionalId: prof._openid,
          date,
          professionalTypes: professionalTypes,
          city: city,
          district: district,
          province: prof.province || '未知',
          isTestData: true,
          createTime: new Date(),
          updateTime: new Date() // 添加更新时间字段，用于排序
        })
      })
    }
    
    if (dateIndexes.length === 0) {
      return {
        success: false,
        message: '未能生成任何日期索引数据'
      }
    }
    
    console.log(`生成了${dateIndexes.length}条日期索引数据，准备分批导入`)
    
    // 获取批次大小参数，默认100
    const batchSize = event?.batchSize || 100
    
    try {
      // 分批导入数据
      const importedCount = await batchImportData(
        db.collection('professionalDateIndex'), 
        dateIndexes, 
        batchSize
      )
      
      // 验证数据
      const finalCount = await db
        .collection('professionalDateIndex')
        .where({ isTestData: true })
        .count()
      
      return {
        success: true,
        message: `成功修复professionalDateIndex数据，已导入${importedCount}条记录（验证：${finalCount.total}条）`,
        count: importedCount,
        verifiedCount: finalCount.total,
        professionals: professionals.data.length,
        batchSize
      }
    } catch (err) {
      console.error('分批导入失败，错误:', err)
      
      return {
        success: false,
        message: `分批导入${dateIndexes.length}条记录失败: ${err.message}`,
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