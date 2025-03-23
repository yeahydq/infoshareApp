<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '系统设置' },
}
</route>

<template>
  <view class="container">
    <page-header title="系统设置"></page-header>

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

<script setup>
import PageHeader from '../../components/PageHeader.vue'
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f8f8f8;
}

.settings-list {
  margin-top: 20px;
  background-color: white;
}

.settings-item {
  padding: 15px;
  font-size: 16px;
}

.item-text {
  color: #333;
}

.divider {
  height: 1px;
  margin-left: 15px;
  background-color: #f0f0f0;
}
</style>
