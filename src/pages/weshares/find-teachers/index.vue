<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '专业人士列表' },
}
</route>

<template>
  <!-- 添加测试数据按钮（仅开发环境可见） -->
  <view v-if="showDevTools" class="dev-tools">
    <button class="dev-button load-data" @click="loadTestData">加载测试数据</button>
    <button class="dev-button clear-data" @click="clearTestData">清理测试数据</button>
  </view>
  <!-- <view class="header">
    <text class="header-title">找老师</text>
    <view class="header-right">
      <text class="dots">•••</text>
      <text class="target-icon">○</text>
    </view>
  </view> -->

  <view class="container">
    <view class="search-bar">
      <view class="location">
        <picker @change="onRegionChange" mode="region">
          <view class="location-picker">
            {{ selectedRegion[1] || '全部' }}
            <text class="down-arrow">▼</text>
          </view>
        </picker>
      </view>
      <view class="search-input" @click="onSearchClick">
        <text class="search-icon">🔍</text>
        <input
          class="search-field"
          v-model="searchKeyword"
          placeholder="搜索专业人士"
          confirm-type="search"
          @confirm="onSearch"
        />
      </view>
      <view class="search-button" @click="onSearch">搜索</view>
    </view>

    <view class="category-bar">
      <scroll-view :scroll-x="true" class="scroll-view-x">
        <view
          :class="['category', selectedCategory === '' ? 'active' : '']"
          @click="selectCategory('')"
        >
          全部
        </view>
        <view
          v-for="category in categories"
          :key="category.id"
          :class="['category', selectedCategory === category.id ? 'active' : '']"
          @click="selectCategory(category.id)"
        >
          {{ category.name }}
        </view>
      </scroll-view>
    </view>

    <view class="filter-bar">
      <view class="filter-item" @click="toggleSortOrder('default')">
        <text :class="{ active: sortType === 'default' }">默认</text>
      </view>
      <view class="filter-item" @click="toggleSortOrder('rating')">
        <text :class="{ active: sortType === 'rating' }">评分</text>
        <text class="sort-icon">
          {{ sortType === 'rating' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
        </text>
      </view>
      <view class="filter-item" @click="toggleSortOrder('price')">
        <text :class="{ active: sortType === 'price' }">价格</text>
        <text class="sort-icon">
          {{ sortType === 'price' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
        </text>
      </view>
      <view class="filter-item" @click="toggleAvailability()">
        <text :class="{ active: onlyAvailable }">仅可预约</text>
      </view>
    </view>

    <!-- 加载指示器 -->
    <view class="loading-container" v-if="loading">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 暂无数据提示 -->
    <view class="empty-container" v-else-if="professionals.length === 0">
      <view class="empty-icon">🔍</view>
      <text class="empty-text">
        {{ onlyAvailable ? '暂无可预约的专业人士' : '暂无符合条件的专业人士' }}
      </text>
      <text class="empty-subtext">
        {{ onlyAvailable ? '您可以尝试关闭"仅可预约"选项' : '请尝试调整筛选条件' }}
      </text>
      <view class="empty-actions" v-if="onlyAvailable">
        <button class="action-btn" @click="toggleAvailability">显示全部专业人士</button>
      </view>
    </view>

    <!-- 专业人士列表 -->
    <view class="teacher-list" v-else>
      <view
        v-for="professional in professionals"
        :key="professional._id"
        class="teacher-card"
        @click="navigateToProfessionalDetails(professional._id)"
      >
        <view class="teacher-level-tag" v-if="professional.level">{{ professional.level }}</view>
        <image
          class="teacher-avatar"
          :src="professional.avatarUrl || defaultAvatarUrl"
          mode="aspectFill"
        />
        <view class="teacher-info">
          <view class="teacher-name">
            <text>{{ professional.name || '匿名专家' }}</text>
            <text class="verify-icon" v-if="professional.verified">✓</text>
          </view>
          <view class="teacher-stats">
            <text>{{ renderProfessionalStats(professional) }}</text>
          </view>
          <view class="teacher-rating">
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
        </view>
        <view class="teacher-price" v-if="professional.hourlyRate">
          ¥{{ professional.hourlyRate }}/小时
        </view>
        <view class="teacher-price-hidden" v-else></view>
        <view class="book-button" @click.stop="navigateToBooking(professional._id)">
          <text>去预约</text>
        </view>
      </view>
    </view>

    <!-- 加载更多 -->
    <view
      class="load-more"
      v-if="professionals.length > 0 && hasMore && !loading"
      @click="loadMore"
    >
      <text>加载更多</text>
    </view>
    <view class="load-more end" v-else-if="professionals.length > 0 && !hasMore && !loading">
      <text>已经到底了</text>
    </view>

    <!-- <view class="bottom-nav">
      <view class="nav-item" @click="navigateToHome">
        <view class="nav-icon">🏠</view>
        <text class="nav-text">首页</text>
      </view>
      <view class="nav-item active">
        <view class="nav-icon">👨‍🏫</view>
        <text class="nav-text">找老师</text>
      </view>
      <view class="nav-item" @click="navigateToOrders">
        <view class="nav-icon">📝</view>
        <text class="nav-text">订单</text>
      </view>
      <view class="nav-item" @click="navigateToPersonalCenter">
        <view class="nav-icon">👤</view>
        <text class="nav-text">我的</text>
      </view>
    </view> -->
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 使用内联默认头像，避免依赖外部文件
const defaultAvatarUrl =
  'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

// 专业人士数据
const professionals = ref<any[]>([])
const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)
const pageSize = ref(10)

// 搜索和筛选条件
const searchKeyword = ref('')
const selectedCategory = ref('')
const selectedRegion = ref(['', '', ''])
const sortType = ref('default')
const sortOrder = ref('desc')

// 添加onlyAvailable控制参数
const onlyAvailable = ref(true) // 默认只显示有可用时间段的专业人士

// 分类列表
const categories = ref([
  { id: 'education', name: '教育培训' },
  { id: 'repair', name: '维修服务' },
  { id: 'it', name: 'IT技术' },
  { id: 'design', name: '设计服务' },
  { id: 'finance', name: '金融财务' },
  { id: 'medical', name: '医疗健康' },
  { id: 'legal', name: '法律咨询' },
  { id: 'other', name: '其他服务' },
])

// 定义是否显示开发工具，始终显示测试按钮以方便开发
const showDevTools = ref(true)

// 页面加载时获取专业人士列表
onMounted(() => {
  fetchProfessionals()
})

// 获取专业人士列表
const fetchProfessionals = async (refresh = true) => {
  try {
    loading.value = true

    if (refresh) {
      page.value = 1
      professionals.value = []
    }

    // 构建查询条件
    const queryParams = {
      page: page.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value,
      category: selectedCategory.value,
      province: selectedRegion.value[0],
      city: selectedRegion.value[1],
      sortType: sortType.value,
      sortOrder: sortOrder.value,
      onlyAvailable: onlyAvailable.value,
    }

    console.log('查询参数:', queryParams)

    // 调用云函数获取专业人士列表
    const { result } = await uni.cloud.callFunction({
      name: 'profRegister',
      data: {
        action: 'getProfessionalList',
        ...queryParams,
      },
    })

    console.log('获取专业人士列表结果:', result)

    if (result.success) {
      if (refresh) {
        professionals.value = result.data || []
      } else {
        professionals.value = [...professionals.value, ...(result.data || [])]
      }

      hasMore.value = result.hasMore || false

      if (result.data && result.data.length < pageSize.value) {
        hasMore.value = false
      }

      // 如果没有数据，显示提示
      if (professionals.value.length === 0) {
        uni.showToast({
          title: onlyAvailable.value ? '暂无可预约的专业人士' : '暂无符合条件的专业人士',
          icon: 'none',
        })
      }
    } else {
      uni.showToast({
        title: result.message || '获取专业人士列表失败',
        icon: 'none',
      })
    }
  } catch (error) {
    console.error('获取专业人士列表出错:', error)
    uni.showToast({
      title: '网络错误，请稍后重试',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

// 加载更多
const loadMore = () => {
  if (hasMore.value && !loading.value) {
    page.value++
    fetchProfessionals(false)
  }
}

// 选择分类
const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId
  fetchProfessionals()
}

// 区域选择变更
const onRegionChange = (e: any) => {
  selectedRegion.value = e.detail.value
  fetchProfessionals()
}

// 切换排序方式
const toggleSortOrder = (type: string) => {
  if (sortType.value === type) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortType.value = type
    sortOrder.value = 'desc'
  }
  fetchProfessionals()
}

// 搜索
const onSearch = () => {
  fetchProfessionals()
}

const onSearchClick = () => {
  console.log('搜索框点击')
}

// 渲染专业人士统计信息
const renderProfessionalStats = (professional: any) => {
  const parts = []

  if (professional.experience) {
    parts.push(`经验${professional.experience}年`)
  }

  if (professional.serviceCount) {
    parts.push(`服务${professional.serviceCount}次`)
  }

  if (professional.category) {
    const category = categories.value.find((c) => c.id === professional.category)
    if (category) {
      parts.push(category.name)
    } else {
      parts.push(professional.category)
    }
  }

  if (professional.education) {
    parts.push(professional.education)
  }

  return parts.join(' | ') || '暂无详细信息'
}

// 跳转到专业人士详情页
const navigateToProfessionalDetails = (professionalId: string) => {
  uni.navigateTo({
    url: `/pages/weshares/professional-detail/index?id=${professionalId}`,
  })
}

// 跳转到预约页面
const navigateToBooking = (professionalId: string) => {
  uni.navigateTo({
    url: `/pages/weshares/booking/index?id=${professionalId}`,
  })
}

// 加载测试数据的方法
async function loadTestData() {
  try {
    uni.showLoading({
      title: '加载测试数据中...',
    })

    const result = await wx.cloud.callFunction({
      name: 'initTestData',
      data: {
        action: 'init',
        collection: 'professionals',
      },
    })

    console.log('加载测试数据结果:', result)

    const cloudResult = result.result as any

    if (cloudResult && cloudResult.professionals && cloudResult.professionals.success) {
      uni.showToast({
        title: cloudResult.professionals.message,
        icon: 'success',
      })

      // 如果有数据更新，刷新列表
      if (cloudResult.professionals.count > 0) {
        fetchProfessionals()
      }
    } else {
      const errorMsg = cloudResult?.professionals?.message || '加载测试数据失败'
      uni.showToast({
        title: errorMsg,
        icon: 'none',
      })
    }
  } catch (error: any) {
    console.error('加载测试数据出错:', error)
    uni.showToast({
      title: '加载测试数据出错: ' + (error.message || error),
      icon: 'none',
    })
  } finally {
    uni.hideLoading()
  }
}

// 清理测试数据的方法
async function clearTestData() {
  try {
    uni.showLoading({
      title: '清理测试数据中...',
    })

    const result = await wx.cloud.callFunction({
      name: 'initTestData',
      data: {
        action: 'clear',
        collection: 'professionals',
      },
    })

    console.log('清理测试数据结果:', result)

    const cloudResult = result.result as any

    if (cloudResult && cloudResult.professionals && cloudResult.professionals.success) {
      uni.showToast({
        title: cloudResult.professionals.message,
        icon: 'success',
      })

      // 如果有数据更新，刷新列表
      if (cloudResult.professionals.count > 0) {
        fetchProfessionals()
      }
    } else {
      const errorMsg = cloudResult?.professionals?.message || '清理测试数据失败'
      uni.showToast({
        title: errorMsg,
        icon: 'none',
      })
    }
  } catch (error: any) {
    console.error('清理测试数据出错:', error)
    uni.showToast({
      title: '清理测试数据出错: ' + (error.message || error),
      icon: 'none',
    })
  } finally {
    uni.hideLoading()
  }
}

// 添加切换可用性方法
const toggleAvailability = () => {
  onlyAvailable.value = !onlyAvailable.value
  fetchProfessionals()
}
</script>

<style scoped>
@import './index.css';

.scroll-view-x {
  width: 100%;
  white-space: nowrap;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  margin-bottom: 10px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #5bbdca;
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
  font-size: 14px;
  color: #666;
}

.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 20px;
}

.empty-icon {
  margin-bottom: 10px;
  font-size: 48px;
  color: #cccccc;
}

.empty-text {
  margin-bottom: 5px;
  font-size: 16px;
  color: #666;
}

.empty-subtext {
  font-size: 14px;
  color: #999;
}

.empty-actions {
  margin-top: 20rpx;
}

.action-btn {
  padding: 10rpx 30rpx;
  margin-top: 30rpx;
  font-size: 28rpx;
  color: white;
  background-color: #2b5cff;
  border-radius: 30rpx;
}

.load-more {
  display: flex;
  justify-content: center;
  padding: 15px;
  font-size: 14px;
  color: #5bbdca;
  background-color: #fff;
}

.load-more.end {
  color: #999;
}

.search-icon {
  margin-right: 5px;
  font-size: 14px;
  color: #999;
}

.search-field {
  flex: 1;
  height: 36px;
  font-size: 14px;
}

.sort-icon {
  margin-left: 4rpx;
  font-size: 24rpx;
}

.star {
  color: #ddd;
}

.star.filled {
  color: #ffc107;
}

.review-count {
  margin-left: 5px;
  font-size: 12px;
  color: #999;
}

.verify-icon {
  margin-left: 5px;
  font-size: 14px;
  color: #4caf50;
}

.location-picker {
  display: flex;
  align-items: center;
}
/* 开发工具样式 */
.dev-tools {
  position: fixed;
  right: 20rpx;
  bottom: 120rpx;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.dev-button {
  width: 180rpx;
  padding: 10rpx 20rpx;
  font-size: 24rpx;
  border-radius: 10rpx;
  opacity: 0.8;
}

.load-data {
  color: white;
  background-color: #4caf50;
}

.clear-data {
  color: white;
  background-color: #f44336;
}

.filter-item {
  position: relative;
  display: flex;
  align-items: center;
  height: 80rpx;
  padding: 0 16rpx;
  font-size: 28rpx;
  color: #666;
}

.filter-item .active {
  font-weight: 500;
  color: #2b5cff;
}
/* 仅可预约按钮样式 */
.filter-item:last-child {
  padding: 0 20rpx;
  margin-left: auto;
  background-color: #f5f7fa;
  border-radius: 8rpx;
}

.filter-item:last-child .active {
  color: #2b5cff;
}
</style>
