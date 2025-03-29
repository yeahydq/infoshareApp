<template>
  <view class="time-schedule">
    <!-- 日历视图 -->
    <view class="calendar">
      <view class="calendar-header">
        <view class="month-selector">
          <view class="month-nav">
            <text class="nav-btn" @click="prevMonth">←</text>
            <!-- 简化日期显示，不使用picker -->
            <view class="month-display">{{ currentYear }}年{{ currentMonth }}月</view>
            <text class="nav-btn" @click="nextMonth">→</text>
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
              { 'past-date': day.isPast },
              { 'out-of-range': day.isOutOfRange },
            ]"
            @click="handleDateClick(day)"
          >
            <text class="day-number">{{ day.dayNumber }}</text>
            <view v-if="day.hasSchedule" class="schedule-dot"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 日期详情弹窗 -->
    <view v-if="showDateDetail" class="date-detail-popup">
      <view class="popup-mask" @click="closeDateDetail"></view>
      <view class="popup-content">
        <view class="popup-header">
          <text class="date-title">{{ formatDate(selectedDate) }}</text>
          <text class="close-btn" @click="closeDateDetail">×</text>
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
              :class="[
                'time-slot',
                {
                  selected: isTimeSlotSelected(slot.value),
                  booked: isSlotBooked(selectedDate, slot.value),
                },
              ]"
              @click="isSlotBooked(selectedDate, slot.value) ? null : toggleTimeSlot(slot.value)"
            >
              <text>{{ slot.label }}</text>
              <text
                :class="[
                  'status',
                  {
                    selected: isTimeSlotSelected(slot.value),
                    booked: isSlotBooked(selectedDate, slot.value),
                  },
                ]"
              >
                {{
                  isSlotBooked(selectedDate, slot.value)
                    ? '已被预约'
                    : isTimeSlotSelected(slot.value)
                      ? '可预约'
                      : '未选择'
                }}
              </text>
            </view>
          </scroll-view>
        </view>
        <view class="popup-actions">
          <text class="action-btn" @click="selectAllTimes">全选</text>
          <text class="action-btn" @click="clearAllTimes">清空</text>
        </view>
      </view>
    </view>

    <!-- 已选择时间展示 -->
    <view class="selected-times">
      <view class="section-header">
        <text class="section-title">时间段</text>
        <text
          v-if="selectedDate && !isPastDate(selectedDate)"
          class="add-btn"
          @click="editSelectedDateTimes"
        >
          维护时间段
        </text>
      </view>
      <view v-if="!selectedDate" class="empty-tip">
        <text>请先选择日期</text>
      </view>
      <view v-else-if="!selectedDateHasSlots" class="empty-tip">
        <text>当前日期未设置时间段</text>
        <text class="add-tip">点击"维护时间段"按钮添加</text>
      </view>
      <view v-else class="time-slot-display">
        <view class="date-header">
          <text class="date-title">{{ formatDate(selectedDate) }}</text>
        </view>

        <view v-if="hasBookedSlots" class="time-slot-section">
          <text class="section-label">已被预约:</text>
          <view class="time-ranges">
            <text v-for="slot in bookedSlotsForSelectedDate" :key="slot" class="time-range booked">
              {{ slot }}
            </text>
          </view>
        </view>

        <view v-if="selectedDateHasSlots" class="time-slot-section">
          <text class="section-label">可预约:</text>
          <view class="time-ranges">
            <text
              v-for="slot in formattedSelectedDateSlots"
              :key="slot"
              class="time-range available"
            >
              {{ slot }}
            </text>
          </view>
        </view>

        <view v-if="!hasBookedSlots && !selectedDateHasSlots" class="empty-message">
          <text>暂无时间段安排</text>
        </view>
      </view>
    </view>

    <!-- 时间段选择弹窗 -->
    <view v-if="showTimeSelector" class="time-selector-popup">
      <view class="popup-mask" @click="hideTimeSelector"></view>
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">{{ formatDate(selectedDate) }} 时间段</text>
          <text class="close-btn" @click="hideTimeSelector">×</text>
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
              :class="[
                'time-slot',
                {
                  selected: isSelectorTimeSlotSelected(slot.value),
                  booked: isSlotBooked(selectedDate, slot.value),
                },
              ]"
              @click="
                isSlotBooked(selectedDate, slot.value) ? null : toggleSelectorTimeSlot(slot.value)
              "
            >
              <text>{{ slot.label }}</text>
              <text
                :class="[
                  'status',
                  {
                    selected: isSelectorTimeSlotSelected(slot.value),
                    booked: isSlotBooked(selectedDate, slot.value),
                  },
                ]"
              >
                {{
                  isSlotBooked(selectedDate, slot.value)
                    ? '已被预约'
                    : isSelectorTimeSlotSelected(slot.value)
                      ? '可预约'
                      : '未选择'
                }}
              </text>
            </view>
          </scroll-view>
        </view>

        <view class="popup-actions">
          <text class="action-btn" @click="selectAllSelectorTimes">全选</text>
          <text class="action-btn" @click="clearAllSelectorTimes">清空</text>
          <text class="action-btn confirm" @click="confirmTimeSelection">确定</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'

