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
            v-model:value="formData.education"
            :max="3"
            :multiple="true"
            fileType="education"
            v-model:uploadStatus="uploadStatus"
            :fileList="getFileList(formData.education)"
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
            v-model:value="formData.professional"
            :max="5"
            :multiple="true"
            fileType="professional"
            v-model:uploadStatus="uploadStatus"
            :fileList="getFileList(formData.professional)"
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
            v-model:value="formData.qualification"
            fileType="qualification"
            :max="1"
            :showPreview="true"
            v-model:uploadStatus="uploadStatus"
            :fileList="getFileList(formData.qualification)"
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
                v-model:value="formData.idCardFront"
                :max="1"
                :multiple="false"
                fileType="idCardFront"
                v-model:uploadStatus="uploadStatus"
                :fileList="getFileList(formData.idCardFront)"
                @change="handleIdCardFrontChange"
                :enableCrop="true"
                cropType="idCard"
                :showPreview="true"
              />
            </view>
            <view class="upload-item">
              <text class="upload-label">反面</text>
              <FileUploader
                v-model:value="formData.idCardBack"
                :max="1"
                :multiple="false"
                fileType="idCardBack"
                v-model:uploadStatus="uploadStatus"
                :fileList="getFileList(formData.idCardBack)"
                @change="handleIdCardBackChange"
                :enableCrop="true"
                cropType="idCard"
                :showPreview="true"
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
            v-model:value="formData.honor"
            :max="5"
            :multiple="true"
            fileType="honor"
            v-model:uploadStatus="uploadStatus"
            :fileList="getFileList(formData.honor)"
            @change="handleHonorChange"
          />
        </view>
      </view>
    </view>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue'
import { useRegisterStore } from '@/store/registerStore'
import { useUserStore } from '@/store'
import PageLayout from '@/components/PageLayout/PageLayout.vue'
import FileUploader from '@/components/FileUploader/FileUploader.vue'

const userStore = useUserStore()
// 检查用户是否已登录
onMounted(() => {
  if (!userStore.userInfo?.openid) {
    uni.showModal({
      title: '提示',
      content: '请先登录后再进行专业人员注册',
      showCancel: false,
      success: () => {
        // 返回上一页 - 不再尝试自动登录
        uni.navigateBack()
      },
    })
  }
})

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
  console.log('身份证正面照片变更:', files)
  formData.idCardFront = files[0] || ''

  // 立即更新到store
  registerStore.updateStep3({ idCardFront: formData.idCardFront })
  registerStore.saveToStorage()
  console.log('已更新身份证正面到store:', formData.idCardFront)
}

// 处理身份证背面照片上传
const handleIdCardBackChange = (files: string[]) => {
  console.log('身份证背面照片变更:', files)
  formData.idCardBack = files[0] || ''

  // 立即更新到store
  registerStore.updateStep3({ idCardBack: formData.idCardBack })
  registerStore.saveToStorage()
  console.log('已更新身份证背面到store:', formData.idCardBack)
}

// 处理资格证书上传
const handleQualificationChange = (files: string[]) => {
  console.log('资格证书变更:', files)
  formData.qualification = files[0] || ''

  // 立即更新到store
  registerStore.updateStep3({ qualification: formData.qualification })
  registerStore.saveToStorage()
  console.log('已更新资格证书到store:', formData.qualification)
}

// 处理学历证书上传
const handleEducationChange = (files: string[]) => {
  console.log('学历证书变更:', files)
  formData.education = files.join(',')

  // 立即更新到store
  registerStore.updateStep3({ education: formData.education })
  registerStore.saveToStorage()
  console.log('已更新学历证书到store:', formData.education)
}

// 处理专业证书上传
const handleProfessionalChange = (files: string[]) => {
  console.log('专业证书变更:', files)
  formData.professional = files.join(',')

  // 立即更新到store
  registerStore.updateStep3({ professional: formData.professional })
  registerStore.saveToStorage()
  console.log('已更新专业证书到store:', formData.professional)
}

