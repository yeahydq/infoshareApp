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
import registerPage1 from './register-page1.vue'
import registerPage2 from './register-page2.vue'
import registerPage3 from './register-page3.vue'
import registerPage4 from './register-page4.vue'

// 获取注册状态存储
const registerStore = useRegisterStore()

// 使用字符串直接表示当前活动组件
const activeComponent = ref('registerPage1')

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

onMounted(() => {
  console.log('Teacher registration index page mounted')

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
    } else if (step1Data && step1Data.professionalTypes && step1Data.professionalTypes.length > 0) {
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
})
</script>

<style>
.container {
  width: 100%;
  height: 100vh;
  background-color: #f5f5f5;
}
</style>
