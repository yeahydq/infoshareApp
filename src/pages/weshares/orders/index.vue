<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '订单', navigationStyle: 'default' },
}
</route>

<template>
  <view class="container">
    <!-- <view class="header">
      <text class="header-title">订单</text>
      <view class="header-right">
        <text class="dots">•••</text>
        <text class="target-icon">○</text>
      </view>
    </view> -->

    <view class="tab-bar">
      <scroll-view scroll-x class="tab-scroll" :scroll-left="scrollLeft" @scroll="onTabScroll">
        <view class="tab-content">
          <view
            v-for="(tab, index) in tabs"
            :key="index"
            class="tab-item"
            :class="{ active: currentTab === index }"
            @tap="switchTab(index)"
          >
            <text class="tab-text">{{ tab.name }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="empty-state">
      <text class="empty-text">暂无订单~</text>
    </view>

    <!-- 订单列表 -->
    <z-paging
      ref="paging"
      v-model="orderList"
      @query="queryList"
      :auto-show-back-to-top="true"
      :loading-more-loading-text="loadingText"
      :empty-view-text="emptyText"
      :empty-view-img="emptyImg"
      :refresher-enabled="true"
      :auto-clean-list-when-reload="true"
    >
      <view class="order-list">
        <view v-for="(order, index) in orderList" :key="index" class="order-item">
          <!-- 订单头部 -->
          <view class="order-header">
            <text class="order-no">订单号：{{ order.orderNo }}</text>
            <text class="order-status">{{ getStatusText(order.status) }}</text>
          </view>

          <!-- 课程信息 -->
          <view class="course-info" @tap="goToDetail(order.id)">
            <image :src="order.courseImage" mode="aspectFill" class="course-image" />
            <view class="course-detail">
              <text class="course-name">{{ order.courseName }}</text>
              <text class="teacher-name">讲师：{{ order.teacherName }}</text>
              <text class="course-time">{{ order.courseTime }}</text>
            </view>
          </view>

          <!-- 订单金额 -->
          <view class="order-amount">
            <text class="amount-label">实付金额：</text>
            <text class="amount-value">¥{{ order.amount }}</text>
          </view>

          <!-- 订单操作按钮 -->
          <view class="order-actions">
            <block v-if="order.status === 'PENDING_PAYMENT'">
              <button class="action-btn cancel" @tap="cancelOrder(order.id)">取消订单</button>
              <button class="action-btn primary" @tap="payOrder(order.id)">立即支付</button>
            </block>
            <block v-else-if="order.status === 'PENDING_CONFIRM'">
              <button class="action-btn cancel" @tap="cancelOrder(order.id)">取消订单</button>
            </block>
            <block v-else-if="order.status === 'COMPLETED'">
              <button class="action-btn" @tap="goToDetail(order.id)">查看详情</button>
              <button class="action-btn primary" @tap="goToReview(order.id)">评价</button>
            </block>
            <block v-else-if="order.status === 'CANCELLED'">
              <button class="action-btn" @tap="deleteOrder(order.id)">删除订单</button>
            </block>
          </view>
        </view>
      </view>
    </z-paging>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useOrderStore } from '@/store/order'

const orderStore = useOrderStore()
const paging = ref(null)
const scrollLeft = ref(0)
const currentTab = ref(0)
const orderList = ref([])

// 订单状态标签
const tabs = [
  { name: '全部', value: 'ALL' },
  { name: '待确认', value: 'PENDING_CONFIRM' },
  { name: '待支付', value: 'PENDING_PAYMENT' },
  { name: '待上课', value: 'PENDING_CLASS' },
  { name: '待完成', value: 'PENDING_COMPLETE' },
  { name: '待评价', value: 'PENDING_REVIEW' },
  { name: '售后', value: 'AFTER_SALE' },
]

// 加载文本
const loadingText = ref('正在加载...')
const emptyText = ref('暂无订单~')
const emptyImg = ref('/static/empty/order-empty.png')

// 切换标签
const switchTab = (index) => {
  currentTab.value = index
  paging.value?.reload()
}

