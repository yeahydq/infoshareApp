<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '系统公告' },
}
</route>

<template>
  <view class="container">
    <!-- <page-header title="系统公告" /> -->

    <view class="announcement-item">
      <view class="announcement-title">分销商城2023上线了</view>

      <view class="announcement-info">
        <view class="announcement-time">
          <text class="time-icon">⏱</text>
          <text class="time-text">2023/07/15 09:09</text>
        </view>

        <view class="view-count">
          <text class="view-icon">👁</text>
          <text class="view-count-text">6</text>
        </view>
      </view>

      <view class="divider"></view>
    </view>
  </view>
</template>

<script setup>
import PageHeader from '../../../components/PageHeader/PageHeader.vue'
</script>

<style>
@import './style.css';
</style>
