/**
 * 测试数据管理模块入口
 * 用于开发环境下加载和管理测试数据
 */

import professionals from './professionals'
import { loadProfessionals, clearTestProfessionals } from './loadProfessionals'

// 验证是否处于开发环境
const isDevelopment = process.env.NODE_ENV === 'development'

/**
 * 批量加载测试数据
 * 仅在开发环境有效
 */
async function loadAllTestData() {
  if (!isDevelopment) {
    console.warn('只能在开发环境加载测试数据')
    return
  }
  
  console.log('开始加载测试数据...')
  
  // 加载专业人士数据
  const profResult = await loadProfessionals()
  console.log(`专业人士数据: ${profResult.message}`)
  
  // 可以在此处添加其他类型测试数据的加载
  
  console.log('测试数据加载完成')
  
  return {
    professionals: profResult
    // 可添加其他测试数据结果
  }
}

/**
 * 清理所有测试数据
 * 仅在开发环境有效
 */
async function clearAllTestData() {
  if (!isDevelopment) {
    console.warn('只能在开发环境清理测试数据')
    return
  }
  
  console.log('开始清理测试数据...')
  
  // 清理专业人士数据
  const profResult = await clearTestProfessionals()
  console.log(`专业人士数据: ${profResult.message}`)
  
  // 可以在此处添加其他类型测试数据的清理
  
  console.log('测试数据清理完成')
  
  return {
    professionals: profResult
    // 可添加其他测试数据结果
  }
}

export {
  // 测试数据集
  professionals,
  
  // 加载测试数据方法
  loadProfessionals,
  loadAllTestData,
  
  // 清理测试数据方法
  clearTestProfessionals,
  clearAllTestData,
  
  // 环境标志
  isDevelopment
} 