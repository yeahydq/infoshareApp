<template>
  <!-- <view class="header">
    <view class="back-button">
      <text class="back-icon">返回</text>
    </view>
    <view class="title">{{ title }}</view>
    <view class="header-right">
      <view class="dots">•••</view>
      <view class="target-icon">○</view>
    </view>
  </view> -->
  <view></view>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<style scoped>
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

.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.back-icon {
  font-size: 24px;
  font-weight: bold;
}

.title {
  position: absolute;
  left: 50%;
  font-size: 18px;
  font-weight: 500;
  transform: translateX(-50%);
}

.header-right {
  display: flex;
  align-items: center;
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
</style>
