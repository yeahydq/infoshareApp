import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import RegisterPage1 from '../register-page1.vue'

// 模拟 uni 全局对象
global.uni = {
  clearStorageSync: vi.fn(),
  getStorageSync: vi.fn(),
  setStorageSync: vi.fn(),
  showToast: vi.fn(),
}

describe('RegisterPage1', () => {
  let wrapper: any

  beforeEach(() => {
    // 清除本地存储
    global.uni.clearStorageSync()
    wrapper = mount(RegisterPage1)
  })

  describe('辅导类型选择', () => {
    it('选择语文辅导后应该显示辅导范围选项', async () => {
      // 选择专业类型
      await wrapper.vm.toggleProfessionalType('语文辅导')

      // 验证是否显示辅导范围
      expect(wrapper.vm.isEducationType).toBe(true)
    })

    it('选择辅导范围应该正确更新数据', async () => {
      // 选择专业类型
      await wrapper.vm.toggleProfessionalType('数学辅导')

      // 选择辅导范围
      await wrapper.vm.toggleEducationRange('小学')

      // 验证辅导范围
      expect(wrapper.vm.formData.educationRanges).toContain('小学')
    })

    it('可以选择多个辅导范围', async () => {
      // 选择专业类型
      await wrapper.vm.toggleProfessionalType('英语辅导')

      // 选择多个辅导范围
      await wrapper.vm.toggleEducationRange('小学')
      await wrapper.vm.toggleEducationRange('初中')

      // 验证辅导范围
      expect(wrapper.vm.formData.educationRanges).toHaveLength(2)
      expect(wrapper.vm.formData.educationRanges).toContain('小学')
      expect(wrapper.vm.formData.educationRanges).toContain('初中')
    })

    it('可以取消选择辅导范围', async () => {
      // 选择专业类型
      await wrapper.vm.toggleProfessionalType('物理辅导')

      // 选择辅导范围
      await wrapper.vm.toggleEducationRange('高中')
      expect(wrapper.vm.formData.educationRanges).toContain('高中')

      // 取消选择
      await wrapper.vm.toggleEducationRange('高中')
      expect(wrapper.vm.formData.educationRanges).not.toContain('高中')
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

      // 填写姓名
      wrapper.vm.formData.name = '张三'
      wrapper.vm.formData.gender = '男'
      wrapper.vm.formData.phone = '13800138000'

      // 选择专业类型
      await wrapper.vm.toggleProfessionalType('语文辅导')

      // 验证表单（未选择辅导范围）
      const isValid2 = wrapper.vm.validateForm()
      expect(isValid2).toBe(false)

      // 选择辅导范围
      await wrapper.vm.toggleEducationRange('小学')

      // 模拟设置价格和计费方式
      wrapper.vm.skillPrices['语文辅导'] = '100'
      wrapper.vm.skillBillingTypes['语文辅导'] = '按小时'

      // 验证完整表单
      const isValid3 = wrapper.vm.validateForm()
      expect(isValid3).toBe(true)
    })
  })

  describe('数据存储', () => {
    it('应该正确保存辅导范围到本地存储', async () => {
      // 模拟 setStorageSync
      global.uni.setStorageSync = vi.fn()

      // 选择专业类型
      await wrapper.vm.toggleProfessionalType('数学辅导')

      // 选择辅导范围
      await wrapper.vm.toggleEducationRange('初中')
      await wrapper.vm.toggleEducationRange('高中')

      // 模拟设置价格和计费方式
      wrapper.vm.skillPrices['数学辅导'] = '120'
      wrapper.vm.skillBillingTypes['数学辅导'] = '按小时'

      // 填写其他必要信息
      wrapper.vm.formData.name = '李四'
      wrapper.vm.formData.gender = '男'
      wrapper.vm.formData.phone = '13900139000'

      // 触发保存
      await wrapper.vm.handleNext()

      // 验证本地存储
      expect(global.uni.setStorageSync).toHaveBeenCalled()
      expect(global.uni.setStorageSync).toHaveBeenCalledWith(
        'professionalRegisterStep1',
        expect.objectContaining({
          professionalTypes: ['数学辅导'],
          educationRanges: ['初中', '高中'],
        }),
      )
    })
  })
})
