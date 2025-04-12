<template>
  <view class="container">
    <!-- 顶部状态栏 -->
    <view
      class="status-banner"
      :class="{ approved: userStore.userInfo.professionalStatus === 'approved' }"
    >
      <view class="status-icon">
        <template v-if="userStore.userInfo.professionalStatus === 'approved'">✅</template>
        <template v-else>⏳</template>
      </view>
      <view class="status-info">
        <view class="status-title">
          <template v-if="userStore.userInfo.professionalStatus === 'approved'">
            您的申请已通过审核
          </template>
          <template v-else>您的申请正在审核中</template>
        </view>
        <view class="status-desc">
          <template v-if="userStore.userInfo.professionalStatus === 'approved'">
            您可以修改个人资料和服务信息
          </template>
          <template v-else>我们的工作人员正在审核您的资料，请耐心等待</template>
        </view>
      </view>
    </view>

    <!-- 审核进度 -->
    <view class="review-progress">
      <view class="progress-step active">
        <view class="step-dot"></view>
        <view class="step-info">
          <view class="step-title">提交申请</view>
          <view class="step-time">已完成</view>
        </view>
      </view>
      <view class="progress-step active">
        <view class="step-dot"></view>
        <view class="step-info">
          <view class="step-title">资料审核中</view>
          <view class="step-time">
            <template v-if="userStore.userInfo.professionalStatus === 'approved'">已完成</template>
            <template v-else>处理中</template>
          </view>
        </view>
      </view>
      <view
        class="progress-step"
        :class="{ active: userStore.userInfo.professionalStatus === 'approved' }"
      >
        <view class="step-dot"></view>
        <view class="step-info">
          <view class="step-title">审核完成</view>
          <view class="step-time">
            <template v-if="userStore.userInfo.professionalStatus === 'approved'">已完成</template>
            <template v-else>待完成</template>
          </view>
        </view>
      </view>
    </view>

    <!-- 审核提示 -->
    <view class="review-tips">
      <template v-if="userStore.userInfo.professionalStatus === 'approved'">
        <text>您的申请已经通过审核，可以开始接单了</text>
        <text>您可以随时修改个人资料和服务信息</text>
      </template>
      <template v-else>
        <text>我们会在1-3个工作日内完成审核，请耐心等待</text>
        <text>审核结果将通过短信通知您，请保持手机畅通</text>
      </template>
    </view>

    <!-- 修改资料按钮 -->
    <view class="action-buttons">
      <button class="modify-btn" @click="handleModify">
        <template v-if="userStore.userInfo.professionalStatus === 'approved'">
          修改个人资料
        </template>
        <template v-else>修改资料</template>
      </button>
      <button class="back-btn" @click="handleBack">返回首页</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/store'
import { useRegisterStore } from '@/store/registerStore'

const userStore = useUserStore()
const registerStore = useRegisterStore()

// 处理修改资料
const handleModify = async () => {
  console.log('点击修改资料')

  try {
    // 显示加载提示
    uni.showLoading({
      title: '加载中...',
    })

    // 调用云函数获取申请信息
    const { result } = await uni.cloud.callFunction({
      name: 'profRegister',
      data: {
        action: 'getApplication',
      },
    })

    if (result.success && result.application) {
      const application = result.application

      // 更新registerStore中的数据
      registerStore.updateStep1({
        name: application.name,
        gender: application.gender,
        phone: application.phone,
        email: application.email,
        idCard: application.idCard,
        professionalTypes: application.professionalTypes,
        educationRanges: application.educationRanges,
        skillPrices: application.skillPrices,
        skillBillingTypes: application.skillBillingTypes,
      })

      registerStore.updateStep2({
        skillTags: application.skillTags,
        serviceArea: application.serviceArea,
        serviceDescription: application.serviceDescription,
        experience: application.experience,
        selectedCity: application.selectedCity,
        selectedDistrict: application.selectedDistrict,
        selectedStreet: application.selectedStreet,
      })

      registerStore.updateStep3({
        idCardFront: application.idCardFront,
        idCardBack: application.idCardBack,
        qualification: application.qualification,
        education: application.education,
        professional: application.professional,
        honor: application.honor,
      })

      // 保存到本地存储
      registerStore.saveToStorage()

      // 设置为修改模式
      registerStore.setModifyMode(true)

      // 显示提示消息
      uni.showToast({
        title: '正在进入修改模式...',
        icon: 'none',
        duration: 1500,
      })

      // 跳转到第四页（预览页）
      uni.navigateTo({
        url: '/pages/weshares/professional-registration/index?step=4&from=status',
      })
    } else {
      throw new Error(result.message || '获取申请信息失败')
    }
  } catch (error: any) {
    uni.hideLoading()
    uni.showToast({
      title: error.message || '加载失败，请重试',
      icon: 'none',
    })
  }
}

