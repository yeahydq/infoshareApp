<template>
  <PageLayout
    title="专业人员注册 (4/4)"
    subtitle="预览并确认您的注册信息"
    :steps="steps"
    :showBack="true"
    @back="handleBack"
    @next="handleSubmit"
  >
    <view class="preview-container">
      <!-- 信息预览区域 -->
      <view class="preview-section">
        <view class="section-header">
          <view class="section-title">基本信息</view>
        </view>
        <view class="info-group">
          <view class="info-item" v-if="step1Data.name">
            <text class="label">姓名</text>
            <text class="value">{{ step1Data.name }}</text>
          </view>
          <view class="info-item" v-if="step1Data.phone">
            <text class="label">联系电话</text>
            <text class="value">{{ step1Data.phone }}</text>
          </view>
          <view class="info-item" v-if="step1Data.professionalType">
            <text class="label">专业类型</text>
            <text class="value">{{ step1Data.professionalType }}</text>
          </view>
        </view>
      </view>

      <view class="preview-section">
        <view class="section-header">
          <view class="section-title">专业能力与服务信息</view>
        </view>
        <view class="info-group">
          <view class="info-item" v-if="step2Data.experience">
            <text class="label">工作经验</text>
            <text class="value">{{ step2Data.experience }} 年</text>
          </view>
          <view class="info-item" v-if="step2Data.serviceDescription">
            <text class="label">专业特长</text>
            <text class="value">{{ step2Data.serviceDescription }}</text>
          </view>
          <view class="info-item" v-if="step2Data.skillTags && step2Data.skillTags.length > 0">
            <text class="label">技能标签</text>
            <view class="tags-preview">
              <view class="tag" v-for="(tag, index) in step2Data.skillTags" :key="index">
                {{ tag }}
              </view>
            </view>
          </view>
          <view class="info-item" v-if="step2Data.serviceArea">
            <text class="label">服务区域</text>
            <text class="value">{{ step2Data.serviceArea }}</text>
          </view>
          <view class="info-item" v-if="step2Data.servicePrice">
            <text class="label">服务价格</text>
            <text class="value">{{ step2Data.servicePrice }} 元/小时</text>
          </view>
        </view>
      </view>

      <view class="preview-section">
        <view class="section-header">
          <view class="section-title">证件资料</view>
        </view>
        <view class="upload-status">
          <view class="status-item" v-if="step3Data.education">
            <text class="label">学历证书</text>
            <text class="status uploaded">已上传</text>
          </view>
          <view class="status-item" v-if="step3Data.professional">
            <text class="label">专业证书</text>
            <text class="status uploaded">已上传</text>
          </view>
          <view class="status-item" v-if="step3Data.qualification">
            <text class="label">专业资格证书</text>
            <text class="status uploaded">已上传</text>
          </view>
          <view class="status-item" v-if="step3Data.idCardFront && step3Data.idCardBack">
            <text class="label">身份证照片</text>
            <text class="status uploaded">已上传</text>
          </view>
          <view class="status-item" v-if="step3Data.honor">
            <text class="label">荣誉证书</text>
            <text class="status uploaded">已上传</text>
          </view>
        </view>
      </view>

      <!-- 服务协议 -->
      <view class="agreement-section">
        <view class="agreement-title">服务协议</view>
        <scroll-view scroll-y class="agreement-content">
          <text class="agreement-text">
            1. 本平台仅作为信息发布平台，不对服务提供者的资质、能力、服务质量等做任何保证。 2.
            服务提供者应遵守相关法律法规，确保提供的服务合法合规。 3.
            服务提供者应保护用户隐私，不得泄露用户个人信息。 4.
            平台有权对违规账号进行处理，包括但不限于警告、限制、封禁等。 5.
            服务提供者应按时完成服务，保证服务质量。 6. 平台保留对服务协议进行修改的权利。
          </text>
        </scroll-view>
        <view class="agreement-checkbox">
          <checkbox-group @change="handleAgreementChange">
            <checkbox value="agree" :checked="formData.agreement" />
            <text class="checkbox-label">我已阅读并同意《服务协议》</text>
          </checkbox-group>
        </view>
      </view>

      <!-- 提交说明 -->
      <view class="submit-notice">
        <text class="notice-text">
          提交后，我们将在1-3个工作日内完成审核，审核结果将通过短信通知您。
        </text>
      </view>
    </view>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import PageLayout from '@/components/PageLayout/PageLayout.vue'

interface Step {
  number: number
  status: '' | 'active' | 'completed'
}

interface Step1Data {
  name?: string
  phone?: string
  idCard?: string
  professionalType?: string
}

interface Step2Data {
  skillTags?: string[]
  serviceArea?: string
  servicePrice?: string
  serviceDescription?: string
  experience?: string
  description?: string
}

interface Step3Data {
  idCardFront?: string
  idCardBack?: string
  qualification?: string
  education?: string
  professional?: string
  honor?: string
}

// 步骤配置
const steps = ref<Step[]>([
  { number: 1, status: 'completed' },
  { number: 2, status: 'completed' },
  { number: 3, status: 'completed' },
  { number: 4, status: 'active' },
])

// 存储前三页的数据
const step1Data = ref<Step1Data>({})
const step2Data = ref<Step2Data>({})
const step3Data = ref<Step3Data>({})

const formData = reactive({
  agreement: false,
})

// 返回上一步
const handleBack = () => {
  emit('back', 4)
}

