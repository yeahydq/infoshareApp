<route lang="json5">
{
  style: { navigationBarTitleText: '我的二维码', navigationStyle: 'default' },
}
</route>

<template>
  <view class="container">
    <!-- <page-header title="我的二维码" /> -->

    <view class="qr-content">
      <view class="qr-header">
        <text class="qr-title">千乐教员</text>
        <text class="qr-subtitle">为您提供最具性价比的讲师</text>
      </view>

      <view class="user-info">
        <image
          class="user-avatar"
          src="https://source.unsplash.com/featured/?eiffel,tower"
          mode="aspectFill"
        />
        <view class="user-tag">
          <text>用户</text>
        </view>
      </view>

      <view class="qr-code">
        <image
          class="qr-image"
          src="https://source.unsplash.com/featured/?qrcode"
          mode="aspectFill"
        />
      </view>

      <view class="qr-caption">
        <text>长按/识别小程序码，邀您加入</text>
      </view>

      <view class="qr-illustration">
        <image
          class="illustration-img"
          src="https://source.unsplash.com/featured/?education,graduation"
          mode="aspectFill"
        />
      </view>
    </view>

    <view class="save-button">
      <text>保存到相册</text>
    </view>
  </view>
</template>

<script setup>
import PageHeader from '../../../components/PageHeader/PageHeader.vue'
</script>

<style>
@import './style.css';
</style>
