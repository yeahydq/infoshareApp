<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
}
</route>

<template>
  <view class="container">
    <!-- Header section -->
    <view class="header">
      <view class="title">首页</view>
      <view class="header-right">
        <view class="dots">•••</view>
        <view class="circle">◎</view>
      </view>
    </view>

    <!-- Search Bar -->
    <view class="search-bar">
      <view class="location">
        济南市
        <text class="down-arrow">▼</text>
      </view>
      <view class="search-input">
        <text>请输入关键词</text>
      </view>
      <view class="search-icon">🔍</view>
    </view>

    <!-- Banner -->
    <view class="banner">
      <image
        class="banner-img"
        src="https://source.unsplash.com/featured/?education,tutor"
        mode="aspectFill"
      />
      <view class="banner-text">
        <view class="banner-title">家教预约</view>
        <view class="banner-subtitle">小程序上线了</view>
      </view>
    </view>

    <!-- Category Grid - First Row -->
    <view class="category-grid">
      <view class="category-item">
        <view class="category-icon management">👨‍💼</view>
        <view class="category-label">管理学</view>
      </view>
      <view class="category-item">
        <view class="category-icon medicine">👨‍⚕️</view>
        <view class="category-label">医学</view>
      </view>
      <view class="category-item">
        <view class="category-icon agriculture">🌱</view>
        <view class="category-label">农学</view>
      </view>
      <view class="category-item">
        <view class="category-icon engineering">⚙️</view>
        <view class="category-label">工学</view>
      </view>
    </view>

    <!-- Category Grid - Second Row -->
    <view class="category-grid">
      <view class="category-item">
        <view class="category-icon science">🔬</view>
        <view class="category-label">理学</view>
      </view>
      <view class="category-item">
        <view class="category-icon history">📜</view>
        <view class="category-label">历史学</view>
      </view>
      <view class="category-item">
        <view class="category-icon literature">📚</view>
        <view class="category-label">文学</view>
      </view>
      <view class="category-item">
        <view class="category-icon more">➕</view>
        <view class="category-label">更多</view>
      </view>
    </view>

    <!-- Teacher Finder Section -->
    <view class="teacher-finder">
      <view class="finder-left">
        <image
          class="finder-img"
          src="https://source.unsplash.com/featured/?teacher,profile"
          mode="aspectFit"
        />
      </view>
      <view class="finder-content">
        <view class="finder-title">您想找什么样的老师？</view>
        <view class="finder-subtitle">根据您的需求，快速帮您找到优质老师</view>
      </view>
      <view class="finder-button" @click="navigateToFindTeachers">帮我找</view>
    </view>

    <!-- Service Options -->
    <view class="service-options">
      <view class="service-card online">
        <view class="service-title">在线辅导</view>
        <view class="service-subtitle">全国名师在线</view>
        <view class="service-button" @click="navigateToFindTeachers">选在线老师</view>
        <image
          class="service-img"
          src="https://source.unsplash.com/featured/?online,teaching"
          mode="aspectFit"
        />
      </view>

      <view class="service-card in-person">
        <view class="service-title">上门辅导</view>
        <view class="service-subtitle">名师面对面</view>
        <view class="service-button" @click="navigateToFindTeachers">选上门老师</view>
        <image
          class="service-img"
          src="https://source.unsplash.com/featured/?classroom,teaching"
          mode="aspectFit"
        />
      </view>
    </view>

    <!-- Featured Teachers Section -->
    <view class="featured-section">
      <view class="featured-header">
        <view class="featured-title">优选名师</view>
        <view class="featured-more" @click="navigateTorecommendedTeacher">更多 ></view>
      </view>

      <view class="featured-teachers">
        <!-- Teacher cards would go here -->
      </view>
    </view>

    <!-- Bottom Navigation
    <view class="bottom-nav">
      <view class="nav-item active">
        <view class="nav-icon">🏠</view>
        <text class="nav-text">首页</text>
      </view>
      <view class="nav-item" @click="navigateToFindTeachers">
        <view class="nav-icon">👨‍🏫</view>
        <text class="nav-text">找老师</text>
      </view>
      <view class="nav-item" @click="navigateToOrders">
        <view class="nav-icon">📝</view>
        <text class="nav-text">订单</text>
      </view>
      <view class="nav-item" @click="navigateToPersonalCenter">
        <view class="nav-icon">👤</view>
        <text class="nav-text">我的</text>
      </view>
    </view> -->
  </view>
</template>

