<template>
  <view class="container">
    <view class="nav-bar">
      <view class="title">个人时间管理</view>
      <!-- <view class="back" @tap="goBack">
        <text class="back-icon">←</text>
      </view> -->
    </view>

    <!-- 标签页切换 -->
    <view class="tabs">
      <view
        class="tab-item"
        :class="{ active: activeTab === 'schedule' }"
        @tap="activeTab = 'schedule'"
      >
        我的可约时间
      </view>
      <view
        class="tab-item"
        :class="{ active: activeTab === 'bookings' }"
        @tap="activeTab = 'bookings'"
      >
        我的预约记录
      </view>
    </view>

    <view class="content">
      <!-- 空闲时间安排 -->
      <view v-if="activeTab === 'schedule'">
        <time-schedule ref="timeScheduleRef" />
        <view class="action-buttons">
          <button class="btn cancel" @tap="goBack">取消</button>
          <button class="btn save" @tap="handleSave">保存</button>
        </view>
      </view>

      <!-- 预约记录 -->
      <view v-if="activeTab === 'bookings'" class="bookings-list">
        <view v-if="loading" class="loading">加载中...</view>
        <view v-else-if="bookings.length === 0" class="empty-bookings">暂无预约记录</view>
        <view v-else class="booking-items">
          <view v-for="(booking, index) in bookings" :key="index" class="booking-item">
            <view class="booking-header">
              <view class="professional-info">
                <image
                  class="avatar"
                  :src="booking.professionalAvatar || defaultAvatar"
                  mode="aspectFill"
                />
                <view class="name">{{ booking.professionalName || '未知专家' }}</view>
              </view>
              <view class="status" :class="getStatusClass(booking.status)">
                {{ getStatusText(booking.status) }}
              </view>
            </view>
            <view class="booking-info">
              <view class="info-row">
                <text class="label">预约时间：</text>
                <text class="value">{{ booking.date }} {{ booking.startTime }}</text>
              </view>
              <view class="info-row">
                <text class="label">服务内容：</text>
                <text class="value">{{ booking.serviceName || '专业服务' }}</text>
              </view>
              <view class="info-row" v-if="booking.remark">
                <text class="label">备注信息：</text>
                <text class="value">{{ booking.remark }}</text>
              </view>
            </view>
            <view class="booking-actions">
              <button
                class="action-btn cancel-btn"
                v-if="['pending', 'confirmed'].includes(booking.status)"
                @tap="cancelBooking(booking._id)"
              >
                取消预约
              </button>
              <button class="action-btn contact-btn" @tap="contactProfessional(booking)">
                联系专家
              </button>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import TimeSchedule from '@/components/TimeSchedule.vue'
import type { TimeSchedule as TimeScheduleType } from '@/types/cloud'

// 扩展uni类型以支持cloud属性
declare global {
  interface Uni {
    cloud: {
      callFunction(options: { name: string; data?: any }): Promise<any>
    }
  }
}

// 默认头像
const defaultAvatar =
  'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

// 数据
const timeScheduleRef = ref()
const activeTab = ref('schedule') // 默认显示时间安排页
const bookings = ref<any[]>([])
const loading = ref(false)

// 获取当前时间安排
const getCurrentSchedule = async () => {
  try {
    const { result } = await uni.cloud.callFunction({
      name: 'TimeSchedule',
      data: {
        type: 'get',
      },
    })

    if (result.code === 0 && result.data) {
      const schedule = result.data as TimeScheduleType
      // 将时间段按日期分组
      const slotsByDate: { [date: string]: string[] } = {}

      schedule.slots.forEach((slot) => {
        const date = slot.date || new Date(slot.date).toISOString().split('T')[0]
        if (!slotsByDate[date]) {
          slotsByDate[date] = []
        }
        slotsByDate[date].push(slot.startTime)
      })

      timeScheduleRef.value?.setSelectedTimes({
        selectedDays: schedule.slots
          .map((slot) => {
            const date = new Date(slot.date)
            return date.getDay() // 返回星期几 (0-6)
          })
          .filter((v, i, a) => a.indexOf(v) === i), // 去重
        selectedSlots: slotsByDate,
      })
    }
  } catch (error) {
    console.error('获取时间安排失败:', error)
    // 不显示错误提示，直接使用空数据
    timeScheduleRef.value?.setSelectedTimes({
      selectedDays: [],
      selectedSlots: {},
    })
  }
}

