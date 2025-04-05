<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '专业人士详情' },
}
</route>

<template>
  <view class="container">
    <!-- 加载中提示 -->
    <view class="loading-container" v-if="loading">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 主内容区 -->
    <block v-else>
      <!-- 头部基本信息 -->
      <view class="profile-header">
        <image
          class="profile-avatar"
          :src="professional.avatarUrl || defaultAvatar"
          mode="aspectFill"
        />
        <view class="profile-info">
          <view class="profile-name-row">
            <text class="profile-name">{{ professional.name || '未知专家' }}</text>
            <text class="verify-icon" v-if="professional.verified">✓</text>
          </view>
          <view class="profile-rating">
            <text
              v-for="n in 5"
              :key="n"
              class="star"
              :class="{ filled: n <= (professional.rating || 5) }"
            >
              ★
            </text>
            <text class="review-count" v-if="professional.reviewCount">
              ({{ professional.reviewCount }})
            </text>
          </view>
          <view class="profile-stats">
            <text>{{ renderProfessionalStats() }}</text>
          </view>
          <view class="profile-price" v-if="professional.hourlyRate">
            <text class="price">¥{{ professional.hourlyRate }}</text>
            <text class="price-unit">/小时</text>
          </view>
        </view>
      </view>

      <!-- 服务信息 -->
      <view class="section service-section">
        <view class="section-title">服务项目</view>
        <view class="service-name">{{ professional.serviceName || '专业服务' }}</view>
        <view class="service-desc">{{ professional.serviceDescription || '暂无服务描述' }}</view>
      </view>

      <!-- 地区信息 -->
      <view class="section location-section">
        <view class="section-title">服务地区</view>
        <view class="location-info">
          {{ professional.province || '' }} {{ professional.city || '' }}
          {{ professional.district || '' }}
        </view>
      </view>

      <!-- 专业标签 -->
      <view class="section tags-section" v-if="professional.tags && professional.tags.length">
        <view class="section-title">专业标签</view>
        <view class="tags-list">
          <text v-for="(tag, index) in professional.tags" :key="index" class="tag-item">
            {{ tag }}
          </text>
        </view>
      </view>

      <!-- 相关图片 -->
      <view class="section images-section" v-if="professional.images && professional.images.length">
        <view class="section-title">相关图片</view>
        <scroll-view scroll-x class="images-scroll">
          <view class="images-row">
            <image
              v-for="(img, index) in professional.images"
              :key="index"
              :src="img"
              mode="aspectFill"
              class="service-image"
              @tap="previewImage(img)"
            />
          </view>
        </scroll-view>
      </view>

      <!-- 用户评价 -->
      <view class="section reviews-section">
        <view class="section-header">
          <view class="section-title">用户评价</view>
          <view class="all-reviews" @tap="navigateToReviews">查看全部</view>
        </view>

        <view class="empty-reviews" v-if="!reviews.length">
          <text>暂无评价</text>
        </view>

        <view class="review-item" v-for="(review, index) in reviews" :key="index">
          <view class="review-header">
            <image
              class="reviewer-avatar"
              :src="review.userAvatar || defaultAvatar"
              mode="aspectFill"
            />
            <view class="reviewer-info">
              <text class="reviewer-name">{{ review.userName || '匿名用户' }}</text>
              <view class="review-rating">
                <text v-for="n in 5" :key="n" class="star" :class="{ filled: n <= review.rating }">
                  ★
                </text>
                <text class="review-time">{{ formatDate(review.createTime) }}</text>
              </view>
            </view>
          </view>
          <view class="review-content">{{ review.content }}</view>
        </view>
      </view>

      <!-- 底部操作区 -->
      <view class="bottom-actions">
        <button class="action-btn contact" @tap="contactProfessional">
          <text class="btn-icon">📱</text>
          <text>联系TA</text>
        </button>
        <button class="action-btn booking" @tap="navigateToBooking">立即预约</button>
      </view>
    </block>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 默认头像
