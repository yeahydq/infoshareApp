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
        <text class="placeholder">搜索老师/课程</text>
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

    <!-- 教师推荐 -->
    <view class="featured-section">
      <view class="featured-header">
        <view class="featured-title">优选名师</view>
        <view class="featured-more" @click="navigateTorecommendedTeacher">
          更多
          <text class="arrow">></text>
        </view>
      </view>

      <scroll-view class="featured-teachers" scroll-x>
        <view
          class="teacher-card"
          v-for="(teacher, index) in featuredTeachers"
          :key="index"
          @click="viewTeacherDetail(teacher)"
        >
          <image class="teacher-avatar" :src="teacher.avatar" mode="aspectFill" />
          <view class="teacher-info">
            <view class="teacher-name">{{ teacher.name }}</view>
            <view class="teacher-subject">{{ teacher.subject }}</view>
            <view class="teacher-rating">
              <text class="rating">{{ teacher.rating }}</text>
              <text class="rating-count">({{ teacher.ratingCount }})</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 服务选项 -->
    <view class="service-options">
      <view class="service-card online" @click="navigateToFindTeachers('online')">
        <view class="service-content">
          <view class="service-title">在线辅导</view>
          <view class="service-subtitle">全国名师在线</view>
          <view class="service-button">选在线老师</view>
        </view>
        <image class="service-img" src="/static/image/online-teaching.png" mode="aspectFit" />
      </view>

      <view class="service-card in-person" @click="navigateToFindTeachers('in-person')">
        <view class="service-content">
          <view class="service-title">上门辅导</view>
          <view class="service-subtitle">名师面对面</view>
          <view class="service-button">选上门老师</view>
        </view>
        <image class="service-img" src="/static/image/in-person-teaching.png" mode="aspectFit" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { safeAreaInsets } = uni.getSystemInfoSync()

const currentLocation = ref('济南市')
const bannerList = ref([
  {
    image: '/static/image/banner1.png',
    title: '家教预约',
    subtitle: '小程序上线了',
    link: '/pages/activity/new',
  },
  {
    image: '/static/image/banner2.png',
    title: '暑期特惠',
    subtitle: '名师课程8折起',
    link: '/pages/activity/summer',
  },
])

const categories = ref([
  {
    icon: '/static/image/management.png',
    label: '管理学',
    description: '企业管理/市场营销',
    class: 'management',
  },
  {
    icon: '/static/image/medicine.png',
    label: '医学',
    description: '临床医学/护理',
    class: 'medicine',
  },
  {
    icon: '/static/image/agriculture.png',
    label: '农学',
    description: '农业科学/园艺',
    class: 'agriculture',
  },
  {
    icon: '/static/image/engineering.png',
    label: '工学',
    description: '机械/电子/计算机',
    class: 'engineering',
  },
  {
    icon: '/static/image/science.png',
    label: '理学',
    description: '数学/物理/化学',
    class: 'science',
  },
  {
    icon: '/static/image/history.png',
    label: '历史学',
    description: '中国史/世界史',
    class: 'history',
  },
  {
    icon: '/static/image/literature.png',
    label: '文学',
    description: '中文/外语',
    class: 'literature',
  },
  {
    icon: '/static/image/more.png',
    label: '更多',
    description: '查看全部',
    class: 'more',
  },
])

const featuredTeachers = ref([
  {
    id: 1,
    name: '张老师',
    subject: '高中数学',
    avatar: '/static/image/teacher1.png',
    rating: 4.9,
    ratingCount: 128,
  },
  {
    id: 2,
    name: '李老师',
    subject: '初中英语',
    avatar: '/static/image/teacher2.png',
    rating: 4.8,
    ratingCount: 96,
  },
  {
    id: 3,
    name: '王老师',
    subject: '小学语文',
    avatar: '/static/image/teacher3.png',
    rating: 4.9,
    ratingCount: 156,
  },
])

// 方法定义
const showLocationPicker = () => {
  uni.showActionSheet({
    itemList: ['济南市', '青岛市', '烟台市'],
    success: (res) => {
      currentLocation.value = ['济南市', '青岛市', '烟台市'][res.tapIndex]
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
    url: `/pages/category/${category.label}`,
  })
}

const viewTeacherDetail = (teacher) => {
  uni.navigateTo({
    url: `/pages/teacher-details/index?id=${teacher.id}`,
  })
}

const navigateToFindTeachers = (type) => {
  uni.navigateTo({
    url: `/pages/find-teachers/index?type=${type}`,
  })
}

function navigateToOrders() {
  console.log('Navigating to Orders page')
  // This page doesn't exist yet, so navigate to home
  window.location.href = '/pages/index/index'
}

function navigateToPersonalCenter() {
  console.log('Navigating to Personal Center page')
  window.location.href = '/pages/personal-center/index'
}

function navigateTorecommendedTeacher() {
  console.log('Navigating to Address Management page')
  uni.navigateTo({
    url: '../recommended-teacher/index',
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
