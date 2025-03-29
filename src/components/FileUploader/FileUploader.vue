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
          :src="value"
          mode="aspectFill"
          @click.stop="previewImage([value])"
        />
        <view v-else class="placeholder">
          <text class="icon">+</text>
          <text class="text">{{ placeholder || '点击上传' }}</text>
        </view>
        <view v-if="value" class="delete-icon" @click.stop="handleDelete">×</view>
      </view>
    </template>

    <!-- 多文件上传模式 -->
    <template v-else>
      <view class="upload-grid">
        <!-- 已上传的文件列表 -->
        <view v-for="(file, index) in fileList" :key="index" class="grid-item has-file">
          <image
            class="file-preview"
            :src="file"
            mode="aspectFill"
            @click.stop="previewImage(fileList, index)"
          />
          <view class="delete-icon" @click.stop="handleDeleteMultiple(index)">×</view>
        </view>

        <!-- 上传按钮 -->
        <view
          v-if="fileList.length < maxCount"
          class="grid-item upload-btn"
          @click="handleMultipleUpload"
        >
          <text class="icon">+</text>
          <text class="text">{{ placeholder || '上传' }}</text>
        </view>
      </view>

      <!-- 计数提示 -->
      <view class="upload-tip" v-if="multiple">
        <text>{{ fileList.length }}/{{ maxCount }}</text>
      </view>
    </template>

    <!-- 错误提示 -->
    <view class="error-text" v-if="hasError && errorMessage">
      {{ errorMessage }}
    </view>
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
import { ref, computed } from 'vue'
import useUpload from '@/hooks/useUpload'

export default {
  name: 'FileUploader',
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
  },
  setup(props, { emit }) {
    // 单文件上传处理
    const handleSingleUpload = () => {
      const { run, loading, data } = useUpload({ type: props.fileType })

      // 显示加载状态
      uni.showLoading({
        title: '上传中...',
      })

      // 执行上传
      run()

      // 监听上传状态
      const stopWatch = uni.$watch(
        () => loading.value,
        (loading) => {
          if (!loading) {
            uni.hideLoading()
            stopWatch() // 停止监听

            if (data.value) {
              try {
                let result
                if (typeof data.value === 'string') {
                  result = JSON.parse(data.value)
                } else {
                  result = data.value
                }

                // 从响应中提取URL
                const url = result.url || (result.data && result.data.url) || result

                if (url) {
                  emit('input', url)
                  uni.showToast({
                    title: '上传成功',
                    icon: 'success',
                  })
                } else {
                  throw new Error('未找到图片URL')
                }
              } catch (e) {
                console.error('处理上传响应出错:', e)
                uni.showToast({
                  title: '上传失败',
                  icon: 'none',
                })
              }
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

      const { run, loading, data } = useUpload({ type: props.fileType })

      // 显示加载状态
      uni.showLoading({
        title: '上传中...',
      })

      // 执行上传
      run()

      // 监听上传状态
      const stopWatch = uni.$watch(
        () => loading.value,
        (loading) => {
          if (!loading) {
            uni.hideLoading()
            stopWatch() // 停止监听

            if (data.value) {
              try {
                let result
                if (typeof data.value === 'string') {
                  result = JSON.parse(data.value)
                } else {
                  result = data.value
                }

                // 从响应中提取URL
                const url = result.url || (result.data && result.data.url) || result

                if (url) {
                  const newFileList = [...props.fileList, url]
                  emit('update:fileList', newFileList)
                  uni.showToast({
                    title: '上传成功',
                    icon: 'success',
                  })
                } else {
                  throw new Error('未找到图片URL')
                }
              } catch (e) {
                console.error('处理上传响应出错:', e)
                uni.showToast({
                  title: '上传失败',
                  icon: 'none',
                })
              }
            }
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
            emit('input', '')
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

    // 预览图片
    const previewImage = (urls, current = 0) => {
      uni.previewImage({
        urls,
        current,
      })
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

    return {
      handleSingleUpload,
      handleMultipleUpload,
      handleDelete,
      handleDeleteMultiple,
      previewImage,
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
