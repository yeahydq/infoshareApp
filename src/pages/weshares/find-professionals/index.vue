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
        <picker @change="onCityChange" mode="selector" :range="cityList">
          <view class="location-picker">
            {{ selectedCity || '全部城市' }}
            <text class="down-arrow">▼</text>
          </view>
        </picker>
      </view>
      <view class="location" v-if="selectedCity && districtList.length > 0">
        <picker @change="onDistrictChange" mode="selector" :range="districtList">
          <view class="location-picker">
            {{ selectedDistrict || '全部区域' }}
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

    <view class="date-filter">
      <view class="date-filter-title">按日期筛选</view>
      <scroll-view scroll-x class="date-scroll">
        <view
          v-for="(date, index) in availableDates"
          :key="index"
          :class="['date-item', selectedDate === date.value ? 'active' : '']"
          @click="selectDate(date.value)"
        >
          <text class="weekday">{{ date.weekday }}</text>
          <text class="date">{{ date.day }}</text>
          <text class="month">{{ date.month }}月</text>
          <text v-if="date.isToday" class="today-mark">今天</text>
        </view>
      </scroll-view>

      <!-- 时间段选择 -->
      <view class="time-filter" v-if="selectedDate">
        <view class="time-filter-title">时间段</view>
        <view class="time-buttons">
          <view
            :class="['time-button', selectedTimeSlot === 'morning' ? 'active' : '']"
            @click="selectTimeSlot('morning')"
          >
            上午 (9:00-12:00)
          </view>
          <view
            :class="['time-button', selectedTimeSlot === 'afternoon' ? 'active' : '']"
            @click="selectTimeSlot('afternoon')"
          >
            下午 (14:00-18:00)
          </view>
          <view
            :class="['time-button', selectedTimeSlot === 'all' ? 'active' : '']"
            @click="selectTimeSlot('all')"
          >
            全天
          </view>
        </view>
      </view>

      <!-- 已选条件标签，当有选择时显示 -->
      <view class="selected-filters" v-if="selectedDate || selectedTimeSlot">
        <view class="filter-tags">
          <view class="filter-tag" v-if="selectedDate">
            日期: {{ formatSelectedDate(selectedDate) }}
            <text class="clear-tag" @click="clearDateFilter">×</text>
          </view>
          <view class="filter-tag" v-if="selectedTimeSlot">
            时间段: {{ timeSlotLabels[selectedTimeSlot] }}
            <text class="clear-tag" @click="clearTimeSlotFilter">×</text>
          </view>
        </view>
        <view class="clear-all" @click="clearAllDateFilters">清除日期筛选</view>
      </view>
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
      <view
        class="filter-item availability-filter"
        :class="{ 'active-filter': onlyAvailable }"
        @click="toggleAvailability()"
      >
        <text :class="{ active: onlyAvailable }">仅可预约</text>
        <text class="filter-icon" v-if="onlyAvailable">✓</text>
      </view>
    </view>

    <view class="filter-tip" v-if="onlyAvailable">
      <text class="tip-text">当前仅显示近期有可预约时间段的专业人士</text>
      <text class="tip-text-sub">符合条件的专业人士: {{ professionals.length }}</text>
    </view>

    <view class="filter-tip" v-else-if="professionals.length > 0">
      <text class="tip-text">当前显示所有专业人士，包括暂无可用时间段的专业人士</text>
      <text class="tip-text-sub">符合条件的专业人士: {{ professionals.length }}</text>
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
    <view class="professional-list" v-else>
      <view
        v-for="(item, index) in professionals"
        :key="index"
        class="professional-card"
        @click="gotoBooking(item._openid)"
      >
        <view class="professional-avatar-container">
          <image
            :src="item.avatarUrl || defaultAvatarUrl"
            mode="aspectFill"
            class="professional-avatar"
          ></image>
        </view>
        <view class="professional-info">
          <view class="professional-name-row">
            <text class="professional-name">{{ item.name || '匿名专家' }}</text>
            <text class="professional-gender" v-if="item.gender">
              {{ item.gender === '男' ? '♂' : '♀' }}
            </text>
          </view>

          <view class="professional-area" v-if="item.serviceArea">
            <text class="professional-area-text">{{ getAreaName(item.serviceArea) }}</text>
          </view>

          <view class="professional-experience" v-if="isValidField(item.experience)">
            <text class="professional-experience-text">{{ item.experience }}</text>
          </view>

          <view class="professional-status">
            <view
              :class="[
                'status-tag',
                item.status === '服务中' ? 'status-available' : 'status-unavailable',
              ]"
            >
              {{ item.status === '服务中' ? '可预约' : '暂不可约' }}
            </view>
          </view>
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
import { ref, onMounted, computed } from 'vue'
import { cityAreaData, simpleCityList } from '@/config/areaData'
import allCategories from '@/config/categoryData'

