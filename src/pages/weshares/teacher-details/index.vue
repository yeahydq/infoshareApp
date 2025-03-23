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

<style scoped>
.container {
  min-height: 100vh;
  padding-bottom: 60px;
  background-color: #f8f8f8;
}

.teacher-card {
  padding: 15px;
  margin-bottom: 15px;
  background-color: white;
}

.teacher-info {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.teacher-avatar {
  width: 70px;
  height: 70px;
  margin-right: 15px;
  border-radius: 5px;
}

.teacher-name {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.search-icon {
  margin-left: 5px;
  font-size: 16px;
  color: #ff6b6b;
}

.teacher-rating {
  margin-bottom: 5px;
  font-size: 16px;
  color: #ffc107;
}

.teacher-contact {
  margin-bottom: 5px;
  font-size: 16px;
  color: #666;
}

.teacher-level {
  position: absolute;
  top: 0;
  right: 0;
}

.level-badge {
  padding: 2px 6px;
  font-size: 14px;
  color: white;
  background-color: #ff9800;
  border-radius: 4px;
}

.teacher-price {
  position: absolute;
  right: 0;
  bottom: 15px;
  font-size: 16px;
  font-weight: 500;
  color: #ff5722;
}

.section-title {
  margin: 15px 0 10px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
}

.info-label {
  color: #666;
}

.info-value {
  color: #333;
}

.display-content {
  padding: 15px 0;
  font-size: 14px;
  color: #999;
}

.qualification-banner {
  position: relative;
  height: 100px;
  margin: 10px 0;
  overflow: hidden;
  border-radius: 8px;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
}

.banner-text {
  margin: 5px 0;
  font-size: 18px;
  font-weight: 500;
  color: white;
}

.certification-list {
  display: flex;
  margin: 15px 0;
}

.certification-item {
  display: flex;
  align-items: center;
  margin-right: 15px;
}

.cert-icon {
  margin-right: 5px;
  color: #4caf50;
}

.cert-text {
  font-size: 14px;
  color: #666;
}

.subject-list {
  padding: 10px 0;
}

.subject-item {
  padding: 10px 15px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  border-left: 3px solid #5bbdca;
}

.subject-type {
  margin-bottom: 5px;
  font-size: 14px;
  color: #5bbdca;
}

.subject-name {
  margin-bottom: 5px;
  font-size: 16px;
  color: #333;
}

.subject-duration {
  font-size: 12px;
  color: #999;
}

.book-button {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 0;
  cursor: pointer;
  background-color: #5bbdca;
}

.button-text {
  font-size: 16px;
  font-weight: 500;
  color: white;
}
/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  width: 80%;
  overflow: hidden;
  background-color: white;
  border-radius: 8px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 15px;
}

.success-icon {
  margin-bottom: 15px;
  font-size: 60px;
  color: #52c41a;
  text-align: center;
}

.success-message {
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
  text-align: center;
}

.success-detail {
  font-size: 14px;
  color: #666;
  text-align: center;
}

.modal-footer {
  display: flex;
  justify-content: center;
  padding: 10px 15px;
  border-top: 1px solid #f0f0f0;
}

.modal-btn {
  padding: 8px 20px;
  font-size: 14px;
  color: white;
  cursor: pointer;
  background-color: #5bbdca;
  border-radius: 4px;
}
</style>
