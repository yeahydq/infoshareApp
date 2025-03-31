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
          <view class="info-item" v-if="step1Data.gender">
            <text class="label">性别</text>
            <text class="value">{{ step1Data.gender === 'male' ? '男' : '女' }}</text>
          </view>
          <view class="info-item" v-if="step1Data.phone">
            <text class="label">联系电话</text>
            <text class="value">{{ step1Data.phone }}</text>
          </view>
          <view class="info-item" v-if="step1Data.email">
            <text class="label">邮箱</text>
            <text class="value">{{ step1Data.email }}</text>
          </view>
          <view class="info-item" v-if="step1Data.idCard">
            <text class="label">身份证号</text>
            <text class="value">{{ step1Data.idCard }}</text>
          </view>
          <view
            class="info-item"
            v-if="step1Data.professionalTypes && step1Data.professionalTypes.length > 0"
          >
            <text class="label">专业类型</text>
            <text class="value">{{ step1Data.professionalTypes.join(', ') }}</text>
          </view>
          <view
            class="info-item"
            v-if="step1Data.educationRanges && step1Data.educationRanges.length > 0"
          >
            <text class="label">辅导范围</text>
            <text class="value">{{ step1Data.educationRanges.join(', ') }}</text>
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
            <text class="value">{{ step2Data.experience }}</text>
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
        </view>
      </view>

      <!-- 服务价格信息 -->
      <view
        class="preview-section"
        v-if="
          step1Data.professionalTypes &&
          step1Data.professionalTypes.length > 0 &&
          step1Data.skillPrices &&
          step1Data.skillBillingTypes
        "
      >
        <view class="section-header">
          <view class="section-title">服务价格设置</view>
        </view>
        <view class="info-group">
          <view
            class="info-item price-item"
            v-for="(type, index) in step1Data.professionalTypes"
            :key="index"
          >
            <text class="label">{{ type }}</text>
            <text class="value" v-if="step1Data.skillBillingTypes[type] === 'negotiable'">
              面议
            </text>
            <text class="value" v-else-if="step1Data.skillPrices[type]">
              {{ step1Data.skillPrices[type] }} 元{{
                getBillingUnitLabel(step1Data.skillBillingTypes[type])
              }}
            </text>
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
            <text class="status" :class="getFileStatusClass(step3Data.education.split(',')[0])">
              {{ getFileStatusText(step3Data.education.split(',')[0]) }}
            </text>
            <view class="image-preview-container" v-if="step3Data.education">
              <scroll-view scroll-x>
                <view class="image-preview-list">
                  <view
                    class="preview-item"
                    v-for="(path, index) in getImageList(step3Data.education)"
                    :key="index"
                    @click="previewImage(getImageList(step3Data.education), index)"
                  >
                    <image class="preview-image" :src="getImageSrc(path)" mode="aspectFill"></image>
                  </view>
                </view>
              </scroll-view>
            </view>
          </view>
          <view class="status-item" v-if="step3Data.professional">
            <text class="label">专业证书</text>
            <text class="status" :class="getFileStatusClass(step3Data.professional.split(',')[0])">
              {{ getFileStatusText(step3Data.professional.split(',')[0]) }}
            </text>
            <view class="image-preview-container" v-if="step3Data.professional">
              <scroll-view scroll-x>
                <view class="image-preview-list">
                  <view
                    class="preview-item"
                    v-for="(path, index) in getImageList(step3Data.professional)"
                    :key="index"
                    @click="previewImage(getImageList(step3Data.professional), index)"
                  >
                    <image class="preview-image" :src="getImageSrc(path)" mode="aspectFill"></image>
                  </view>
                </view>
              </scroll-view>
            </view>
          </view>
          <view class="status-item" v-if="step3Data.qualification">
            <text class="label">专业资格证书</text>
            <text class="status" :class="getFileStatusClass(step3Data.qualification)">
              {{ getFileStatusText(step3Data.qualification) }}
            </text>
            <view class="image-preview-container" v-if="step3Data.qualification">
              <view class="preview-item" @click="previewImage([step3Data.qualification])">
                <image
                  class="preview-image"
                  :src="getImageSrc(step3Data.qualification)"
                  mode="aspectFill"
                ></image>
              </view>
            </view>
          </view>
          <view class="status-item" v-if="step3Data.idCardFront && step3Data.idCardBack">
            <text class="label">身份证照片</text>
            <text class="status" :class="getFileStatusClass(step3Data.idCardFront)">
              {{ getFileStatusText(step3Data.idCardFront) }}
            </text>
            <view class="id-card-container">
              <view class="id-card-preview">
                <view class="preview-item" @click="previewImage([step3Data.idCardFront])">
                  <text class="preview-label">正面</text>
                  <image
                    class="preview-image"
                    :src="getImageSrc(step3Data.idCardFront)"
                    mode="aspectFill"
                  ></image>
                </view>
                <view class="preview-item" @click="previewImage([step3Data.idCardBack])">
                  <text class="preview-label">反面</text>
                  <image
                    class="preview-image"
                    :src="getImageSrc(step3Data.idCardBack)"
                    mode="aspectFill"
                  ></image>
                </view>
              </view>
            </view>
          </view>
          <view class="status-item" v-if="step3Data.honor">
            <text class="label">荣誉证书</text>
            <text class="status" :class="getFileStatusClass(step3Data.honor.split(',')[0])">
              {{ getFileStatusText(step3Data.honor.split(',')[0]) }}
            </text>
            <view class="image-preview-container" v-if="step3Data.honor">
              <scroll-view scroll-x>
                <view class="image-preview-list">
                  <view
                    class="preview-item"
                    v-for="(path, index) in getImageList(step3Data.honor)"
                    :key="index"
                    @click="previewImage(getImageList(step3Data.honor), index)"
                  >
                    <image class="preview-image" :src="getImageSrc(path)" mode="aspectFill"></image>
                  </view>
                </view>
              </scroll-view>
            </view>
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
import { useRegisterStore } from '@/store/registerStore'
import PageLayout from '@/components/PageLayout/PageLayout.vue'

