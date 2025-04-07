import express, { Request, Response } from 'express'
import { body, param } from 'express-validator'
import { requireAuth } from '../middlewares/auth'
import { validateRequest } from '../middlewares/validation'
import db, { collections } from '../models/database'

const router = express.Router()

// 获取所有服务类型
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    console.log('[服务类型] 获取所有服务类型')

    // 定义服务类型数据
    const serviceTypes = [
      {
        id: 'education',
        name: '教育培训',
        icon: 'education',
        description: '提供各类教育培训服务',
        types: ['语文教学', '数学教学', '英语教学', '物理教学', '化学教学'],
      },
      {
        id: 'finance',
        name: '金融理财',
        icon: 'finance',
        description: '提供专业的金融理财服务',
        types: ['理财规划', '投资顾问', '税务咨询', '资产管理', '财务分析'],
      },
      {
        id: 'legal',
        name: '法律咨询',
        icon: 'legal',
        description: '提供专业的法律咨询服务',
        types: ['民事诉讼', '婚姻家庭', '劳动法律', '合同审核', '知识产权'],
      },
      {
        id: 'design',
        name: '设计服务',
        icon: 'design',
        description: '提供各类设计服务',
        types: ['平面设计', '室内设计', '建筑设计', '产品设计', 'UI/UX设计'],
      },
      {
        id: 'it',
        name: '信息技术',
        icon: 'it',
        description: '提供各类信息技术服务',
        types: ['软件开发', '网络安全', '数据分析', '系统集成', '人工智能'],
      },
      {
        id: 'health',
        name: '健康医疗',
        icon: 'health',
        description: '提供专业的健康医疗服务',
        types: ['内科医生', '外科医生', '心理咨询', '营养师', '理疗师'],
      },
      {
        id: 'other',
        name: '其他服务',
        icon: 'other',
        description: '提供其他类型的专业服务',
        types: ['搬家服务', '美容服务', '旅游顾问', '婚庆服务', '宠物护理'],
      },
    ]

    res.json({
      code: 200,
      message: '获取服务类型成功',
      data: serviceTypes,
    })
  } catch (error: any) {
    console.error('[服务类型] 获取服务类型失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取服务类型失败',
      error: error.message,
    })
  }
})

// 根据ID获取服务类型
router.get(
  '/:id',
  requireAuth,
  [param('id').isString()],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const serviceTypes = {
        education: {
          id: 'education',
          name: '教育培训',
          icon: 'education',
          description: '提供各类教育培训服务',
          types: ['语文教学', '数学教学', '英语教学', '物理教学', '化学教学'],
        },
        finance: {
          id: 'finance',
          name: '金融理财',
          icon: 'finance',
          description: '提供专业的金融理财服务',
          types: ['理财规划', '投资顾问', '税务咨询', '资产管理', '财务分析'],
        },
        legal: {
          id: 'legal',
          name: '法律咨询',
          icon: 'legal',
          description: '提供专业的法律咨询服务',
          types: ['民事诉讼', '婚姻家庭', '劳动法律', '合同审核', '知识产权'],
        },
        design: {
          id: 'design',
          name: '设计服务',
          icon: 'design',
          description: '提供各类设计服务',
          types: ['平面设计', '室内设计', '建筑设计', '产品设计', 'UI/UX设计'],
        },
        it: {
          id: 'it',
          name: '信息技术',
          icon: 'it',
          description: '提供各类信息技术服务',
          types: ['软件开发', '网络安全', '数据分析', '系统集成', '人工智能'],
        },
        health: {
          id: 'health',
          name: '健康医疗',
          icon: 'health',
          description: '提供专业的健康医疗服务',
          types: ['内科医生', '外科医生', '心理咨询', '营养师', '理疗师'],
        },
        other: {
          id: 'other',
          name: '其他服务',
          icon: 'other',
          description: '提供其他类型的专业服务',
          types: ['搬家服务', '美容服务', '旅游顾问', '婚庆服务', '宠物护理'],
        },
      }

      const id = req.params.id
      const serviceType = serviceTypes[id as keyof typeof serviceTypes]

      if (!serviceType) {
        return res.status(404).json({
          code: 404,
          message: '服务类型不存在',
        })
      }

      res.json({
        code: 200,
        message: '获取服务类型成功',
        data: serviceType,
      })
    } catch (error: any) {
      console.error('[服务类型] 获取服务类型详情失败:', error)
      res.status(500).json({
        code: 500,
        message: '获取服务类型详情失败',
        error: error.message,
      })
    }
  },
)

export default router
