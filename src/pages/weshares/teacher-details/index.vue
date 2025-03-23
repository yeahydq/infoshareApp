<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '老师详情' },
}
</route>

<template>
  <view class="container">
    <page-header title="老师详情" />

    <view class="teacher-card">
      <view class="teacher-info">
        <image
          class="teacher-avatar"
          src="https://source.unsplash.com/featured/?woman,portrait"
          mode="aspectFill"
        />
        <view class="teacher-name">
          <text>张三丰</text>
          <text class="search-icon">🔍</text>
        </view>
        <view class="teacher-rating">
          <text class="rating-stars">★★★★★</text>
        </view>
        <view class="teacher-contact">15468956326</view>
        <view class="teacher-level">
          <text class="level-badge">5A</text>
        </view>
        <view class="teacher-price">¥10/小时</view>
      </view>

      <view class="section-title">基础信息</view>
      <view class="info-item">
        <text class="info-label">最高学历</text>
        <text class="info-value">本科</text>
      </view>
      <view class="info-item">
        <text class="info-label">毕业院校</text>
        <text class="info-value">张三丰的学校</text>
      </view>
      <view class="info-item">
        <text class="info-label">授课方式</text>
        <text class="info-value">网络授课</text>
      </view>
      <view class="info-item">
        <text class="info-label">教学时间</text>
        <text class="info-value">10年</text>
      </view>
      <view class="info-item">
        <text class="info-label">教学学科</text>
        <text class="info-value">农学|工学|历史学|文学</text>
      </view>

      <view class="section-title">个人展示</view>
      <view class="display-content">
        <text>没什么展示</text>
      </view>

      <view class="section-title">资质信息</view>
      <view class="qualification-banner">
        <image
          class="banner-img"
          src="https://source.unsplash.com/featured/?certificate,education"
          mode="aspectFill"
        />
        <view class="banner-overlay">
          <text class="banner-text">多重维度</text>
          <text class="banner-text">严格筛选</text>
        </view>
      </view>

      <view class="certification-list">
        <view class="certification-item">
          <text class="cert-icon">✓</text>
          <text class="cert-text">身份认证</text>
        </view>
        <view class="certification-item">
          <text class="cert-icon">✓</text>
          <text class="cert-text">学历认证</text>
        </view>
        <view class="certification-item">
          <text class="cert-icon">✓</text>
          <text class="cert-text">职业认证</text>
        </view>
      </view>

      <view class="section-title">学科信息</view>
      <view class="subject-list">
        <view class="subject-item">
          <view class="subject-type">网络授课</view>
          <view class="subject-name">农学</view>
          <view class="subject-duration">课程时间: 60分钟</view>
        </view>

        <view class="subject-item">
          <view class="subject-type">网络授课</view>
          <view class="subject-name">工学</view>
          <view class="subject-duration">课程时间: 60分钟</view>
        </view>

        <view class="subject-item">
          <view class="subject-type">网络授课</view>
          <view class="subject-name">历史学</view>
          <view class="subject-duration">课程时间: 60分钟</view>
        </view>

        <view class="subject-item">
          <view class="subject-type">网络授课</view>
          <view class="subject-name">文学</view>
          <view class="subject-duration">课程时间: 60分钟</view>
        </view>
      </view>
    </view>

    <view class="book-button" @click="bookTeacher">
      <text class="button-text">立即预约</text>
    </view>

    <!-- Success Modal -->
    <view class="modal" v-if="showBookingModal">
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">预约成功</text>
        </view>
        <view class="modal-body">
          <view class="success-icon">✓</view>
          <text class="success-message">您已成功预约张三丰老师</text>
          <text class="success-detail">老师将于24小时内与您联系</text>
        </view>
        <view class="modal-footer">
          <view class="modal-btn" @click="navigateToFindTeachers">返回老师列表</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import PageHeader from '../../../components/PageHeader/PageHeader.vue'

// Control modal visibility
const showBookingModal = ref(false)

// Book teacher function
function bookTeacher() {
  console.log('Booking teacher...')
  showBookingModal.value = true
}

// Navigation function
function navigateToFindTeachers() {
  console.log('Navigating to Find Teachers page')
  window.location.href = '/pages/find-teachers/index'
}
</script>

<style>
@import './style.css';
</style>
