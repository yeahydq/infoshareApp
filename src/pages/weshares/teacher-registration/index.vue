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
      @editFromReview="handleEditFromReview"
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
      // 如果是修改模式，需要在进入第4页前设置好标记
      if (registerStore.isModifyMode) {
        console.log('修改模式：从第3页进入第4页，需确认修改')
      }
      activeComponent.value = 'registerPage4'
      break
    case 4:
      // 完成注册，跳转到状态页
      uni.redirectTo({
        url: '/pages/weshares/teacher-registration/status',
      })
      break
  }
}

// 处理返回
const handleBack = (step) => {
  console.log('返回上一步:', step)

  // 特殊处理：如果是从第1步返回，返回到上一级页面
  if (step === 1) {
    uni.navigateBack()
    return
  }

  // 从step3返回step2，或从step4返回step3
  if (step > 1) {
    // 如果是修改模式，需要特殊处理返回逻辑
    if (registerStore.isModifyMode) {
      // 如果从第4步返回，应该回到第3步
      if (step === 4) {
        console.log('修改模式：从第4步返回到第3步')
        activeComponent.value = 'registerPage3'
        return
      }
      // 如果从第3步返回，应该回到第2步
      else if (step === 3) {
        console.log('修改模式：从第3步返回到第2步')
        activeComponent.value = 'registerPage2'
        return
      }
      // 如果从第2步返回，应该回到第1步
      else if (step === 2) {
        console.log('修改模式：从第2步返回到第1步')
        activeComponent.value = 'registerPage1'
        return
      }
    }

    // 非修改模式下的正常返回逻辑
    activeComponent.value = `registerPage${step - 1}`
  }
}

// 处理从审核状态页面点击修改资料的事件
const handleEditFromReview = (step) => {
  console.log('从审核状态页面点击修改资料，当前步骤:', step)

  // 确保处于修改模式
  if (!registerStore.isModifyMode) {
    registerStore.setModifyMode(true)
  }

  // 直接前往第3页进行修改
  activeComponent.value = 'registerPage3'

  // 显示成功提示
  uni.showToast({
    title: '请修改您的资料',
    icon: 'none',
    duration: 1500,
  })
}

// 完全替换onMounted函数
onMounted(async () => {
  console.log('Teacher registration index page mounted')

  // 检查修改模式是否过期
  registerStore.checkModifyModeExpired()

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

  // 显示加载提示
  uni.showLoading({
    title: '加载中...',
  })

  try {
    console.log('当前用户状态:', userStore.userInfo)

    // 先调用云函数检查用户是否有申请记录，不依赖本地状态
    const { result } = await uni.cloud.callFunction({
      name: 'profRegister',
      data: {
        action: 'checkApplication',
      },
    })

    uni.hideLoading()

    if (result && result.hasApplication) {
      // 用户有申请记录，检查状态和修改模式
      const appStatus = result.application.status
      console.log('云端查询：用户有申请记录，状态为:', appStatus)

      // 获取URL参数，检查是否携带step参数
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      const options = currentPage.options || {}
      const hasStepParam = !!options.step

      // 如果是已通过审核的状态，且不是从修改资料按钮点击过来的（没有step参数）
      // 直接跳转到状态页面
      if (appStatus === 'approved' && !hasStepParam) {
        console.log('已通过审核状态，直接跳转到状态页面')
        registerStore.setModifyMode(false) // 重置修改模式
        uni.redirectTo({
          url: '/pages/weshares/teacher-registration/status',
        })
        return
      }

      // 如果是处于修改模式，且是通过修改资料按钮点击进来的
      if (registerStore.isModifyMode && hasStepParam) {
        console.log('修改模式：从状态页进入，显示第4页')
        // 如果是修改模式，直接显示第4页
        activeComponent.value = 'registerPage4'
      } else {
        // 非修改模式，跳转到状态页
        console.log('非修改模式，跳转到状态页')
        uni.redirectTo({
          url: '/pages/weshares/teacher-registration/status',
        })
      }
    } else {
      // 云端无申请记录，用户需要注册
      console.log('云端查询：用户无申请记录，需要注册')

      // 重置本地状态（如果本地状态不正确）
      if (
        userStore.userInfo.professionalStatus === 'pending' ||
        userStore.userInfo.professionalId
      ) {
        console.log('本地状态不正确，重置用户专业人员状态')
        userStore.setUserInfo({
          ...userStore.userInfo,
          professionalStatus: null,
          professionalId: null,
          updateTime: new Date().getTime(),
        })
      }

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
  } catch (error) {
    uni.hideLoading()
    console.error('检查专业人员申请状态失败:', error)

    // 出错时，尝试使用本地状态
    if (userStore.userInfo.professionalStatus === 'pending' || userStore.userInfo.professionalId) {
      // 检查是否处于修改模式
      if (registerStore.isModifyMode) {
        console.log('修改模式：从状态页进入，显示第4页')
        activeComponent.value = 'registerPage4'
      } else {
        console.log('使用本地状态: 用户已有申请记录')
        uni.redirectTo({
          url: '/pages/weshares/teacher-registration/status',
        })
      }
    } else {
      // 显示第一步
      console.log('使用本地状态: 用户无申请记录')
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
