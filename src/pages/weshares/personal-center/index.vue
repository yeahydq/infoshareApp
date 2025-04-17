<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '个人中心', navigationStyle: 'default' },
}
</route>
<template>
  <view class="container">
    <!-- 未登录界面 -->
    <view v-if="!userStore.isLogined" class="login-container">
      <view class="login-card">
        <image class="login-avatar" src="/static/image/logo.png"></image>
        <view class="login-title">欢迎使用</view>
        <view class="login-description">登录后体验更多功能</view>
        <button class="login-button" @click="handleLogin">立即登录</button>
      </view>
    </view>

    <!-- 已登录且用户类型不是unknown -->
    <view v-else-if="userStore.isFullAccessUser" class="container">
      <!-- 头部用户信息 -->
      <view class="header">
        <view class="profile-info">
          <view class="avatar">
            <image class="avatar-img" :src="avatarUrl" mode="aspectFill" />
          </view>
          <view class="user-info">
            <view class="head-box">
              <view @click="navigateToSettings">
                <view class="username">{{ nickName }}</view>
                <view class="user-tag">用户</view>
              </view>
            </view>
          </view>
        </view>
        <view class="edit-button" @click="navigateTo(NavigationRoutes.PERSONAL_INFO)">
          <text>编辑资料</text>
        </view>
      </view>

      <!-- 服务卡片 -->
      <view class="service-cards">
        <view class="service-card" @click="navigateTo(NavigationRoutes.FIND_PROFESSIONALS)">
          <view class="service-icon">🔍</view>
          <view class="service-text">帮我找</view>
          <view class="service-icon-arrow">></view>
        </view>
        <view class="service-card" @click="navigateToRegister">
          <view class="service-icon">👩‍🏫</view>
          <view class="service-text">{{ professionalButtonText }}</view>
          <view class="service-icon-arrow">></view>
        </view>
      </view>

      <!-- 全部功能区 -->
      <view class="section-title">
        <text>全部功能</text>
      </view>

      <view class="features-grid">
        <view class="feature-item" @click="navigateTo(NavigationRoutes.QR_CODE)">
          <view class="feature-icon">📋</view>
          <view class="feature-text">推广二维码</view>
        </view>
        <view class="feature-item" @click="navigateTo(NavigationRoutes.HELP_CENTER)">
          <view class="feature-icon">❓</view>
          <view class="feature-text">帮助中心</view>
        </view>
        <view class="feature-item" @click="navigateTo(NavigationRoutes.ADDRESS)">
          <view class="feature-icon">📍</view>
          <view class="feature-text">我的地址</view>
        </view>
        <view class="feature-item" @click="navigateTo(NavigationRoutes.ANNOUNCEMENT)">
          <view class="feature-icon">🔔</view>
          <view class="feature-text">系统公告</view>
        </view>
        <view class="feature-item" @click="navigateToTimeSchedule">
          <view class="feature-icon">⏰</view>
          <view class="feature-text">空闲时间</view>
        </view>
        <view class="feature-item" @click="navigateTo(NavigationRoutes.AI_ASSISTANT)">
          <view class="feature-icon">🤖</view>
          <view class="feature-text">AI助手</view>
        </view>
      </view>

      <!-- 信息链接 -->
      <view class="info-links">
        <view class="info-link" @click="navigateTo(NavigationRoutes.ABOUT_US)">
          <view class="info-icon">ℹ️</view>
          <view class="info-text">关于我们</view>
          <view class="info-arrow">></view>
        </view>
        <view class="info-link" @click="navigateTo(NavigationRoutes.SETTINGS)">
          <view class="info-icon">⚙️</view>
          <view class="info-text">系统设置</view>
          <view class="info-arrow">></view>
        </view>
        <view class="info-link" @tap="logout">
          <view class="info-icon">🚪</view>
          <view class="info-text">退出登录</view>
          <view class="info-arrow">></view>
        </view>
      </view>
    </view>

    <!-- 已登录但用户类型是unknown -->
    <view v-else class="limited-container">
      <view class="header">
        <view class="profile-info">
          <view class="avatar">
            <image class="avatar-img" :src="avatarUrl" mode="aspectFill" />
          </view>
          <view class="user-info">
            <view class="head-box">
              <view @click="navigateToSettings">
                <view class="username">{{ nickName }}</view>
                <view class="user-tag">用户</view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- <view class="limited-message">
        <view class="message-title">访问受限</view>
        <view class="message-content">您当前只能访问有限的功能</view>
      </view> -->

      <view class="limited-features">
        <view class="feature-item" @click="navigateTo(NavigationRoutes.AI_ASSISTANT)">
          <view class="feature-icon">🤖</view>
          <view class="feature-text">AI助手</view>
        </view>
      </view>

      <view class="info-links">
        <view class="info-link" @click="navigateTo(NavigationRoutes.ABOUT_US)">
          <view class="info-icon">ℹ️</view>
          <view class="info-text">关于我们</view>
          <view class="info-arrow">></view>
        </view>
        <view class="info-link" @tap="logout">
          <view class="info-icon">🚪</view>
          <view class="info-text">退出登录</view>
          <view class="info-arrow">></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useUserStore } from '@/store'
