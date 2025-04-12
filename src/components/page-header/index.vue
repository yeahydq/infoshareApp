<template>
  <view class="page-header">
    <view class="header-left" v-if="showBack" @tap="handleBack">
      <view class="back-icon">
        <view class="back-arrow"></view>
      </view>
      <text class="back-text">返回</text>
    </view>
    <view class="header-title">{{ title }}</view>
    <view class="header-right">
      <slot name="right"></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    title: {
      type: String,
      default: '',
    },
    showBack: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    handleBack() {
      this.$emit('back')
    },
  },
}
</script>

<style lang="scss">
.page-header {
  position: relative;
  z-index: 100;
  display: flex;
  align-items: center;
  height: 90rpx;
  padding: 0 30rpx;
  background-color: #ffffff;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

  .header-left {
    position: absolute;
    left: 30rpx;
    display: flex;
    align-items: center;

    .back-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50rpx;
      height: 50rpx;

      .back-arrow {
        width: 18rpx;
        height: 18rpx;
        border-bottom: 3rpx solid #333;
        border-left: 3rpx solid #333;
        transform: rotate(45deg);
      }
    }

    .back-text {
      font-size: 28rpx;
      color: #333;
    }
  }

  .header-title {
    flex: 1;
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
    text-align: center;
  }

  .header-right {
    position: absolute;
    right: 30rpx;
  }
}
</style>