// 处理返回首页
const handleBack = () => {
  uni.switchTab({
    url: '/pages/weshares/index/index',
  })
}

// 页面加载时检查状态
onMounted(async () => {
  // 重置修改模式状态
  registerStore.setModifyMode(false)

  // 检查用户是否已登录
  if (!userStore.userInfo?.openid) {
    uni.showToast({
      title: '请先登录',
      icon: 'none',
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
    return
  }

  // 显示加载状态
  uni.showLoading({
    title: '加载中...',
  })

  try {
    // 从服务器获取最新的专业人士状态
    const { result } = await uni.cloud.callFunction({
      name: 'profRegister',
      data: {
        action: 'checkApplication',
      },
    })

    uni.hideLoading()

    if (result && result.hasApplication) {
      // 获取到最新状态，更新本地用户状态
      const latestStatus = result.application.status
      console.log('从服务器获取的专业人士状态:', latestStatus)

      // 如果服务器状态与本地状态不同，更新本地状态
      if (latestStatus !== userStore.userInfo.professionalStatus) {
        console.log('更新本地状态:', latestStatus)
        userStore.setUserInfo({
          ...userStore.userInfo,
          professionalStatus: latestStatus,
          updateTime: new Date().getTime(),
        })
      }

      // 如果没有状态或状态不是pending或approved，则显示提示并返回
      if (!latestStatus || (latestStatus !== 'pending' && latestStatus !== 'approved')) {
        uni.showToast({
          title: '您没有审核中或已通过的申请',
          icon: 'none',
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
    } else {
      // 没有申请记录
      uni.showToast({
        title: '您没有申请记录',
        icon: 'none',
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    }
  } catch (error) {
    uni.hideLoading()
    console.error('获取专业人士状态失败:', error)

    // 发生错误时，使用本地状态进行检查
    if (
      !userStore.userInfo.professionalStatus ||
      (userStore.userInfo.professionalStatus !== 'pending' &&
        userStore.userInfo.professionalStatus !== 'approved')
    ) {
      uni.showToast({
        title: '您没有申请记录',
        icon: 'none',
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    }
  }
})
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  padding: 30rpx;
  background-color: #f5f5f5;
}

.status-banner {
  display: flex;
  align-items: center;
  padding: 30rpx;
  margin-bottom: 30rpx;
  background: linear-gradient(45deg, #fdf0cc, #f7e8b0);
  border-radius: 12rpx;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);

  &.approved {
    background: linear-gradient(45deg, #d4f8d4, #c1e8c1);
  }

  .status-icon {
    margin-right: 20rpx;
    font-size: 64rpx;
    color: #f1c40f;
  }

  .status-info {
    flex: 1;

    .status-title {
      margin-bottom: 6rpx;
      font-size: 32rpx;
      font-weight: 600;
      color: #7d6608;
    }

    .status-desc {
      font-size: 24rpx;
      color: #8c7811;
    }
  }
}

.review-progress {
  padding: 30rpx;
  margin-bottom: 30rpx;
  background-color: #fff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

  .progress-step {
    position: relative;
    display: flex;
    align-items: flex-start;
    padding-left: 20rpx;
    margin-bottom: 40rpx;

    &:last-child {
      margin-bottom: 0;
    }

    &:not(:last-child):before {
      position: absolute;
      top: 24rpx;
      left: 12rpx;
      z-index: 0;
      width: 2rpx;
      height: calc(100% + 16rpx);
      content: '';
      background-color: #e0e0e0;
    }

    .step-dot {
      position: relative;
      z-index: 1;
      width: 24rpx;
      height: 24rpx;
      margin-right: 20rpx;
      background-color: #fff;
      border: 2rpx solid #ccc;
      border-radius: 50%;
    }

    &.active {
      .step-dot {
        background-color: #07c160;
        border-color: #07c160;
      }

      .step-title {
        font-weight: 500;
        color: #07c160;
      }

      &:not(:last-child):before {
        background-color: #07c160;
      }
    }

    .step-info {
      flex: 1;

      .step-title {
        margin-bottom: 4rpx;
        font-size: 28rpx;
        color: #333;
      }

      .step-time {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

.review-tips {
  padding: 30rpx;
  margin-bottom: 40rpx;
  background-color: #fff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

  text {
    display: block;
    font-size: 24rpx;
    line-height: 1.6;
    color: #666;
  }
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  button {
    width: 100%;
    height: 88rpx;
    font-size: 32rpx;
    border-radius: 44rpx;
  }

  .modify-btn {
    color: #fff;
    background-color: #07c160;
    border: none;
  }

  .back-btn {
    color: #666;
    background-color: #f5f5f5;
    border: 1rpx solid #ddd;
  }
}
</style>
