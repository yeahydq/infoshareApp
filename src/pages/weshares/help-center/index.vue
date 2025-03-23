<template>
  <view class="container">
    <page-header title="帮助中心" />

    <view class="tab-container">
      <view class="tab active">
        <text>使用手册</text>
      </view>
      <view class="tab">
        <text>常见问题</text>
      </view>
      <view class="tab">
        <text>升级说明</text>
      </view>
    </view>

    <view class="question-list">
      <view class="question-item">
        <text class="question-title">如何接收积分到账通知&收益到账通知?</text>
        <view class="question-meta">
          <view class="time">
            <text class="time-icon">⏱</text>
            <text class="time-text">2022/10/14 17:41</text>
          </view>
          <view class="view-count">
            <text class="view-icon">👁</text>
            <text class="view-number">6</text>
          </view>
        </view>
        <view class="divider" />
      </view>

      <view class="question-item">
        <text class="question-title">如何获取积分?</text>
        <view class="question-meta">
          <view class="time">
            <text class="time-icon">⏱</text>
            <text class="time-text">2022/10/14 17:29</text>
          </view>
          <view class="view-count">
            <text class="view-icon">👁</text>
            <text class="view-number">3</text>
          </view>
        </view>
        <view class="divider" />
      </view>
    </view>
  </view>
</template>

<script setup>
import PageHeader from '../../components/PageHeader.vue'
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f8f8f8;
}

.tab-container {
  display: flex;
  background-color: white;
  border-bottom: 1px solid #f0f0f0;
}

.tab {
  position: relative;
  display: flex;
  flex: 1;
  justify-content: center;
  padding: 15px 0;
  font-size: 16px;
  color: #666;
}

.active {
  font-weight: 500;
  color: #5bbdca;
}

.active::after {
  position: absolute;
  bottom: 0;
  left: 20%;
  width: 60%;
  height: 2px;
  content: '';
  background-color: #5bbdca;
}

.question-list {
  background-color: white;
}

.question-item {
  padding: 15px;
}

.question-title {
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
}

.question-meta {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #999;
}

.time,
.view-count {
  display: flex;
  align-items: center;
}

.time-icon,
.view-icon {
  margin-right: 5px;
}

.divider {
  height: 1px;
  margin-top: 15px;
  background-color: #f0f0f0;
}
</style>
