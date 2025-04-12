<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'default',
    navigationBarTitleText: '首页',
  },
}
</route>

<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search-container">
      <view class="search-bar">
        <view class="location" @click="showLocationPicker">
          <text class="location-icon">📍</text>
          {{ currentLocation }}
          <text class="down-arrow">▼</text>
        </view>
        <view class="search-input-wrapper" @click="focusSearch">
          <view class="search-input">
            <text class="search-icon">🔍</text>
            <text class="placeholder">搜索专业人士/服务</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 轮播图 -->
    <swiper
      class="banner"
      circular
      autoplay
      interval="3000"
      duration="500"
      indicator-dots
      indicator-color="rgba(255,255,255,0.6)"
      indicator-active-color="#ffffff"
    >
      <swiper-item v-for="(item, index) in bannerList" :key="index">
        <image
          class="banner-img"
          :src="item.image"
          mode="aspectFill"
          @click="handleBannerClick(item)"
        />
        <view class="banner-text">
          <view class="banner-title">{{ item.title }}</view>
          <view class="banner-subtitle">{{ item.subtitle }}</view>
        </view>
      </swiper-item>
    </swiper>

    <!-- 分类导航 -->
    <view class="section-title">服务分类</view>
    <view class="category-section">
      <view class="category-grid">
        <view
          class="category-item"
          v-for="(category, index) in categories"
          :key="index"
          @click="handleCategoryClick(category)"
        >
          <view class="category-icon" :class="category.class">
            <image :src="category.icon" mode="aspectFit" class="category-icon-img" />
          </view>
          <view class="category-content">
            <view class="category-label">{{ category.label }}</view>
            <view class="category-desc">{{ category.description }}</view>
          </view>
          <view class="category-arrow">
            <text>›</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 专业人士推荐 -->
    <view class="section-title" v-if="!isRegisteredProfessional">热门推荐</view>
    <view class="featured-section" v-if="!isRegisteredProfessional">
      <view class="professional-cards">
        <view
          class="professional-card"
          v-for="(professional, index) in featuredProfessionals"
          :key="index"
          @click="viewProfessionalDetail(professional)"
        >
          <image class="professional-avatar" :src="professional.avatar" mode="aspectFill" />
          <view class="professional-info">
            <view class="professional-name">{{ professional.name }}</view>
            <view class="professional-specialty">{{ professional.specialty }}</view>
            <view class="professional-rating">
              <text class="star-icon">★</text>
              <text class="rating">{{ professional.rating }}</text>
              <text class="rating-count">({{ professional.ratingCount }})</text>
            </view>
          </view>
        </view>
      </view>

      <view class="view-more" @click="navigateToRecommendedProfessionals">
        查看更多
        <text class="arrow">›</text>
      </view>
    </view>

    <!-- 注册引导 -->
    <view v-if="!isRegisteredProfessional" class="register-prompt" @click="navigateToRegister">
      <view class="prompt-content">
        <view class="prompt-title">成为专业人士</view>
        <view class="prompt-subtitle">分享您的专业知识，获取额外收入</view>
      </view>
      <view class="prompt-button">立即注册</view>
    </view>

    <!-- 已注册专业人士的预约状态 -->
    <view v-else class="pro-status-card" @click="navigateToMySchedule">
      <view class="status-header">
        <view class="status-title">我的接单状态</view>
        <view
          class="status-subtitle"
          :class="{ 'status-unavailable': !professionalStatus.isAvailable }"
        >
          {{ professionalStatus.isAvailable ? '当前可接单' : '当前暂停接单' }}
        </view>
        <view class="status-switch">
          <switch
            :checked="professionalStatus.isAvailable"
            @change="toggleAvailabilityStatus"
            color="#07c160"
          />
        </view>
      </view>
      <view class="status-content">
        <view class="status-item">
          <view class="status-label">今日预约</view>
          <view class="status-value">{{ professionalStatus.todayBookings || 0 }}</view>
        </view>
        <view class="status-item">
          <view class="status-label">本周预约</view>
          <view class="status-value">{{ professionalStatus.weekBookings || 0 }}</view>
        </view>
        <view class="status-item">
          <view class="status-label">总评分</view>
          <view class="status-value rating">
            {{ professionalStatus.rating || '5.0' }}
            <text class="star">★</text>
          </view>
        </view>
      </view>
      <view class="status-footer">
        <view class="status-button" @click.stop="navigateToManageSchedule">管理排班</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { simpleCityList } from '@/config/areaData'
