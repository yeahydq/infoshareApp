<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '专业人才入驻' },
}
</route>

<template>
  <view class="register-container">
    <view class="header">
      <text class="title">服务协议</text>
      <text class="subtitle">请仔细阅读并同意服务协议</text>
    </view>

    <view class="agreement-content">
      <scroll-view scroll-y class="agreement-scroll">
        <view class="agreement-text">
          <view class="section">
            <text class="section-title">1. 服务说明</text>
            <text class="section-content">
              本平台为专业人才提供展示和接单服务，平台将根据专业人才的资质、经验和服务质量进行审核和推荐。
            </text>
          </view>

          <view class="section">
            <text class="section-title">2. 入驻要求</text>
            <text class="section-content">
              2.1 专业人才必须提供真实、有效的身份信息和专业资质证明。 2.2
              专业人才必须遵守平台规则和相关法律法规。 2.3 专业人才必须保证服务质量，维护平台声誉。
            </text>
          </view>

          <view class="section">
            <text class="section-title">3. 服务规范</text>
            <text class="section-content">
              3.1 专业人才必须按照约定的时间和地点提供服务。 3.2
              专业人才必须使用符合标准的工具和材料。 3.3 专业人才必须保护客户隐私和财产安全。
            </text>
          </view>

          <view class="section">
            <text class="section-title">4. 费用结算</text>
            <text class="section-content">
              4.1 平台将按照约定的服务价格进行结算。 4.2 平台将收取一定比例的服务费。 4.3
              结算周期为每月一次。
            </text>
          </view>

          <view class="section">
            <text class="section-title">5. 违约责任</text>
            <text class="section-content">
              5.1 如违反平台规则，平台有权暂停或终止服务。 5.2
              如造成客户损失，专业人才需承担相应责任。 5.3 平台保留追究法律责任的权利。
            </text>
          </view>
        </view>
      </scroll-view>

      <view class="agreement-checkbox">
        <checkbox-group @change="handleAgreementChange">
          <label class="checkbox-label">
            <checkbox :checked="isAgreed" color="#007aff" />
            <text class="checkbox-text">我已阅读并同意《服务协议》</text>
          </label>
        </checkbox-group>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="footer">
      <button class="submit-btn" @tap="handleSubmit" :disabled="!isAgreed">提交申请</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isAgreed = ref(false)

// 处理协议同意状态
const handleAgreementChange = (e: any) => {
  isAgreed.value = e.detail.value.length > 0
}

// 提交申请
const handleSubmit = async () => {
  if (!isAgreed.value) {
    uni.showToast({
      title: '请先同意服务协议',
      icon: 'none',
    })
    return
  }

  try {
    // 获取前两步的数据
    const step1Data = uni.getStorageSync('professionalRegisterStep1')
    const step2Data = uni.getStorageSync('professionalRegisterStep2')

    if (!step1Data || !step2Data) {
      uni.showToast({
        title: '请完成所有步骤',
        icon: 'none',
      })
      return
    }

    // 合并所有数据
    const submitData = {
      ...step1Data,
      ...step2Data,
      agreement: true,
      submitTime: new Date().toISOString(),
    }

    // TODO: 调用后端API提交数据
    // const res = await uni.request({
    //   url: 'YOUR_API_ENDPOINT',
    //   method: 'POST',
    //   data: submitData,
    // })

    // 模拟提交成功
    uni.showLoading({
      title: '提交中...',
    })

    setTimeout(() => {
      uni.hideLoading()
      uni.showToast({
        title: '提交成功',
        icon: 'success',
      })

      // 清除本地存储的数据
      uni.removeStorageSync('professionalRegisterStep1')
      uni.removeStorageSync('professionalRegisterStep2')

      // 延迟跳转到首页
      setTimeout(() => {
        uni.switchTab({
          url: '/pages/index/index',
        })
      }, 1500)
    }, 2000)
  } catch (error) {
    console.error('提交失败:', error)
    uni.showToast({
      title: '提交失败，请重试',
      icon: 'none',
    })
  }
}

// 检查是否已完成前两步
onMounted(() => {
  const step1Data = uni.getStorageSync('professionalRegisterStep1')
  const step2Data = uni.getStorageSync('professionalRegisterStep2')

  if (!step1Data || !step2Data) {
    uni.showToast({
      title: '请完成所有步骤',
      icon: 'none',
    })
    uni.navigateBack()
  }
})
</script>

<style lang="scss" scoped>
.register-container {
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

.agreement-content {
  padding: 20rpx;
  margin-bottom: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;

  .agreement-scroll {
    height: 800rpx;
    margin-bottom: 20rpx;

    .agreement-text {
      .section {
        margin-bottom: 30rpx;

        .section-title {
          display: block;
          margin-bottom: 16rpx;
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
        }

        .section-content {
          font-size: 28rpx;
          line-height: 1.6;
          color: #666;
        }
      }
    }
  }

  .agreement-checkbox {
    padding: 20rpx 0;
    border-top: 1rpx solid #eee;

    .checkbox-label {
      display: flex;
      align-items: center;

      .checkbox-text {
        margin-left: 10rpx;
        font-size: 28rpx;
        color: #333;
      }
    }
  }
}

.footer {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 20rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

  .submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80rpx;
    font-size: 32rpx;
    color: #fff;
    background-color: #007aff;
    border-radius: 40rpx;

    &[disabled] {
      background-color: #ccc;
    }
  }
}
</style>
