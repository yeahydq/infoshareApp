<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '我的' },
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
      <view class="edit-button" @click="navigateToPersonalInfo">
        <text>编辑资料</text>
      </view>
    </view>

    <view class="service-cards">
      <view class="service-card" @click="navigateToFindTeachers">
        <view class="service-icon">🔍</view>
        <view class="service-text">帮我找</view>
        <view class="service-icon-arrow">></view>
      </view>
      <view class="service-card" @click="navigateToTeacherRegistration">
        <view class="service-icon">👩‍🏫</view>
        <view class="service-text">教员入驻</view>
        <view class="service-icon-arrow">></view>
      </view>
    </view>

    <view class="section-title">
      <text>全部功能</text>
    </view>

    <view class="features-grid">
      <view class="feature-item" @click="navigateToQrCode">
        <view class="feature-icon">📋</view>
        <view class="feature-text">推广二维码</view>
      </view>
      <view class="feature-item" @click="navigateToHelpCenter">
        <view class="feature-icon">❓</view>
        <view class="feature-text">帮助中心</view>
      </view>
      <view class="feature-item" @click="navigateToAddress">
        <view class="feature-icon">📍</view>
        <view class="feature-text">我的地址</view>
      </view>
      <view class="feature-item" @click="navigateToAnnouncement">
        <view class="feature-icon">🔔</view>
        <view class="feature-text">系统公告</view>
      </view>
    </view>

    <view class="info-links">
      <view class="info-link" @click="navigateToAboutUs">
        <view class="info-icon">ℹ️</view>
        <view class="info-text">关于我们</view>
        <view class="info-arrow">></view>
      </view>
      <view class="info-link" @click="navigateToCustomerService">
        <view class="info-icon">🎧</view>
        <view class="info-text">在线客服</view>
        <view class="info-arrow">></view>
      </view>
      <view class="info-link" @click="navigateToContactUs">
        <view class="info-icon">📞</view>
        <view class="info-text">联系我们</view>
        <view class="info-arrow">></view>
      </view>
      <view class="info-link" @click="navigateToSettings">
        <view class="info-icon">⚙️</view>
        <view class="info-text">系统设置</view>
        <view class="info-arrow">></view>
      </view>
    </view>
    <!-- 
    <view class="bottom-nav">
      <view class="nav-item" @click="navigateToHome">
        <view class="nav-icon">🏠</view>
        <view class="nav-text">首页</view>
      </view>
      <view class="nav-item" @click="navigateToFindTeachers">
        <view class="nav-icon">👨‍🏫</view>
        <view class="nav-text">找老师</view>
      </view>
      <view class="nav-item" @click="navigateToOrders">
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
// Navigation functions
function navigateToFindTeachers() {
  console.log('Navigating to Find Teachers page')
  uni.redirectTo({
    url: '../find-teachers/index',
  })
}

function navigateToTeacherRegistration() {
  console.log('Navigating to Teacher Registration page')
  uni.redirectTo({
    url: '../teacher-registration/index',
  })
}

function navigateToPersonalInfo() {
  console.log('Navigating to Teacher Registration page')
  uni.redirectTo({
    url: '../personal-info/index',
  })
}

function navigateToQrCode() {
  console.log('Navigating to QR Code page')
  uni.redirectTo({
    url: '../qr-code/index',
  })
}

function navigateToHelpCenter() {
  console.log('Navigating to Help Center page')
  uni.redirectTo({
    url: '../help-center/index',
  })
}

function navigateToAddress() {
  console.log('Navigating to Address Management page')
  uni.redirectTo({
    url: '../address-management/index',
  })
}

function navigateToAnnouncement() {
  console.log('Navigating to System Announcement page')
  uni.redirectTo({
    url: '../system-announcement/index',
  })
}

function navigateToAboutUs() {
  console.log('Navigating to About Us page')
  // This page doesn't exist yet, so just log the action
}

function navigateToCustomerService() {
  console.log('Navigating to Customer Service page')
  // This page doesn't exist yet, so just log the action
}

function navigateToContactUs() {
  console.log('Navigating to Contact Us page')
  // This page doesn't exist yet, so just log the action
}

function navigateToSettings() {
  console.log('Navigating to Settings page')
  uni.redirectTo({
    url: '../system-settings/index',
  })
}

function navigateToHome() {
  console.log('Navigating to Home page')
  uni.redirectTo({
    url: '../index/index',
  })
}

function navigateToOrders() {
  console.log('Navigating to Orders page')
  // This page doesn't exist yet, so navigate to home
  uni.redirectTo({
    url: '../index/index',
  })
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  padding-bottom: 60px;
  background-color: #f8f8f8;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 15px;
  color: white;
  background-color: #5bbdca;
}

.profile-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 60px;
  height: 60px;
  margin-right: 15px;
  overflow: hidden;
  border-radius: 50%;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.username {
  margin-bottom: 5px;
  font-size: 18px;
  font-weight: 500;
}

.user-tag {
  display: inline-block;
  padding: 2px 8px;
  margin-bottom: 5px;
  font-size: 12px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
}

.user-id {
  font-size: 12px;
  opacity: 0.8;
}

.edit-button {
  padding: 5px 12px;
  font-size: 14px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
}

.service-cards {
  display: flex;
  padding: 15px;
  margin: 10px 0;
  background-color: white;
  border-radius: 8px;
}

.service-card {
  position: relative;
  flex: 1;
  padding: 10px;
  margin: 0 5px;
  cursor: pointer;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.service-icon {
  margin-bottom: 5px;
  font-size: 18px;
}

.service-text {
  font-size: 14px;
  color: #333;
}

.service-icon-arrow {
  position: absolute;
  top: 50%;
  right: 10px;
  color: #ccc;
  transform: translateY(-50%);
}

.section-title {
  padding: 15px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.features-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  background-color: white;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25%;
  padding: 15px 0;
  cursor: pointer;
}

.feature-icon {
  margin-bottom: 8px;
  font-size: 24px;
}

.feature-text {
  font-size: 12px;
  color: #666;
}

.info-links {
  margin-top: 10px;
  background-color: white;
}

.info-link {
  display: flex;
  align-items: center;
  padding: 15px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
}

.info-icon {
  margin-right: 10px;
  font-size: 18px;
}

.info-text {
  flex: 1;
  font-size: 16px;
  color: #333;
}

.info-arrow {
  color: #ccc;
}

.bottom-nav {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  height: 50px;
  background-color: white;
  border-top: 1px solid #f0f0f0;
}

.nav-item {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.nav-icon {
  margin-bottom: 2px;
  font-size: 20px;
  color: #999;
}

.nav-text {
  font-size: 12px;
  color: #999;
}

.active .nav-icon,
.active .nav-text {
  color: #5bbdca;
}
</style>
