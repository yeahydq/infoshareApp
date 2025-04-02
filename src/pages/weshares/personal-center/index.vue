<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '个人中心', navigationStyle: 'default' },
}
</route>
<template>
  <view class="container">
    <view class="header">
      <view class="profile-info">
        <view class="avatar">
          <image class="avatar-img" :src="avatarUrl" mode="aspectFill" />
        </view>
        <view class="user-info">
          <view v-if="userStore.userInfo?.openid" class="head-box">
            <view @click="navigateToSettings">
              <!-- <image class="photo" :src="avatarUrl"></image> -->
              <view class="username">{{ nickName }}</view>
              <view class="user-tag">用户</view>
              <!-- <view class="user-id">ID:HY000054 {{ userStore.userInfo?.id }}</view> -->
            </view>
          </view>
          <view v-else class="head-box" @click="handleLogin">
            <image class="photo" src="/static/image/logo.png"></image>
            <view class="name">点击登录</view>
          </view>
        </view>
      </view>
      <view class="edit-button" @click="navigateTo(NavigationRoutes.PERSONAL_INFO)">
        <text>编辑资料</text>
      </view>
    </view>

    <view class="service-cards">
      <view class="service-card" @click="navigateTo(NavigationRoutes.FIND_TEACHERS)">
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
    </view>

    <view class="info-links">
      <view class="info-link" @click="navigateTo(NavigationRoutes.ABOUT_US)">
        <view class="info-icon">ℹ️</view>
        <view class="info-text">关于我们</view>
        <view class="info-arrow">></view>
      </view>
      <!-- <view class="info-link" @click="navigateTo(NavigationRoutes.CUSTOMER_SERVICE)">
        <view class="info-icon">🎧</view>
        <view class="info-text">在线客服</view>
        <view class="info-arrow">></view>
      </view>
      <view class="info-link" @click="navigateTo(NavigationRoutes.CONTACT_US)">
        <view class="info-icon">📞</view>
        <view class="info-text">联系我们</view>
        <view class="info-arrow">></view>
      </view> -->
      <view class="info-link" @click="navigateTo(NavigationRoutes.SETTINGS)">
        <view class="info-icon">⚙️</view>
        <view class="info-text">系统设置</view>
        <view class="info-arrow">></view>
      </view>
      <view class="info-link" @tap="logout" v-if="hasLogin">
        <view class="info-icon">⚙️</view>
        <view class="info-text">退出登录</view>
        <view class="info-arrow">></view>
      </view>
    </view>
    <!-- 
    <view class="bottom-nav">
      <view class="nav-item" @click="navigateTo(NavigationRoutes.HOME)">
        <view class="nav-icon">🏠</view>
        <view class="nav-text">首页</view>
      </view>
      <view class="nav-item" @click="navigateTo(NavigationRoutes.FIND_TEACHERS)">
        <view class="nav-icon">👨‍🏫</view>
        <view class="nav-text">找老师</view>
      </view>
      <view class="nav-item" @click="navigateTo(NavigationRoutes.ORDERS)">
        <view class="nav-icon">📝</view>
        <view class="nav-text">订单</view>
      </view>
      <view class="nav-item active">
        <view class="nav-icon">👤</view>
        <view class="nav-text">我的</view>
      </view>
    </view> -->
  </view>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/store'
import { login } from '@/service/auth'

const NavigationRoutes = {
  FIND_TEACHERS: '../find-teachers/index',
  TEACHER_REGISTRATION: '../teacher-registration/index',
  PERSONAL_INFO: '../personal-info/index',
  QR_CODE: '../qr-code/index',
  HELP_CENTER: '../help-center/index',
  ADDRESS: '../address-management/index',
  ANNOUNCEMENT: '../system-announcement/index',
  ABOUT_US: null, // This page doesn't exist yet
  CUSTOMER_SERVICE: null, // This page doesn't exist yet
  CONTACT_US: null, // This page doesn't exist yet
  SETTINGS: '../system-settings/index',
  HOME: '../index/index',
  ORDERS: '../index/index', // This page doesn't exist yet, so navigate to home
  PROFESSIONAL_HOME: null, // This page doesn't exist yet
}

function navigateTo(route) {
  if (route) {
    console.log(`Navigating to ${route}`)
    uni.navigateTo({ url: route })
  } else {
    console.log('This page does not exist yet')
  }
}

const show = ref(false)
const userStore = useUserStore()
const hasLogin = computed(() => userStore.userInfo?.openid)
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
const navigateToRegister = () => {
  const status = userStore.userInfo.professionalStatus

  if (!hasLogin.value) {
    // 未登录先登录
    handleLogin()
    return
  }

  if (status === 'approved') {
    // 已通过审核，跳转到专业人员主页
    navigateTo(NavigationRoutes.PROFESSIONAL_HOME)
  } else {
    // 其他状态都跳转到注册/审核页面
    navigateTo(NavigationRoutes.TEACHER_REGISTRATION)
  }
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

const onLoad = () => {
  console.log('onload')
  // 删除本地缓存
  wx.removeStorageSync('userInfo')
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
</script>

<style>
@import './style.css';
</style>
