<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '预约专业人士' },
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
      <!-- 专业人士信息 -->
      <view class="professional-card">
        <image
          class="professional-avatar"
          :src="professional.avatarUrl || defaultAvatar"
          mode="aspectFill"
        />
        <view class="professional-info">
          <view class="professional-name">
            <text>{{ professional.name || '未知专家' }}</text>
            <text class="verify-icon" v-if="professional.verified">✓</text>
          </view>
          <view class="professional-stats">
            <text>{{ renderProfessionalStats() }}</text>
          </view>
          <view class="professional-service">
            <text>{{ professional.serviceName || '专业服务' }}</text>
          </view>
          <view class="professional-price" v-if="professional.hourlyRate">
            <text>¥{{ professional.hourlyRate }}/小时</text>
          </view>
        </view>
      </view>

      <!-- 预约表单 -->
      <view class="booking-form">
        <view class="form-title">选择预约时间</view>

        <!-- 日期选择器 - 类似time-schedule风格 -->
        <view class="date-selector">
          <scroll-view scroll-x class="date-scroll">
            <view
              v-for="(date, index) in dates"
              :key="index"
              class="date-item"
              :class="{
                active: selectedDate === date.date,
                disabled: !date.hasSlots,
              }"
              @tap="date.hasSlots ? selectDate(date.date) : showNoSlotsToast(date.date)"
            >
              <text class="weekday">{{ date.weekday }}</text>
              <text class="date">{{ date.day }}</text>
              <text class="month">{{ date.month }}月</text>
              <text class="no-slots-mark" v-if="!date.hasSlots">不可约</text>
            </view>
          </scroll-view>
        </view>

        <!-- 时间段选择器 - 类似time-schedule风格 -->
        <view class="time-selector">
          <view
            v-for="(timeSlot, index) in timeSlots"
            :key="index"
            class="time-item"
            :class="{ active: selectedTimeSlot === timeSlot }"
            @tap="handleTimeSelected(selectedDate, timeSlot)"
          >
            {{ timeSlot }}
          </view>
          <view class="no-time" v-if="timeSlots.length === 0">
            <text>该日期暂无可预约时间</text>
          </view>
        </view>

        <!-- 预约备注 -->
        <view class="remark-section">
          <view class="form-title">预约备注</view>
          <textarea
            class="remark-input"
            v-model="remark"
            placeholder="请输入预约事项、具体需求等信息（选填）"
            :maxlength="200"
          />
          <text class="remark-count">{{ remark.length }}/200</text>
        </view>
      </view>

      <!-- 订单信息 -->
      <view class="order-info">
        <view class="order-item">
          <text class="order-label">服务时长</text>
          <text class="order-value">30分钟</text>
        </view>
        <view class="order-item">
          <text class="order-label">服务单价</text>
          <text class="order-value">¥{{ formattedPrice }}</text>
        </view>
        <view class="order-item total">
          <text class="order-label">预约总价</text>
          <text class="order-value price">¥{{ totalPrice }}</text>
        </view>
      </view>

      <!-- 底部操作区 -->
      <view class="action-bar">
        <view class="price-section">
          <text class="price-label">应付金额：</text>
          <text class="price-value">¥{{ totalPrice }}</text>
        </view>
        <button class="submit-btn" :disabled="!canSubmit" @tap="submitBooking">立即预约</button>
      </view>
    </block>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import TimeSchedule from '@/components/TimeSchedule.vue'

dayjs.locale('zh-cn')

const router = useRouter()
const route = useRoute()

// 默认头像
const defaultAvatar =
  'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

// 页面数据
const loading = ref(true)
const professional = ref<any>({})
const professionalOpenId = ref('')
const dates = ref<any[]>([])
const timeSlots = ref<string[]>([])
const selectedDate = ref('')
const selectedTimeSlot = ref('')
const remark = ref('')
const submitting = ref(false)

// 日程组件引用
const timeScheduleRef = ref(null)

// 计算属性
const totalPrice = computed((): string => {
  // 假设服务时长为30分钟，即0.5小时
  const price = (professional.value.hourlyRate || 0) * 0.5
  return price.toFixed(2)
})

