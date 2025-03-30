<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '专业人才入驻' },
}
</route>

<template>
  <PageLayout
    title="专业人员注册 (3/4)"
    subtitle="上传证件资料，增加您的信誉度"
    :steps="steps"
    :showBack="true"
    @next="handleNext"
    @back="handleBack"
  >
    <view class="form">
      <!-- 上传说明 -->
      <view class="upload-intro">
        <view class="intro-title">为什么要上传资质证明？</view>
        <view class="intro-text">
          上传相关证件和资质证明，不仅能提高您的注册审核通过率，还能增加用户对您的信任。
          所有资料将严格保密，仅用于平台审核。
        </view>
      </view>

      <!-- 证件上传区域 -->
      <view class="upload-section">
        <!-- 学历证书 -->
        <view class="upload-group">
          <view class="upload-title">
            学历证书
            <text class="hint">(选填，有助于提高审核通过率)</text>
          </view>
          <FileUploader
            v-model="formData.education"
            :max="3"
            :multiple="true"
            fileType="education"
            @change="handleEducationChange"
          />
        </view>

        <!-- 专业证书 -->
        <view class="upload-group">
          <view class="upload-title">
            专业证书
            <text class="hint">(选填，有助于提高审核通过率)</text>
          </view>
          <FileUploader
            v-model="formData.professional"
            :max="5"
            :multiple="true"
            fileType="professional"
            @change="handleProfessionalChange"
          />
        </view>

        <!-- 专业资格证书 -->
        <view class="form-item">
          <text class="label">
            专业资格证书
            <text class="hint">(选填，如有其他专业资格证书可上传)</text>
          </text>
          <FileUploader
            v-model="formData.qualification"
            fileType="qualification"
            :max="1"
            :showPreview="true"
            @change="handleQualificationChange"
          />
        </view>

        <!-- 身份证上传 -->
        <view class="upload-group">
          <view class="upload-title">
            身份证照片
            <text class="hint">(选填，有助于提高审核通过率)</text>
          </view>
          <view class="upload-container">
            <view class="upload-item">
              <text class="upload-label">正面</text>
              <FileUploader
                v-model="formData.idCardFront"
                :max="1"
                :multiple="false"
                fileType="idCardFront"
                @change="handleIdCardFrontChange"
              />
            </view>
            <view class="upload-item">
              <text class="upload-label">反面</text>
              <FileUploader
                v-model="formData.idCardBack"
                :max="1"
                :multiple="false"
                fileType="idCardBack"
                @change="handleIdCardBackChange"
              />
            </view>
          </view>
        </view>

        <!-- 荣誉证书 -->
        <view class="upload-group">
          <view class="upload-title">
            荣誉证书
            <text class="hint">(选填，如获奖证书、表彰证书等)</text>
          </view>
          <FileUploader
            v-model="formData.honor"
            :max="5"
            :multiple="true"
            fileType="honor"
            @change="handleHonorChange"
          />
        </view>
      </view>
    </view>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRegisterStore } from '@/store/registerStore'
import FileUploader from '@/components/FileUploader/FileUploader.vue'
import PageLayout from '@/components/PageLayout/PageLayout.vue'

interface Step {
  number: number
  status: 'active' | 'completed' | ''
}

const steps = ref<Step[]>([
  { number: 1, status: 'completed' },
  { number: 2, status: 'completed' },
  { number: 3, status: 'active' },
  { number: 4, status: '' },
])

const registerStore = useRegisterStore()

const formData = reactive({
  idCardFront: '',
  idCardBack: '',
  qualification: '',
  education: '',
  professional: '',
  honor: '',
})

// 表单是否已提交（用于显示验证错误）
const formSubmitted = ref(false)

// 处理身份证正面照片上传
const handleIdCardFrontChange = (files: string[]) => {
  formData.idCardFront = files[0] || ''
}

// 处理身份证反面照片上传
const handleIdCardBackChange = (files: string[]) => {
  formData.idCardBack = files[0] || ''
}

// 处理专业资格证书上传
const handleQualificationChange = (files: string[]) => {
  formData.qualification = files.join(',')
}