// 使用内联默认头像，避免依赖外部文件
const defaultAvatarUrl =
  'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

// 城市列表
const cityList = computed(() => cityAreaData.map((city) => city.name))

// 专业人士数据
const professionals = ref<any[]>([])
const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)
const pageSize = ref(10)

// 搜索和筛选条件
const searchKeyword = ref('')
const selectedCategory = ref('')
const selectedCity = ref('')
const sortType = ref('default')
const sortOrder = ref('desc')

// 添加onlyAvailable控制参数
const onlyAvailable = ref(true) // 默认只显示有可用时间段的专业人士

// 分类列表
const categories = ref([
  { id: 'education', name: '教育' },
  { id: 'repair', name: '维修服务' },
  { id: 'other', name: '其他服务' },
])

// 定义是否显示开发工具，始终显示测试按钮以方便开发
const showDevTools = ref(true)

// 日期相关
const selectedDate = ref('')
const selectedTimeSlot = ref('')
const availableDates = ref(generateDateRangeArray())
const timeSlotLabels = {
  morning: '上午 (9:00-12:00)',
  afternoon: '下午 (14:00-18:00)',
  all: '全天',
}

// 添加区域（区）选择功能
const districtList = computed(() => {
  if (!selectedCity.value) return []
  const cityData = cityAreaData.find((city) => city.name === selectedCity.value)
  return cityData ? cityData.districts.map((district) => district.name) : []
})
const selectedDistrict = ref('')

// 生成未来7天的日期数组
function generateDateRangeArray() {
  const dates = []
  const today = new Date()

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(today)
    currentDate.setDate(today.getDate() + i)

    const weekdayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1
    const day = currentDate.getDate()
    const weekday = weekdayNames[currentDate.getDay()]

    dates.push({
      value: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      year,
      month,
      day,
      weekday,
      isToday: i === 0,
    })
  }

  return dates
}

/**
 * 批量处理云存储链接
 * @param items 需要处理的专业人士数据列表
 * @returns 处理后的数据
 */
