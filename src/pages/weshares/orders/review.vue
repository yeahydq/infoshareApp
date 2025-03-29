<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '课程评价', navigationStyle: 'default' },
}
</route>

<template>
  <view class="container">
    <!-- 课程信息 -->
    <view class="course-section">
      <image :src="order.courseImage" mode="aspectFill" class="course-image" />
      <view class="course-info">
        <text class="course-name">{{ order.courseName }}</text>
        <text class="teacher-name">讲师：{{ order.teacherName }}</text>
      </view>
    </view>

    <!-- 评分 -->
    <view class="rating-section">
      <view class="section-title">课程评分</view>
      <view class="rating-content">
        <view class="rating-stars">
          <text
            v-for="(star, index) in 5"
            :key="index"
            class="star"
            :class="{ active: index < rating }"
            @tap="setRating(index + 1)"
          >
            ★
          </text>
        </view>
        <text class="rating-text">{{ ratingText }}</text>
      </view>
    </view>

    <!-- 评价内容 -->
    <view class="review-section">
      <view class="section-title">评价内容</view>
      <textarea
        v-model="content"
        class="review-textarea"
        placeholder="请输入您的评价内容（最少10个字）"
        :maxlength="500"
      />
      <view class="word-count">{{ content.length }}/500</view>
    </view>

    <!-- 图片上传 -->
    <view class="upload-section">
      <view class="section-title">上传图片</view>
      <view class="upload-content">
        <view class="image-list">
          <view v-for="(image, index) in images" :key="index" class="image-item">
            <image :src="image" mode="aspectFill" class="preview-image" />
            <text class="delete-btn" @tap="deleteImage(index)">×</text>
          </view>
          <view v-if="images.length < 9" class="upload-btn" @tap="chooseImage">
            <text class="upload-icon">+</text>
            <text class="upload-text">上传图片</text>
          </view>
        </view>
        <text class="upload-tip">最多上传9张图片</text>
      </view>
    </view>

    <!-- 匿名评价 -->
    <view class="anonymous-section">
      <text class="anonymous-label">匿名评价</text>
      <switch :checked="isAnonymous" @change="toggleAnonymous" color="#2B5CFF" />
    </view>

    <!-- 提交按钮 -->
    <view class="submit-section">
      <button class="submit-btn" :disabled="!isValid" @tap="submitReview">提交评价</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrderStore } from '@/store/order'

const orderStore = useOrderStore()
const order = ref({})
const rating = ref(0)
const content = ref('')
const images = ref([])
const isAnonymous = ref(false)

// 评分文本
const ratingText = computed(() => {
  const texts = ['很差', '差', '一般', '好', '很好']
  return rating.value ? texts[rating.value - 1] : '请选择评分'
})

// 表单验证
const isValid = computed(() => {
  return rating.value > 0 && content.value.length >= 10
})

// 获取订单详情
const getOrderDetail = async (orderId) => {
  try {
    const data = await orderStore.getOrderDetail(orderId)
    order.value = data
  } catch (error) {
    console.error('获取订单详情失败:', error)
    uni.showToast({
      title: '获取订单详情失败',
      icon: 'none',
    })
  }
}

// 设置评分
const setRating = (value) => {
  rating.value = value
}

// 选择图片
const chooseImage = () => {
  uni.chooseImage({
    count: 9 - images.value.length,
    success: (res) => {
      images.value = [...images.value, ...res.tempFilePaths]
    },
  })
}

// 删除图片
const deleteImage = (index) => {
  images.value.splice(index, 1)
}

// 切换匿名评价
const toggleAnonymous = (e) => {
  isAnonymous.value = e.detail.value
}

// 提交评价
const submitReview = async () => {
  if (!isValid.value) {
    uni.showToast({
      title: '请完善评价内容',
      icon: 'none',
    })
    return
  }

  try {
    // 上传图片
    const uploadedImages = []
    for (const image of images.value) {
      const uploadRes = await uni.uploadFile({
        url: '/api/upload',
        filePath: image,
        name: 'file',
      })
      const data = JSON.parse(uploadRes.data)
      uploadedImages.push(data.url)
    }

    // 提交评价
    await orderStore.submitReview(order.value.id, {
      rating: rating.value,
      content: content.value,
      images: uploadedImages,
      isAnonymous: isAnonymous.value,
    })

    uni.showToast({
      title: '评价成功',
      icon: 'success',
    })

    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error) {
    console.error('提交评价失败:', error)
    uni.showToast({
      title: '提交评价失败',
      icon: 'none',
    })
  }
}

onMounted(() => {
  const orderId = uni.getStorageSync('currentOrderId')
  if (orderId) {
    getOrderDetail(orderId)
  }
})
</script>

<style>
.container {
  min-height: 100vh;
  padding-bottom: 100px;
  background-color: #f5f5f5;
}

.course-section {
  display: flex;
  padding: 16px;
  margin-bottom: 12px;
  background-color: #fff;
}

.course-image {
  width: 120px;
  height: 120px;
  margin-right: 16px;
  border-radius: 8px;
}

.course-info {
  flex: 1;
}

.course-name {
  display: -webkit-box;
  margin-bottom: 8px;
  overflow: hidden;
  font-size: 16px;
  color: #333;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.teacher-name {
  font-size: 14px;
  color: #666;
}

.rating-section,
.review-section,
.upload-section {
  padding: 16px;
  margin-bottom: 12px;
  background-color: #fff;
}

.section-title {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.rating-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rating-stars {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.star {
  font-size: 32px;
  color: #ddd;
  cursor: pointer;
}

.star.active {
  color: #ffd700;
}

.rating-text {
  font-size: 14px;
  color: #666;
}

.review-textarea {
  box-sizing: border-box;
  width: 100%;
  height: 200px;
  padding: 12px;
  font-size: 14px;
  line-height: 1.5;
  border: 1px solid #eee;
  border-radius: 4px;
}

.word-count {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
  text-align: right;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.image-item {
  position: relative;
  width: 100px;
  height: 100px;
}

.preview-image {
  width: 100%;
  height: 100%;
  border-radius: 4px;
}

.delete-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  font-size: 16px;
  line-height: 20px;
  color: #fff;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}

.upload-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border: 1px dashed #ddd;
  border-radius: 4px;
}

.upload-icon {
  margin-bottom: 4px;
  font-size: 24px;
  color: #999;
}

.upload-text {
  font-size: 12px;
  color: #999;
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}

.anonymous-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  margin-bottom: 12px;
  background-color: #fff;
}

.anonymous-label {
  font-size: 14px;
  color: #333;
}

.submit-section {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 12px 16px;
  background-color: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.submit-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  line-height: 44px;
  color: #fff;
  text-align: center;
  background-color: #2b5cff;
  border-radius: 4px;
}

.submit-btn[disabled] {
  background-color: #ccc;
}
</style>