const defaultAvatar =
  'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

// 页面数据
const loading = ref(true)
const professional = ref<any>({})
const reviews = ref<any[]>([])
const professionalId = ref('')

// 初始化页面
onMounted(async () => {
  // 获取路由参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  // @ts-ignore - 微信小程序特有的属性
  const options = currentPage.options || {}

  if (options.id) {
    professionalId.value = options.id
    await Promise.all([fetchProfessionalInfo(), fetchReviews()])
  } else {
    // 没有传入ID，显示错误
    uni.showToast({
      title: '未指定专业人士ID',
      icon: 'none',
    })
  }

  loading.value = false
})

// 获取专业人士信息
const fetchProfessionalInfo = async () => {
  try {
    // 调用云函数获取专业人士信息
    const { result } = await uni.cloud.callFunction({
      name: 'profRegister',
      data: {
        action: 'getProfessionalDetail',
        id: professionalId.value,
      },
    })

    if (result.success) {
      professional.value = result.data || {}
    } else {
      uni.showToast({
        title: result.message || '获取专业人士信息失败',
        icon: 'none',
      })
    }
  } catch (error) {
    console.error('获取专业人士信息出错:', error)
    uni.showToast({
      title: '网络错误，请稍后重试',
      icon: 'none',
    })
  }
}

// 获取评价信息
const fetchReviews = async () => {
  try {
    // 调用云函数获取评价信息（暂时模拟数据）
    // 实际项目中应该调用云函数获取真实数据
    reviews.value = generateMockReviews()
  } catch (error) {
    console.error('获取评价信息出错:', error)
    // 不显示错误提示，使用空数据
    reviews.value = []
  }
}

// 生成模拟评价数据（开发阶段使用）
const generateMockReviews = () => {
  const mockReviews = []
  // 生成1-3条评价
  const count = Math.floor(Math.random() * 3) + 1
  for (let i = 0; i < count; i++) {
    mockReviews.push({
      _id: `review_${i}`,
      professionalId: professionalId.value,
      userId: `user_${i}`,
      userName: `用户${Math.floor(Math.random() * 1000)}`,
      userAvatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
      rating: Math.floor(Math.random() * 2) + 4, // 4-5星
      content: [
        '服务很专业，解决了我的问题，非常满意！',
        '态度很好，专业水平高，下次还会找TA。',
        '回复很及时，服务质量不错，推荐给大家。',
        '专业知识丰富，讲解很清晰，学到了很多东西。',
      ][Math.floor(Math.random() * 4)],
      createTime: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
    })
  }
  return mockReviews
}

