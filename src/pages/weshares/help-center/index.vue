<route lang="json5">
{
  style: { navigationBarTitleText: '帮助中心' },
}
</route>

<template>
  <!-- <uni-nav-bar
    title="自定义导航栏"
    left-icon="left"
    @clickLeft="goBack"
    class="fixed w-full"
    :border="false"
    :status-bar="true"
  ></uni-nav-bar> -->
  <view class="container">
    <!-- <page-header title="帮助中心" /> -->

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
import PageHeader from '../../../components/PageHeader/PageHeader.vue'
const goBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
@import './index.css';
</style>
