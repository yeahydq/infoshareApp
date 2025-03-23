<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '找老师' },
}
</route>

<template>
  <view class="container">
    <!-- <view class="header">
      <text class="header-title">找老师</text>
      <view class="header-right">
        <text class="dots">•••</text>
        <text class="target-icon">○</text>
      </view>
    </view> -->

    <view class="search-bar">
      <view class="location">
        济南市
        <text class="down-arrow">▼</text>
      </view>
      <view class="search-input">
        <text class="search-placeholder">请输入关键词</text>
      </view>
      <view class="search-button">🔍</view>
    </view>

    <view class="category-bar">
      <text class="category active">管理学</text>
      <text class="category">医学</text>
      <text class="category">农学</text>
      <text class="category">工学</text>
      <text class="category">理学</text>
      <text class="category">历史学</text>
      <text class="category">文学</text>
    </view>

    <view class="filter-bar">
      <view class="filter-item">
        <text>全部</text>
        <text class="down-arrow">▼</text>
      </view>
      <view class="filter-item">
        <text>评分</text>
        <text class="down-arrow">▼</text>
      </view>
      <view class="filter-item">
        <text>价格</text>
        <text class="down-arrow">▼</text>
      </view>
    </view>

    <view class="teacher-list">
      <view class="teacher-card" @click="navigateToTeacherDetails">
        <view class="teacher-level-tag">5A</view>
        <image
          class="teacher-avatar"
          src="https://source.unsplash.com/featured/?woman,portrait"
          mode="aspectFill"
        />
        <view class="teacher-info">
          <view class="teacher-name">
            <text>12</text>
            <text class="search-icon">🔍</text>
          </view>
          <view class="teacher-stats">
            <text>教龄10年|10|管理学|10</text>
          </view>
          <view class="teacher-rating">★★★★★</view>
        </view>
        <view class="teacher-price">¥0.00/小时</view>
        <view class="book-button">
          <text>去预约</text>
        </view>
      </view>

      <view class="teacher-card" @click="navigateToTeacherDetails">
        <view class="teacher-level-tag">5A</view>
        <image
          class="teacher-avatar"
          src="https://source.unsplash.com/featured/?man,portrait"
          mode="aspectFill"
        />
        <view class="teacher-info">
          <view class="teacher-name">
            <text>美羊羊</text>
            <text class="search-icon">🔍</text>
          </view>
          <view class="teacher-stats">
            <text>教龄1年|1|管理学|1</text>
          </view>
          <view class="teacher-rating">★★★★★</view>
        </view>
        <view class="teacher-price">¥11.00/小时</view>
        <view class="book-button">
          <text>去预约</text>
        </view>
      </view>

      <view class="teacher-card" @click="navigateToTeacherDetails">
        <view class="teacher-level-tag">5A</view>
        <image
          class="teacher-avatar"
          src="https://source.unsplash.com/featured/?woman,portrait,asian"
          mode="aspectFill"
        />
        <view class="teacher-info">
          <view class="teacher-name">
            <text>王心茹</text>
            <text class="search-icon">🔍</text>
          </view>
          <view class="teacher-stats">
            <text>教龄2年|1|管理学|22</text>
          </view>
          <view class="teacher-rating">★★★★★</view>
        </view>
        <view class="teacher-price">¥12.00/小时</view>
        <view class="book-button">
          <text>去预约</text>
        </view>
      </view>

      <view class="teacher-card" @click="navigateToTeacherDetails">
        <view class="teacher-level-tag">5A</view>
        <image
          class="teacher-avatar"
          src="https://source.unsplash.com/featured/?teacher,woman"
          mode="aspectFill"
        />
        <view class="teacher-info">
          <view class="teacher-name">
            <text>王教员</text>
            <text class="search-icon">🔍</text>
          </view>
          <view class="teacher-stats">
            <text>教龄3年|1|北京师范大学|管理学|硕士</text>
          </view>
          <view class="teacher-rating">★★★★★</view>
        </view>
        <view class="teacher-price-hidden"></view>
        <view class="book-button">
          <text>去预约</text>
        </view>
      </view>
    </view>

    <!-- <view class="bottom-nav">
      <view class="nav-item" @click="navigateToHome">
        <view class="nav-icon">🏠</view>
        <text class="nav-text">首页</text>
      </view>
      <view class="nav-item active">
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
// Navigation functions
function navigateToTeacherDetails() {
  console.log('Navigating to Teacher Details page')
  window.location.href = '/pages/teacher-details/index'
}

function navigateToHome() {
  console.log('Navigating to Home page')
  window.location.href = '/pages/index/index'
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
</script>

<style scoped>
.container {
  min-height: 100vh;
  padding-bottom: 60px;
  background-color: #f8f8f8;
}

.header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 15px;
  color: white;
  background-color: #5bbdca;
}

.header-title {
  position: absolute;
  left: 50%;
  font-size: 18px;
  font-weight: 500;
  transform: translateX(-50%);
}

.header-right {
  display: flex;
  align-items: center;
}

.dots {
  margin-right: 15px;
  font-size: 20px;
}

.target-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 24px;
  border: 2px solid white;
  border-radius: 50%;
}

.search-bar {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: #f8f8f8;
}

.location {
  display: flex;
  align-items: center;
  margin-right: 10px;
  font-size: 14px;
  color: #333;
}

.down-arrow {
  margin-left: 5px;
  font-size: 12px;
}

.search-input {
  display: flex;
  flex: 1;
  align-items: center;
  height: 36px;
  padding: 0 15px;
  margin-right: 10px;
  background-color: white;
  border-radius: 18px;
}

.search-placeholder {
  font-size: 14px;
  color: #999;
}

.search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-size: 18px;
  background-color: white;
  border-radius: 50%;
}

.category-bar {
  display: flex;
  padding: 10px 0;
  overflow-x: auto;
  white-space: nowrap;
  background-color: white;
  border-bottom: 1px solid #f0f0f0;
}

.category {
  display: inline-block;
  padding: 0 15px;
  font-size: 14px;
  color: #666;
}

.active {
  font-weight: 500;
  color: #5bbdca;
}

.filter-bar {
  display: flex;
  padding: 10px 0;
  background-color: white;
  border-bottom: 1px solid #f0f0f0;
}

.filter-item {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #666;
}

.teacher-list {
  padding: 15px;
}

.teacher-card {
  position: relative;
  display: flex;
  align-items: center;
  padding: 15px;
  margin-bottom: 15px;
  cursor: pointer;
  background-color: white;
  border-radius: 8px;
}

.teacher-level-tag {
  position: absolute;
  top: 15px;
  left: 15px;
  padding: 2px 6px;
  font-size: 12px;
  color: white;
  background-color: #ff9800;
  border-radius: 4px;
}

.teacher-avatar {
  width: 60px;
  height: 60px;
  margin-right: 15px;
  border-radius: 4px;
}

.teacher-info {
  flex: 1;
}

.teacher-name {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.search-icon {
  margin-left: 5px;
  font-size: 16px;
  color: #ff6b6b;
}

.teacher-stats {
  margin-bottom: 5px;
  font-size: 12px;
  color: #666;
}

.teacher-rating {
  font-size: 14px;
  color: #ffc107;
}

.teacher-price {
  margin-right: 15px;
  font-size: 14px;
  font-weight: 500;
  color: #ff5722;
}

.teacher-price-hidden {
  width: 70px;
  margin-right: 15px;
}

.book-button {
  padding: 5px 12px;
  font-size: 14px;
  color: white;
  background-color: #5bbdca;
  border-radius: 15px;
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
