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
    <swiper class="banner" circular autoplay interval="3000" duration="500">
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
    <view class="featured-section">
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
    <view class="service-options">
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
    </view>

    <!-- 注册引导 -->
    <view class="register-prompt" @click="navigateToRegister">
      <view class="prompt-content">
        <view class="prompt-title">成为专业人士</view>
        <view class="prompt-subtitle">分享您的专业知识，获取额外收入</view>
      </view>
      <view class="prompt-button">立即注册</view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { simpleCityList } from '@/config/areaData'

const { safeAreaInsets } = uni.getSystemInfoSync()

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
    icon: '/static/image/education.png',
    label: '教育服务',
    description: '语文/数学/英语/物理',
    class: 'education',
  },
  {
    icon: '/static/image/repair.png',
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
    icon: '/static/image/business.png',
    label: '商业服务',
    description: '管理咨询/营销策划',
    class: 'business',
  },
  {
    icon: '/static/image/legal.png',
    label: '法律服务',
    description: '法律咨询/合同审查',
    class: 'legal',
  },
  {
    icon: '/static/image/design.png',
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
})
</script>

<style>
@import './index.css';
</style>