interface Step {
  number: number
  status: '' | 'active' | 'completed'
}

interface Step1Data {
  name?: string
  gender?: string
  phone?: string
  email?: string
  idCard?: string
  professionalTypes?: string[]
  customType?: string
  educationRanges?: string[]
  servicePrice?: string
  billingType?: string
  skillPrices?: Record<string, string>
  skillBillingTypes?: Record<string, string>
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

const registerStore = useRegisterStore()

// 存储前三页的数据
const step1Data = ref<Step1Data>({})
const step2Data = ref<Step2Data>({})
const step3Data = ref<Step3Data>({})

const formData = reactive({
  agreement: false,
})

// 返回上一步
const handleBack = () => {
  // 保存当前数据到全局状态
  registerStore.updateStep4({
    agreement: formData.agreement,
  })
  // 同时保存到本地存储（作为备份）
  registerStore.saveToStorage()
  // 触发back事件
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

    // 从全局状态获取数据
    const step1Data = registerStore.step1Data
    const step2Data = registerStore.step2Data
    const step3Data = registerStore.step3Data

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
      // 清空全局状态数据
      registerStore.clearData()

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
  // 从全局状态加载数据
  step1Data.value = registerStore.step1Data
  step2Data.value = registerStore.step2Data
  step3Data.value = registerStore.step3Data

  // 如果没有前三页的数据，返回第一页
  if (!step1Data.value.name || !step2Data.value.serviceArea || !step3Data.value) {
    uni.showToast({
      title: '请先完成前三步信息填写',
      icon: 'none',
    })
    setTimeout(() => {
      emit('back', 4)
    }, 1500)
    return
  }

  // 恢复第四页数据
  formData.agreement = registerStore.step4Data.agreement
})