// 生成未来3个月的日期范围
const startDate = new Date().toISOString().split('T')[0]

// 更精确地计算90天后的日期
const today = new Date()
today.setHours(0, 0, 0, 0)
const endDateObj = new Date(today)
endDateObj.setDate(today.getDate() + 90 - 1) // 今天+89天=90天范围
const endDate = endDateObj.toISOString().split('T')[0]

// 为picker组件准备的日期范围
const startDateForPicker = computed(() => {
  // 当前月份的第一天
  const todayMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  return todayMonth.toISOString().split('T')[0]
})

const endDateForPicker = computed(() => {
  // 最后可预约日期所在月份的第一天
  const lastBookableMonth = new Date(endDateObj.getFullYear(), endDateObj.getMonth(), 1)
  // 移到下一个月，因为我们需要包含整个最后一个月
  lastBookableMonth.setMonth(lastBookableMonth.getMonth() + 1)
  lastBookableMonth.setDate(0) // 设置为月的最后一天
  return lastBookableMonth.toISOString().split('T')[0]
})

// 提取为全局函数：判断日期是否超出可预约范围
const isDateOutOfRange = (dateStr) => {
  const date = new Date(dateStr)
  date.setHours(0, 0, 0, 0)
  return date < today || date > endDateObj
}

// 提取为全局函数：判断日期是否是过去的日期
const isPastDate = (dateStr) => {
  const date = new Date(dateStr)
  date.setHours(0, 0, 0, 0)
  return date < today
}

// 设置当前日期为今天，格式为YYYY-MM-DD
const now = new Date()
const year = now.getFullYear()
const month = String(now.getMonth() + 1).padStart(2, '0')
const day = String(now.getDate()).padStart(2, '0')
const currentDate = ref(`${year}-${month}-${day}`)

const currentMonth = computed(() => new Date(currentDate.value).getMonth() + 1)
const currentYear = computed(() => new Date(currentDate.value).getFullYear())
const selectedDate = ref<string | null>(null)

// 选中的星期和时间段
const selectedDays = ref<number[]>([])
const selectedSlots = ref<{ [date: string]: string[] }>({})

