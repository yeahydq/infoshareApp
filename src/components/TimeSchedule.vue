<template>
  <view class="time-schedule">
    <!-- 日历视图 -->
    <view class="calendar">
      <view class="calendar-header">
        <view class="month-selector">
          <view class="month-nav">
            <text class="nav-btn" @tap="prevMonth">←</text>
            <picker
              mode="date"
              :value="currentDate"
              :start="startDate"
              :end="endDate"
              @change="handleMonthChange"
            >
              <view class="picker">{{ currentMonth }}月</view>
            </picker>
            <text class="nav-btn" @tap="nextMonth">→</text>
          </view>
        </view>
      </view>

      <view class="calendar-grid">
        <view class="weekdays">
          <text v-for="day in weekDays" :key="day.value">{{ day.label }}</text>
        </view>
        <view class="days">
          <view
            v-for="day in calendarDays"
            :key="day.date"
            :class="[
              'day',
              { 'has-schedule': day.hasSchedule },
              { selected: selectedDate === day.date },
              { today: day.isToday },
              { 'other-month': !day.isCurrentMonth },
            ]"
            @tap="selectDate(day)"
          >
            <text class="day-number">{{ day.dayNumber }}</text>
            <view v-if="day.hasSchedule" class="schedule-dot"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 日期详情弹窗 -->
    <view v-if="showDateDetail" class="date-detail-popup">
      <view class="popup-mask" @tap="closeDateDetail"></view>
      <view class="popup-content">
        <view class="popup-header">
          <text class="date-title">{{ formatDate(selectedDate) }}</text>
          <text class="close-btn" @tap="closeDateDetail">×</text>
        </view>
        <view class="time-slots">
          <view class="time-slot-header">
            <text>时间段</text>
            <text>选择</text>
          </view>
          <scroll-view scroll-y class="time-slot-list">
            <view
              v-for="slot in timeSlots"
              :key="slot.value"
              :class="['time-slot', { selected: isTimeSlotSelected(slot.value) }]"
              @tap="toggleTimeSlot(slot.value)"
            >
              <text>{{ slot.label }}</text>
              <text :class="['status', { selected: isTimeSlotSelected(slot.value) }]">
                {{ isTimeSlotSelected(slot.value) ? '已选择' : '未选择' }}
              </text>
            </view>
          </scroll-view>
        </view>
        <view class="popup-actions">
          <text class="action-btn" @tap="selectAllTimes">全选</text>
          <text class="action-btn" @tap="clearAllTimes">清空</text>
        </view>
      </view>
    </view>

    <!-- 已选择时间展示 -->
    <view class="selected-times">
      <text class="section-title">已选择的时间段</text>
      <view class="selected-list">
        <view v-for="(times, date) in groupedSelectedTimes" :key="date" class="date-group">
          <text class="date">{{ date }}</text>
          <view class="time-ranges">
            <text v-for="range in times" :key="range" class="time-range">{{ range }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'

// 生成未来3个月的日期范围
const startDate = new Date().toISOString().split('T')[0]
const endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

const currentDate = ref(new Date().toISOString().split('T')[0])
const currentMonth = computed(() => new Date(currentDate.value).getMonth() + 1)
const selectedDate = ref<string | null>(null)

// 选中的星期和时间段
const selectedDays = ref<number[]>([])
const selectedSlots = ref<string[]>([])

// 时间段选项（8:00-23:00，每半小时一个时间段）
const timeSlots = computed(() => {
  const slots = []
  for (let hour = 8; hour < 23; hour++) {
    slots.push(
      { label: `${hour}:00`, value: `${hour}:00` },
      { label: `${hour}:30`, value: `${hour}:30` },
    )
  }
  return slots
})

// 星期选项
const weekDays = [
  { label: '日', value: 0 },
  { label: '一', value: 1 },
  { label: '二', value: 2 },
  { label: '三', value: 3 },
  { label: '四', value: 4 },
  { label: '五', value: 5 },
  { label: '六', value: 6 },
]

// 计算日历数据
const calendarDays = computed(() => {
  const current = new Date(currentDate.value)
  const year = current.getFullYear()
  const month = current.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const firstDayWeek = firstDay.getDay()

  const days = []
  const today = new Date().toISOString().split('T')[0]

  // 添加上个月的日期
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = firstDayWeek - 1; i >= 0; i--) {
    const prevMonth = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    days.push({
      date: `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(prevMonthLastDay - i).padStart(2, '0')}`,
      dayNumber: prevMonthLastDay - i,
      isCurrentMonth: false,
      isToday: false,
      hasSchedule: false,
    })
  }

  // 添加当前月的日期
  for (let i = 1; i <= daysInMonth; i++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    days.push({
      date,
      dayNumber: i,
      isCurrentMonth: true,
      isToday: date === today,
      hasSchedule: hasScheduleForDate(date),
    })
  }

  // 添加下个月的日期
  const remainingDays = 42 - days.length // 保持6行
  for (let i = 1; i <= remainingDays; i++) {
    const nextMonth = month === 11 ? 0 : month + 1
    const nextYear = month === 11 ? year + 1 : year
    days.push({
      date: `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
      dayNumber: i,
      isCurrentMonth: false,
      isToday: false,
      hasSchedule: false,
    })
  }

  return days
})

// 检查日期是否有安排
const hasScheduleForDate = (date: string) => {
  return Object.keys(groupedSelectedTimes.value).some((key) => {
    const [month, day] = key.replace(/[月日]/g, '').split('')
    const scheduleDate = `${new Date().getFullYear()}-${String(parseInt(month)).padStart(2, '0')}-${String(parseInt(day)).padStart(2, '0')}`
    return scheduleDate === date
  })
}

// 控制日期详情弹窗的显示
const showDateDetail = ref(false)

// 选择日期
const selectDate = (day: any) => {
  if (!day.isCurrentMonth) return
  selectedDate.value = day.date
  showDateDetail.value = true
}

// 关闭日期详情
const closeDateDetail = () => {
  showDateDetail.value = false
}

// 格式化日期
const formatDate = (date: string) => {
  const d = new Date(date)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

// 切换时间段选择
const toggleTimeSlot = (slot: string) => {
  if (!selectedDate.value) return
  const date = formatDate(selectedDate.value)

  // 检查时间段是否已经被选中
  const isSelected = selectedSlots.value.includes(slot)

  if (isSelected) {
    // 如果已选中，则移除
    selectedSlots.value = selectedSlots.value.filter((s) => s !== slot)
  } else {
    // 如果未选中，则添加
    selectedSlots.value.push(slot)
  }
}

// 检查时间段是否被选中
const isTimeSlotSelected = (slot: string) => {
  if (!selectedDate.value) return false
  return selectedSlots.value.includes(slot)
}

// 全选时间段
const selectAllTimes = () => {
  if (!selectedDate.value) return
  const slots = timeSlots.value.map((slot) => slot.value)
  // 移除当前日期的时间段
  selectedSlots.value = selectedSlots.value.filter((slot) => {
    const slotDate = slot.split(' ')[0]
    return slotDate !== selectedDate.value
  })
  // 添加所有时间段
  selectedSlots.value.push(...slots)
}

// 清空时间段
const clearAllTimes = () => {
  if (!selectedDate.value) return
  // 直接清空所有时间段
  selectedSlots.value = []
}

// 切换到上一个月
const prevMonth = () => {
  const current = new Date(currentDate.value)
  const prevDate = new Date(current.getFullYear(), current.getMonth() - 1, 1)
  const start = new Date(startDate)
  if (prevDate >= start) {
    const year = prevDate.getFullYear()
    const month = String(prevDate.getMonth() + 1).padStart(2, '0')
    const day = String(prevDate.getDate()).padStart(2, '0')
    currentDate.value = `${year}-${month}-${day}`
  }
}

// 切换到下一个月
const nextMonth = () => {
  const current = new Date(currentDate.value)
  const nextDate = new Date(current.getFullYear(), current.getMonth() + 1, 1)
  const end = new Date(endDate)
  if (nextDate <= end) {
    const year = nextDate.getFullYear()
    const month = String(nextDate.getMonth() + 1).padStart(2, '0')
    const day = String(nextDate.getDate()).padStart(2, '0')
    currentDate.value = `${year}-${month}-${day}`
  }
}

// 处理月份变化
const handleMonthChange = (e: any) => {
  const selectedDate = new Date(e.detail.value)
  const start = new Date(startDate)
  const end = new Date(endDate)
  // 确保选择的日期在允许的范围内
  if (selectedDate >= start && selectedDate <= end) {
    currentDate.value = e.detail.value
  }
}

// 计算已选择的时间段
const groupedSelectedTimes = computed(() => {
  const result: Record<string, string[]> = {}
  const currentMonth = new Date(currentDate.value).getMonth()
  const currentYear = new Date(currentDate.value).getFullYear()

  selectedDays.value.forEach((day) => {
    // 获取当前月份的所有日期
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    for (let date = 1; date <= daysInMonth; date++) {
      const currentDate = new Date(currentYear, currentMonth, date)
      if (currentDate.getDay() === day) {
        const dateStr = `${currentMonth + 1}月${date}日`
        if (!result[dateStr]) {
          result[dateStr] = []
        }
        // 将时间段分组显示
        const slots = selectedSlots.value.sort()
        let currentRange = slots[0]
        const ranges: string[] = []

        for (let i = 1; i <= slots.length; i++) {
          if (
            i === slots.length ||
            new Date(`2000-01-01 ${slots[i]}`).getTime() -
              new Date(`2000-01-01 ${slots[i - 1]}`).getTime() >
              30 * 60 * 1000
          ) {
            ranges.push(`${currentRange}-${slots[i - 1]}`)
            if (i < slots.length) {
              currentRange = slots[i]
            }
          }
        }

        result[dateStr] = ranges
      }
    }
  })

  return result
})

// 导出选择的时间数据
const getSelectedTimes = () => {
  return {
    selectedDays: selectedDays.value,
    selectedSlots: selectedSlots.value,
    groupedTimes: groupedSelectedTimes.value,
  }
}

// 设置已选择的时间
const setSelectedTimes = (data: { selectedDays: number[]; selectedSlots: string[] }) => {
  selectedDays.value = data.selectedDays
  selectedSlots.value = data.selectedSlots
}

// 暴露方法给父组件
defineExpose({
  getSelectedTimes,
  setSelectedTimes,
})
</script>

<style lang="scss">
.time-schedule {
  padding: 20px;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 8px;
}

.calendar {
  margin-bottom: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid #eee;

    .month-selector {
      .month-nav {
        display: flex;
        gap: 12px;
        align-items: center;

        .nav-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          font-size: 18px;
          color: #666;
          cursor: pointer;
          background: #f5f5f5;
          border-radius: 4px;
          transition: all 0.3s;

          &:hover {
            background: #e8e8e8;
          }
        }

        .picker {
          padding: 8px 16px;
          font-size: 16px;
          font-weight: 500;
          color: #333;
          background: #f5f5f5;
          border-radius: 4px;
        }
      }
    }
  }

  .calendar-grid {
    padding: 16px;

    .weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      margin-bottom: 12px;
      text-align: center;

      text {
        padding: 8px 0;
        font-size: 14px;
        color: #999;
      }
    }

    .days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 8px;

      .day {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        aspect-ratio: 1;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.3s;

        &:hover {
          background-color: #f5f5f5;
        }

        &.other-month {
          pointer-events: none;
          cursor: not-allowed;
          opacity: 0.3;
        }

        &.today {
          color: #5bbdca;
          background-color: #f0f9ff;
        }

        &.selected {
          color: #5bbdca;
          background-color: #e6f7ff;
        }

        &.has-schedule {
          .schedule-dot {
            width: 4px;
            height: 4px;
            margin-top: 4px;
            background-color: #5bbdca;
            border-radius: 50%;
          }
        }

        .day-number {
          font-size: 14px;
          color: #333;
        }

        &.other-month .day-number {
          color: #999;
        }
      }
    }
  }
}

.date-detail-popup {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-end;

  .popup-mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .popup-content {
    position: relative;
    width: 100%;
    max-height: 80vh;
    padding: 20px;
    overflow-y: auto;
    background-color: #fff;
    border-radius: 16px 16px 0 0;

    .popup-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;

      .date-title {
        font-size: 18px;
        font-weight: 500;
        color: #333;
      }

      .close-btn {
        padding: 8px;
        font-size: 24px;
        color: #999;
      }
    }

    .time-slots {
      margin-bottom: 20px;

      .time-slot-header {
        display: flex;
        justify-content: space-between;
        padding: 12px;
        margin-bottom: 12px;
        font-size: 14px;
        color: #666;
        background-color: #f5f5f5;
        border-radius: 8px;
      }

      .time-slot-list {
        height: 300px;
        border: 1px solid #eee;
        border-radius: 8px;
      }

      .time-slot {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        font-size: 14px;
        border-bottom: 1px solid #eee;

        &:last-child {
          border-bottom: none;
        }

        &.selected {
          background-color: #f0f9ff;
        }

        .status {
          font-size: 12px;
          color: #999;

          &.selected {
            color: #5bbdca;
          }
        }
      }
    }

    .popup-actions {
      display: flex;
      gap: 12px;
      justify-content: space-between;
      padding: 16px 0;

      .action-btn {
        flex: 1;
        padding: 8px;
        font-size: 14px;
        color: #5bbdca;
        text-align: center;
        background-color: #f0f9ff;
        border-radius: 4px;
      }
    }
  }
}

.selected-times {
  .section-title {
    display: block;
    margin-bottom: 12px;
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }

  .selected-list {
    .date-group {
      margin-bottom: 12px;

      .date {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        color: #666;
      }

      .time-ranges {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        .time-range {
          padding: 4px 8px;
          font-size: 12px;
          color: #5bbdca;
          background-color: #f0f9ff;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
