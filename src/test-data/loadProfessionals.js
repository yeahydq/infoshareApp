/**
 * 专业人士测试数据加载脚本
 * 用于开发环境下将测试数据导入到数据库
 */

import professionals from './professionals'

/**
 * 将测试数据加载到数据库中
 * @returns {Promise<{success: boolean, message: string, count: number}>} 加载结果
 */
export async function loadProfessionals() {
  // 检查环境，仅在开发环境运行
  if (process.env.NODE_ENV !== 'development') {
    console.warn('测试数据只能在开发环境加载')
    return {
      success: false, 
      message: '测试数据只能在开发环境加载',
      count: 0
    }
  }

  try {
    const db = wx.cloud.database()
    const collection = db.collection('professionals')
    
    // 检查集合中是否已有测试数据
    const { total } = await collection.where({
      _id: db.RegExp({
        regexp: '^test_professional_',
        options: 'i'
      })
    }).count()
    
    if (total > 0) {
      console.log(`数据库中已存在${total}条测试数据`)
      return {
        success: true,
        message: `数据库中已存在${total}条测试数据`,
        count: total
      }
    }
    
    // 批量导入数据
    console.log(`准备导入${professionals.length}条测试数据`)
    let successCount = 0
    
    // 使用Promise.all进行批量导入
    // 由于小程序云开发有单次操作数量限制，将数据分批导入
    const batchSize = 20 // 每批20条数据
    const batches = []
    
    for (let i = 0; i < professionals.length; i += batchSize) {
      const batch = professionals.slice(i, i + batchSize)
      batches.push(batch)
    }
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]
      const promises = batch.map(professional => {
        return collection.add({
          data: {
            ...professional,
            // 将Date对象转为服务器日期
            createTime: db.serverDate({
              offset: professional.createTime.getTime() - Date.now()
            }),
            updateTime: db.serverDate({
              offset: professional.updateTime.getTime() - Date.now()
            })
          }
        })
      })
      
      const results = await Promise.all(promises)
      successCount += results.filter(res => res._id).length
      
      console.log(`已导入第${i + 1}批数据(${successCount}/${professionals.length})`)
    }
    
    return {
      success: true,
      message: `成功导入${successCount}条测试数据`,
      count: successCount
    }
  } catch (error) {
    console.error('导入测试数据失败:', error)
    return {
      success: false,
      message: `导入测试数据失败: ${error.message}`,
      count: 0
    }
  }
}

/**
 * 清理测试数据
 * @returns {Promise<{success: boolean, message: string, count: number}>} 清理结果
 */
export async function clearTestProfessionals() {
  // 检查环境，仅在开发环境运行
  if (process.env.NODE_ENV !== 'development') {
    console.warn('测试数据只能在开发环境清理')
    return {
      success: false, 
      message: '测试数据只能在开发环境清理',
      count: 0
    }
  }
  
  try {
    const db = wx.cloud.database()
    const collection = db.collection('professionals')
    
    // 获取测试数据的ID列表
    const { data } = await collection.where({
      _id: db.RegExp({
        regexp: '^test_professional_',
        options: 'i'
      })
    }).field({
      _id: true
    }).get()
    
    if (!data || data.length === 0) {
      return {
        success: true,
        message: '没有测试数据需要清理',
        count: 0
      }
    }
    
    console.log(`准备清理${data.length}条测试数据`)
    
    // 由于云函数中无法直接批量删除，需要循环删除
    // 如果数据量很大，应考虑在云函数中实现批量删除
    let deletedCount = 0
    const batchSize = 20
    const batches = []
    
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize)
      batches.push(batch)
    }
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]
      const promises = batch.map(item => collection.doc(item._id).remove())
      const results = await Promise.all(promises)
      
      const batchDeletedCount = results.reduce((sum, result) => 
        sum + (result.stats && result.stats.removed ? result.stats.removed : 0), 0)
      
      deletedCount += batchDeletedCount
      console.log(`已清理第${i + 1}批数据(${deletedCount}/${data.length})`)
    }
    
    return {
      success: true,
      message: `成功清理${deletedCount}条测试数据`,
      count: deletedCount
    }
  } catch (error) {
    console.error('清理测试数据失败:', error)
    return {
      success: false,
      message: `清理测试数据失败: ${error.message}`,
      count: 0
    }
  }
}

// 初始化测试数据 - 专业人士数据
async function initProfessionals() {
  try {
    const db = wx.cloud.database()
    
    // 首先获取现有测试数据数量
    const testDataRes = await db.collection('professionals')
      .where({
        isTestData: true
      })
      .count()
    
    // 如果已有测试数据，则不再添加
    if (testDataRes.total >= 50) {
      console.log('已存在足够的测试数据，无需再次初始化')
      return {
        success: true,
        message: '测试数据已存在，无需初始化',
        count: testDataRes.total,
        skipped: true
      }
    }
  } catch (error) {
    console.error('初始化测试数据失败:', error)
    return {
      success: false,
      message: `初始化测试数据失败: ${error.message}`,
      count: 0,
      skipped: false
    }
  }
} 