// 添加已预约时间段的数据
const bookedSlots = ref<{ [date: string]: string[] }>({})

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
  // 使用全局变量中的today，确保一致性
  const todayStr = today.toISOString().split('T')[0]

  // 添加上个月的日期
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = firstDayWeek - 1; i >= 0; i--) {
    const prevMonth = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    const date = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(prevMonthLastDay - i).padStart(2, '0')}`
    days.push({
      date,
      dayNumber: prevMonthLastDay - i,
      isCurrentMonth: false,
      isToday: date === todayStr,
      hasSchedule: hasScheduleForDate(date),
      isPast: isPastDate(date),
      isOutOfRange: isDateOutOfRange(date),
    })
  }

  // 添加当前月的日期
  for (let i = 1; i <= daysInMonth; i++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    days.push({
      date,
      dayNumber: i,
      isCurrentMonth: true,
      isToday: date === todayStr,
      hasSchedule: hasScheduleForDate(date),
      isPast: isPastDate(date),
      isOutOfRange: isDateOutOfRange(date),
    })
  }

  // 添加下个月的日期
  const remainingDays = 42 - days.length // 保持6行
  for (let i = 1; i <= remainingDays; i++) {
    const nextMonth = month === 11 ? 0 : month + 1
    const nextYear = month === 11 ? year + 1 : year
    const date = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    days.push({
      date,
      dayNumber: i,
      isCurrentMonth: false,
      isToday: date === todayStr,
      hasSchedule: hasScheduleForDate(date),
      isPast: isPastDate(date),
      isOutOfRange: isDateOutOfRange(date),
    })
  }

  return days
})

// 检查日期是否有安排
const hasScheduleForDate = (date: string) => {
  // 直接检查该日期是否在selectedSlots中有值且不为空
  return selectedSlots.value[date] && selectedSlots.value[date].length > 0
}

// 控制日期详情弹窗的显示
const showDateDetail = ref(false)

// 处理日期点击
const handleDateClick = (day) => {
  // 如果不是当前月份的日期，不做任何操作
  if (!day.isCurrentMonth) return

  // 检查日期是否在有效范围内
  if (isDateOutOfRange(day.date)) {
    showOutOfRangeToast()
    return
  }

  // 检查是否是过去的日期
  if (day.isPast) {
    uni.showToast({
      title: '不能选择过去的日期',
      icon: 'none',
    })
    return
  }

  // 更新选中的日期
  selectedDate.value = day.date
  showDateDetail.value = false
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

  // 如果该时间段已被预约，不允许选择
  if (isSlotBooked(selectedDate.value, slot)) return

  // 确保当前日期在selectedSlots中有一个数组
  if (!selectedSlots.value[selectedDate.value]) {
    selectedSlots.value[selectedDate.value] = []
  }

  // 检查时间段是否已经被选中
  const isSelected = selectedSlots.value[selectedDate.value].includes(slot)

  if (isSelected) {
    // 如果已选中，则移除
    selectedSlots.value[selectedDate.value] = selectedSlots.value[selectedDate.value].filter(
      (s) => s !== slot,
    )
  } else {
    // 如果未选中，则添加
    selectedSlots.value[selectedDate.value].push(slot)
  }
}

// 检查时间段是否被选中
const isTimeSlotSelected = (slot: string) => {
  if (!selectedDate.value) return false
  return (
    selectedSlots.value[selectedDate.value] &&
    selectedSlots.value[selectedDate.value].includes(slot)
  )
}

// 全选时间段
const selectAllTimes = () => {
  if (!selectedDate.value) return
  const availableSlots = timeSlots.value
    .map((slot) => slot.value)
    .filter((slot) => !isSlotBooked(selectedDate.value, slot))

  // 设置当前日期的所有可用时间段
  selectedSlots.value[selectedDate.value] = [...availableSlots]
}

// 清空时间段
const clearAllTimes = () => {
  if (!selectedDate.value) return

  // 清空当前日期的时间段
  selectedSlots.value[selectedDate.value] = []
}

// 使用uni-app原生方法重写月份切换逻辑
const prevMonth = () => {
  try {
    const dateObj = new Date(currentDate.value)

    // 获取当前视图的年月
    const currentViewYear = dateObj.getFullYear()
    const currentViewMonth = dateObj.getMonth()

    // 获取前一个月
    let prevMonthObj
    if (currentViewMonth === 0) {
      // 如果是1月，要回到上一年的12月
      prevMonthObj = new Date(currentViewYear - 1, 11, 1)
    } else {
      prevMonthObj = new Date(currentViewYear, currentViewMonth - 1, 1)
    }

    // 检查是否不早于当前月
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    if (prevMonthObj >= currentMonth) {
      // 格式化为yyyy-MM-dd
      const year = prevMonthObj.getFullYear()
      const month = String(prevMonthObj.getMonth() + 1).padStart(2, '0')
      // 直接修改currentDate
      currentDate.value = `${year}-${month}-01`
      console.log('切换到上个月:', currentDate.value)
    } else {
      uni.showToast({
        title: '不能查看过去的月份',
        icon: 'none',
      })
    }
  } catch (error) {
    console.error('prevMonth error:', error)
  }
}

const nextMonth = () => {
  try {
    const dateObj = new Date(currentDate.value)

    // 获取当前视图的年月
    const currentViewYear = dateObj.getFullYear()
    const currentViewMonth = dateObj.getMonth()

    // 获取下一个月
    let nextMonthObj
    if (currentViewMonth === 11) {
      // 如果是12月，要前进到下一年的1月
      nextMonthObj = new Date(currentViewYear + 1, 0, 1)
    } else {
      nextMonthObj = new Date(currentViewYear, currentViewMonth + 1, 1)
    }

    // 检查是否不晚于最后可预约月份
    const lastBookableMonth = new Date(endDateObj.getFullYear(), endDateObj.getMonth(), 1)

    if (nextMonthObj <= lastBookableMonth) {
      // 格式化为yyyy-MM-dd
      const year = nextMonthObj.getFullYear()
      const month = String(nextMonthObj.getMonth() + 1).padStart(2, '0')

      // 直接修改currentDate
      currentDate.value = `${year}-${month}-01`
      console.log('切换到下个月:', currentDate.value)
    } else {
      uni.showToast({
        title: '已到最后可预约月份',
        icon: 'none',
      })
    }
  } catch (error) {
    console.error('nextMonth error:', error)
  }
}

// 处理月份变化
const handleMonthChange = (e: any) => {
  try {
    // 获取选择的日期值
    const dateValue = e.detail.value // 格式为: "2024-06"

    // 添加日份以创建完整日期对象（默认第1天）
    const dateWithDay = dateValue + '-01'
    const selectedDate = new Date(dateWithDay)

    // 获取当前月份的第一天
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    // 获取最后一个可预约月份的第一天
    const lastBookableMonth = new Date(endDateObj.getFullYear(), endDateObj.getMonth(), 1)

    console.log(
      '选择月份:',
      dateValue,
      '判断范围:',
      currentMonth.toISOString().slice(0, 10),
      lastBookableMonth.toISOString().slice(0, 10),
    )

    // 检查选择的月份是否在允许范围内
    if (selectedDate >= currentMonth && selectedDate <= lastBookableMonth) {
      // 直接使用作为当前日期
      currentDate.value = dateWithDay
      console.log('设置月份为:', currentDate.value)
    } else if (selectedDate < currentMonth) {
      uni.showToast({
        title: '不能选择过去的月份',
        icon: 'none',
      })
    } else {
      uni.showToast({
        title: '超出可预约的月份范围',
        icon: 'none',
      })
    }
  } catch (error) {
    console.error('处理月份变化出错:', error)
  }
}

// 计算已选择的时间段
const groupedSelectedTimes = computed(() => {
  const result: Record<string, string[]> = {}

  // 处理每个日期的时间段
  Object.keys(selectedSlots.value).forEach((date) => {
    const slots = selectedSlots.value[date]
    if (!slots || slots.length === 0) return

    // 使用格式化的日期作为键
    const formattedDate = formatDate(date)
    if (!result[formattedDate]) {
      result[formattedDate] = []
    }

    // 对时间槽进行排序
    const sortedSlots = [...slots].sort((a, b) => {
      return a.localeCompare(b)
    })

    // 将时间段分组显示 (合并连续的时间段)
    if (sortedSlots.length > 0) {
      let startTime = sortedSlots[0]
      let endTime = startTime
      const ranges: string[] = []

      for (let i = 1; i < sortedSlots.length; i++) {
        const currentSlot = sortedSlots[i]
        const currentTime = new Date(`2000-01-01T${currentSlot}:00`)
        const prevTime = new Date(`2000-01-01T${endTime}:00`)

        // 检查时间是否连续 (相差30分钟)
        if (currentTime.getTime() - prevTime.getTime() === 30 * 60 * 1000) {
          endTime = currentSlot
        } else {
          // 不连续时添加范围并开始新范围
          ranges.push(`${startTime}-${endTime}`)
          startTime = currentSlot
          endTime = currentSlot
        }
      }

      // 添加最后一个范围
      ranges.push(`${startTime}-${endTime}`)
      result[formattedDate] = ranges
    }
  })

  return result
})

// 导出选择的时间数据
const getSelectedTimes = () => {
  // 处理返回数据格式
  const slots = []

  // 将每个日期的时间段转换为需要的格式
  Object.keys(selectedSlots.value).forEach((date) => {
    const timeSlots = selectedSlots.value[date]
    if (timeSlots && timeSlots.length > 0) {
      // 对应日期添加一次selectedDays (确保不重复)
      const dateObj = new Date(date)
      const dayOfWeek = dateObj.getDay()
      if (!selectedDays.value.includes(dayOfWeek)) {
        selectedDays.value.push(dayOfWeek)
      }

      // 构建时间段
      timeSlots.forEach((time) => {
        slots.push({
          date,
          startTime: time,
          // 计算结束时间 (30分钟后)
          endTime: getEndTime(time),
        })
      })
    }
  })

  return {
    selectedDays: selectedDays.value,
    selectedSlots: selectedSlots.value,
    slots,
  }
}

// 计算结束时间 (30分钟后)
const getEndTime = (startTime: string) => {
  const [hours, minutes] = startTime.split(':').map(Number)
  const date = new Date(2000, 0, 1, hours, minutes)
  date.setMinutes(date.getMinutes() + 30)
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 设置已选择的时间
const setSelectedTimes = (data: {
  selectedDays: number[]
  selectedSlots: { [date: string]: string[] } | string[]
}) => {
  selectedDays.value = data.selectedDays || []

  // 处理不同的数据格式
  if (Array.isArray(data.selectedSlots)) {
    // 如果是旧格式（数组），转换为新格式
    const formattedSlots: { [date: string]: string[] } = {}
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0]
    formattedSlots[dateStr] = data.selectedSlots as string[]
    selectedSlots.value = formattedSlots
  } else {
    // 新格式直接使用
    selectedSlots.value = (data.selectedSlots as { [date: string]: string[] }) || {}
  }
}

// 暴露方法给父组件
defineExpose({
  getSelectedTimes,
  setSelectedTimes,
})

// 时间段选择器相关
const showTimeSelector = ref(false)

// 显示时间选择器 (修改方法名以匹配模板使用)
const editSelectedDateTimes = () => {
  if (selectedDate.value && !isPastDate(selectedDate.value)) {
    showTimeSelector.value = true
  } else if (isPastDate(selectedDate.value)) {
    // 显示提示信息
    uni.showToast({
      title: '无法修改过去的日期',
      icon: 'none',
    })
  }
}

// 隐藏时间选择器
const hideTimeSelector = () => {
  showTimeSelector.value = false
}

// 切换选择器中的时间段
const toggleSelectorTimeSlot = (slot: string) => {
  if (!selectedDate.value) return

  // 如果是过去的日期，不允许修改
  if (isPastDate(selectedDate.value)) {
    uni.showToast({
      title: '无法修改过去的日期',
      icon: 'none',
    })
    return
  }

  // 如果该时间段已被预约，不允许选择或取消
  if (isSlotBooked(selectedDate.value, slot)) {
    uni.showToast({
      title: '已预约的时间段无法取消',
      icon: 'none',
    })
    return
  }

  // 确保当前日期在selectedSlots中有一个数组
  if (!selectedSlots.value[selectedDate.value]) {
    selectedSlots.value[selectedDate.value] = []
  }

  // 检查时间段是否已经被选中
  const isSelected = selectedSlots.value[selectedDate.value].includes(slot)

  if (isSelected) {
    // 如果已选中，则移除
    selectedSlots.value[selectedDate.value] = selectedSlots.value[selectedDate.value].filter(
      (s) => s !== slot,
    )
  } else {
    // 如果未选中，则添加
    selectedSlots.value[selectedDate.value].push(slot)
  }
}

// 检查选择器中的时间段是否被选中
const isSelectorTimeSlotSelected = (slot: string) => {
  if (!selectedDate.value) return false
  return (
    selectedSlots.value[selectedDate.value] &&
    selectedSlots.value[selectedDate.value].includes(slot)
  )
}

// 全选选择器中的时间段（排除已预约的时间段）
const selectAllSelectorTimes = () => {
  if (!selectedDate.value) return

  // 如果是过去的日期，不允许修改
  if (isPastDate(selectedDate.value)) {
    uni.showToast({
      title: '无法修改过去的日期',
      icon: 'none',
    })
    return
  }

  const availableSlots = timeSlots.value
    .map((slot) => slot.value)
    .filter((slot) => !isSlotBooked(selectedDate.value, slot))

  // 设置当前日期的所有可用时间段
  selectedSlots.value[selectedDate.value] = [...availableSlots]
}

// 清空选择器中的时间段
const clearAllSelectorTimes = () => {
  if (!selectedDate.value) return

  // 如果是过去的日期，不允许修改
  if (isPastDate(selectedDate.value)) {
    uni.showToast({
      title: '无法修改过去的日期',
      icon: 'none',
    })
    return
  }

  // 仅清空未被预约的时间段
  const bookedSlotsForDate = bookedSlots.value[selectedDate.value] || []
  selectedSlots.value[selectedDate.value] = selectedSlots.value[selectedDate.value].filter((slot) =>
    bookedSlotsForDate.includes(slot),
  )
}

// 确认时间选择
const confirmTimeSelection = () => {
  if (selectedDate.value && selectedSlots.value[selectedDate.value]?.length > 0) {
    // 添加对应的星期到selectedDays
    const dateObj = new Date(selectedDate.value)
    const dayOfWeek = dateObj.getDay()
    if (!selectedDays.value.includes(dayOfWeek)) {
      selectedDays.value.push(dayOfWeek)
    }
  }
  hideTimeSelector()
}

// 当前选中日期的时间段
const selectedDateHasSlots = computed(() => {
  if (!selectedDate.value || !selectedSlots.value[selectedDate.value]) return false
  return selectedSlots.value[selectedDate.value].length > 0
})

// 获取所选日期的已预约时间段
const bookedSlotsForSelectedDate = computed(() => {
  if (!selectedDate.value || !bookedSlots.value[selectedDate.value]) return []

  // 对时间槽进行排序
  const sortedSlots = [...bookedSlots.value[selectedDate.value]].sort((a, b) => {
    return a.localeCompare(b)
  })

  // 将时间段分组显示 (合并连续的时间段)
  if (sortedSlots.length > 0) {
    let startTime = sortedSlots[0]
    let endTime = startTime
    const ranges: string[] = []

    for (let i = 1; i < sortedSlots.length; i++) {
      const currentSlot = sortedSlots[i]
      const currentTime = new Date(`2000-01-01T${currentSlot}:00`)
      const prevTime = new Date(`2000-01-01T${endTime}:00`)

      // 检查时间是否连续 (相差30分钟)
      if (currentTime.getTime() - prevTime.getTime() === 30 * 60 * 1000) {
        endTime = currentSlot
      } else {
        // 不连续时添加范围并开始新范围
        ranges.push(`${startTime}-${endTime}`)
        startTime = currentSlot
        endTime = currentSlot
      }
    }

    // 添加最后一个范围
    ranges.push(`${startTime}-${endTime}`)
    return ranges
  }

  return []
})

// 修改formattedSelectedDateSlots，排除已预约的时间段
const formattedSelectedDateSlots = computed(() => {
  if (!selectedDate.value || !selectedSlots.value[selectedDate.value]) return []

  // 对时间槽进行排序，排除已预约的时间段
  const slots = selectedSlots.value[selectedDate.value].filter(
    (slot) => !isSlotBooked(selectedDate.value, slot),
  )

  const sortedSlots = [...slots].sort((a, b) => {
    return a.localeCompare(b)
  })

  // 将时间段分组显示 (合并连续的时间段)
  if (sortedSlots.length > 0) {
    let startTime = sortedSlots[0]
    let endTime = startTime
    const ranges: string[] = []

    for (let i = 1; i < sortedSlots.length; i++) {
      const currentSlot = sortedSlots[i]
      const currentTime = new Date(`2000-01-01T${currentSlot}:00`)
      const prevTime = new Date(`2000-01-01T${endTime}:00`)

      // 检查时间是否连续 (相差30分钟)
      if (currentTime.getTime() - prevTime.getTime() === 30 * 60 * 1000) {
        endTime = currentSlot
      } else {
        // 不连续时添加范围并开始新范围
        ranges.push(`${startTime}-${endTime}`)
        startTime = currentSlot
        endTime = currentSlot
      }
    }

    // 添加最后一个范围
    ranges.push(`${startTime}-${endTime}`)
    return ranges
  }

  return []
})

// 模拟获取已预约时间段数据（实际应该从服务器获取）
const fetchBookedSlots = async () => {
  try {
    // 这里应该是调用云函数获取已预约的时间段
    // 暂时使用模拟数据
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const todayStr = `${year}-${month}-${day}`

    // 模拟数据：今天的9:00和13:30已被预约
    bookedSlots.value = {
      [todayStr]: ['9:00', '13:30'],
    }
  } catch (error) {
    console.error('获取已预约时间段失败:', error)
  }
}

// 检查时间段是否已被预约
const isSlotBooked = (date: string, slot: string) => {
  return bookedSlots.value[date] && bookedSlots.value[date].includes(slot)
}

// 在组件加载时获取已预约时间段
onMounted(() => {
  fetchBookedSlots()
})

// 新增的计算属性
const hasBookedSlots = computed(() => {
  return bookedSlots.value[selectedDate.value] && bookedSlots.value[selectedDate.value].length > 0
})

// 显示超出范围提示
const showOutOfRangeToast = () => {
  uni.showToast({
    title: '该日期不在可预约范围内',
    icon: 'none',
  })
}
</script>

<style lang="scss" scoped>
// 通用样式
.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

// 基础选择器
.day-number {
  font-size: 14px;
  color: #333;
  text-align: center;
}

.time-range {
  display: inline-block;
  padding: 4px 8px;
  margin-right: 5px;
  margin-bottom: 5px;
  font-size: 12px;
  color: #5bbdca;
  background-color: #f0f9ff;
  border-radius: 4px;

  &.booked {
    color: #ff6b6b;
    background-color: #ffeeee;
  }

  &.available {
    color: #5bbdca;
    background-color: #f0f9ff;
  }
}

// 组件容器
.time-schedule {
  padding: 20px;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 8px;
}

// 日历组件
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

        .month-display {
          min-width: 120px;
          padding: 8px 16px;
          font-size: 16px;
          font-weight: 500;
          color: #333;
          text-align: center;
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

        &.past-date {
          text-decoration: line-through;
          cursor: not-allowed;
          background-color: #f0f0f0;
          opacity: 0.6;
        }

        &.out-of-range {
          color: #aaa;
          cursor: not-allowed;
          background-color: #f8f8f8;
          border: 1px dashed #ddd;

          .day-number {
            color: #aaa;
          }
        }

        &.other-month .day-number {
          color: #999;
        }
      }
    }
  }
}

// 已选择时间区域
.selected-times {
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;

    .section-title {
      display: block;
      margin-bottom: 12px;
    }

    .add-btn {
      padding: 8px 12px;
      font-size: 14px;
      color: #ffffff;
      cursor: pointer;
      background-color: #5bbdca;
      border-radius: 4px;
    }
  }

  .empty-tip {
    padding: 20px;
    color: #999;
    text-align: center;
    background-color: #f9f9f9;
    border: 1px dashed #ddd;
    border-radius: 8px;

    .add-tip {
      display: block;
      margin-top: 8px;
      font-size: 12px;
      color: #5bbdca;
    }
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
    }
  }
}

// 时间选择弹窗
.time-selector-popup {
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

      .popup-title {
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

// 时间段显示
.time-slot-display {
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;

  .date-header {
    margin-bottom: 12px;
  }

  .time-slot-section {
    margin-bottom: 12px;

    .section-label {
      font-size: 14px;
      font-weight: bold;
      color: #333;
    }
  }

  .empty-message {
    padding: 20px;
    color: #999;
    text-align: center;
    background-color: #f9f9f9;
    border: 1px dashed #ddd;
    border-radius: 8px;
  }
}

// 弹窗
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

      .confirm {
        flex: 1;
        padding: 8px;
        font-size: 14px;
        color: #fff;
        text-align: center;
        background-color: #5bbdca;
        border-radius: 4px;
      }
    }
  }
}

// 基础选择器（移动到样式表底部）
.time-slot {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  margin-bottom: 10px;
  font-size: 14px;
  text-align: center;
  background-color: #f0f2f5;
  border-bottom: 1px solid #eee;
  border-radius: 4px;
  transition: all 0.3s;

  &:last-child {
    margin-bottom: 0;
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

    &.booked {
      color: #ff6b6b;
    }
  }

  &.booked {
    cursor: not-allowed;
    background-color: #f2f2f2;
    opacity: 0.6;
  }
}

.date-title {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.time-ranges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 5px;
}
</style>
