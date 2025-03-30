import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import RegisterPage2 from '../register-page2.vue'

// 模拟 uni 全局对象
global.uni = {
  clearStorageSync: vi.fn(),
  getStorageSync: vi.fn(),
  setStorageSync: vi.fn(),
  showToast: vi.fn(),
}

describe('RegisterPage2', () => {
  let wrapper: any

  beforeEach(() => {
    // 清除本地存储
    global.uni.clearStorageSync()
    wrapper = mount(RegisterPage2)
  })

  describe('技能标签过滤', () => {
    it('选择语文辅导后应该显示语文相关标签', async () => {
      // 模拟第一步数据
      global.uni.getStorageSync.mockReturnValue({
        professionalTypes: ['语文辅导'],
        educationRanges: ['小学'],
      })

      // 验证标签分类
      const categories = wrapper.vm.filteredSkillTagCategories
      expect(categories).toHaveLength(2) // 教学特色和教师特点

      // 验证标签内容
      const tags = categories.flatMap((c: any) => c.tags)
      expect(tags).toContain('耐心细致')
      expect(tags).toContain('认真负责')
      expect(tags).toContain('写作')
      expect(tags).toContain('阅读')
    })

    it('选择数学辅导后应该显示数学相关标签', async () => {
      // 模拟第一步数据
      global.uni.getStorageSync.mockReturnValue({
        professionalTypes: ['数学辅导'],
        educationRanges: ['初中'],
      })

      // 验证标签分类
      const categories = wrapper.vm.filteredSkillTagCategories
      expect(categories).toHaveLength(2)

      // 验证标签内容
      const tags = categories.flatMap((c: any) => c.tags)
      expect(tags).toContain('思维')
      expect(tags).toContain('解题')
      expect(tags).toContain('逻辑')
    })

    it('选择物理辅导后应该显示物理相关标签', async () => {
      // 模拟第一步数据
      global.uni.getStorageSync.mockReturnValue({
        professionalTypes: ['物理辅导'],
        educationRanges: ['高中'],
      })

      // 验证标签分类
      const categories = wrapper.vm.filteredSkillTagCategories
      expect(categories).toHaveLength(2)

      // 验证标签内容
      const tags = categories.flatMap((c: any) => c.tags)
      expect(tags).toContain('实验')
      expect(tags).toContain('原理')
      expect(tags).toContain('应用')
    })

    it('根据不同辅导范围显示相应的标签', async () => {
      // 模拟第一步数据 - 小学
      global.uni.getStorageSync.mockReturnValue({
        professionalTypes: ['英语辅导'],
        educationRanges: ['小学'],
      })
      let categories = wrapper.vm.filteredSkillTagCategories
      let tags = categories.flatMap((c: any) => c.tags)
      expect(tags).toContain('耐心')
      expect(tags).toContain('兴趣')
      expect(tags).toContain('基础')

      // 模拟第一步数据 - 高中
      global.uni.getStorageSync.mockReturnValue({
        professionalTypes: ['英语辅导'],
        educationRanges: ['高中'],
      })
      categories = wrapper.vm.filteredSkillTagCategories
      tags = categories.flatMap((c: any) => c.tags)
      expect(tags).toContain('专业')
      expect(tags).toContain('冲刺')
      expect(tags).toContain('突破')
    })
  })

  describe('标签选择', () => {
    it('应该限制最多选择5个标签', async () => {
      // 选择6个标签
      for (let i = 0; i < 6; i++) {
        await wrapper.vm.toggleSkillTag(`标签${i}`)
      }

      // 验证标签数量
      expect(wrapper.vm.formData.skillTags).toHaveLength(5)
    })

    it('应该可以取消选择标签', async () => {
      // 选择标签
      await wrapper.vm.toggleSkillTag('标签1')
      expect(wrapper.vm.formData.skillTags).toContain('标签1')

      // 取消选择
      await wrapper.vm.toggleSkillTag('标签1')
      expect(wrapper.vm.formData.skillTags).not.toContain('标签1')
    })
  })

  describe('表单验证', () => {
    it('应该验证必填字段', async () => {
      // 模拟 showToast
      global.uni.showToast = vi.fn()

      // 验证空表单
      const isValid = wrapper.vm.validateForm()
      expect(isValid).toBe(false)
      expect(global.uni.showToast).toHaveBeenCalled()

      // 填写必要信息
      wrapper.vm.formData.skillTags = ['标签1', '标签2', '标签3']
      wrapper.vm.formData.serviceArea = '北京市'
      wrapper.vm.formData.serviceDescription = '服务描述'

      // 验证完整表单
      const isValid2 = wrapper.vm.validateForm()
      expect(isValid2).toBe(true)
    })
  })

  describe('数据存储', () => {
    it('应该正确保存表单数据到本地存储', async () => {
      // 模拟 setStorageSync
      global.uni.setStorageSync = vi.fn()

      // 填写表单
      wrapper.vm.formData.skillTags = ['标签1', '标签2', '标签3']
      wrapper.vm.formData.serviceArea = '北京市'
      wrapper.vm.formData.serviceDescription = '服务描述'

      // 触发保存
      await wrapper.vm.handleNext()

      // 验证本地存储
      expect(global.uni.setStorageSync).toHaveBeenCalled()
      expect(global.uni.setStorageSync).toHaveBeenCalledWith(
        'professionalRegisterStep2',
        expect.objectContaining({
          skillTags: ['标签1', '标签2', '标签3'],
          serviceArea: '北京市',
          serviceDescription: '服务描述',
        }),
      )
    })
  })
})
