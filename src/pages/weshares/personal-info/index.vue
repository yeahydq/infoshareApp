<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '修改信息' },
}
</route>

<template>
  <view class="container">
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

<script setup></script>

<style>
@import './style.css';
</style>