// 处理学历证书上传
const handleEducationChange = (files: string[]) => {
  formData.education = files.join(',')
}

// 处理专业证书上传
const handleProfessionalChange = (files: string[]) => {
  formData.professional = files.join(',')
}

// 处理荣誉证书上传
const handleHonorChange = (files: string[]) => {
  formData.honor = files.join(',')
}

// 处理下一步
const handleNext = () => {
  formSubmitted.value = true
  if (!validateForm()) {
    return
  }

  // 保存当前数据到全局状态
  registerStore.updateStep3({
    idCardFront: formData.idCardFront,
    idCardBack: formData.idCardBack,
    qualification: formData.qualification,
    education: formData.education,
    professional: formData.professional,
    honor: formData.honor,
  })
  // 同时保存到本地存储（作为备份）
  registerStore.saveToStorage()
  // 触发next事件
  emit('next', 3)
}

// 返回上一步
const handleBack = () => {
  // 保存当前数据到全局状态
  registerStore.updateStep3({
    idCardFront: formData.idCardFront,
    idCardBack: formData.idCardBack,
    qualification: formData.qualification,
    education: formData.education,
    professional: formData.professional,
    honor: formData.honor,
  })
  // 同时保存到本地存储（作为备份）
  registerStore.saveToStorage()
  // 触发back事件
  emit('back', 3)
}

// 表单验证
const validateForm = () => {
  // 所有项都选填，总是返回true
  return true
}

// 定义emit
const emit = defineEmits(['next', 'back'])

// 页面加载时获取缓存数据
onMounted(() => {
  // 从全局状态加载数据
  const storeData = registerStore.step3Data
  if (storeData) {
    // 如果存在数据，填充表单
    Object.assign(formData, storeData)
  }

  // 检查是否有第二步数据
  const step2Data = registerStore.step2Data
  if (!step2Data || !step2Data.serviceArea) {
    uni.showToast({
      title: '请先完成专业能力信息',
      icon: 'none',
    })
    setTimeout(() => {
      emit('back', 3)
    }, 1500)
  }
})
</script>

<style lang="scss" scoped>
// 定义统一的颜色变量
$primary-color: #07c160; // 主题色（绿色）
$background-color: #f5f5f5; // 背景色
$text-primary: #333; // 主要文本颜色
$text-secondary: #666; // 次要文本颜色
$text-hint: #999; // 提示文本颜色
$border-color: #e0e0e0; // 边框颜色
$required-color: #ff4d4f; // 必填项标记颜色

.form {
  .upload-intro {
    padding: 20rpx;
    margin-bottom: 30rpx;
    background-color: #fff7e6;
    border-radius: 8rpx;

    .intro-title {
      display: block;
      margin-bottom: 10rpx;
      font-size: 28rpx;
      font-weight: bold;
      color: $text-primary;
    }

    .intro-text {
      font-size: 24rpx;
      line-height: 1.5;
      color: $text-secondary;
    }
  }

  .upload-section {
    .upload-group {
      padding: 20rpx;
      margin-bottom: 30rpx;
      background-color: #fff;
      border-radius: 12rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .upload-title {
        margin-bottom: 20rpx;
        font-size: 28rpx;
        font-weight: 500;
        color: $text-primary;

        .hint {
          margin-left: 8rpx;
          font-size: 24rpx;
          font-weight: normal;
          color: $text-hint;
        }

        .required {
          margin-left: 4rpx;
          color: $required-color;
        }
      }

      .upload-container {
        display: flex;
        gap: 30rpx;

        .upload-item {
          flex: 1;

          .upload-label {
            display: block;
            margin-bottom: 10rpx;
            font-size: 24rpx;
            color: $text-secondary;
          }
        }
      }
    }

    .form-item {
      padding: 20rpx;
      margin-bottom: 30rpx;
      background-color: #fff;
      border-radius: 12rpx;

      .label {
        display: block;
        margin-bottom: 16rpx;
        font-size: 28rpx;
        font-weight: 500;
        color: $text-primary;

        .hint {
          margin-left: 8rpx;
          font-size: 24rpx;
          font-weight: normal;
          color: $text-hint;
        }
      }
    }
  }
}
</style>
