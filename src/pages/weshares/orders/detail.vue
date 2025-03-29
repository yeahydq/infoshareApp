<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '订单详情', navigationStyle: 'default' },
}
</route>

<template>
  <view class="container">
    <!-- 订单状态 -->
    <view class="status-section">
      <text class="status-text">{{ getStatusText(order.status) }}</text>
      <text class="status-desc">{{ getStatusDesc(order.status) }}</text>
    </view>

    <!-- 课程信息 -->
    <view class="course-section">
      <image :src="order.courseImage" mode="aspectFill" class="course-image" />
      <view class="course-info">
        <text class="course-name">{{ order.courseName }}</text>
        <text class="teacher-name">讲师：{{ order.teacherName }}</text>
        <text class="course-time">{{ order.courseTime }}</text>
      </view>
    </view>

    <!-- 订单信息 -->
    <view class="order-section">
      <view class="section-title">订单信息</view>
      <view class="info-item">
        <text class="label">订单编号</text>
        <text class="value">{{ order.orderNo }}</text>
      </view>
      <view class="info-item">
        <text class="label">创建时间</text>
        <text class="value">{{ order.createTime }}</text>
      </view>
      <view class="info-item">
        <text class="label">支付方式</text>
        <text class="value">{{ order.payMethod }}</text>
      </view>
      <view class="info-item">
        <text class="label">支付时间</text>
        <text class="value">{{ order.payTime || '-' }}</text>
      </view>
    </view>

    <!-- 金额信息 -->
    <view class="amount-section">
      <view class="section-title">金额信息</view>
      <view class="info-item">
        <text class="label">课程原价</text>
        <text class="value">¥{{ order.originalPrice }}</text>
      </view>
      <view class="info-item">
        <text class="label">优惠金额</text>
        <text class="value">-¥{{ order.discountAmount }}</text>
      </view>
      <view class="info-item total">
        <text class="label">实付金额</text>
        <text class="value">¥{{ order.amount }}</text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="action-bar" v-if="showActionBar">
      <block v-if="order.status === 'PENDING_PAYMENT'">
        <button class="action-btn cancel" @tap="cancelOrder">取消订单</button>
        <button class="action-btn primary" @tap="payOrder">立即支付</button>
      </block>
      <block v-else-if="order.status === 'PENDING_CONFIRM'">
        <button class="action-btn cancel" @tap="cancelOrder">取消订单</button>
      </block>
      <block v-else-if="order.status === 'COMPLETED'">
        <button class="action-btn" @tap="goToReview">评价</button>
      </block>
      <block v-else-if="order.status === 'CANCELLED'">
        <button class="action-btn" @tap="deleteOrder">删除订单</button>
      </block>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrderStore } from '@/store/order'

const orderStore = useOrderStore()
const order = ref({})

// 获取订单状态文本
const getStatusText = (status) => {
  const statusMap = {
    PENDING_CONFIRM: '待确认',
    PENDING_PAYMENT: '待支付',
    PENDING_CLASS: '待上课',
    PENDING_COMPLETE: '待完成',
    PENDING_REVIEW: '待评价',
    COMPLETED: '已完成',
    CANCELLED: '已取消',
    AFTER_SALE: '售后中',
  }
  return statusMap[status] || '未知状态'
}

// 获取状态描述
const getStatusDesc = (status) => {
  const descMap = {
    PENDING_CONFIRM: '等待商家确认订单',
    PENDING_PAYMENT: '请在30分钟内完成支付',
    PENDING_CLASS: '课程即将开始',
    PENDING_COMPLETE: '课程进行中',
    PENDING_REVIEW: '课程已完成，请评价',
    COMPLETED: '订单已完成',
    CANCELLED: '订单已取消',
    AFTER_SALE: '正在处理售后',
  }
  return descMap[status] || ''
}

// 是否显示底部操作栏
const showActionBar = computed(() => {
  return ['PENDING_PAYMENT', 'PENDING_CONFIRM', 'COMPLETED', 'CANCELLED'].includes(
    order.value.status,
  )
})

// 获取订单详情
const getOrderDetail = async (orderId) => {
  try {
    const data = await orderStore.getOrderDetail(orderId)
    order.value = data
  } catch (error) {
    console.error('获取订单详情失败:', error)
    uni.showToast({
      title: '获取订单详情失败',
      icon: 'none',
    })
  }
}

// 取消订单
const cancelOrder = async () => {
  try {
    await uni.showModal({
      title: '提示',
      content: '确定要取消该订单吗？',
    })
    await orderStore.cancelOrder(order.value.id)
    uni.showToast({
      title: '取消成功',
      icon: 'success',
    })
    getOrderDetail(order.value.id)
  } catch (error) {
    console.error('取消订单失败:', error)
  }
}

// 支付订单
const payOrder = async () => {
  try {
    const payInfo = await orderStore.getPayInfo(order.value.id)
    await uni.requestPayment(payInfo)
    uni.showToast({
      title: '支付成功',
      icon: 'success',
    })
    getOrderDetail(order.value.id)
  } catch (error) {
    console.error('支付失败:', error)
  }
}

// 跳转到评价页面
const goToReview = () => {
  uni.navigateTo({
    url: `/pages/weshares/orders/review?id=${order.value.id}`,
  })
}

// 删除订单
const deleteOrder = async () => {
  try {
    await uni.showModal({
      title: '提示',
      content: '确定要删除该订单吗？',
    })
    await orderStore.deleteOrder(order.value.id)
    uni.showToast({
      title: '删除成功',
      icon: 'success',
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error) {
    console.error('删除订单失败:', error)
  }
}

onMounted(() => {
  const orderId = uni.getStorageSync('currentOrderId')
  if (orderId) {
    getOrderDetail(orderId)
  }
})
</script>

<style>
.container {
  min-height: 100vh;
  padding-bottom: 100px;
  background-color: #f5f5f5;
}

.status-section {
  padding: 24px 16px;
  color: #fff;
  background-color: #2b5cff;
}

.status-text {
  display: block;
  margin-bottom: 8px;
  font-size: 20px;
  font-weight: 500;
}

.status-desc {
  font-size: 14px;
  opacity: 0.8;
}

.course-section {
  display: flex;
  padding: 16px;
  margin-bottom: 12px;
  background-color: #fff;
}

.course-image {
  width: 120px;
  height: 120px;
  margin-right: 16px;
  border-radius: 8px;
}

.course-info {
  flex: 1;
}

.course-name {
  display: -webkit-box;
  margin-bottom: 8px;
  overflow: hidden;
  font-size: 16px;
  color: #333;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.teacher-name {
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.course-time {
  font-size: 14px;
  color: #999;
}

.order-section,
.amount-section {
  padding: 16px;
  margin-bottom: 12px;
  background-color: #fff;
}

.section-title {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.info-item.total {
  padding-top: 16px;
  margin-top: 16px;
  border-top: 1px solid #eee;
}

.label {
  font-size: 14px;
  color: #666;
}

.value {
  font-size: 14px;
  color: #333;
}

.info-item.total .value {
  font-size: 16px;
  font-weight: 500;
  color: #ff4d4f;
}

.action-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 12px 16px;
  background-color: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.action-btn {
  padding: 8px 24px;
  font-size: 14px;
  color: #666;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.action-btn.primary {
  color: #fff;
  background-color: #2b5cff;
}

.action-btn.cancel {
  color: #666;
  background-color: #fff;
  border: 1px solid #ddd;
}
</style>
