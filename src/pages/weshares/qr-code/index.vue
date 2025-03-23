<template>
  <view class="container">
    <page-header title="我的二维码" />

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
import PageHeader from '../../components/PageHeader.vue'
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #5bbdca;
}

.qr-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.qr-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.qr-title {
  margin-bottom: 5px;
  font-size: 24px;
  font-weight: 700;
  color: white;
}

.qr-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.user-info {
  position: relative;
  margin-bottom: 20px;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border: 2px solid white;
  border-radius: 50%;
}

.user-tag {
  position: absolute;
  bottom: 0;
  left: 50%;
  padding: 2px 15px;
  font-size: 12px;
  color: #5bbdca;
  background-color: white;
  border-radius: 12px;
  transform: translateX(-50%);
}

.qr-code {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  margin-bottom: 15px;
  background-color: white;
  border-radius: 10px;
}

.qr-image {
  width: 160px;
  height: 160px;
}

.qr-caption {
  margin-bottom: 30px;
  font-size: 14px;
  color: white;
}

.qr-illustration {
  width: 100%;
  height: 150px;
}

.illustration-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.save-button {
  position: fixed;
  bottom: 30px;
  left: 50%;
  padding: 10px 30px;
  font-size: 16px;
  font-weight: 500;
  color: #5bbdca;
  background-color: white;
  border-radius: 25px;
  transform: translateX(-50%);
}
</style>
