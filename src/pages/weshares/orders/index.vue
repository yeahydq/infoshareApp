<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '订单' },
}
</route>
<template>
  <view class="container">
    <!-- <view class="header">
      <text class="header-title">订单</text>
      <view class="header-right">
        <text class="dots">•••</text>
        <text class="target-icon">○</text>
      </view>
    </view> -->

    <view class="tab-bar">
      <view class="tab-item active">
        <text class="tab-text">全部</text>
      </view>
      <view class="tab-item">
        <text class="tab-text">待确认</text>
      </view>
      <view class="tab-item">
        <text class="tab-text">待支付</text>
      </view>
      <view class="tab-item">
        <text class="tab-text">待上课</text>
      </view>
      <view class="tab-item">
        <text class="tab-text">待完成</text>
      </view>
      <view class="tab-item">
        <text class="tab-text">待评价</text>
      </view>
      <view class="tab-item">
        <text class="tab-text">售后</text>
      </view>
    </view>

    <view class="empty-state">
      <text class="empty-text">暂无订单~</text>
    </view>
  </view>
</template>

<script setup>
// Navigation functions
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
  margin-left: auto;
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

.tab-bar {
  display: flex;
  overflow-x: auto;
  background-color: white;
  border-bottom: 1px solid #f0f0f0;
}

.tab-item {
  position: relative;
  padding: 15px 10px;
  white-space: nowrap;
  cursor: pointer;
}

.tab-text {
  font-size: 14px;
  color: #666;
}

.active {
  color: #5bbdca;
}

.active .tab-text {
  font-weight: 500;
  color: #5bbdca;
}

.active::after {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  content: '';
  background-color: #5bbdca;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.empty-text {
  font-size: 14px;
  color: #999;
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