// 获取用户预约记录
const getMyBookings = async () => {
  loading.value = true
  bookings.value = []

  try {
    const { result } = await uni.cloud.callFunction({
      name: 'order-create',
      data: {
        action: 'getMyBookings',
      },
    })

    console.log('获取预约记录结果:', result)

    if (result.code === 0) {
      bookings.value = result.data || []
    } else {
      uni.showToast({
        title: result.message || '获取预约记录失败',
        icon: 'none',
      })
    }
  } catch (error) {
    console.error('获取预约记录出错:', error)
    uni.showToast({
      title: '网络错误，请稍后重试',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap = {
    pending: '待确认',
    confirmed: '已确认',
    completed: '已完成',
    cancelled: '已取消',
  }
  return statusMap[status] || '未知状态'
}

// 获取状态样式类
const getStatusClass = (status: string) => {
  const classMap = {
    pending: 'status-pending',
    confirmed: 'status-confirmed',
    completed: 'status-completed',
    cancelled: 'status-cancelled',
  }
  return classMap[status] || ''
}

// 取消预约
const cancelBooking = async (orderId: string) => {
  try {
    uni.showLoading({ title: '取消中...' })

    const { result } = await uni.cloud.callFunction({
      name: 'order-create',
      data: {
        action: 'cancelBooking',
        orderId,
      },
    })

    uni.hideLoading()

    if (result.code === 0) {
      uni.showToast({
        title: '取消成功',
        icon: 'success',
      })
      // 刷新预约记录
      getMyBookings()
    } else {
      uni.showToast({
        title: result.message || '取消失败',
        icon: 'none',
      })
    }
  } catch (error) {
    uni.hideLoading()
    console.error('取消预约出错:', error)
    uni.showToast({
      title: '网络错误，请稍后重试',
      icon: 'none',
    })
  }
}

// 联系专业人士
const contactProfessional = (booking: any) => {
  if (booking.professionalPhone) {
    uni.makePhoneCall({
      phoneNumber: booking.professionalPhone,
    })
  } else {
    uni.showToast({
      title: '暂无联系方式',
      icon: 'none',
    })
  }
}

// 保存时间安排
const handleSave = async () => {
  try {
    const timeSchedule = timeScheduleRef.value?.getSelectedTimes()
    if (!timeSchedule) {
      uni.showToast({
        title: '请选择时间',
        icon: 'none',
      })
      return
    }

    const { result } = await uni.cloud.callFunction({
      name: 'TimeSchedule',
      data: {
        type: 'update',
        timeSchedule,
      },
    })

    if (result.code === 0) {
      uni.showToast({
        title: '保存成功',
        icon: 'success',
      })
      setTimeout(() => {
        goBack()
      }, 1500)
    } else {
      throw new Error(result.message)
    }
  } catch (error) {
    console.error('保存时间安排失败:', error)
    uni.showToast({
      title: '保存失败',
      icon: 'none',
    })
  }
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 切换标签页
const handleTabChange = (tab: string) => {
  activeTab.value = tab
  if (tab === 'bookings') {
    getMyBookings()
  }
}

onMounted(() => {
  getCurrentSchedule()

  // 监听标签切换
  watch(activeTab, (newValue) => {
    if (newValue === 'bookings') {
      getMyBookings()
    }
  })
})
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.nav-bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
  background-color: #ffffff;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);

  .title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333333;
  }

  .back {
    position: absolute;
    left: 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48rpx;
    height: 48rpx;

    .back-icon {
      font-size: 32rpx;
      color: #333333;
    }
  }
}
/* 标签页样式 */
.tabs {
  display: flex;
  height: 90rpx;
  background-color: #ffffff;
  border-bottom: 1rpx solid #eeeeee;

  .tab-item {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 28rpx;
    color: #666666;

    &.active {
      position: relative;
      font-weight: 500;
      color: #4caf50;

      &:after {
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 60rpx;
        height: 4rpx;
        content: '';
        background-color: #4caf50;
        transform: translateX(-50%);
      }
    }
  }
}

.content {
  flex: 1;
  padding: 24rpx;
  overflow-y: auto;
  background-color: #f5f5f5;
}

.action-buttons {
  display: flex;
  gap: 24rpx;
  justify-content: space-between;
  padding: 24rpx;
  background-color: #ffffff;
  box-shadow: 0 -2rpx 4rpx rgba(0, 0, 0, 0.05);

  .btn {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    height: 88rpx;
    font-size: 32rpx;
    font-weight: 500;
    border-radius: 44rpx;

    &.cancel {
      color: #666666;
      background-color: #f5f5f5;
    }

    &.save {
      color: #ffffff;
      background-color: #4caf50;
    }
  }
}
/* 预约记录样式 */
.bookings-list {
  .loading {
    padding: 40rpx;
    font-size: 28rpx;
    color: #999999;
    text-align: center;
  }

  .empty-bookings {
    padding: 100rpx 0;
    font-size: 28rpx;
    color: #999999;
    text-align: center;
  }

  .booking-items {
    .booking-item {
      margin-bottom: 30rpx;
      overflow: hidden;
      background-color: #ffffff;
      border-radius: 12rpx;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

      .booking-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 24rpx;
        border-bottom: 1rpx solid #f5f5f5;

        .professional-info {
          display: flex;
          align-items: center;

          .avatar {
            width: 80rpx;
            height: 80rpx;
            margin-right: 20rpx;
            border-radius: 40rpx;
          }

          .name {
            font-size: 30rpx;
            font-weight: 500;
            color: #333333;
          }
        }

        .status {
          padding: 6rpx 16rpx;
          font-size: 24rpx;
          border-radius: 20rpx;

          &.status-pending {
            color: #ff9800;
            background-color: rgba(255, 152, 0, 0.1);
          }

          &.status-confirmed {
            color: #4caf50;
            background-color: rgba(76, 175, 80, 0.1);
          }

          &.status-completed {
            color: #2196f3;
            background-color: rgba(33, 150, 243, 0.1);
          }

          &.status-cancelled {
            color: #9e9e9e;
            background-color: rgba(158, 158, 158, 0.1);
          }
        }
      }

      .booking-info {
        padding: 24rpx;

        .info-row {
          display: flex;
          margin-bottom: 16rpx;

          &:last-child {
            margin-bottom: 0;
          }

          .label {
            width: 160rpx;
            font-size: 26rpx;
            color: #666666;
          }

          .value {
            flex: 1;
            font-size: 26rpx;
            color: #333333;
          }
        }
      }

      .booking-actions {
        display: flex;
        justify-content: flex-end;
        padding: 16rpx 24rpx 24rpx;

        .action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 160rpx;
          height: 60rpx;
          padding: 0 30rpx;
          margin-left: 20rpx;
          font-size: 26rpx;
          border-radius: 30rpx;

          &.cancel-btn {
            color: #ff5722;
            background-color: #ffffff;
            border: 1rpx solid #ff5722;
          }

          &.contact-btn {
            color: #ffffff;
            background-color: #4caf50;
          }
        }
      }
    }
  }
}
</style>