// 格式化日期
const formatDate = (date: Date) => {
  if (!date) return ''

  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// 渲染专业人士统计信息
const renderProfessionalStats = () => {
  const parts = []

  if (professional.value.experience) {
    parts.push(`经验${professional.value.experience}年`)
  }

  if (professional.value.serviceCount) {
    parts.push(`服务${professional.value.serviceCount}次`)
  }

  if (professional.value.category) {
    parts.push(professional.value.category)
  }

  if (professional.value.education) {
    parts.push(professional.value.education)
  }

  return parts.join(' | ') || '暂无详细信息'
}

// 查看大图
const previewImage = (current: string) => {
  const urls = professional.value.images || []
  uni.previewImage({
    current,
    urls,
  })
}

// 联系专业人士
const contactProfessional = () => {
  if (professional.value.phone) {
    uni.makePhoneCall({
      phoneNumber: professional.value.phone,
    })
  } else {
    uni.showToast({
      title: '暂无联系方式',
      icon: 'none',
    })
  }
}

// 跳转到预约页面
const navigateToBooking = () => {
  uni.navigateTo({
    url: `/pages/weshares/booking/index?id=${professionalId.value}`,
  })
}

// 跳转到评价列表
const navigateToReviews = () => {
  uni.navigateTo({
    url: `/pages/weshares/professional-reviews/index?id=${professionalId.value}`,
  })
}
</script>

<style>
.container {
  min-height: 100vh;
  padding-bottom: 120rpx;
  background-color: #f5f5f5;
}
/* 加载中 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300rpx;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 20rpx;
  border: 6rpx solid #f3f3f3;
  border-top: 6rpx solid #5bbdca;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 28rpx;
  color: #666;
}
/* 头部基本信息 */
.profile-header {
  display: flex;
  padding: 30rpx;
  background-color: #fff;
}

.profile-avatar {
  width: 160rpx;
  height: 160rpx;
  margin-right: 30rpx;
  border-radius: 80rpx;
}

.profile-info {
  flex: 1;
}

.profile-name-row {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.profile-name {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
}

.verify-icon {
  margin-left: 10rpx;
  font-size: 32rpx;
  color: #4caf50;
}

.profile-rating {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.star {
  font-size: 28rpx;
  color: #ddd;
}

.star.filled {
  color: #ffc107;
}

.review-count {
  margin-left: 10rpx;
  font-size: 24rpx;
  color: #999;
}

.profile-stats {
  margin-bottom: 10rpx;
  font-size: 24rpx;
  color: #666;
}

.profile-price {
  display: flex;
  align-items: baseline;
}

.price {
  font-size: 40rpx;
  font-weight: 500;
  color: #ff6b6b;
}

.price-unit {
  margin-left: 4rpx;
  font-size: 24rpx;
  color: #999;
}
/* 内容区块 */
.section {
  padding: 30rpx;
  margin-top: 20rpx;
  background-color: #fff;
}

.section-title {
  margin-bottom: 20rpx;
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
}
/* 服务信息 */
.service-name {
  margin-bottom: 10rpx;
  font-size: 30rpx;
  color: #333;
}

.service-desc {
  font-size: 26rpx;
  line-height: 1.6;
  color: #666;
}
/* 地区信息 */
.location-info {
  font-size: 28rpx;
  color: #666;
}
/* 标签列表 */
.tags-list {
  display: flex;
  flex-wrap: wrap;
}

.tag-item {
  padding: 10rpx 20rpx;
  margin: 0 20rpx 20rpx 0;
  font-size: 24rpx;
  color: #4a90e2;
  background-color: #f1f8ff;
  border-radius: 30rpx;
}
/* 图片列表 */
.images-scroll {
  width: 100%;
}

.images-row {
  display: flex;
  padding: 10rpx 0;
}

.service-image {
  width: 240rpx;
  height: 240rpx;
  margin-right: 20rpx;
  background-color: #f5f5f5;
  border-radius: 12rpx;
}
/* 评价区域 */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.all-reviews {
  font-size: 24rpx;
  color: #5bbdca;
}

.empty-reviews {
  padding: 40rpx 0;
  font-size: 28rpx;
  color: #999;
  text-align: center;
}

.review-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eee;
}

.review-item:last-child {
  border-bottom: none;
}

.review-header {
  display: flex;
  margin-bottom: 16rpx;
}

.reviewer-avatar {
  width: 80rpx;
  height: 80rpx;
  margin-right: 20rpx;
  border-radius: 40rpx;
}

.reviewer-info {
  flex: 1;
}

.reviewer-name {
  margin-bottom: 6rpx;
  font-size: 28rpx;
  color: #333;
}

.review-rating {
  display: flex;
  align-items: center;
}

.review-time {
  margin-left: 10rpx;
  font-size: 22rpx;
  color: #999;
}

.review-content {
  font-size: 26rpx;
  line-height: 1.6;
  color: #666;
}
/* 底部操作区 */
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 100;
  display: flex;
  width: 100%;
  height: 100rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.action-btn {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 30rpx;
  border: none;
  border-radius: 0;
}

.action-btn::after {
  border: none;
}

.action-btn.contact {
  color: #666;
  background-color: #fff;
}

.action-btn.booking {
  color: #fff;
  background-color: #5bbdca;
}

.btn-icon {
  margin-right: 10rpx;
  font-size: 28rpx;
}
</style>
