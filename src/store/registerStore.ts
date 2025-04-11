import { defineStore } from 'pinia'

export interface Step4Data {
  agreement: boolean
  status?: string
}

export const useRegisterStore = defineStore('register', {
  state: () => ({
    step1Data: {
      name: '',
      gender: '',
      phone: '',
      idCard: '',
      email: '',
      professionalTypes: [],
      customType: '',
      educationRanges: [],
      servicePrice: '',
      billingType: '',
      skillPrices: {},
      skillBillingTypes: {},
    },
    step2Data: {
      skillTags: [],
      serviceArea: '',
      serviceDescription: '',
      experience: '',
      description: '',
      selectedCity: '',
      selectedDistrict: '',
      selectedStreet: '',
    },
    step3Data: {
      idCardFront: '',
      idCardBack: '',
      qualification: '',
      education: '',
      professional: '',
      honor: '',
    },
    step4Data: {
      agreement: false,
      status: '',
    } as Step4Data,

    // 添加修改模式标志
    isModifyMode: false,
  }),

  actions: {
    updateStep1(data) {
      this.step1Data = { ...this.step1Data, ...data }
    },

    updateStep2(data) {
      this.step2Data = { ...this.step2Data, ...data }
    },

    updateStep3(data) {
      this.step3Data = { ...this.step3Data, ...data }
    },

    updateStep4(data) {
      this.step4Data = { ...this.step4Data, ...data }
    },

    // 设置修改模式
    setModifyMode(isModify: boolean) {
      this.isModifyMode = isModify
      try {
        // 如果设置为true，保存当前时间戳
        if (isModify) {
          const timestamp = new Date().getTime()
          uni.setStorageSync('professionalRegisterModifyTimestamp', timestamp)
        } else {
          uni.removeStorageSync('professionalRegisterModifyTimestamp')
        }
        uni.setStorageSync('professionalRegisterModifyMode', isModify)
      } catch (error) {
        console.error('保存修改模式状态失败:', error)
      }
    },

    // 检查修改模式是否过期 (30分钟过期)
    checkModifyModeExpired() {
      try {
        const modifyTimestamp = uni.getStorageSync('professionalRegisterModifyTimestamp')
        if (modifyTimestamp) {
          const currentTime = new Date().getTime()
          const thirtyMinutes = 30 * 60 * 1000 // 30分钟的毫秒数

          // 如果修改模式已经存在超过30分钟，则自动重置
          if (currentTime - modifyTimestamp > thirtyMinutes) {
            console.log('修改模式已过期，自动重置')
            this.setModifyMode(false)
            return true
          }
        }
        return false
      } catch (error) {
        console.error('检查修改模式过期失败:', error)
        return false
      }
    },

    // 加载本地存储数据初始化状态
    loadFromStorage() {
      try {
        // 先检查修改模式是否过期
        this.checkModifyModeExpired()

        const step1Storage = uni.getStorageSync('professionalRegisterStep1')
        const step2Storage = uni.getStorageSync('professionalRegisterStep2')
        const step3Storage = uni.getStorageSync('professionalRegisterStep3')
        const step4Storage = uni.getStorageSync('professionalRegisterStep4')
        const modifyModeStorage = uni.getStorageSync('professionalRegisterModifyMode')

        if (step1Storage) this.step1Data = { ...this.step1Data, ...step1Storage }
        if (step2Storage) this.step2Data = { ...this.step2Data, ...step2Storage }
        if (step3Storage) this.step3Data = { ...this.step3Data, ...step3Storage }
        if (step4Storage) this.step4Data = { ...this.step4Data, ...step4Storage }
        if (modifyModeStorage !== '') this.isModifyMode = modifyModeStorage
      } catch (error) {
        console.error('加载注册数据失败:', error)
      }
    },

    // 保存数据到本地存储
    saveToStorage() {
      try {
        uni.setStorageSync('professionalRegisterStep1', this.step1Data)
        uni.setStorageSync('professionalRegisterStep2', this.step2Data)
        uni.setStorageSync('professionalRegisterStep3', this.step3Data)
        uni.setStorageSync('professionalRegisterStep4', this.step4Data)
        uni.setStorageSync('professionalRegisterModifyMode', this.isModifyMode)
      } catch (error) {
        console.error('保存注册数据失败:', error)
      }
    },

    // 清空数据
    clearData() {
      try {
        uni.removeStorageSync('professionalRegisterStep1')
        uni.removeStorageSync('professionalRegisterStep2')
        uni.removeStorageSync('professionalRegisterStep3')
        uni.removeStorageSync('professionalRegisterStep4')
        uni.removeStorageSync('professionalRegisterModifyMode')

        this.step1Data = {
          name: '',
          gender: '',
          phone: '',
          idCard: '',
          email: '',
          professionalTypes: [],
          customType: '',
          educationRanges: [],
          servicePrice: '',
          billingType: '',
          skillPrices: {},
          skillBillingTypes: {},
        }
        this.step2Data = {
          skillTags: [],
          serviceArea: '',
          serviceDescription: '',
          experience: '',
          description: '',
          selectedCity: '',
          selectedDistrict: '',
          selectedStreet: '',
        }
        this.step3Data = {
          idCardFront: '',
          idCardBack: '',
          qualification: '',
          education: '',
          professional: '',
          honor: '',
        }
        this.step4Data = {
          agreement: false,
          status: '',
        }
        this.isModifyMode = false
      } catch (error) {
        console.error('清空注册数据失败:', error)
      }
    },
  },
})
