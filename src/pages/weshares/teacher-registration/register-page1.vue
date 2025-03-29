<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '专业人员注册' },
}
</route>

<template>
  <view class="register-container">
    <view class="header">
      <text class="title">专业人员注册</text>
      <text class="subtitle">请填写基本信息，带 * 为必填项</text>
    </view>

    <view class="form">
      <!-- 专业类型选择 -->
      <view class="form-item">
        <text class="label">
          专业类型
          <text class="required">*</text>
        </text>
        <picker :range="professionalTypes" @change="handleTypeChange" class="picker">
          <view class="picker-text">
            {{ formData.professionalType || '请选择专业类型' }}
          </view>
        </picker>
      </view>

      <!-- 自定义专业类型 -->
      <view class="form-item" v-if="formData.professionalType === '其他'">
        <text class="label">
          请输入专业类型
          <text class="required">*</text>
        </text>
        <input
          v-model="formData.customType"
          type="text"
          placeholder="请输入专业类型（不超过5个字）"
          class="input"
          maxlength="5"
        />
      </view>

      <!-- 姓名 -->
      <view class="form-item">
        <text class="label">
          姓名
          <text class="required">*</text>
        </text>
        <input v-model="formData.name" type="text" placeholder="请输入真实姓名" class="input" />
      </view>

      <!-- 性别 -->
      <view class="form-item">
        <text class="label">
          性别
          <text class="required">*</text>
        </text>
        <radio-group @change="handleGenderChange" class="radio-group">
          <label class="radio-label">
            <radio value="male" :checked="formData.gender === 'male'" />
            <text>男</text>
          </label>
          <label class="radio-label">
            <radio value="female" :checked="formData.gender === 'female'" />
            <text>女</text>
          </label>
        </radio-group>
      </view>

      <!-- 手机号 -->
      <view class="form-item">
        <text class="label">
          手机号
          <text class="required">*</text>
        </text>
        <input
          v-model="formData.phone"
          type="number"
          placeholder="请输入手机号"
          class="input"
          maxlength="11"
        />
      </view>

      <!-- 身份证号 -->
      <view class="form-item">
        <text class="label">身份证号</text>
        <input
          v-model="formData.idCard"
          type="idcard"
          placeholder="请输入身份证号（选填）"
          class="input"
          maxlength="18"
        />
      </view>

      <!-- 邮箱 -->
      <view class="form-item">
        <text class="label">邮箱</text>
        <input
          v-model="formData.email"
          type="text"
          placeholder="请输入邮箱（选填）"
          class="input"
        />
      </view>
    </view>

    <!-- 下一步按钮 -->
    <view class="footer">
      <button class="next-btn" @tap="handleNext">下一步</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/store'

const userStore = useUserStore()

const formData = reactive({
  professionalType: '',
  customType: '',
  name: '',
  gender: '',
  phone: '',
  idCard: '',
  email: '',
  wechat: userStore.userInfo.openid || '',
})

// 专业类型列表
const professionalTypes = [
  '教师',
  '水电维修工',
  '木工',
  '油漆工',
  '泥瓦工',
  '空调维修工',
  '管道工',
  '电工',
  '其他',
]

// 选择专业类型
const handleTypeChange = (e: any) => {
  formData.professionalType = professionalTypes[e.detail.value]
}

// 处理性别选择
const handleGenderChange = (e: any) => {
  formData.gender = e.detail.value
}

// 表单验证
const validateForm = () => {
  if (!formData.professionalType) {
    uni.showToast({
      title: '请选择专业类型',
      icon: 'none',
    })
    return false
  }
  if (formData.professionalType === '其他' && !formData.customType) {
    uni.showToast({
      title: '请输入专业类型',
      icon: 'none',
    })
    return false
  }
  if (formData.professionalType === '其他' && formData.customType.length > 5) {
    uni.showToast({
      title: '专业类型不能超过5个字',
      icon: 'none',
    })
    return false
  }
  if (!formData.name) {
    uni.showToast({
      title: '请输入姓名',
      icon: 'none',
    })
    return false
  }
  if (!formData.gender) {
    uni.showToast({
      title: '请选择性别',
      icon: 'none',
    })
    return false
  }
  if (!formData.phone) {
    uni.showToast({
      title: '请输入手机号',
      icon: 'none',
    })
    return false
  }
  if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none',
    })
    return false
  }
  // 如果填写了身份证号，则验证格式
  if (
    formData.idCard &&
    !/^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dX]$/.test(formData.idCard)
  ) {
    uni.showToast({
      title: '请输入正确的身份证号',
      icon: 'none',
    })
    return false
  }
  return true
}

// 处理下一步
const handleNext = () => {
  if (validateForm()) {
    // 保存表单数据到本地存储
    const submitData = {
      ...formData,
      professionalType:
        formData.professionalType === '其他' ? formData.customType : formData.professionalType,
    }
    uni.setStorageSync('professionalRegisterStep1', submitData)
    // 跳转到下一步
    uni.navigateTo({
      url: '/pages/weshares/teacher-registration/register-page2',
    })
  }
}
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

.form {
  padding: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;

  .form-item {
    margin-bottom: 30rpx;

    .label {
      display: block;
      margin-bottom: 16rpx;
      font-size: 28rpx;
      color: #333;

      .required {
        margin-left: 4rpx;
        color: #ff4d4f;
      }
    }

    .input {
      width: 100%;
      height: 80rpx;
      padding: 0 20rpx;
      font-size: 28rpx;
      background-color: #f8f8f8;
      border-radius: 8rpx;
    }

    .radio-group {
      display: flex;
      gap: 40rpx;

      .radio-label {
        display: flex;
        align-items: center;
        font-size: 28rpx;
        color: #333;
      }
    }

    .picker {
      display: flex;
      align-items: center;
      width: 100%;
      height: 80rpx;
      padding: 0 20rpx;
      background-color: #f8f8f8;
      border-radius: 8rpx;

      .picker-text {
        font-size: 28rpx;
        color: #333;
      }
    }
  }
}

.upload-group {
  display: flex;
  gap: 20rpx;

  .upload-item {
    flex: 1;
    height: 200rpx;
    overflow: hidden;
    background-color: #f8f8f8;
    border-radius: 8rpx;

    .upload-image {
      width: 100%;
      height: 100%;
    }

    .upload-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;

      .iconfont {
        margin-bottom: 10rpx;
        font-size: 48rpx;
        color: #999;
      }

      .upload-text {
        font-size: 24rpx;
        color: #999;
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

  .next-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80rpx;
    font-size: 32rpx;
    color: #fff;
    background-color: #007aff;
    border-radius: 40rpx;
  }
}
</style>
