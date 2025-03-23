<template>
  <view class="container">
    <page-header title="地址管理" />

    <view class="no-data">
      <text class="no-data-text">暂无数据~~</text>
    </view>

    <view class="add-button">
      <text class="button-text">添加地址</text>
    </view>
  </view>
</template>

<script setup>
import PageHeader from '../../components/PageHeader.vue'
</script>

<style scoped>
.container {
  min-height: 100vh;
  padding-bottom: 80px;
  background-color: #f8f8f8;
}

.no-data {
  display: flex;
  justify-content: center;
  padding: 30px 0;
  background-color: white;
}

.no-data-text {
  font-size: 14px;
  color: #999;
}

.add-button {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 15px;
  background-color: #5bbdca;
  border-radius: 4px;
}

.button-text {
  font-size: 16px;
  font-weight: 500;
  color: white;
}
</style>
