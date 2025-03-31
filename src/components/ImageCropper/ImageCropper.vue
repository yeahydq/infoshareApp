<template>
  <div class="image-cropper" v-if="visible">
    <div class="mask"></div>
    <div class="cropper-container">
      <div class="cropper-title">{{ title }}</div>
      <div class="cropper-content">
        <div class="cropper-preview" ref="previewRef">
          <div class="crop-image-wrapper" ref="cropImageWrapper">
            <img
              :src="imageUrl"
              class="crop-image"
              ref="cropImageRef"
              :style="imageStyle"
              @load="onImageLoad"
              @error="onImageError"
            />
          </div>
          <div class="crop-frame" :class="{ round: isRound }" :style="frameStyle"></div>
        </div>

        <div class="cropper-tips">{{ tips }}</div>
      </div>
      <div class="cropper-actions">
        <div class="action-btn cancel" @click="handleCancel">取消</div>
        <div class="action-btn confirm" @click="handleConfirm">确认</div>
      </div>
    </div>

    <!-- 隐藏的canvas用于裁剪 -->
    <canvas
      canvas-id="cropCanvas"
      id="cropCanvas"
      class="hidden-canvas"
      :style="{
        width: `${innerCropWidth}px`,
        height: `${innerCropHeight}px`,
      }"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'default', // default, idCard, avatar
  },
})

const emit = defineEmits(['confirm', 'cancel'])

// 裁剪框类型配置
const cropTypes = {
  default: {
    width: 300,
    height: 300,
    ratio: 1,
    round: false,
    title: '裁剪图片',
    tips: '拖动或缩放调整图片位置',
  },
  idCard: {
    width: 300,
    height: 189, // 身份证比例约为 1.585:1
    ratio: 1.585,
    round: false,
    title: '调整身份证照片',
    tips: '请确保身份证信息清晰可见',
  },
  avatar: {
    width: 300,
    height: 300,
    ratio: 1,
    round: true,
    title: '调整头像',
    tips: '拖动或缩放调整头像位置',
  },
}

// 根据类型获取配置
const currentCropType = computed(() => {
  return cropTypes[props.type] || cropTypes.default
})

// 计算内部裁剪宽高（实际像素）
const innerCropWidth = computed(() => currentCropType.value.width * 2)
const innerCropHeight = computed(() => currentCropType.value.height * 2)

// 组件相关变量
const title = computed(() => currentCropType.value.title)
const tips = computed(() => currentCropType.value.tips)
const isRound = computed(() => currentCropType.value.round)

// 裁剪框样式
const frameStyle = computed(() => {
  return {
    width: `${currentCropType.value.width}px`,
    height: `${currentCropType.value.height}px`,
  }
})

// 图像相关变量
const previewRef = ref(null)
const cropImageRef = ref(null)
const cropImageWrapper = ref(null)

// 图像状态
const imageLoaded = ref(false)
const imageWidth = ref(0)
const imageHeight = ref(0)
const imageRatio = ref(1)
const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)

// 图像样式
const imageStyle = computed(() => {
  return {
    transform: `translate(${translateX.value}px, ${translateY.value}px) scale(${scale.value})`,
  }
})

// 图像加载处理
const onImageLoad = async (e) => {
  imageLoaded.value = true

  // 获取图像原始尺寸
  try {
    const imageInfo = await getImageInfo(props.imageUrl)
    imageWidth.value = imageInfo.width
    imageHeight.value = imageInfo.height
    imageRatio.value = imageWidth.value / imageHeight.value

    console.log(
      '图片原始尺寸:',
      imageWidth.value,
      'x',
      imageHeight.value,
      '比例:',
      imageRatio.value,
    )

    // 初始化图像位置和缩放
    initImagePosition()
  } catch (error) {
    console.error('获取图片信息失败:', error)
  }
}

