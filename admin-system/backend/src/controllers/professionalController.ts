import { Request, Response } from 'express'
import { Professional } from '../models/Professional'

/**
 * 专业人士控制器
 */
export class ProfessionalController {
  /**
   * 获取专业人士列表
   */
  static async getList(req: Request, res: Response) {
    try {
      const { pageSize = 10, pageNumber = 1, searchText = '' } = req.query

      const result = await Professional.getList({
        pageSize: Number(pageSize),
        pageNumber: Number(pageNumber),
        searchText: String(searchText),
      })

      return res.json({
        code: 0,
        data: result,
        message: '获取专业人士列表成功',
      })
    } catch (error) {
      console.error('[专业人士控制器] 获取列表失败:', error)
      return res.status(500).json({
        code: -1,
        message: '获取专业人士列表失败',
        error: (error as Error).message,
      })
    }
  }

  /**
   * 获取专业人士详情
   */
  static async getDetail(req: Request, res: Response) {
    try {
      const { id } = req.params

      if (!id) {
        return res.status(400).json({
          code: -1,
          message: '专业人士ID不能为空',
        })
      }

      const professional = await Professional.getDetail(id)

      if (!professional) {
        return res.status(404).json({
          code: -1,
          message: '专业人士不存在',
        })
      }

      return res.json({
        code: 0,
        data: professional,
        message: '获取专业人士详情成功',
      })
    } catch (error) {
      console.error('[专业人士控制器] 获取详情失败:', error)
      return res.status(500).json({
        code: -1,
        message: '获取专业人士详情失败',
        error: (error as Error).message,
      })
    }
  }
}