const batchProcessCloudUrls = async (items: any[]) => {
  if (!items || items.length === 0) {
    return []
  }

  // 深拷贝数据，避免修改原始数据
  const cleanedItems = JSON.parse(JSON.stringify(items))

  // 清理显示字段中的云存储链接
  cleanedItems.forEach((item) => {
    // 遍历所有字段，处理可能包含云存储链接的字段
    Object.keys(item).forEach((key) => {
      if (typeof item[key] === 'string' && item[key].includes('cloud://')) {
        if (key !== 'avatarUrl') {
          // 对于非头像字段，如果包含云存储链接，设置为适当的替代文本
          if (key === 'experience') {
            // 尝试从经验字段提取年份信息
            const yearMatch = item[key].match(/(\d+)年/)
            if (yearMatch && yearMatch[1]) {
              item[key] = `${yearMatch[1]}年专业经验`
            } else {
              item[key] = '专业经验丰富'
            }
          } else if (key === 'education') {
            item[key] = '专业教育背景'
          } else {
            // 其他字段设置为空字符串
            item[key] = ''
          }
        }
      }
    })
  })

  // 收集所有需要处理的云存储URL
  const cloudUrls: string[] = []
  const urlMapping: Record<string, number[]> = {}

  cleanedItems.forEach((item, itemIndex) => {
    // 仅处理头像URL
    if (
      item.avatarUrl &&
      typeof item.avatarUrl === 'string' &&
      item.avatarUrl.startsWith('cloud://')
    ) {
      if (!cloudUrls.includes(item.avatarUrl)) {
        cloudUrls.push(item.avatarUrl)
        urlMapping[item.avatarUrl] = [itemIndex]
      } else {
        urlMapping[item.avatarUrl].push(itemIndex)
      }
    }
  })

  if (cloudUrls.length === 0) {
    console.log('没有需要转换的云存储链接')
    return cleanedItems
  }

  console.log(`需要转换${cloudUrls.length}个云存储链接`)

  try {
    const res = await uni.cloud.callFunction({
      name: 'getTemporaryUrl',
      data: { cloudPaths: cloudUrls },
    })

    // 安全地处理返回结果
    const resultData = res?.result && typeof res.result === 'object' ? res.result : {}
    const urlData = resultData.data && typeof resultData.data === 'object' ? resultData.data : {}

    // 使用返回的临时URL更新数据
    Object.keys(urlData).forEach((cloudPath) => {
      const tempUrl = urlData[cloudPath]
      const itemIndices = urlMapping[cloudPath]

      if (itemIndices && tempUrl) {
        itemIndices.forEach((idx) => {
          cleanedItems[idx].avatarUrl = tempUrl
        })
      }
    })
  } catch (error) {
    console.error('获取临时URL失败:', error)
  }

  return cleanedItems
}

/**
 * 检查字段是否为有效的非云存储链接字符串
 */