import allCategories from '@/config/categoryData'
import { checkProfessionalStatus, updateProfessionalStatus } from '@/service/professional'
import { useUserStore } from '@/store'

const { safeAreaInsets } = uni.getSystemInfoSync()
const userStore = useUserStore()

// 用户注册专业人士状态
const isRegisteredProfessional = ref(false)
const professionalStatus = ref({
  isAvailable: true, // 是否可接单
  todayBookings: 0, // 今日预约数
  weekBookings: 0, // 本周预约数
  rating: 5.0, // 总评分
})

const currentLocation = ref(simpleCityList[0] || '济南市')
const bannerList = ref([
  {
    image: '/static/image/banner1.png',
    title: '专业服务预约',
    subtitle: '小程序上线了',
    link: '/pages/weshares/activity/new',
  },
  {
    image: '/static/image/banner2.png',
    title: '暑期特惠',
    subtitle: '专业服务8折起',
    link: '/pages/weshares/activity/summer',
  },
])

const categories = ref([
  {
    icon: '/static/image/literature.png',
    label: allCategories[0].name,
    description: allCategories[0].types.join('/'),
    class: 'education',
  },
  {
    icon: '/static/image/bulb.png',
    label: allCategories[1].name,
    description: allCategories[1].types.join('/'),
    class: 'repair',
  },
  {
    icon: '/static/image/more.png',
    label: allCategories[2].name,
    description: '查看全部',
    class: 'other',
  },
])

const featuredProfessionals = ref([
  {
    id: 1,
    name: '张先生',
    specialty: '数学辅导',
    avatar: '/static/image/teacher1.png',
    rating: 4.9,
    ratingCount: 128,
  },
  {
    id: 2,
    name: '李小姐',
    specialty: '英语辅导',
    avatar: '/static/image/teacher2.png',
    rating: 4.8,
    ratingCount: 96,
  },
  {
    id: 3,
    name: '王先生',
    specialty: '水电维修',
    avatar: '/static/image/teacher3.png',
    rating: 4.9,
    ratingCount: 156,
  },
])

// 方法定义
const showLocationPicker = () => {
  uni.showActionSheet({
    itemList: simpleCityList,
    success: (res) => {
      currentLocation.value = simpleCityList[res.tapIndex]
    },
  })
}

const focusSearch = () => {
  uni.navigateTo({
    url: '../find-professionals/index',
  })
}

const handleBannerClick = (banner) => {
  uni.navigateTo({
    url: banner.link,
  })
}

const handleCategoryClick = (category) => {
  uni.navigateTo({
    url: `/pages/weshares/find-professionals/index?category=${encodeURIComponent(category.class)}`,
  })
}

const viewProfessionalDetail = (professional) => {
  uni.navigateTo({
    url: `/pages/weshares/professional-details/index?id=${professional.id}`,
  })
}

const navigateToFindProfessionals = (type) => {
  uni.navigateTo({
    url: `/pages/weshares/find-professionals/index?type=${type}`,
  })
}

function navigateToOrders() {
  uni.switchTab({
    url: '/pages/weshares/orders/index',
  })
}

function navigateToPersonalCenter() {
  uni.switchTab({
    url: '/pages/weshares/personal-center/index',
  })
}

function navigateToRecommendedProfessionals() {
  uni.navigateTo({
    url: '../recommended-professional/index',
  })
}

function navigateToRegister() {
  uni.navigateTo({
    url: '/pages/weshares/professional-registration/index',
  })
}

function navigateToMySchedule() {
  uni.navigateTo({
    url: '../time-schedule',
  })
}

function navigateToManageSchedule() {
  uni.navigateTo({
    url: '../time-schedule',
  })
}

