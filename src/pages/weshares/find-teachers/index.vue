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
@import './index.css';
</style>
