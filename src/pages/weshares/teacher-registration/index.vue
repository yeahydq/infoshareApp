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
import registerPage1 from './register-page1.vue'
import registerPage2 from './register-page2.vue'
import registerPage3 from './register-page3.vue'
import registerPage4 from './register-page4.vue'

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

  // 初始化第一步数据（创建一个空对象）
  const initStep1Data = uni.getStorageSync('professionalRegisterStep1')
  if (!initStep1Data) {
    console.log('Initializing step 1 data with default values')
    uni.setStorageSync('professionalRegisterStep1', {
      name: '',
      phone: '',
      idCard: '',
      professionalType: '', // 移除默认值
    })
  }

  // 根据缓存决定显示哪个页面
  try {
    const step1Data = uni.getStorageSync('professionalRegisterStep1')
    const step2Data = uni.getStorageSync('professionalRegisterStep2')
    const step3Data = uni.getStorageSync('professionalRegisterStep3')

    if (!step1Data || !step2Data || !step3Data) {
      throw new Error('请先完成前三步信息填写')
    }

    if (step2Data && Object.keys(step2Data).length > 0) {
      // 如果有第二步数据，显示第三步
      activeComponent.value = 'registerPage3'
    } else if (step1Data && Object.keys(step1Data).length > 0) {
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