// 处理荣誉证书上传
const handleHonorChange = (files: string[]) => {
  console.log('荣誉证书变更:', files)
  formData.honor = files.join(',')

  // 立即更新到store
  registerStore.updateStep3({ honor: formData.honor })
  registerStore.saveToStorage()
  console.log('已更新荣誉证书到store:', formData.honor)
}

// 获取文件列表
const getFileList = (value: string) => {
  if (!value) return []
  return value.split(',').filter(Boolean)
}

// 获取图片源 - 优化以支持本地缓存和云存储
const getImageSrc = (path: string): string => {
  if (!path) return ''

  // 如果是云存储路径
  if (path.startsWith('cloud://')) {
    // 先检查缓存
    const tempCloudURLs = uni.getStorageSync('tempCloudURLs') || {}
    if (tempCloudURLs[path]) {
      console.log(`从缓存加载云文件临时链接: ${path} -> ${tempCloudURLs[path]}`)
      return tempCloudURLs[path]
    }

    // 再检查临时映射（可能是本次会话中刚下载的）
    const tempFileMappings = uni.getStorageSync('tempFileMappings') || {}
    if (tempFileMappings[path]) {
      console.log(`从临时映射获取云文件: ${path} -> ${tempFileMappings[path]}`)
      return tempFileMappings[path]
    }

    // 异步获取临时URL（不阻塞当前函数）
    setTimeout(() => {
      console.log(`开始异步获取云文件临时链接: ${path}`)
      wx.cloud.getTempFileURL({
        fileList: [path],
        success: (res) => {
          if (res.fileList && res.fileList[0] && res.fileList[0].tempFileURL) {
            console.log(`云文件转换临时URL成功: ${path} -> ${res.fileList[0].tempFileURL}`)

            // 保存到缓存
            const tempCloudURLs = uni.getStorageSync('tempCloudURLs') || {}
            tempCloudURLs[path] = res.fileList[0].tempFileURL
            uni.setStorageSync('tempCloudURLs', tempCloudURLs)

            // 保存到临时映射
            const tempFileMappings = uni.getStorageSync('tempFileMappings') || {}
            tempFileMappings[path] = res.fileList[0].tempFileURL
            uni.setStorageSync('tempFileMappings', tempFileMappings)

            // 此时需要强制刷新
            uni.$emit('forceRefreshImages')
          }
        },
        fail: (err) => {
          console.error(`获取云文件临时链接失败: ${path}`, err)
        },
      })
    }, 0)

    // 返回原始路径，等待异步操作更新
    return path
  }

  // 尝试从映射中获取真实路径
  try {
    const mappings = uni.getStorageSync('filePathMappings') || {}
    if (mappings[path]) {
      console.log('从映射获取文件路径:', path, '->', mappings[path])
      return mappings[path]
    }
  } catch (err) {
    console.error('从映射获取文件路径失败:', err)
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

// 预加载所有图片
const preloadImages = () => {
  console.log('开始预加载图片...')
  const imagePaths = [formData.idCardFront, formData.idCardBack, formData.qualification]

  // 添加可能的多图片路径
  if (formData.education) {
    imagePaths.push(...formData.education.split(',').filter(Boolean))
  }
  if (formData.professional) {
    imagePaths.push(...formData.professional.split(',').filter(Boolean))
  }
  if (formData.honor) {
    imagePaths.push(...formData.honor.split(',').filter(Boolean))
  }

  // 过滤有效路径并预加载
  imagePaths.filter(Boolean).forEach((path) => {
    if (path.startsWith('cloud://')) {
      console.log(`预加载云存储图片: ${path}`)
      wx.cloud.getTempFileURL({
        fileList: [path],
        success: (res) => {
          if (res.fileList && res.fileList[0] && res.fileList[0].tempFileURL) {
            console.log(`云文件预加载成功: ${path} -> ${res.fileList[0].tempFileURL}`)

            // 保存到缓存
            const tempCloudURLs = uni.getStorageSync('tempCloudURLs') || {}
            tempCloudURLs[path] = res.fileList[0].tempFileURL
            uni.setStorageSync('tempCloudURLs', tempCloudURLs)

            // 同时更新临时映射
            const tempFileMappings = uni.getStorageSync('tempFileMappings') || {}
            tempFileMappings[path] = res.fileList[0].tempFileURL
            uni.setStorageSync('tempFileMappings', tempFileMappings)

            // 强制刷新组件
            uni.$emit('forceRefreshImages')
          }
        },
        fail: (err) => {
          console.error(`云文件预加载失败: ${path}`, err)
        },
      })
    }
  })
}

// 强制刷新所有图片组件
const refreshKey = ref(0)
const forceRefreshImages = () => {
  refreshKey.value++
  console.log('强制刷新图片组件，刷新键:', refreshKey.value)
}

// 监听强制刷新事件
uni.$on('forceRefreshImages', forceRefreshImages)

// 在组件卸载时移除事件监听
onUnmounted(() => {
  uni.$off('forceRefreshImages', forceRefreshImages)
})

// 预览图片
const previewImage = (fileId: string) => {
  if (!fileId) {
    uni.showToast({
      title: '请先上传图片',
      icon: 'none',
    })
    return
  }

  // 获取图片源
  const imgSrc = getImageSrc(fileId)

  uni.previewImage({
    urls: [imgSrc],
    current: imgSrc,
    success: () => console.log('预览本地图片成功'),
    fail: (err) => {
      console.error('预览本地图片失败:', err)
      uni.showToast({
        title: '预览图片失败',
        icon: 'none',
      })
    },
  })
}

// 监听文件上传状态
const uploadStatus = ref({
  loading: false,
  error: null,
})

// 监听上传状态变化
watch(
  () => uploadStatus.value.loading,
  (newVal) => {
    if (!newVal) {
      uni.hideLoading()
    }
  },
)

// 监听错误状态变化
watch(
  () => uploadStatus.value.error,
  (newVal) => {
    if (newVal) {
      uni.hideLoading()
      uni.showToast({
        title: newVal.message || '上传失败',
        icon: 'none',
      })
    }
  },
)

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

// 在组件挂载时，从store中恢复数据
onMounted(() => {
  console.log('register-page3 onMounted')
  console.log('修改模式:', registerStore.isModifyMode)

  // 从store中恢复数据
  const step3Data = registerStore.step3Data
  if (step3Data) {
    console.log('从store恢复的step3数据:', step3Data)
    formData.idCardFront = step3Data.idCardFront || ''
    formData.idCardBack = step3Data.idCardBack || ''
    formData.qualification = step3Data.qualification || ''
    formData.education = step3Data.education || ''
    formData.professional = step3Data.professional || ''
    formData.honor = step3Data.honor || ''
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
    return
  }

  // 如果是修改模式，预加载所有图片
  if (registerStore.isModifyMode) {
    console.log('修改模式下预加载图片')
    // 显示加载提示
    uni.showLoading({
      title: '加载图片中...',
      mask: true,
    })

    // 预加载图片并在完成后隐藏加载提示
    setTimeout(() => {
      preloadImages()
      setTimeout(() => {
        uni.hideLoading()
        // 强制刷新图片显示
        forceRefreshImages()
      }, 1000)
    }, 100)
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

  // 预览容器样式
  .preview-container {
    padding: 10rpx;
    margin-top: 16rpx;
    background-color: #f9f9f9;
    border: 1px solid #eee;
    border-radius: 8rpx;

    .preview-image {
      width: 100%;
      height: 200rpx;
      object-fit: contain;
    }
  }
}
</style>
