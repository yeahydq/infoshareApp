<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '订单', navigationStyle: 'default' },
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

<style>
@import './style.css';
</style>