// 获取计费单位显示文本
const getBillingUnitLabel = (billingType: string) => {
  switch (billingType) {
    case 'hourly':
      return '/小时'
    case 'per_time':
      return '/次'
    case 'per_project':
      return '/项目'
    case 'daily':
      return '/天'
    default:
      return ''
  }
}

// 获取图片列表
const getImageList = (path: string | undefined): string[] => {
  if (!path) return []
  return path.split(',').filter(Boolean)
}

// 获取图片源
const getImageSrc = (path: string): string => {
  if (!path) return ''

  // 尝试从映射中获取真实路径
  try {
    const mappings = uni.getStorageSync('filePathMappings') || {}
    if (mappings[path]) {
      console.log('预览页从映射获取文件路径:', path, '->', mappings[path])
      return mappings[path]
    }
  } catch (err) {
    console.error('预览页从映射获取文件路径失败:', err)
  }

  // 尝试从缓存中获取
  if (path.includes('file_')) {
    try {
      const cachedFiles = uni.getStorageSync('cachedFiles') || {}
      if (cachedFiles[path]) {
        return cachedFiles[path].tempFilePath
      }
    } catch (error) {
      console.error('获取缓存文件失败:', error)
    }
  }

  return path
}

// 检查文件是否仅本地缓存（未上传到服务器）
const isLocalCachedOnly = (path: string): boolean => {
  // 如果路径包含file_前缀，表示这是一个本地缓存文件标识符
  if (!path || !path.includes('file_')) {
    return false
  }

  // 判断是本地缓存文件
  return true
}

// 获取证件状态文本
const getFileStatusText = (path: string): string => {
  if (!path) return ''

  if (isLocalCachedOnly(path)) {
    return '已缓存本地'
  } else {
    return '已上传'
  }
}

// 获取证件状态样式类
const getFileStatusClass = (path: string): string => {
  if (!path) return ''

  if (isLocalCachedOnly(path)) {
    return 'cached'
  } else {
    return 'uploaded'
  }
}

// 预览图片
const previewImage = (imageList: string[], index = 0) => {
  if (!imageList || imageList.length === 0) {
    uni.showToast({
      title: '没有可预览的图片',
      icon: 'none',
    })
    return
  }

  // 处理图片路径
  const urls = imageList.map((path) => getImageSrc(path)).filter(Boolean)

  if (urls.length === 0) {
    uni.showToast({
      title: '图片加载失败',
      icon: 'none',
    })
    return
  }

  uni.previewImage({
    urls,
    current: urls[index] || urls[0],
    fail: (err) => {
      console.error('预览图片失败:', err)
      uni.showToast({
        title: '预览图片失败',
        icon: 'none',
      })
    },
  })
}
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

        &.uploaded {
          color: #07c160;
        }

        &.cached {
          color: #ff9900;
        }
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

.image-preview-container {
  padding: 16rpx;
  margin-top: 16rpx;
  background-color: #f8f8f8;
  border-radius: 8rpx;

  .image-preview-list {
    display: flex;
    flex-wrap: nowrap;
  }

  .preview-item {
    position: relative;
    width: 160rpx;
    height: 160rpx;
    margin-right: 16rpx;
    overflow: hidden;
    border-radius: 8rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

    &:last-child {
      margin-right: 0;
    }

    .preview-label {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      padding: 4rpx 8rpx;
      font-size: 20rpx;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 0 0 8rpx 0;
    }

    .preview-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.id-card-container {
  padding: 16rpx;
  margin-top: 16rpx;
  background-color: #f8f8f8;
  border-radius: 8rpx;

  .id-card-preview {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .preview-item {
      position: relative;
      width: 48%;
      height: 180rpx;
      overflow: hidden;
      border-radius: 8rpx;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

      .preview-label {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        padding: 4rpx 8rpx;
        font-size: 20rpx;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 0 0 8rpx 0;
      }

      .preview-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
</style>
