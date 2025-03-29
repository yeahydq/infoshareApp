<template>
  <view class="container">
    <view class="nav-bar">
      <view class="title">空闲时间安排</view>
      <!-- <view class="back" @tap="goBack">
        <text class="back-icon">←</text>
      </view> -->
    </view>

    <view class="content">
      <time-schedule ref="timeScheduleRef" />
    </view>

    <view class="action-buttons">
      <button class="btn cancel" @tap="goBack">取消</button>
      <button class="btn save" @tap="handleSave">保存</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TimeSchedule from '@/components/TimeSchedule.vue'
import type { TimeSchedule as TimeScheduleType } from '@/types/cloud'

const timeScheduleRef = ref()

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

onMounted(() => {
  getCurrentSchedule()
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
</style>