// 处理服务协议勾选
const handleAgreementChange = (e: any) => {
  formData.agreement = e.detail.value.length > 0
}

// 表单验证
const validateForm = () => {
  if (!formData.agreement) {
    uni.showToast({
      title: '请阅读并同意服务协议',
      icon: 'none',
    })
    return false
  }
  return true
}

// 处理提交
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  try {
    // 显示加载提示
    uni.showLoading({
      title: '提交中...',
    })

    // 获取前三步的数据
    const step1Data = uni.getStorageSync('professionalRegisterStep1')
    const step2Data = uni.getStorageSync('professionalRegisterStep2')
    const step3Data = uni.getStorageSync('professionalRegisterStep3')

    if (!step1Data || !step2Data || !step3Data) {
      throw new Error('请先完成前三步信息填写')
    }

    // 合并所有数据
    const submitData = {
      ...step1Data,
      ...step2Data,
      ...step3Data,
      agreement: formData.agreement,
    }

    // 调用云函数提交数据
    const { result } = await uni.cloud.callFunction({
      name: 'submitProfessionalRegistration',
      data: submitData,
    })

    // 隐藏加载提示
    uni.hideLoading()

    if (result.success) {
      // 清除本地存储的数据
      uni.removeStorageSync('professionalRegisterStep1')
      uni.removeStorageSync('professionalRegisterStep2')
      uni.removeStorageSync('professionalRegisterStep3')

      // 显示成功提示
      uni.showToast({
        title: '提交成功',
        icon: 'success',
      })

      // 延迟跳转到成功页面
      setTimeout(() => {
        uni.redirectTo({
          url: '/pages/weshares/teacher-registration/success',
        })
      }, 1500)
    } else {
      throw new Error(result.message || '提交失败')
    }
  } catch (error: any) {
    // 隐藏加载提示
    uni.hideLoading()

    // 显示错误提示
    uni.showToast({
      title: error.message || '提交失败，请重试',
      icon: 'none',
    })
  }
}

// 定义emit
const emit = defineEmits(['back'])

// 页面加载时获取缓存数据
onMounted(() => {
  // 获取前三页的数据
  step1Data.value = uni.getStorageSync('professionalRegisterStep1') || {}
  step2Data.value = uni.getStorageSync('professionalRegisterStep2') || {}
  step3Data.value = uni.getStorageSync('professionalRegisterStep3') || {}

  // 如果没有前三页的数据，返回第一页
  if (!step1Data.value || !step2Data.value || !step3Data.value) {
    uni.showToast({
      title: '请先完成前三步信息填写',
      icon: 'none',
    })
    setTimeout(() => {
      emit('back', 4)
    }, 1500)
  }
})
</script>

<style lang="scss" scoped>
// 基础样式
.label {
  margin-bottom: 8rpx;
  font-size: 28rpx;
  color: #666;
}

.preview-container {
  .preview-section {
    margin-bottom: 30rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10rpx;
      margin-bottom: 20rpx;
      background-color: #fff;
      border-radius: 12rpx;

      .section-title {
        font-size: 32rpx;
        font-weight: 500;
        color: #333;
      }
    }

    .info-group {
      padding: 20rpx;
      background-color: #fff;
      border-radius: 12rpx;

      .info-item {
        margin-bottom: 20rpx;

        &:last-child {
          margin-bottom: 0;
        }

        .label {
          // 继承基础样式
        }

        .value {
          font-size: 30rpx;
          line-height: 1.5;
          color: #333;
        }
      }
    }
  }

  .upload-status {
    padding: 20rpx;
    margin-bottom: 30rpx;
    background-color: #fff;
    border-radius: 12rpx;

    .status-item {
      margin-bottom: 20rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        // 继承基础样式
      }

      .status {
        font-size: 30rpx;
        line-height: 1.5;
        color: #333;
      }
    }
  }

  .agreement-section {
    padding: 20rpx;
    margin-bottom: 30rpx;
    background-color: #fff;
    border-radius: 12rpx;

    .agreement-title {
      margin-bottom: 20rpx;
      font-size: 28rpx;
      font-weight: 500;
      color: #333;
    }

    .agreement-content {
      height: 300rpx;
      padding: 20rpx;
      margin-bottom: 20rpx;
      background-color: #f8f8f8;
      border-radius: 8rpx;

      .agreement-text {
        font-size: 24rpx;
        line-height: 1.6;
        color: #666;
      }
    }

    .agreement-checkbox {
      display: flex;
      align-items: center;
      justify-content: center;

      .checkbox-label {
        margin-left: 10rpx;
        font-size: 24rpx;
        color: #666;
      }
    }
  }

  .submit-notice {
    padding: 20rpx;
    margin-bottom: 30rpx;
    background-color: #fff;
    border-radius: 12rpx;

    .notice-text {
      font-size: 28rpx;
      color: #666;
    }
  }
}

.tags-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 8rpx;

  .tag {
    position: relative;
    display: flex;
    align-items: center;
    padding: 12rpx 24rpx;
    overflow: hidden;
    font-size: 26rpx;
    color: #fff;
    background-color: #07c160;
    border: 2rpx solid #07c160;
    border-radius: 30rpx;

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      content: '';
      background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
      border-radius: 30rpx;
    }

    &::after {
      margin-left: 8rpx;
      font-size: 24rpx;
      content: '✓';
    }
  }
}
</style>
