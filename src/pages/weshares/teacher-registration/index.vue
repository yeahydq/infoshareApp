<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '专业人士注册' },
}
</route>

<template>
  <view class="container">
    <registerPage1
      v-if="activeComponent === 'registerPage1'"
      @next="handleNext"
      @back="handleBack"
    ></registerPage1>
    <registerPage2
      v-if="activeComponent === 'registerPage2'"
      @next="handleNext"
      @back="handleBack"
    ></registerPage2>
    <registerPage3
      v-if="activeComponent === 'registerPage3'"
      @next="handleNext"
      @back="handleBack"
    ></registerPage3>
    <registerPage4
      v-if="activeComponent === 'registerPage4'"
      @next="handleNext"
      @back="handleBack"
    ></registerPage4>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRegisterStore } from '@/store/registerStore'
import { useUserStore } from '@/store'
import registerPage1 from './register-page1.vue'
import registerPage2 from './register-page2.vue'
import registerPage3 from './register-page3.vue'
import registerPage4 from './register-page4.vue'

// 获取注册状态存储
const registerStore = useRegisterStore()
const userStore = useUserStore()

// 使用字符串直接表示当前活动组件
const activeComponent = ref('registerPage1')
// 添加标志判断是否处于审核中状态
const isApplicationPending = ref(false)
// 存储已提交的专业人员数据
const professionalData = ref(null)

// 处理页面切换
const handleNext = (step) => {
  switch (step) {
    case 1:
      activeComponent.value = 'registerPage2'
      break
    case 2:
      activeComponent.value = 'registerPage3'
      break
    case 3:
      activeComponent.value = 'registerPage4'
      break
    case 4:
      // 完成注册，跳转到首页
      uni.switchTab({
        url: '/pages/index/index',
      })
      break
  }
}

// 处理返回
const handleBack = (step) => {
  switch (step) {
    case 2:
      activeComponent.value = 'registerPage1'
      break
    case 3:
      activeComponent.value = 'registerPage2'
      break
    case 4:
      activeComponent.value = 'registerPage3'
      break
  }
}

onMounted(async () => {
  console.log('Teacher registration index page mounted')

  // 检查用户是否已登录
  if (!userStore.userInfo?.openid) {
    uni.showToast({
      title: '请先登录后再进行专业人员注册',
      icon: 'none',
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
    return
  }

  // 检查用户专业人员状态（直接从userStore获取）
  if (userStore.userInfo.professionalStatus === 'pending') {
    // 如果已有审核中的申请，显示第四步（审核中状态）
    console.log('用户已有申请记录，状态为审核中')
    isApplicationPending.value = true
    activeComponent.value = 'registerPage4'

    // 获取专业人员详细信息
    try {
      uni.showLoading({
        title: '加载中...',
      })

      // 调用云函数获取详细信息
      const { result } = await uni.cloud.callFunction({
        name: 'profRegister',
        data: {
          action: 'checkApplication',
        },
      })

      uni.hideLoading()

      if (result && result.hasApplication) {
        professionalData.value = result.application

        // 将申请数据保存到registerStore，使register-page4可以访问
        if (professionalData.value) {
          const {
            name,
            gender,
            phone,
            email,
            idCard,
            professionalTypes,
            educationRanges,
            skillPrices,
            skillBillingTypes,
            skillTags,
            serviceArea,
            serviceDescription,
            experience,
            selectedCity,
            selectedDistrict,
            selectedStreet,
            idCardFront,
            idCardBack,
            qualification,
            education,
            professional,
            honor,
          } = professionalData.value

          // 更新RegisterStore中的数据
          registerStore.updateStep1({
            name,
            gender,
            phone,
            email,
            idCard,
            professionalTypes,
            educationRanges,
            skillPrices,
            skillBillingTypes,
          })

          registerStore.updateStep2({
            skillTags,
            serviceArea,
            serviceDescription,
            experience,
            selectedCity,
            selectedDistrict,
            selectedStreet,
          })

          registerStore.updateStep3({
            idCardFront,
            idCardBack,
            qualification,
            education,
            professional,
            honor,
          })

          // 设置申请状态为审核中
          registerStore.updateStep4({
            agreement: true,
            status: 'pending',
          })
        }
      }
    } catch (error) {
      uni.hideLoading()
      console.error('获取申请详情失败:', error)
    }
  } else {
    // 初始化全局状态存储
    registerStore.loadFromStorage()

    // 决定显示哪个页面
    try {
      const step1Data = registerStore.step1Data
      const step2Data = registerStore.step2Data
      const step3Data = registerStore.step3Data

      if (step3Data && step3Data.education) {
        // 如果有第三步数据，显示第四步
        activeComponent.value = 'registerPage4'
      } else if (step2Data && step2Data.serviceArea) {
        // 如果有第二步数据，显示第三步
        activeComponent.value = 'registerPage3'
      } else if (
        step1Data &&
        step1Data.professionalTypes &&
        step1Data.professionalTypes.length > 0
      ) {
        // 如果有第一步数据，显示第二步
        activeComponent.value = 'registerPage2'
      } else {
        // 默认显示第一步
        activeComponent.value = 'registerPage1'
      }
      console.log('Active component set to:', activeComponent.value)
    } catch (error) {
      console.error('Error initializing teacher registration:', error)
      // 出错时默认显示第一步
      activeComponent.value = 'registerPage1'
    }
  }
})
</script>

<style>
.container {
  width: 100%;
  height: 100vh;
  background-color: #f5f5f5;
}
</style>
