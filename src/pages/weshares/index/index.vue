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
    <view class="search-bar">
      <view class="location" @click="showLocationPicker">
        {{ currentLocation }}
        <text class="down-arrow">▼</text>
      </view>
      <view class="search-input" @click="focusSearch">
        <text class="placeholder">搜索专业人士/服务</text>
      </view>
      <view class="search-icon">🔍</view>
    </view>

    <!-- 轮播图 -->
    <!-- <swiper class="banner" circular autoplay interval="3000" duration="500">
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
    </swiper> -->

    <!-- 分类导航 -->
    <view class="category-section">
      <view class="category-grid">
        <view
          class="category-item"
          v-for="(item, index) in categories"
          :key="index"
          @click="handleCategoryClick(item)"
        >
          <view class="category-icon" :class="item.class">
            <image :src="item.icon" mode="aspectFit" class="category-icon-img" />
          </view>
          <view class="category-label">{{ item.label }}</view>
          <view class="category-desc">{{ item.description }}</view>
        </view>
      </view>
    </view>

    <!-- 专业人士推荐 -->
    <view class="featured-section" v-if="!isRegisteredProfessional">
      <view class="featured-header">
        <view class="featured-title">优选专业人士</view>
        <view class="featured-more" @click="navigateToRecommendedProfessionals">
          更多
          <text class="arrow">></text>
        </view>
      </view>

      <scroll-view class="featured-professionals" scroll-x>
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
              <text class="rating">{{ professional.rating }}</text>
              <text class="rating-count">({{ professional.ratingCount }})</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 服务选项 -->
    <!-- <view class="service-options">
      <view class="service-card online" @click="navigateToFindProfessionals('online')">
        <view class="service-content">
          <view class="service-title">线上服务</view>
          <view class="service-subtitle">专业人士远程指导</view>
          <view class="service-button">立即预约</view>
        </view>
        <image class="service-img" src="/static/image/online-teaching.png" mode="aspectFit" />
      </view>

      <view class="service-card in-person" @click="navigateToFindProfessionals('in-person')">
        <view class="service-content">
          <view class="service-title">线下服务</view>
          <view class="service-subtitle">专业人士上门服务</view>
          <view class="service-button">立即预约</view>
        </view>
        <image class="service-img" src="/static/image/in-person-teaching.png" mode="aspectFit" />
      </view>
    </view> -->

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
import { ref, onMounted } from 'vue'
import { simpleCityList } from '@/config/areaData'
import { checkProfessionalStatus, updateProfessionalStatus } from '@/service/professional'

const { safeAreaInsets } = uni.getSystemInfoSync()

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
    label: '教育服务',
    description: '语文/数学/英语/物理',
    class: 'education',
  },
  {
    icon: '/static/image/bulb.png',
    label: '维修服务',
    description: '水管/电路/空调/保洁',
    class: 'repair',
  },
  {
    icon: '/static/image/medicine.png',
    label: '医疗服务',
    description: '医学咨询/保健服务',
    class: 'medicine',
  },
  {
    icon: '/static/image/engineering.png',
    label: '工程技术',
    description: '机械/电子/计算机',
    class: 'engineering',
  },
  {
    icon: '/static/image/management.png',
    label: '商业服务',
    description: '管理咨询/营销策划',
    class: 'business',
  },
  {
    icon: '/static/image/release.png',
    label: '法律服务',
    description: '法律咨询/合同审查',
    class: 'legal',
  },
  {
    icon: '/static/image/science.png',
    label: '艺术设计',
    description: '平面设计/室内设计',
    class: 'design',
  },
  {
    icon: '/static/image/more.png',
    label: '更多服务',
    description: '查看全部',
    class: 'more',
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
    url: '/pages/search/index',
  })
}

const handleBannerClick = (banner) => {
  uni.navigateTo({
    url: banner.link,
  })
}

const handleCategoryClick = (category) => {
  uni.navigateTo({
    url: `/pages/weshares/find-teachers/index?category=${encodeURIComponent(category.label)}`,
  })
}

const viewProfessionalDetail = (professional) => {
  uni.navigateTo({
    url: `/pages/weshares/teacher-details/index?id=${professional.id}`,
  })
}

const navigateToFindProfessionals = (type) => {
  uni.navigateTo({
    url: `/pages/weshares/find-teachers/index?type=${type}`,
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
    url: '../recommended-teacher/index',
  })
}

function navigateToRegister() {
  uni.navigateTo({
    url: '/pages/weshares/teacher-registration/index',
  })
}

function navigateToMySchedule() {
  uni.navigateTo({
    url: '/pages/weshares/my-schedule/index',
  })
}

function navigateToManageSchedule() {
  uni.navigateTo({
    url: '/pages/weshares/manage-schedule/index',
  })
}

// 检查用户是否已注册为专业人士
const checkUserProfessionalStatus = async () => {
  try {
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
</script>

<style>
@import './index.css';
/* 专业人士状态卡片样式 */
.pro-status-card {
  display: flex;
  flex-direction: column;
  padding: 30rpx;
  margin: 20rpx;
  background-color: #ffffff;
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
}
</style>
