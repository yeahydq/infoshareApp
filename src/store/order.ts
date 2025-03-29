import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '@/utils/request'

export const useOrderStore = defineStore('order', () => {
  const orderList = ref([])
  const currentOrder = ref(null)

  // 获取订单列表
  const getOrderList = async (params) => {
    try {
      const res = await request('/api/orders', {
        method: 'GET',
        params,
      })
      return res
    } catch (error) {
      console.error('获取订单列表失败:', error)
      throw error
    }
  }

  // 获取订单详情
  const getOrderDetail = async (orderId) => {
    try {
      const res = await request(`/api/orders/${orderId}`, {
        method: 'GET',
      })
      currentOrder.value = res
      return res
    } catch (error) {
      console.error('获取订单详情失败:', error)
      throw error
    }
  }

  // 取消订单
  const cancelOrder = async (orderId) => {
    try {
      await request(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
      })
    } catch (error) {
      console.error('取消订单失败:', error)
      throw error
    }
  }

  // 获取支付信息
  const getPayInfo = async (orderId) => {
    try {
      const res = await request(`/api/orders/${orderId}/pay`, {
        method: 'GET',
      })
      return res
    } catch (error) {
      console.error('获取支付信息失败:', error)
      throw error
    }
  }

  // 删除订单
  const deleteOrder = async (orderId) => {
    try {
      await request(`/api/orders/${orderId}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error('删除订单失败:', error)
      throw error
    }
  }

  // 提交评价
  const submitReview = async (orderId, reviewData) => {
    try {
      await request(`/api/orders/${orderId}/review`, {
        method: 'POST',
        data: reviewData,
      })
    } catch (error) {
      console.error('提交评价失败:', error)
      throw error
    }
  }

  return {
    orderList,
    currentOrder,
    getOrderList,
    getOrderDetail,
    cancelOrder,
    getPayInfo,
    deleteOrder,
    submitReview,
  }
})