// 标签滚动
const onTabScroll = (e) => {
  scrollLeft.value = e.detail.scrollLeft
}

// 获取状态文本
const getStatusText = (status) => {
  const tab = tabs.find((tab) => tab.value === status)
  return tab ? tab.name : '未知状态'
}

// 查询订单列表
const queryList = async (pageNo, pageSize) => {
  try {
    const status = currentTab.value === 0 ? 'ALL' : tabs[currentTab.value].value
    const res = await orderStore.getOrderList({
      pageNo,
      pageSize,
      status,
    })
    return res
  } catch (error) {
    console.error('获取订单列表失败:', error)
    return []
  }
}

// 跳转到订单详情
const goToDetail = (orderId) => {
  uni.navigateTo({
    url: `/pages/weshares/orders/detail?id=${orderId}`,
  })
}

// 取消订单
const cancelOrder = async (orderId) => {
  try {
    await uni.showModal({
      title: '提示',
      content: '确定要取消该订单吗？',
    })
    await orderStore.cancelOrder(orderId)
    uni.showToast({
      title: '取消成功',
      icon: 'success',
    })
    paging.value?.reload()
  } catch (error) {
    console.error('取消订单失败:', error)
  }
}

// 支付订单
const payOrder = async (orderId) => {
  try {
    const payInfo = await orderStore.getPayInfo(orderId)
    // 调用支付接口
    await uni.requestPayment(payInfo)
    uni.showToast({
      title: '支付成功',
      icon: 'success',
    })
    paging.value?.reload()
  } catch (error) {
    console.error('支付失败:', error)
  }
}

// 跳转到评价页面
const goToReview = (orderId) => {
  uni.navigateTo({
    url: `/pages/weshares/orders/review?id=${orderId}`,
  })
}

// 删除订单
const deleteOrder = async (orderId) => {
  try {
    await uni.showModal({
      title: '提示',
      content: '确定要删除该订单吗？',
    })
    await orderStore.deleteOrder(orderId)
    uni.showToast({
      title: '删除成功',
      icon: 'success',
    })
    paging.value?.reload()
  } catch (error) {
    console.error('删除订单失败:', error)
  }
}

onMounted(() => {
  // 初始化加载
  paging.value?.reload()
})
</script>

<style>
@import './style.css';

.container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.tab-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

.tab-scroll {
  white-space: nowrap;
}

.tab-content {
  display: inline-flex;
  padding: 0 16px;
}

.tab-item {
  position: relative;
  padding: 12px 16px;
}

.tab-text {
  font-size: 14px;
  color: #666;
}

.tab-item.active .tab-text {
  font-weight: 500;
  color: #2b5cff;
}

.tab-item.active::after {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 20px;
  height: 2px;
  content: '';
  background-color: #2b5cff;
  border-radius: 1px;
  transform: translateX(-50%);
}

.order-list {
  padding: 12px;
}

.order-item {
  padding: 16px;
  margin-bottom: 12px;
  background-color: #fff;
  border-radius: 8px;
}

.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.order-no {
  font-size: 12px;
  color: #999;
}

.order-status {
  font-size: 12px;
  color: #2b5cff;
}

.course-info {
  display: flex;
  margin-bottom: 12px;
}

.course-image {
  width: 80px;
  height: 80px;
  margin-right: 12px;
  border-radius: 4px;
}

.course-detail {
  flex: 1;
}

.course-name {
  display: -webkit-box;
  margin-bottom: 4px;
  overflow: hidden;
  font-size: 14px;
  color: #333;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.teacher-name {
  margin-bottom: 4px;
  font-size: 12px;
  color: #666;
}

.course-time {
  font-size: 12px;
  color: #999;
}

.order-amount {
  margin-bottom: 12px;
  text-align: right;
}

.amount-label {
  font-size: 12px;
  color: #666;
}

.amount-value {
  font-size: 16px;
  font-weight: 500;
  color: #ff4d4f;
}

.order-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.action-btn {
  padding: 4px 12px;
  font-size: 12px;
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