const formattedPrice = computed(() => {
  return `¥${(professional.value.hourlyRate || 0).toFixed(2)}`
})

const appointmentDate = computed(() => {
  if (!selectedDate.value) return ''
  return dayjs(selectedDate.value).format('YYYY年MM月DD日')
})

const appointmentTime = computed(() => {
  return selectedTimeSlot.value || ''
})

const canSubmit = computed(() => {
  return !!selectedDate.value && !!selectedTimeSlot.value
})

// 初始化页面
onMounted(async () => {
  // 获取路由参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  // @ts-ignore - 微信小程序特有的属性
  const options = currentPage.options || {}

  if (options.id) {
    professionalOpenId.value = options.id

    // 接收列表页传递的日期参数
    if (options.date) {
      console.log('从列表页接收到的预约日期:', options.date)
      selectedDate.value = options.date
    }

    await Promise.all([fetchProfessionalInfo(), fetchAvailableDates()])
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
    console.log('获取专业人士信息, ID:', professionalOpenId.value)

    // 调用云函数获取专业人士信息
    const { result } = await uni.cloud.callFunction({
      name: 'profRegister',
      data: {
        action: 'getProfessionalDetail',
        id: professionalOpenId.value,
      },
    })

    console.log('获取专业人士信息返回结果:', result)

    if (result.success) {
      professional.value = result.data || {}
      console.log('成功获取专业人士信息:', professional.value)
    } else {
      console.error('获取专业人士信息失败:', result.message)
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

// 获取可用日期
const fetchAvailableDates = async () => {
  try {
    // 生成未来7天的日期
    const now = dayjs()
    const tempDates = []

    for (let i = 0; i < 7; i++) {
      const date = now.add(i, 'day')
      const hasSlots = Math.random() > 0.3 // 70%的概率有可用时间段

      tempDates.push({
        date: date.format('YYYY-MM-DD'),
        weekday: date.format('ddd'),
        day: date.format('DD'),
        month: date.format('MM月'),
        hasSlots,
        isPast: false,
        isSelected: false,
      })
    }

    console.log('正在获取专业人士可用时间, ID:', professionalOpenId.value)

    // 调用云函数获取专业人士所有可用日期
    const { result } = await uni.cloud.callFunction({
      name: 'TimeSchedule',
      data: {
        type: 'getProfessionalSlots',
        professionalId: professionalOpenId.value,
      },
    })

    console.log('获取可用时间段结果:', result)

    if (result.code === 0 && Array.isArray(result.data)) {
      // 标记哪些日期有可用时间段
      const availableDatesSet = new Set(result.data)
      console.log('可用日期集合:', Array.from(availableDatesSet))

      // 更新日期数组，标记有可用时间段的日期
      tempDates.forEach((date) => {
        date.hasSlots = availableDatesSet.has(date.date)
      })
    }

    // 更新可用日期列表
    dates.value = tempDates

    // 检查是否有从列表页传递的日期
    if (selectedDate.value) {
      // 验证该日期是否有可用时间段
      const selectedDateObj = tempDates.find((d) => d.date === selectedDate.value)
      if (selectedDateObj && selectedDateObj.hasSlots) {
        // 有可用时间段，获取该日期的时间段
        await fetchAvailableTimeSlots(selectedDate.value)
      } else {
        selectedDate.value = ''
        timeSlots.value = []
      }
    } else {
      // 默认选中第一个有可用时间段的日期
      const firstAvailableDate = tempDates.find((date) => date.hasSlots)
      if (firstAvailableDate) {
        selectDate(firstAvailableDate.date)
      } else {
        selectedDate.value = ''
        timeSlots.value = []
      }
    }
  } catch (error) {
    console.error('获取可用日期出错:', error)
    // 发生错误时，仍然显示日期选择器，但不选中任何日期
    const tempDates = generateDateRangeArray()
    dates.value = tempDates
    selectedDate.value = ''
  }
}

// 生成日期范围数组（辅助函数）
const generateDateRangeArray = () => {
  const tempDates = []
  const now = dayjs()

  for (let i = 0; i < 7; i++) {
    const date = now.add(i, 'day')
    const hasSlots = Math.random() > 0.3 // 70%的概率有可用时间段

    tempDates.push({
      date: date.format('YYYY-MM-DD'),
      weekday: date.format('ddd'),
      day: date.format('DD'),
      month: date.format('MM月'),
      hasSlots,
      isPast: false,
      isSelected: false,
    })
  }

  return tempDates
}

// 选择日期
const selectDate = async (date) => {
  if (selectedDate.value === date) return // 避免重复选择

  selectedDate.value = date
  selectedTimeSlot.value = ''
  await fetchAvailableTimeSlots(date)
}

// 获取可用时间段
const fetchAvailableTimeSlots = async (date: string) => {
  try {
    // 显示加载状态
    timeSlots.value = []

    // 调用云函数获取可用时间段
    const { result } = await uni.cloud.callFunction({
      name: 'TimeSchedule',
      data: {
        type: 'getProfessionalSlots',
        professionalId: professionalOpenId.value,
        date,
      },
    })

    if (result.code === 0) {
      // 返回的是该日期可用的时间段数组
      timeSlots.value = result.data || []
      console.log(`${date}可用时间段:`, timeSlots.value)
    } else {
      console.error('获取可用时间段失败:', result.message)
    }
  } catch (error) {
    console.error('获取可用时间段出错:', error)
    uni.showToast({
      title: '获取可用时间段出错',
      icon: 'none',
    })
  }
}

// 处理时间选择
const handleTimeSelected = (date: string, timeSlot: string) => {
  selectedDate.value = date
  selectedTimeSlot.value = timeSlot
}

// 提交预约
const submitBooking = async () => {
  if (!canSubmit.value) {
    uni.showToast({
      title: '请选择预约日期和时间',
      icon: 'none',
    })
    return
  }

  submitting.value = true

  try {
    // 构建预约数据
    const bookingData = {
      professionalId: professionalOpenId.value,
      date: selectedDate.value,
      timeSlot: selectedTimeSlot.value,
      remark: remark.value,
    }

    console.log('提交预约数据:', bookingData)

    // 调用云函数创建预约
    const { result } = await uni.cloud.callFunction({
      name: 'order-create',
      data: {
        bookingData,
      },
    })

    console.log('预约结果:', result)

    if (result.code === 0) {
      // 预约成功
      uni.showToast({
        title: '预约成功',
        icon: 'success',
        duration: 2000,
      })

      // 跳转到用户页面或首页
      setTimeout(() => {
        uni.switchTab({
          url: '/pages/weshares/index/index',
        })
      }, 2000)
    } else {
      // 预约失败
      uni.showToast({
        title: result.message || '预约失败，请稍后重试',
        icon: 'none',
      })
    }
  } catch (error) {
    console.error('提交预约出错:', error)
    uni.showToast({
      title: '网络错误，请稍后重试',
      icon: 'none',
    })
  } finally {
    submitting.value = false
  }
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

// 显示无可用时间段提示
const showNoSlotsToast = (date) => {
  uni.showToast({
    title: `该专业人士在${formatDateLabel(date)}没有可用时间段`,
    icon: 'none',
    duration: 2000,
  })
}

// 格式化日期，用于显示
const formatDateLabel = (dateStr: string) => {
  if (!dateStr) return ''

  const date = dayjs(dateStr)
  const today = dayjs().startOf('day')
  const tomorrow = today.add(1, 'day')

  const weekdayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const month = date.format('MM月')
  const day = date.format('DD')
  const weekday = weekdayNames[date.day()]

  // 判断是否是今天或明天
  if (date.isSame(today, 'day')) {
    return `今天(${month}${day}日)`
  } else if (date.isSame(tomorrow, 'day')) {
    return `明天(${month}${day}日)`
  } else {
    return `${month}${day}日(${weekday})`
  }
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
/* 专业人士卡片 */
.professional-card {
  display: flex;
  padding: 30rpx;
  margin: 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.professional-avatar {
  width: 120rpx;
  height: 120rpx;
  margin-right: 20rpx;
  border-radius: 60rpx;
}

.professional-info {
  flex: 1;
}

.professional-name {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
  font-size: 34rpx;
  font-weight: 500;
  color: #333;
}

.verify-icon {
  margin-left: 10rpx;
  font-size: 28rpx;
  color: #4caf50;
}

.professional-stats {
  margin-bottom: 10rpx;
  font-size: 24rpx;
  color: #666;
}

.professional-service {
  margin-bottom: 10rpx;
  font-size: 28rpx;
  color: #333;
}

.professional-price {
  font-size: 30rpx;
  font-weight: 500;
  color: #ff6b6b;
}
/* 预约表单 */
.booking-form {
  padding: 30rpx;
  margin: 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.form-title {
  margin-bottom: 20rpx;
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
}
/* 日期选择器 */
.date-selector {
  margin-bottom: 30rpx;
}

.date-scroll {
  padding: 20rpx 0;
  white-space: nowrap;
}

.date-item {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 160rpx;
  height: 180rpx;
  margin-right: 20rpx;
  background-color: #f5f7fa;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.date-item:last-child {
  margin-right: 40rpx;
}

.weekday {
  margin-bottom: 10rpx;
  font-size: 28rpx;
  color: #666;
}

.date {
  margin-bottom: 6rpx;
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
}

.month {
  font-size: 24rpx;
  color: #999;
}

.date-item.active {
  background-color: #4caf50;
  transform: scale(1.05);
}

.date-item.active .weekday {
  color: rgba(255, 255, 255, 0.8);
}

.date-item.active .date {
  color: white;
}

.date-item.active .month {
  color: rgba(255, 255, 255, 0.8);
}

.date-item.disabled {
  background-color: #f0f0f0;
  opacity: 0.7;
}

.date-item.disabled .weekday,
.date-item.disabled .date,
.date-item.disabled .month {
  color: #aaa;
}

.no-slots-mark {
  position: absolute;
  bottom: 15rpx;
  font-size: 22rpx;
  color: #ff4d4f;
}
/* 时间段选择器 */
.time-selector {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10rpx 30rpx;
}

.time-item {
  width: calc(33.33% - 20rpx);
  height: 80rpx;
  margin: 10rpx;
  font-size: 28rpx;
  line-height: 80rpx;
  color: #333;
  text-align: center;
  background-color: #f9f9f9;
  border: 2rpx solid #eee;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;
}

.time-item:active {
  transform: scale(0.98);
}

.time-item.active {
  color: #fff;
  background-color: #4caf50;
  border-color: #4caf50;
}

.no-time {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 60rpx 0;
  font-size: 28rpx;
  color: #999;
  text-align: center;
}
/* 备注区域 */
.remark-section {
  position: relative;
}

.remark-input {
  box-sizing: border-box;
  width: 100%;
  height: 200rpx;
  padding: 20rpx;
  font-size: 28rpx;
  color: #333;
  background-color: #f9f9f9;
  border-radius: 8rpx;
}

.remark-count {
  position: absolute;
  right: 20rpx;
  bottom: 20rpx;
  font-size: 24rpx;
  color: #999;
}
/* 订单信息 */
.order-info {
  padding: 30rpx;
  margin: 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.order-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.order-label {
  font-size: 28rpx;
  color: #666;
}

.order-value {
  font-size: 28rpx;
  color: #333;
}

.order-item.total {
  padding-top: 20rpx;
  margin-top: 30rpx;
  border-top: 2rpx dashed #eee;
}

.price {
  font-size: 34rpx;
  font-weight: 500;
  color: #ff6b6b;
}
/* 底部操作区 */
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 100;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100rpx;
  padding: 0 30rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.price-section {
  display: flex;
  align-items: center;
}

.price-label {
  font-size: 28rpx;
  color: #666;
}

.price-value {
  font-size: 34rpx;
  font-weight: 500;
  color: #ff6b6b;
}

.submit-btn {
  width: 240rpx;
  height: 80rpx;
  font-size: 30rpx;
  line-height: 80rpx;
  color: #fff;
  background-color: #5bbdca;
  border-radius: 40rpx;
}

.submit-btn[disabled] {
  color: #ffffff;
  background-color: #cccccc;
}
</style>