import { login } from '@/service/auth'
import { checkProfessionalStatus } from '@/service/professional'

const NavigationRoutes = {
  FIND_PROFESSIONALS: '../find-professionals/index',
  PROFESSIONAL_REGISTRATION: '../professional-registration/index',
  PERSONAL_INFO: '../personal-info/index',
  QR_CODE: '../qr-code/index',
  HELP_CENTER: '../help-center/index',
  ADDRESS: '../address-management/index',
  ANNOUNCEMENT: '../system-announcement/index',
  ABOUT_US: '../about-us/index',
  SETTINGS: '../system-settings/index',
  HOME: '../index/index',
  ORDERS: '../orders/index',
  AI_ASSISTANT: '../search/ai-assistant',
}

function navigateTo(route) {
  if (route) {
    console.log(`Navigating to ${route}`)
    uni.navigateTo({ url: route })
  } else {
    console.log('This page does not exist yet')
    uni.showToast({
      title: '该页面正在开发中',
      icon: 'none',
    })
  }
}

const userStore = useUserStore()
const nickName = computed(() => userStore.userInfo.nickName || '')
const avatarUrl = computed(() => userStore.userInfo.avatarUrl || '')

// 根据用户专业人员状态决定按钮文字
const professionalButtonText = computed(() => {
  const status = userStore.userInfo.professionalStatus
  if (!status) return '专业人员注册'

  switch (status) {
    case 'pending':
      return '审核中'
    case 'approved':
      return '专业人页面'
    case 'rejected':
      return '重新申请'
    default:
      return '专业人员注册'
  }
})

// 根据专业人员状态跳转到不同页面
const navigateToRegister = async () => {
  if (!userStore.isLogined) {
    // 未登录先登录
    handleLogin()
    return
  }

  try {
    // 显示加载中提示
    uni.showLoading({
      title: '加载中...',
    })

    // 从服务器获取最新状态
    const { result } = await uni.cloud.callFunction({
      name: 'profRegister',
      data: {
        action: 'checkApplication',
      },
    })

    uni.hideLoading()

    if (result && result.hasApplication) {
      // 更新本地状态
      const latestStatus = result.application.status
      console.log('从服务器获取的专业人士状态:', latestStatus)

      if (latestStatus !== userStore.userInfo.professionalStatus) {
        console.log('更新本地专业人士状态:', latestStatus)
        userStore.setUserInfo({
          ...userStore.userInfo,
          professionalStatus: latestStatus,
          updateTime: new Date().getTime(),
        })
      }

      // 如果有申请记录，直接导航到状态页面
      if (latestStatus === 'pending' || latestStatus === 'approved') {
        console.log('直接导航到专业人士状态页面')
        uni.navigateTo({ url: '../professional-registration/status' })
        return
      }
    }
  } catch (error) {
    uni.hideLoading()
    console.error('获取专业人士状态失败:', error)
  }

  // 如果没有申请记录或状态不是pending/approved，则导航到注册页面
  navigateTo(NavigationRoutes.PROFESSIONAL_REGISTRATION)
}

const navigateToSettings = () => {
  uni.navigateTo({
    url: '../account/setting',
  })
}

const logout = () => {
  uni.showModal({
    title: '确认退出当前账号？',
    success: (res) => {
      if (res.confirm) {
        userStore.clearUserInfo()
      }
    },
  })
}

const handleLogin = () => {
  login().catch((err) => {
    console.error('登录失败:', err)
    uni.showToast({
      title: '登录失败，请重试',
      icon: 'none',
      duration: 2000,
    })
  })
}

// 导航到时间安排页面
const navigateToTimeSchedule = () => {
  uni.navigateTo({
    url: '../time-schedule',
  })
}

// 页面加载时获取最新状态
onMounted(async () => {
  // 如果用户已登录，刷新专业人士状态
  if (userStore.isLogined) {
    try {
      await checkProfessionalStatus()
      // 通用方法会自动更新userStore，不需要额外处理
    } catch (error) {
      console.error('获取专业人士状态失败:', error)
    }
  }
})
</script>

<style>
@import './style.css';
/* 登录页面样式 */
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.login-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  padding: 40rpx;
  background-color: #ffffff;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.login-avatar {
  width: 150rpx;
  height: 150rpx;
  margin-bottom: 30rpx;
  border-radius: 75rpx;
}

.login-title {
  margin-bottom: 20rpx;
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
}

.login-description {
  margin-bottom: 40rpx;
  font-size: 28rpx;
  color: #666666;
  text-align: center;
}

.login-button {
  width: 80%;
  height: 80rpx;
  margin-top: 30rpx;
  font-size: 30rpx;
  line-height: 80rpx;
  color: #ffffff;
  text-align: center;
  background: linear-gradient(135deg, #4c84ff, #2b5cff);
  border-radius: 40rpx;
}
/* 有限访问样式 */
.limited-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.limited-message {
  padding: 30rpx;
  margin: 40rpx 30rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.message-title {
  margin-bottom: 16rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.message-content {
  font-size: 28rpx;
  color: #666666;
}

.limited-features {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 30rpx;
  margin: 0 20rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}
</style>