// 获取图像信息
const getImageInfo = (src: string): Promise<UniApp.GetImageInfoSuccessData> => {
  return new Promise((resolve, reject) => {
    uni.getImageInfo({
      src,
      success: (res: UniApp.GetImageInfoSuccessData) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}

// 初始化图像位置和缩放
const initImagePosition = () => {
  if (!cropImageRef.value || !previewRef.value) return

  const cropWidth = currentCropType.value.width
  const cropHeight = currentCropType.value.height
  const cropRatio = cropWidth / cropHeight

  // 计算适当的缩放比例
  let initialScale = 1

  if (imageRatio.value > cropRatio) {
    // 图片比裁剪框更宽，以高度为基准
    initialScale = cropHeight / imageHeight.value
  } else {
    // 图片比裁剪框更高或一样，以宽度为基准
    initialScale = cropWidth / imageWidth.value
  }

  // 稍微放大一点，使图片能覆盖裁剪框
  initialScale *= 1.1

  // 设置初始缩放
  scale.value = initialScale

  // 居中图片
  translateX.value = (cropWidth - imageWidth.value * initialScale) / 2
  translateY.value = (cropHeight - imageHeight.value * initialScale) / 2

  console.log('初始化图片位置:', '缩放:', scale.value, '位置:', translateX.value, translateY.value)
}

// 图像加载错误处理
const onImageError = (e) => {
  console.error('图片加载失败:', e)
  uni.showToast({
    title: '图片加载失败',
    icon: 'none',
  })
}

// 处理取消
const handleCancel = () => {
  emit('cancel')
}

// 处理确认
const handleConfirm = async () => {
  if (!imageLoaded.value) {
    uni.showToast({
      title: '图片尚未加载完成',
      icon: 'none',
    })
    return
  }

  try {
    // 裁剪图片
    const croppedImagePath = await cropImage()
    console.log('裁剪后的图片路径:', croppedImagePath)

    // 返回裁剪后的图片路径
    emit('confirm', croppedImagePath)
  } catch (error) {
    console.error('裁剪图片失败:', error)
    uni.showToast({
      title: '裁剪图片失败',
      icon: 'none',
    })
  }
}

// 裁剪图片
const cropImage = async () => {
  return new Promise((resolve, reject) => {
    try {
      // 计算裁剪参数
      const cropWidth = currentCropType.value.width
      const cropHeight = currentCropType.value.height

      // 计算实际裁剪参数（基于图片原始尺寸和当前变换）
      const scaledImageWidth = imageWidth.value * scale.value
      const scaledImageHeight = imageHeight.value * scale.value

      // 计算裁剪区域在原图中的位置
      const cropLeft = -translateX.value / scale.value
      const cropTop = -translateY.value / scale.value

      // 计算裁剪区域在原图中的尺寸
      const cropAreaWidth = cropWidth / scale.value
      const cropAreaHeight = cropHeight / scale.value

      console.log('裁剪参数:', {
        imageSize: `${imageWidth.value}x${imageHeight.value}`,
        scale: scale.value,
        translate: `${translateX.value},${translateY.value}`,
        cropArea: `${cropLeft},${cropTop},${cropAreaWidth}x${cropAreaHeight}`,
        canvasSize: `${innerCropWidth.value}x${innerCropHeight.value}`,
      })

      // 创建canvas上下文
      const ctx = uni.createCanvasContext('cropCanvas')

      // 清空画布
      ctx.clearRect(0, 0, innerCropWidth.value, innerCropHeight.value)

      // 绘制裁剪后的图片
      ctx.drawImage(
        props.imageUrl,
        cropLeft,
        cropTop,
        cropAreaWidth,
        cropAreaHeight,
        0,
        0,
        innerCropWidth.value,
        innerCropHeight.value,
      )

      // 提交绘制
      ctx.draw(false, () => {
        setTimeout(() => {
          // 导出图片
          exportImage().then(resolve).catch(reject)
        }, 300) // 给canvas一点时间完成绘制
      })
    } catch (error) {
      console.error('裁剪图片过程出错:', error)
      reject(error)
    }
  })
}

// 导出图片
const exportImage = () => {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    uni.canvasToTempFilePath({
      canvasId: 'cropCanvas',
      success: (res) => {
        console.log('导出裁剪图片成功:', res.tempFilePath)
        resolve(res.tempFilePath)
      },
      fail: (err) => {
        console.error('导出裁剪图片失败:', err)
        reject(err)
      },
    })
    // #endif

    // #ifndef MP-WEIXIN
    uni.canvasToTempFilePath({
      canvasId: 'cropCanvas',
      success: (res) => {
        console.log('导出裁剪图片成功:', res.tempFilePath)
        resolve(res.tempFilePath)
      },
      fail: (err) => {
        console.error('导出裁剪图片失败:', err)
        reject(err)
      },
    })
    // #endif
  })
}

onMounted(() => {
  console.log('ImageCropper组件已挂载，图片URL:', props.imageUrl)
})
</script>

<style lang="scss" scoped>
.image-cropper {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
  }

  .cropper-container {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 90%;
    max-width: 650rpx;
    overflow: hidden;
    background-color: #fff;
    border-radius: 16rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
    transform: translate(-50%, -50%);

    .cropper-title {
      padding: 24rpx;
      font-size: 32rpx;
      font-weight: 500;
      color: #333;
      text-align: center;
      border-bottom: 1rpx solid #eee;
    }

    .cropper-content {
      padding: 30rpx;

      .cropper-preview {
        position: relative;
        width: 100%;
        height: 600rpx;
        overflow: hidden;
        background-color: #000;

        .crop-image-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          transform: translate(-50%, -50%);

          .crop-image {
            max-width: 100%;
            max-height: 100%;
            touch-action: none;
            transform-origin: center;
            will-change: transform;
          }
        }

        .crop-frame {
          position: absolute;
          top: 50%;
          left: 50%;
          border: 2rpx solid #fff;
          box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
          transform: translate(-50%, -50%);

          &.round {
            border-radius: 50%;
          }
        }
      }

      .cropper-tips {
        margin-top: 20rpx;
        font-size: 26rpx;
        color: #666;
        text-align: center;
      }
    }

    .cropper-actions {
      display: flex;
      padding: 20rpx;
      border-top: 1rpx solid #eee;

      .action-btn {
        flex: 1;
        padding: 20rpx 0;
        font-size: 30rpx;
        text-align: center;
        border-radius: 8rpx;

        &.cancel {
          margin-right: 10rpx;
          color: #666;
          background-color: #f5f5f5;
        }

        &.confirm {
          margin-left: 10rpx;
          color: #fff;
          background-color: #07c160;
        }
      }
    }
  }

  .hidden-canvas {
    position: fixed;
    top: -9999px;
    left: -9999px;
    z-index: -1;
  }
}
</style>
