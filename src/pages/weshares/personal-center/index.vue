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
          <image
            class="avatar-img"
            src="https://source.unsplash.com/featured/?eiffel,tower"
            mode="aspectFill"
          />
        </view>
        <view class="user-info">
          <view class="username">Dick</view>
          <view class="user-tag">用户</view>
          <view class="user-id">ID:HY000054</view>
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
      <view class="service-card" @click="navigateTo(NavigationRoutes.TEACHER_REGISTRATION)">
        <view class="service-icon">👩‍🏫</view>
        <view class="service-text">教员入驻</view>
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
    </view>

    <view class="info-links">
      <view class="info-link" @click="navigateTo(NavigationRoutes.ABOUT_US)">
        <view class="info-icon">ℹ️</view>
        <view class="info-text">关于我们</view>
        <view class="info-arrow">></view>
      </view>
      <view class="info-link" @click="navigateTo(NavigationRoutes.CUSTOMER_SERVICE)">
        <view class="info-icon">🎧</view>
        <view class="info-text">在线客服</view>
        <view class="info-arrow">></view>
      </view>
      <view class="info-link" @click="navigateTo(NavigationRoutes.CONTACT_US)">
        <view class="info-icon">📞</view>
        <view class="info-text">联系我们</view>
        <view class="info-arrow">></view>
      </view>
      <view class="info-link" @click="navigateTo(NavigationRoutes.SETTINGS)">
        <view class="info-icon">⚙️</view>
        <view class="info-text">系统设置</view>
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

<script setup>
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
}

function navigateTo(route) {
  if (route) {
    console.log(`Navigating to ${route}`)
    uni.navigateTo({ url: route })
  } else {
    console.log('This page does not exist yet')
  }
}
</script>

<style>
@import './style.css';
</style>