const isValidField = (field: any): boolean => {
  if (!field) return false
  if (typeof field !== 'string') return false
  return !field.includes('cloud://')
}

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

    // 构建查询条件，添加日期和时间段
    const queryParams = {
      page: page.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value,
      category: selectedCategory.value,
      city: selectedCity.value,
      district: selectedDistrict.value,
      sortType: sortType.value,
      sortOrder: sortOrder.value,
      onlyAvailable: onlyAvailable.value,
      date: selectedDate.value,
      timeSlot: selectedTimeSlot.value,
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
      // 处理云存储图片链接
      let processedData = result.data || []

      // 批量处理云存储链接
      processedData = await batchProcessCloudUrls(processedData)

      if (refresh) {
        professionals.value = processedData
      } else {
        professionals.value = [...professionals.value, ...processedData]
      }

      hasMore.value = result.hasMore || false

      if (result.data && result.data.length < pageSize.value) {
        hasMore.value = false
      }

      // 如果没有数据，显示提示
      if (professionals.value.length === 0) {
        uni.showToast({
          title: getEmptyMessage(),
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
const onCityChange = (e: any) => {
  selectedCity.value = cityList.value[e.detail.value]
  selectedDistrict.value = ''
  fetchProfessionals()
}

const onDistrictChange = (e: any) => {
  selectedDistrict.value = districtList.value[e.detail.value]
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

// 跳转到预约页面
const gotoBooking = (id) => {
  let url = '/pages/weshares/booking/index?id=' + id

  // 如果有选择日期，将日期参数传递到预约页面
  if (selectedDate.value) {
    url += '&date=' + selectedDate.value
  }

  console.log('跳转到预约页面', url)
  uni.navigateTo({
    url,
    fail: (err) => {
      console.error('跳转到预约页面失败:', err)
      uni.showToast({
        title: '跳转失败，请稍后重试',
        icon: 'none',
      })
    },
  })
}

// 加载测试数据的方法
async function loadTestData() {
  try {
    uni.showLoading({
      title: '加载测试数据中...',
    })

    const result = await uni.cloud.callFunction({
      name: 'initTestData',
      data: {
        action: 'init',
        collection: 'all',
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

    const result = await uni.cloud.callFunction({
      name: 'initTestData',
      data: {
        action: 'clear',
        collection: 'all',
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

// 选择日期
const selectDate = (date) => {
  selectedDate.value = date
  fetchProfessionals()
}

// 选择时间段
const selectTimeSlot = (slot) => {
  selectedTimeSlot.value = slot
  fetchProfessionals()
}

// 清除日期筛选
const clearDateFilter = () => {
  selectedDate.value = ''
  fetchProfessionals()
}

// 清除时间段筛选
const clearTimeSlotFilter = () => {
  selectedTimeSlot.value = ''
  fetchProfessionals()
}

// 清除所有日期相关筛选
const clearAllDateFilters = () => {
  selectedDate.value = ''
  selectedTimeSlot.value = ''
  fetchProfessionals()
}

// 格式化选中的日期，便于展示
const formatSelectedDate = (dateStr) => {
  const date = availableDates.value.find((d) => d.value === dateStr)
  if (date) {
    return `${date.month}月${date.day}日${date.isToday ? '(今天)' : date.weekday}`
  }
  return dateStr
}

// 根据当前筛选条件生成空数据提示信息
const getEmptyMessage = () => {
  if (selectedDate.value) {
    if (selectedTimeSlot.value) {
      return `没有符合条件的专业人士在${formatSelectedDate(selectedDate.value)}的${timeSlotLabels[selectedTimeSlot.value]}有空`
    }
    return `没有符合条件的专业人士在${formatSelectedDate(selectedDate.value)}有空`
  }

  return onlyAvailable.value ? '暂无可预约的专业人士' : '暂无符合条件的专业人士'
}

/**
 * 根据服务区域字符串获取区域名称
 */
const getAreaName = (serviceAreaStr: string) => {
  if (!serviceAreaStr) return '未设置服务区域'

  // 如果是JSON字符串，尝试解析
  try {
    if (serviceAreaStr.startsWith('{') || serviceAreaStr.startsWith('[')) {
      const areaObj = JSON.parse(serviceAreaStr)
      // 根据解析出的结构提取区域名称
      if (Array.isArray(areaObj)) {
        return areaObj
          .map((area) => area.fullName || area.name || '')
          .filter(Boolean)
          .join(', ')
      } else if (areaObj.fullName || areaObj.name) {
        return areaObj.fullName || areaObj.name
      }
    }

    // 如果只是普通字符串，直接返回
    return serviceAreaStr
  } catch (e) {
    // 解析失败时，直接返回原字符串
    return serviceAreaStr
  }
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

.search-input {
  display: flex;
  flex: 1;
  align-items: center;
  min-width: 120px;
  height: 36px;
  padding: 0 10px;
  margin-right: 10px;
  background-color: #f5f5f5;
  border-radius: 18px;
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
  background-color: transparent;
  border: none;
}

.search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 36px;
  font-size: 14px;
  color: #fff;
  background-color: #007aff;
  border-radius: 18px;
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
  overflow: hidden;
  font-size: 14px;
  color: #333;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.down-arrow {
  margin-left: 4px;
  font-size: 12px;
  color: #999;
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
/* 可用性筛选样式 */
.availability-filter {
  padding: 0 20rpx !important;
  margin-left: auto !important;
  background-color: #f5f7fa !important;
  border-radius: 8rpx !important;
  transition: all 0.3s !important;
}

.availability-filter .active {
  font-weight: bold;
  color: #2b5cff;
}
/* 仅可预约按钮样式 */
.filter-item:last-child {
  /* 重置样式 */
  padding: 0 16rpx;
  margin-left: 0;
  background-color: transparent;
  border-radius: 0;
}

.filter-item:last-child .active {
  /* 保持默认样式 */
  color: inherit;
}

.availability-filter:active {
  transform: scale(0.95);
}
/* 当选中时的样式 */
.active-filter {
  background-color: #e5f1ff;
}

.filter-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12rpx;
  margin: 8rpx 0;
  background-color: #f9f9f9;
  border-radius: 8rpx;
}

.tip-text {
  font-size: 28rpx;
  color: #666;
}

.tip-text-sub {
  margin-top: 6rpx;
  font-size: 24rpx;
  color: #999;
}

.filter-icon {
  margin-left: 5px;
  font-size: 14px;
  color: #4caf50;
}
/* 日期选择器样式 */
.date-filter {
  padding: 20rpx;
  margin-bottom: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
}

.date-filter-title {
  margin-bottom: 16rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}

.date-scroll {
  display: flex;
  width: 100%;
  margin-bottom: 20rpx;
  white-space: nowrap;
}

.date-item {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120rpx;
  height: 150rpx;
  margin-right: 20rpx;
  background-color: #f9f9f9;
  border: 2rpx solid #eee;
  border-radius: 12rpx;
}

.weekday {
  margin-bottom: 6rpx;
  font-size: 24rpx;
  color: #666;
}

.date {
  margin-bottom: 6rpx;
  font-size: 36rpx;
  font-weight: 500;
  color: #333;
}

.month {
  font-size: 22rpx;
  color: #999;
}

.today-mark {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  padding: 2rpx 6rpx;
  font-size: 20rpx;
  color: #fff;
  background-color: #ff5151;
  border-radius: 20rpx;
}

.date-item.active {
  background-color: #2b5cff;
  border-color: #2b5cff;
}

.date-item.active .weekday,
.date-item.active .date,
.date-item.active .month,
.date-item.active .today-mark {
  color: #fff;
}
/* 时间段选择样式 */
.time-filter {
  margin-bottom: 20rpx;
}

.time-filter-title {
  margin-bottom: 16rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}

.time-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.time-button {
  padding: 12rpx 24rpx;
  font-size: 26rpx;
  color: #333;
  background-color: #f5f7fa;
  border-radius: 30rpx;
}

.time-button.active {
  color: #fff;
  background-color: #2b5cff;
}
/* 已选筛选条件样式 */
.selected-filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 20rpx;
  margin-top: 20rpx;
  border-top: 2rpx solid #f5f5f5;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.filter-tag {
  display: flex;
  align-items: center;
  padding: 8rpx 16rpx;
  font-size: 24rpx;
  color: #2b5cff;
  background-color: #e5f1ff;
  border-radius: 6rpx;
}

.clear-tag {
  margin-left: 8rpx;
  font-size: 28rpx;
  color: #999;
}

.clear-all {
  padding: 8rpx 16rpx;
  font-size: 24rpx;
  color: #999;
}

.search-bar {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  background-color: #fff;
}

.location {
  display: flex;
  align-items: center;
  max-width: 120px;
  height: 36px;
  padding: 0 10px;
  margin-right: 10px;
  margin-bottom: 5px;
  background-color: #f5f5f5;
  border-radius: 18px;
}

.professional-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px;
}

.professional-card {
  position: relative;
  display: flex;
  padding: 12px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.professional-avatar-container {
  width: 80px;
  height: 80px;
  margin-right: 12px;
  border-radius: 50%;
}

.professional-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.professional-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
}

.professional-name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 18px;
  font-weight: bold;
}

.professional-name {
  flex: 1;
}

.professional-gender {
  margin-left: 5px;
  font-size: 14px;
  color: #999;
}

.professional-area {
  margin-bottom: 5px;
}

.professional-area-text {
  font-size: 12px;
  color: #999;
}

.professional-experience {
  margin-bottom: 5px;
}

.professional-experience-text {
  font-size: 12px;
  color: #999;
}

.professional-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 5px;
}

.status-tag {
  padding: 2px 6px;
  font-size: 12px;
  color: #999;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.status-available {
  color: #4caf50;
}

.status-unavailable {
  color: #f44336;
}
</style>
