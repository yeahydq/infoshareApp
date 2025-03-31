<template>
  <view class="file-uploader">
    <!-- 单文件上传模式 -->
    <template v-if="!multiple">
      <view
        class="upload-box"
        :class="{ 'has-file': value, error: hasError }"
        @click="handleSingleUpload"
      >
        <image
          v-if="value"
          class="file-preview"
          :src="getImageSrc(value)"
          mode="aspectFit"
          @click.stop="handlePreview([value])"
          @error="(e) => handleImageError(e, value)"
        />
        <view v-else class="placeholder">
          <text class="icon">+</text>
          <text class="text">{{ placeholder || '点击上传' }}</text>
        </view>
        <view v-if="value" class="delete-icon" @click.stop="handleDelete">×</view>
      </view>

      <!-- 单文件预览 -->
      <view v-if="showPreview && value" class="preview-container">
        <image
          class="preview-image"
          :src="getImageSrc(value)"
          mode="aspectFit"
          @click="handlePreview([value])"
        />
      </view>
    </template>

    <!-- 多文件上传模式 -->
    <template v-else>
      <view class="upload-grid">
        <!-- 已上传的文件列表 -->
        <view v-for="(file, index) in currentFileList" :key="index" class="grid-item has-file">
          <image
            class="file-preview"
            :src="getImageSrc(file, index)"
            mode="aspectFill"
            @click.stop="handlePreview(currentFileList, index)"
            @error="(e) => handleImageError(e, file + '-' + index)"
          />
          <view class="delete-icon" @click.stop="handleDeleteMultiple(index)">×</view>
        </view>

        <!-- 上传按钮 -->
        <view
          v-if="currentFileList.length < maxCount"
          class="grid-item upload-btn"
          @click="handleMultipleUpload"
        >
          <text class="icon">+</text>
          <text class="text">{{ placeholder || '上传' }}</text>
        </view>
      </view>

      <!-- 计数提示 -->
      <view class="upload-tip" v-if="multiple">
        <text>{{ currentFileList.length }}/{{ maxCount }}</text>
      </view>
    </template>

    <!-- 错误提示 -->
    <view class="error-text" v-if="hasError && errorMessage">
      {{ errorMessage }}
    </view>

    <!-- 图片裁剪组件 -->
    <ImageCropper
      v-if="showCropper"
      :image="cropperImage"
      @confirm="handleCropConfirm"
      @cancel="handleCropCancel"
    />
  </view>
</template>

<script>
/**
 * 通用文件上传组件
 *
 * 支持功能：
 * 1. 单文件/多文件上传
 * 2. 图片预览
 * 3. 文件删除
 * 4. 云函数上传处理
 * 5. 上传进度提示
 * 6. 错误处理
 */
import { ref, computed, watch, onMounted } from 'vue'
import useUpload from '@/hooks/useUpload'
import ImageCropper from '@/components/ImageCropper/ImageCropper.vue'

