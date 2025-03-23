<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '修改信息' },
}
</route>

<template>
  <view class="container">
    <page-header title="个人信息" />

    <view class="avatar-section">
      <view class="avatar">
        <image
          class="avatar-img"
          src="https://source.unsplash.com/featured/?eiffel,tower"
          mode="aspectFill"
        />
      </view>
      <view class="upload-text">
        <text>上传头像</text>
        <text class="upload-icon">📷</text>
      </view>
    </view>

    <view class="form-container">
      <view class="form-item">
        <text class="required">*</text>
        <text class="label">昵称</text>
        <text class="value">Dick</text>
      </view>
      <view class="divider" />

      <view class="form-item">
        <text class="required">*</text>
        <text class="label">姓名</text>
        <text class="value">Dick</text>
      </view>
      <view class="divider" />

      <view class="form-item">
        <text class="label">电话</text>
        <text class="placeholder">请输入电话</text>
      </view>
      <view class="divider" />

      <view class="form-item">
        <text class="label">地区</text>
        <view class="location-picker">
          <text class="placeholder">请选择地区</text>
          <text class="arrow">▼</text>
        </view>
      </view>
    </view>

    <view class="submit-button">
      <text class="button-text">提交</text>
    </view>
  </view>
</template>

<script setup>
import PageHeader from '../../components/PageHeader.vue'
</script>

<style scoped>
.container {
  min-height: 100vh;
  padding-bottom: 80px;
  background-color: #f8f8f8;
}

.avatar-section {
  display: flex;
  align-items: center;
  padding: 20px 15px;
  background-color: white;
  border-bottom: 1px solid #f0f0f0;
}

.avatar {
  width: 80px;
  height: 80px;
  margin-right: 20px;
  overflow: hidden;
  border-radius: 50%;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-text {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #999;
}

.upload-icon {
  margin-left: 10px;
  font-size: 20px;
}

.form-container {
  margin-top: 20px;
  background-color: white;
}

.form-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 15px;
}

.required {
  margin-right: 2px;
  color: #ff4d4f;
}

.label {
  width: 70px;
  font-size: 16px;
  color: #333;
}

.value {
  flex: 1;
  font-size: 16px;
  color: #333;
  text-align: right;
}

.placeholder {
  flex: 1;
  font-size: 16px;
  color: #999;
  text-align: right;
}

.location-picker {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
}

.arrow {
  margin-left: 5px;
  font-size: 12px;
  color: #999;
}

.divider {
  height: 1px;
  margin-left: 15px;
  background-color: #f0f0f0;
}

.submit-button {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 15px;
  background-color: #5bbdca;
  border-radius: 4px;
}

.button-text {
  font-size: 16px;
  font-weight: 500;
  color: white;
}
</style>