<script setup>
// Component setup

// Add navigation functions
function navigateToFindTeachers() {
  console.log('Navigating to Find Teachers page')
  uni.redirectTo({
    url: '../find-teachers/index',
  })
}

function navigateToOrders() {
  console.log('Navigating to Orders page')
  // This page doesn't exist yet, so navigate to home
  window.location.href = '/pages/index/index'
}

function navigateToPersonalCenter() {
  console.log('Navigating to Personal Center page')
  window.location.href = '/pages/personal-center/index'
}

function navigateTorecommendedTeacher() {
  console.log('Navigating to Address Management page')
  uni.redirectTo({
    url: '../recommended-teacher/index',
  })
}
</script>

<style>
.container {
  padding: 0;
  background-color: #f8f8f8;
}
/* Header Styles */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  color: white;
  background-color: #5bbdca;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.header-right {
  display: flex;
  align-items: center;
}

.dots {
  margin-right: 15px;
  font-size: 20px;
}

.circle {
  font-size: 24px;
}
/* Search Bar Styles */
.search-bar {
  display: flex;
  align-items: center;
  height: 40px;
  margin: 10px 20px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 25px;
}

.location {
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-size: 14px;
  color: #333;
  border-right: 1px solid #eee;
}

.down-arrow {
  margin-left: 5px;
  font-size: 10px;
}

.search-input {
  flex: 1;
  padding: 0 10px;
  font-size: 14px;
  color: #999;
}

.search-icon {
  padding: 0 15px;
  font-size: 18px;
}
/* Banner Styles */
.banner {
  position: relative;
  height: 150px;
  margin: 10px 20px;
  overflow: hidden;
  background-color: #e6f7fb;
  border-radius: 10px;
}

.banner-img {
  width: 100%;
  height: 100%;
}

.banner-text {
  position: absolute;
  top: 20px;
  left: 20px;
  font-weight: bold;
  color: #215967;
}

.banner-title {
  font-size: 32px;
}

.banner-subtitle {
  margin-top: 5px;
  font-size: 24px;
}
/* Category Grid Styles */
.category-grid {
  display: flex;
  justify-content: space-between;
  margin: 10px 20px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 22%;
}

.category-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  margin-bottom: 5px;
  font-size: 24px;
  border-radius: 25px;
}

.management {
  background-color: #4a8af4;
}

.medicine {
  background-color: #5bbdca;
}

.agriculture {
  background-color: #9b7cf6;
}

.engineering {
  background-color: #f47a7a;
}

.science {
  background-color: #5ed3b9;
}

.history {
  background-color: #9b7cf6;
}

.literature {
  background-color: #f47a7a;
}

.more {
  background-color: #5bbdca;
}

.category-label {
  font-size: 14px;
  color: #333;
}
/* Teacher Finder Styles */
.teacher-finder {
  display: flex;
  align-items: center;
  padding: 15px;
  margin: 20px;
  background-color: #fff9e6;
  border-radius: 10px;
}

.finder-left {
  width: 60px;
}

.finder-img {
  width: 60px;
  height: 60px;
}

.finder-content {
  flex: 1;
  padding: 0 10px;
}

.finder-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.finder-subtitle {
  margin-top: 5px;
  font-size: 12px;
  color: #999;
}

.finder-button {
  padding: 5px 15px;
  font-size: 14px;
  color: white;
  background-color: #f47a7a;
  border-radius: 20px;
}
/* Service Options Styles */
.service-options {
  display: flex;
  justify-content: space-between;
  margin: 20px;
}

.service-card {
  position: relative;
  width: 48%;
  height: 120px;
  padding: 15px;
  border-radius: 10px;
}

.online {
  background-color: #f9e9e9;
}

.in-person {
  background-color: #e8effa;
}

.service-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.service-subtitle {
  margin-top: 5px;
  font-size: 12px;
  color: #999;
}

.service-button {
  display: inline-block;
  padding: 5px 15px;
  margin-top: 10px;
  font-size: 12px;
  color: #333;
  background-color: white;
  border-radius: 20px;
}

.service-img {
  position: absolute;
  right: 5px;
  bottom: 5px;
  width: 60px;
  height: 60px;
}
/* Featured Section Styles */
.featured-section {
  margin: 20px;
}

.featured-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.featured-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.featured-more {
  font-size: 12px;
  color: #999;
}

.featured-teachers {
  /* Teacher cards styling would go here */
}
/* Bottom Navigation Styles */
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