// 检查用户是否已注册为专业人士
const checkUserProfessionalStatus = async () => {
  try {
    // 先检查用户是否已登录
    if (!userStore.isLogined) {
      isRegisteredProfessional.value = false
      return
    }

    const result = await checkProfessionalStatus()

    if (result.isApproved) {
      isRegisteredProfessional.value = true

      // 如果已注册并通过审核，获取预约状态
      if (result.professionalData) {
        professionalStatus.value = {
          isAvailable: result.professionalData.isAvailable || false,
          todayBookings: result.professionalData.todayBookings || 0,
          weekBookings: result.professionalData.weekBookings || 0,
          rating: result.professionalData.rating || 5.0,
        }
      }
    } else {
      isRegisteredProfessional.value = false
    }
  } catch (error) {
    console.error('检查专业人士状态出错:', error)
    isRegisteredProfessional.value = false
  }
}

// 重置专业人士状态
const resetProfessionalStatus = () => {
  isRegisteredProfessional.value = false
  professionalStatus.value = {
    isAvailable: true,
    todayBookings: 0,
    weekBookings: 0,
    rating: 5.0,
  }
}

// 切换专业人士可用状态
const toggleAvailabilityStatus = async (e) => {
  const newStatus = e.detail.value
  try {
    const result = await updateProfessionalStatus({
      isAvailable: newStatus,
    })

    if (result.success) {
      professionalStatus.value.isAvailable = newStatus
      uni.showToast({
        title: newStatus ? '已切换为可接单状态' : '已暂停接单',
        icon: 'none',
      })
    } else {
      // 更新失败，恢复原状态
      professionalStatus.value.isAvailable = !newStatus
      uni.showToast({
        title: result.message,
        icon: 'none',
      })
    }
  } catch (error) {
    console.error('更新接单状态出错:', error)
    // 更新失败，恢复原状态
    professionalStatus.value.isAvailable = !newStatus
    uni.showToast({
      title: '网络错误，请稍后重试',
      icon: 'none',
    })
  }
}

// 生命周期钩子
onMounted(() => {
  // 获取位置信息
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      // 这里可以调用地理编码API获取城市名称
      console.log('当前位置：', res)
    },
  })

  // 检查用户是否已注册为专业人士
  checkUserProfessionalStatus()
})

// 监听用户登录状态变化
watch(
  () => userStore.isLogined,
  (isLoggedIn) => {
    console.log('用户登录状态变化:', isLoggedIn)
    if (isLoggedIn) {
      // 用户登录，检查专业人士状态
      checkUserProfessionalStatus()
    } else {
      // 用户退出登录，重置专业人士状态
      resetProfessionalStatus()
    }
  },
)
</script>

