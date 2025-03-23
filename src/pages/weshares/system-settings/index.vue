<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '系统设置' },
}
</route>

<template>
  <view class="container">
    <!-- <page-header title="系统设置"></page-header> -->

    <view class="settings-list">
      <view class="settings-item">
        <text class="item-text">编辑信息</text>
      </view>
      <view class="divider"></view>

      <view class="settings-item">
        <text class="item-text">清空缓存</text>
      </view>
      <view class="divider"></view>

      <view class="settings-item">
        <text class="item-text">管理授权</text>
      </view>
    </view>
  </view>
</template>

<script setup></script>

<style>
@import './style.css';
</style>
