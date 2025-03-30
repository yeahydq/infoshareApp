import { defineStore } from 'pinia'

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
    },
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

    // 加载本地存储数据初始化状态
    loadFromStorage() {
      try {
        const step1Storage = uni.getStorageSync('professionalRegisterStep1')
        const step2Storage = uni.getStorageSync('professionalRegisterStep2')
        const step3Storage = uni.getStorageSync('professionalRegisterStep3')
        const step4Storage = uni.getStorageSync('professionalRegisterStep4')

        if (step1Storage) this.step1Data = { ...this.step1Data, ...step1Storage }
        if (step2Storage) this.step2Data = { ...this.step2Data, ...step2Storage }
        if (step3Storage) this.step3Data = { ...this.step3Data, ...step3Storage }
        if (step4Storage) this.step4Data = { ...this.step4Data, ...step4Storage }
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
        }
      } catch (error) {
        console.error('清空注册数据失败:', error)
      }
    },
  },
})
