<template>
  <view class="success-container">
    <view class="success-content">
      <text class="success-title">提交成功</text>
      <text class="success-desc">您的入驻申请已提交，我们将在1-3个工作日内完成审核</text>
    </view>

    <view class="info-card">
      <view class="card-title">审核说明</view>
      <view class="card-content">
        <view class="info-item">
          <text class="info-label">审核时间</text>
          <text class="info-value">1-3个工作日</text>
        </view>
        <view class="info-item">
          <text class="info-label">审核结果</text>
          <text class="info-value">将通过短信和站内信通知</text>
        </view>
        <view class="info-item">
          <text class="info-label">咨询电话</text>
          <text class="info-value">400-123-4567</text>
        </view>
      </view>
    </view>

    <view class="action-buttons">
      <button class="action-btn" @tap="handleViewStatus">查看审核状态</button>
      <button class="action-btn outline" @tap="handleBackHome">返回首页</button>
    </view>
  </view>
</template>

<script setup lang="ts">
// 查看审核状态
const handleViewStatus = () => {
  uni.redirectTo({
    url: '/pages/weshares/professional-registration/index',
  })
}

// 返回首页
const handleBackHome = () => {
  uni.switchTab({
    url: '/pages/weshares/index',
  })
}
</script>

<style lang="scss" scoped>
.success-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 40rpx;
  background-color: #f5f5f5;
}

.success-content {
  padding: 40rpx;
  margin-bottom: 30rpx;
  text-align: center;
  background-color: #fff;
  border-radius: 12rpx;

  .success-icon {
    width: 160rpx;
    height: 160rpx;
    margin-bottom: 20rpx;
  }

  .success-title {
    display: block;
    margin-bottom: 16rpx;
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }

  .success-desc {
    font-size: 28rpx;
    line-height: 1.6;
    color: #666;
  }
}

.info-card {
  width: 100%;
  padding: 30rpx;
  margin-bottom: 40rpx;
  background-color: #fff;
  border-radius: 12rpx;

  .card-title {
    margin-bottom: 20rpx;
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }

  .card-content {
    .info-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .info-label {
        font-size: 28rpx;
        color: #666;
      }

      .info-value {
        font-size: 28rpx;
        color: #333;
      }
    }
  }
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  width: 100%;

  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80rpx;
    font-size: 32rpx;
    border-radius: 40rpx;

    &.outline {
      color: #007aff;
      background-color: #fff;
      border: 2rpx solid #007aff;
    }
  }
}
</style>
