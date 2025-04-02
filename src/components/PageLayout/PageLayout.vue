<template>
  <view class="page-container">
    <!-- 顶部标题 -->
    <view class="header">
      <text class="title">{{ title }}</text>
      <text class="subtitle">{{ subtitle }}</text>
    </view>

    <!-- 步骤指示器 -->
    <view class="step-indicator">
      <view v-for="(step, index) in steps" :key="index" class="step-wrapper">
        <view :class="['step', step.status]">{{ step.number }}</view>
        <view
          v-if="index < steps.length - 1"
          :class="['step-line', step.status === 'completed' ? 'completed' : '']"
        ></view>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <slot></slot>
    </view>

    <!-- 底部按钮 -->
    <view class="footer">
      <view class="btn-group">
        <button v-if="showBack" class="back-btn" @tap="handleBack">上一步</button>
        <button v-if="!hideNextBtn" class="next-btn" @tap="handleNext">
          {{ isLastStep ? '提交申请' : '下一步' }}
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Step {
  number: number
  status: 'active' | 'completed' | ''
}

const props = defineProps<{
  title: string
  subtitle: string
  steps: Step[]
  showBack?: boolean
  hideNextBtn?: boolean
}>()

const emit = defineEmits<{
  (e: 'next'): void
  (e: 'back', step: number): void
}>()

// 计算是否为最后一步
const isLastStep = computed(() => {
  return props.steps[props.steps.length - 1].status === 'active'
})

// 处理下一步
const handleNext = () => {
  emit('next')
}

// 处理返回
const handleBack = () => {
  const currentStep = props.steps.findIndex((step) => step.status === 'active')
  emit('back', currentStep + 1)
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  padding: 20rpx;
  padding-bottom: 120rpx;
  background-color: #f5f5f5;
}

.header {
  padding: 30rpx 0;
  text-align: center;

  .title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }

  .subtitle {
    margin-top: 10rpx;
    font-size: 24rpx;
    color: #999;
  }
}

.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 40rpx;
  margin: 20rpx 0 40rpx;

  .step-wrapper {
    display: flex;
    flex: 1;
    align-items: center;

    .step {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50rpx;
      height: 50rpx;
      font-size: 28rpx;
      color: #fff;
      background-color: #e0e0e0;
      border-radius: 50%;
      transition: all 0.3s ease;

      &.active {
        background-color: #07c160;
        box-shadow: 0 2rpx 8rpx rgba(7, 193, 96, 0.3);
        transform: scale(1.05);
      }

      &.completed {
        background-color: #07c160;
      }
    }

    .step-line {
      flex: 1;
      height: 2rpx;
      margin: 0 20rpx;
      background-color: #e0e0e0;
      transition: background-color 0.3s ease;

      &.completed {
        background-color: #07c160;
      }
    }

    &:last-child {
      .step-line {
        display: none;
      }
    }
  }
}

.content {
  padding: 30rpx;
  margin: 0 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
}

.footer {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  padding: 20rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

  .btn-group {
    display: flex;
    gap: 20rpx;
    padding: 0 20rpx;
  }

  .back-btn,
  .next-btn {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    height: 80rpx;
    font-size: 32rpx;
    border-radius: 40rpx;
  }

  .back-btn {
    color: #666;
    background-color: #f0f0f0;
    border: 1px solid #ddd;
  }

  .next-btn {
    color: #fff;
    background-color: #07c160;

    &[disabled] {
      background-color: #ccc;
    }
  }
}
</style>
