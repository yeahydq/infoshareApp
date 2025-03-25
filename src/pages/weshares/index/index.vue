<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'default',
    navigationBarTitleText: '首页',
  },
}
</route>

<template>
  <!-- <view
    class="bg-white overflow-hidden pt-2 px-4"
    :style="{ marginTop: safeAreaInsets?.top + 'px' }"
  > -->
  <!-- <view class="container"> -->
  <!-- Header section -->
  <!-- <view class="header">
      <view class="title">首页</view>
      <view class="header-right">
        <view class="dots">•••</view>
        <view class="circle">◎</view>
      </view>
    </view> -->

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
    <image class="banner-img" src="/static/image/logo.png" mode="aspectFill" />
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
      <image class="finder-img" src="/static/image/logo.png" mode="aspectFit" />
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
      <image class="service-img" src="/static/image/logo.png" mode="aspectFit" />
    </view>

    <view class="service-card in-person">
      <view class="service-title">上门辅导</view>
      <view class="service-subtitle">名师面对面</view>
      <view class="service-button" @click="navigateToFindTeachers">选上门老师</view>
      <image class="service-img" src="/static/image/logo.png" mode="aspectFit" />
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
  <!-- </view> -->
</template>

<script setup>
const { safeAreaInsets } = uni.getSystemInfoSync()

// Component setup

// Add navigation functions
function navigateToFindTeachers() {
  console.log('Navigating to Find Teachers page')
  uni.navigateTo({
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
  uni.navigateTo({
    url: '../recommended-teacher/index',
  })
}
</script>

<style>
@import './index.css';
</style>
