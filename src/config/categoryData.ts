// 专业类别数据配置文件
// 用于统一管理应用中使用的专业类别数据

// 专业分类接口
export interface SkillType {
  name: string
  types: string[]
}

// 专业类别数据
export const allCategories: SkillType[] = [
  {
    name: '教育',
    types: ['语文辅导', '数学辅导', '英语辅导', '物理辅导'],
  },
  {
    name: '维修服务',
    types: ['水管', '电路', '空调', '保洁'],
  },
  {
    name: '其他',
    types: ['其他'],
  },
]

// 导出供其他地方使用
export default allCategories