<style>
.container {
  min-height: 100vh;
  padding-bottom: 30rpx;
  background-color: #f7f8fa;
}
/* 搜索栏样式 */
.search-container {
  padding: 20rpx 30rpx;
  background: linear-gradient(135deg, #2b5cff, #3f9aff);
}

.search-bar {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.location {
  display: flex;
  align-items: center;
  padding: 10rpx 0;
  font-size: 28rpx;
  font-weight: 500;
  color: white;
}

.location-icon {
  margin-right: 8rpx;
  font-size: 28rpx;
}

.down-arrow {
  margin-left: 8rpx;
  font-size: 20rpx;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  padding: 14rpx 24rpx;
  margin-bottom: 10rpx;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 40rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.search-input {
  display: flex;
  align-items: center;
  width: 100%;
}

.search-icon {
  margin-right: 12rpx;
  font-size: 28rpx;
  color: #999;
}

.placeholder {
  font-size: 28rpx;
  color: #999;
}
/* 轮播图样式 */
.banner {
  width: 100%;
  height: 280rpx;
}

.banner-img {
  width: 100%;
  height: 100%;
}

.banner-text {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20rpx;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
}

.banner-title {
  font-size: 32rpx;
  font-weight: bold;
  color: white;
}

.banner-subtitle {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
}
/* 分类导航样式 */
.section-title {
  margin: 30rpx 20rpx 20rpx;
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
}

.category-section {
  padding: 20rpx;
  margin: 0 20rpx 30rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.category-grid {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: #f9fafc;
  border-radius: 12rpx;
  transition: all 0.3s ease;
}

.category-item:active {
  background-color: #f0f2f5;
  transform: scale(0.98);
}

.category-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 80rpx;
  margin-right: 20rpx;
  border-radius: 50%;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.category-icon.education {
  background: linear-gradient(135deg, #ff9a9e, #fad0c4);
}

.category-icon.repair {
  background: linear-gradient(135deg, #a1c4fd, #c2e9fb);
}

.category-icon.other {
  background: linear-gradient(135deg, #d4fc79, #96e6a1);
}

.category-icon-img {
  width: 50rpx;
  height: 50rpx;
}

.category-content {
  flex: 1;
}

.category-label {
  margin-bottom: 6rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  text-align: left;
}

.category-desc {
  font-size: 24rpx;
  color: #888;
  text-align: left;
}

.category-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10rpx;
  font-size: 36rpx;
  color: #aaa;
}
/* 专业人士推荐样式 */
.featured-section {
  padding: 20rpx;
  margin: 0 20rpx 30rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.professional-cards {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-top: 20rpx;
}

.professional-card {
  display: flex;
  padding: 20rpx;
  background-color: #f9fafc;
  border-radius: 12rpx;
  transition: all 0.3s ease;
}

.professional-card:active {
  background-color: #f0f2f5;
  transform: scale(0.98);
}

.professional-avatar {
  width: 100rpx;
  height: 100rpx;
  margin-right: 20rpx;
  border-radius: 50%;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.professional-info {
  flex: 1;
}

.professional-name {
  margin-bottom: 8rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}

.professional-specialty {
  margin-bottom: 10rpx;
  font-size: 24rpx;
  color: #888;
}

.professional-rating {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #999;
}

.star-icon {
  margin-right: 6rpx;
  font-size: 24rpx;
  color: #ffba00;
}

.rating {
  font-weight: 500;
  color: #333;
}

.rating-count {
  margin-left: 6rpx;
}

.view-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx 0 10rpx;
  margin-top: 10rpx;
  font-size: 28rpx;
  color: #2b5cff;
}

.arrow {
  margin-left: 6rpx;
  font-size: 28rpx;
}
/* 注册引导样式 */
.register-prompt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  margin: 10rpx 20rpx 30rpx;
  background: linear-gradient(135deg, #2b5cff, #3f9aff);
  border-radius: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(43, 92, 255, 0.2);
}

.prompt-content {
  flex: 1;
}

.prompt-title {
  margin-bottom: 8rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: white;
}

.prompt-subtitle {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
}

.prompt-button {
  padding: 12rpx 30rpx;
  font-size: 26rpx;
  color: #2b5cff;
  background-color: white;
  border-radius: 30rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
}
/* 专业人士状态卡片样式 */
.pro-status-card {
  display: flex;
  flex-direction: column;
  padding: 30rpx;
  margin: 10rpx 20rpx 30rpx;
  background: linear-gradient(to right, #ffffff, #f8f9ff);
  border-radius: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.status-header {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

.status-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.status-subtitle {
  padding: 6rpx 16rpx;
  margin-left: 20rpx;
  font-size: 24rpx;
  color: #fff;
  background-color: #07c160;
  border-radius: 20rpx;
}

.status-unavailable {
  background-color: #ff6b6b;
}

.status-switch {
  margin-left: auto;
}

.status-content {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0;
  border-top: 1rpx solid #f0f0f0;
  border-bottom: 1rpx solid #f0f0f0;
}

.status-item {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
}

.status-label {
  margin-bottom: 8rpx;
  font-size: 24rpx;
  color: #999;
}

.status-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.status-value.rating {
  display: flex;
  align-items: center;
}

.status-value .star {
  margin-left: 4rpx;
  font-size: 28rpx;
  color: #ffba00;
}

.status-footer {
  display: flex;
  justify-content: center;
  margin-top: 30rpx;
}

.status-button {
  padding: 16rpx 40rpx;
  font-size: 28rpx;
  color: #ffffff;
  text-align: center;
  background-color: #2b5cff;
  border-radius: 40rpx;
  box-shadow: 0 4rpx 12rpx rgba(43, 92, 255, 0.2);
  transition: transform 0.2s;
}

.status-button:active {
  transform: scale(0.95);
}
</style>