export default {
  name: 'FileUploader',
  components: {
    ImageCropper,
  },
  props: {
    // 文件类型，如idCardFront、educationCert等
    fileType: {
      type: String,
      required: true,
    },
    // 是否多文件上传
    multiple: {
      type: Boolean,
      default: false,
    },
    // 允许的最大文件数（多文件模式下有效）
    maxCount: {
      type: Number,
      default: 9,
    },
    // 占位文字
    placeholder: {
      type: String,
      default: '',
    },
    // 文件URL（单文件模式）
    value: {
      type: String,
      default: '',
    },
    // 文件URL列表（多文件模式）
    fileList: {
      type: Array,
      default: () => [],
    },
    // 错误状态
    hasError: {
      type: Boolean,
      default: false,
    },
    // 错误信息
    errorMessage: {
      type: String,
      default: '',
    },
    // 允许选择的来源
    sourceType: {
      type: Array,
      default: () => ['album', 'camera'],
    },
    // 添加上传状态属性
    uploadStatus: {
      type: Object,
      default: () => ({
        loading: false,
        error: null,
      }),
    },
    // 是否启用裁剪
    enableCrop: {
      type: Boolean,
      default: false,
    },
    // 裁剪类型: idCard, avatar, custom
    cropType: {
      type: String,
      default: 'custom',
    },
  },
  emits: ['update:uploadStatus', 'update:value', 'update:fileList', 'change'],
  setup(props, { emit }) {
    // 计算属性：当前文件列表
    const currentFileList = computed(() => {
      if (props.multiple) {
        return props.fileList
      }
      return props.value ? [props.value] : []
    })

    // 图片裁剪相关状态
    const showCropper = ref(false)
    const cropperImage = ref('')
    const tempFilePath = ref('')

    // 单文件上传处理
    const handleSingleUpload = () => {
      const { run, loading, data, error } = useUpload({ type: props.fileType })

      // 显示加载状态
      uni.showLoading({
        title: '上传中...',
      })

      // 更新上传状态
      emit('update:uploadStatus', {
        loading: true,
        error: null,
      })

      // 执行上传，并接收临时文件路径
      run({
        success: (tempPath) => {
          // 如果启用了裁剪功能，显示裁剪界面
          if (props.enableCrop && tempPath) {
            tempFilePath.value = tempPath
            cropperImage.value = tempPath
            showCropper.value = true

            // 隐藏加载提示
            uni.hideLoading()

            // 更新上传状态
            emit('update:uploadStatus', {
              loading: false,
              error: null,
            })
          } else {
            // 继续正常的上传流程
            console.log('跳过裁剪，使用原始文件')
          }
        },
      })

      // 监听上传状态
      watch(
        () => loading.value,
        (newVal) => {
          if (!newVal) {
            uni.hideLoading()
          }
          emit('update:uploadStatus', {
            loading: newVal,
            error: error.value,
          })
        },
      )

      // 监听错误状态
      watch(
        () => error.value,
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

      // 监听数据变化
      watch(
        () => data.value,
        (newVal) => {
          if (newVal) {
            console.log('文件上传成功 (单文件):', newVal)
            emit('update:value', newVal)
            emit('change', [newVal])
            // 更新上传状态
            emit('update:uploadStatus', {
              loading: false,
              error: null,
            })

            // 在本地缓存中保存文件路径与新传入的值的映射关系（方便预览页使用）
            try {
              const storedMappings = uni.getStorageSync('filePathMappings') || {}
              if (storedMappings) {
                const updatedMappings = {
                  ...storedMappings,
                  [newVal]: processImagePath(newVal), // 存储映射关系
                }
                uni.setStorageSync('filePathMappings', updatedMappings)
                console.log('已保存文件路径映射:', updatedMappings)
              }
            } catch (err) {
              console.error('保存文件路径映射失败:', err)
            }
          }
        },
      )
    }

    // 多文件上传处理
    const handleMultipleUpload = () => {
      if (props.fileList.length >= props.maxCount) {
        uni.showToast({
          title: `最多只能上传${props.maxCount}个文件`,
          icon: 'none',
        })
        return
      }

      const { run, loading, data, error } = useUpload({ type: props.fileType })

      // 显示加载状态
      uni.showLoading({
        title: '上传中...',
      })

      // 更新上传状态
      emit('update:uploadStatus', {
        loading: true,
        error: null,
      })

      // 执行上传
      run()

      // 监听上传状态
      watch(
        () => loading.value,
        (newVal) => {
          if (!newVal) {
            uni.hideLoading()
          }
          emit('update:uploadStatus', {
            loading: newVal,
            error: error.value,
          })
        },
      )

      // 监听错误状态
      watch(
        () => error.value,
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

      // 监听数据变化
      watch(
        () => data.value,
        (newVal) => {
          if (newVal) {
            console.log('多文件上传成功:', newVal)
            const newFileList = [...props.fileList, newVal]
            emit('update:fileList', newFileList)
            emit('change', newFileList)
            // 更新上传状态
            emit('update:uploadStatus', {
              loading: false,
              error: null,
            })
          }
        },
      )
    }

    // 单文件删除
    const handleDelete = () => {
      uni.showModal({
        title: '提示',
        content: '确定删除此文件吗？',
        success: (res) => {
          if (res.confirm) {
            emit('update:value', '')
          }
        },
      })
    }

    // 多文件删除
    const handleDeleteMultiple = (index) => {
      uni.showModal({
        title: '提示',
        content: '确定删除此文件吗？',
        success: (res) => {
          if (res.confirm) {
            const newFileList = [...props.fileList]
            newFileList.splice(index, 1)
            emit('update:fileList', newFileList)
          }
        },
      })
    }

    // 处理图片预览
    const handlePreview = (urls, current = 0) => {
      // 获取实际处理过的图片路径数组
      const processedUrls = Array.isArray(urls)
        ? urls
            .filter((url) => url) // 过滤空值
            .map((url) => {
              // 直接使用 processImagePath 而不是 getImageSrc 来避免使用占位图
              return processImagePath(url)
            })
            .filter((url) => url && url !== placeholderImage.value) // 过滤掉空值和占位图
        : []

      // 打印预览信息，方便调试
      console.log('预览图片地址:', processedUrls)

      if (processedUrls.length === 0) {
        uni.showToast({
          title: '无可预览的图片',
          icon: 'none',
        })
        return
      }

      // 调用预览
      uni.previewImage({
        urls: processedUrls,
        current: processedUrls[current] || processedUrls[0],
        fail: (err) => {
          console.error('图片预览失败:', err)
          uni.showToast({
            title: '图片预览失败',
            icon: 'none',
          })
        },
      })
    }

    // 处理图片路径
    const processImagePath = (path) => {
      if (!path) {
        console.log('路径为空')
        return ''
      }

      // 如果是网络路径，直接使用
      if (path.startsWith('http') || path.startsWith('https')) {
        console.log('网络路径:', path)
        return path
      }

      // 如果是微信临时文件路径，直接使用
      if (path.startsWith('wxfile://') || path.startsWith('file://')) {
        console.log('本地临时文件路径:', path)
        return path
      }

      // 如果是 Base64 数据 URL，直接使用
      if (path.startsWith('data:image/')) {
        console.log('数据 URL 路径')
        return path
      }

      // 先尝试从文件路径映射中获取
      try {
        const mappings = uni.getStorageSync('filePathMappings') || {}
        if (mappings[path]) {
          console.log('从映射获取文件路径:', path, '->', mappings[path])
          return mappings[path]
        }
      } catch (err) {
        console.error('从映射获取文件路径失败:', err)
      }

      // 如果是缓存键（以 file_ 开头），则尝试从本地存储获取
      if (path.includes('file_')) {
        try {
          // 尝试获取所有缓存文件
          const cachedFiles = uni.getStorageSync('cachedFiles') || {}
          console.log('所有缓存文件:', Object.keys(cachedFiles))

          if (cachedFiles[path]) {
            const tempPath = cachedFiles[path].tempFilePath
            console.log('从缓存获取文件成功:', path, '→', tempPath)

            // 同时保存到映射中，方便后续使用
            try {
              const mappings = uni.getStorageSync('filePathMappings') || {}
              const updatedMappings = { ...mappings, [path]: tempPath }
              uni.setStorageSync('filePathMappings', updatedMappings)
            } catch (err) {
              console.error('保存文件路径映射失败:', err)
            }

            return tempPath
          }
          console.warn('未找到缓存文件:', path)
        } catch (error) {
          console.error('从缓存获取文件失败:', error)
        }
      }

      // 作为相对路径处理
      const result = path.startsWith('/') ? path : `/${path}`
      console.log('处理为相对路径:', path, '→', result)
      return result
    }

    // 获取系统信息
    const getSystemInfo = () => {
      try {
        const windowInfo = wx.getWindowInfo()
        const appBaseInfo = wx.getAppBaseInfo()
        const deviceInfo = wx.getDeviceInfo()

        return {
          windowWidth: windowInfo.windowWidth,
          windowHeight: windowInfo.windowHeight,
          statusBarHeight: windowInfo.statusBarHeight,
          screenWidth: windowInfo.screenWidth,
          screenHeight: windowInfo.screenHeight,
          platform: appBaseInfo.platform,
          brand: deviceInfo.brand,
          model: deviceInfo.model,
          system: deviceInfo.system,
          version: appBaseInfo.version,
          SDKVersion: appBaseInfo.SDKVersion,
          language: appBaseInfo.language,
          theme: appBaseInfo.theme,
          pixelRatio: windowInfo.pixelRatio,
        }
      } catch (error) {
        console.error('获取系统信息失败:', error)
        return {
          windowWidth: 375,
          windowHeight: 667,
          statusBarHeight: 20,
          screenWidth: 375,
          screenHeight: 667,
          platform: 'ios',
          brand: 'Apple',
          model: 'iPhone',
          system: 'iOS 14.0',
          version: '1.0.0',
          SDKVersion: '2.30.0',
          language: 'zh_CN',
          theme: 'light',
          pixelRatio: 2,
        }
      }
    }

    // 获取系统信息
    const systemInfo = getSystemInfo()

    // 图片占位符 - 使用内置占位符代替需要额外创建的文件
    const placeholderImage = ref('')
    // 在组件挂载时设置默认占位图
    onMounted(() => {
      placeholderImage.value =
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f0f0f0"/%3E%3Cpath d="M100 70 A30 30 0 1 0 100 130 A30 30 0 1 0 100 70z M60 130 L140 130 L100 170z" fill="%23cccccc"/%3E%3C/svg%3E'
    })

    // 图片加载状态
    const imageLoadStatus = ref({})

    // 处理图片加载错误
    const handleImageError = (e, key) => {
      console.error('图片加载失败:', e, key)
      imageLoadStatus.value[key] = 'error'
      // 强制更新视图
      imageLoadStatus.value = { ...imageLoadStatus.value }
    }

    // 获取图片显示路径
    const getImageSrc = (path, index = 0) => {
      const key = `${path}-${index}`
      if (imageLoadStatus.value[key] === 'error') {
        console.log('使用占位图:', placeholderImage.value)
        return placeholderImage.value
      }

      const processedPath = processImagePath(path)
      console.log(`处理路径 ${path} -> ${processedPath}`)
      return processedPath
    }

    // 处理裁剪确认
    const handleCropConfirm = async (croppedImagePath) => {
      try {
        console.log('裁剪后的图片路径:', croppedImagePath)
        showCropper.value = false

        // 显示加载中
        uni.showLoading({
          title: '处理中...',
          mask: true,
        })

        // 更新上传状态
        emit('update:uploadStatus', {
          loading: true,
          error: null,
        })

        // 生成唯一文件名
        const timestamp = new Date().getTime()
        const fileName = `file_${props.fileType}_${timestamp}`

        // 保存到本地缓存
        try {
          // 从缓存获取或创建新的缓存对象
          const cachedFiles = uni.getStorageSync('cachedFiles') || {}

          // 添加裁剪后的文件信息
          cachedFiles[fileName] = {
            tempFilePath: croppedImagePath,
            fileName,
            type: props.fileType,
            timestamp,
          }

          // 保存回缓存
          uni.setStorageSync('cachedFiles', cachedFiles)
          console.log('裁剪后图片已缓存:', fileName, '->', croppedImagePath)

          // 创建或更新文件路径映射
          const mappings = uni.getStorageSync('filePathMappings') || {}
          mappings[fileName] = croppedImagePath
          uni.setStorageSync('filePathMappings', mappings)
          console.log('文件路径映射已更新:', fileName, '->', croppedImagePath)

          // 更新模型值
          emit('update:value', fileName)
          // 触发变更事件
          emit('change', [fileName])
          // 触发上传成功事件
          emit('upload-success', fileName)
        } catch (error) {
          console.error('保存裁剪图片到缓存失败:', error)
          emit('update:uploadStatus', {
            loading: false,
            error: { message: '保存裁剪图片失败，请重试' },
          })
          emit('upload-error', error)
        }

        // 隐藏加载中
        uni.hideLoading()

        // 更新上传状态为完成
        emit('update:uploadStatus', {
          loading: false,
          error: null,
        })
      } catch (error) {
        console.error('处理裁剪图片失败:', error)

        // 隐藏加载中
        uni.hideLoading()

        // 更新上传状态为错误
        emit('update:uploadStatus', {
          loading: false,
          error: { message: error.errMsg || '处理裁剪图片失败' },
        })

        emit('upload-error', error)
      }
    }

    // 处理裁剪取消
    const handleCropCancel = () => {
      showCropper.value = false
      // 如果需要，可以在这里处理取消裁剪后的逻辑
    }

    return {
      currentFileList,
      handleSingleUpload,
      handleMultipleUpload,
      handleDelete,
      handleDeleteMultiple,
      handlePreview,
      processImagePath,
      handleImageError,
      getImageSrc,
      // 裁剪相关
      showCropper,
      cropperImage,
      tempFilePath,
      handleCropConfirm,
      handleCropCancel,
    }
  },
}
</script>

<style scoped>
.file-uploader {
  width: 100%;
  margin-bottom: 15px;
}
/* 单文件上传样式 */
.upload-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 150px;
  overflow: hidden;
  background-color: #f9f9f9;
  border: 1px dashed #ccc;
  border-radius: 8px;
}

.upload-box.has-file {
  height: 100px;
  border-color: #ddd;
  border-style: solid;
}

.upload-box.error {
  border-color: #ff4d4f;
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
}

.icon {
  margin-bottom: 8px;
  font-size: 32px;
  line-height: 32px;
}

.text {
  font-size: 14px;
}

.file-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete-icon {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 0 0 0 8px;
}
/* 预览容器样式 */
.preview-container {
  padding: 10px;
  margin-top: 10px;
  background-color: #f5f5f5;
  border: 1px solid #eee;
  border-radius: 8px;
}

.preview-image {
  display: block;
  width: 100%;
  height: 200px;
  object-fit: contain;
}
/* 多文件上传网格样式 */
.upload-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.grid-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: calc((100% - 20px) / 3);
  aspect-ratio: 1;
  overflow: hidden;
  background-color: #f9f9f9;
  border: 1px dashed #ccc;
  border-radius: 8px;
}

.grid-item.has-file {
  border-color: #ddd;
  border-style: solid;
}

.upload-btn {
  color: #999;
}

.upload-tip {
  margin-top: 5px;
  font-size: 12px;
  color: #999;
  text-align: right;
}

.error-text {
  margin-top: 5px;
  font-size: 12px;
  color: #ff4d4f;
}
</style>
