<template>
  <view class="my-container">
    <!-- 用户信息区域 -->
    <view class="user-info">
      <image class="avatar" :src="userInfo.avatar || '/static/default-avatar.png'" />
      <view class="info">
        <text class="name">{{ userInfo.name || '未登录' }}</text>
        <text class="type">{{ userInfo.professionalType || '未认证' }}</text>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-list">
      <!-- 时间安排入口 -->
      <view class="menu-item" @tap="navigateToTimeSchedule">
        <view class="menu-item-left">
          <image class="icon" src="/static/icons/time.png" />
          <text class="title">空闲时间安排</text>
        </view>
        <image class="arrow" src="/static/icons/arrow-right.png" />
      </view>

      <!-- 其他菜单项 -->
      <view class="menu-item" @tap="navigateToOrders">
        <view class="menu-item-left">
          <image class="icon" src="/static/icons/order.png" />
          <text class="title">我的订单</text>
        </view>
        <image class="arrow" src="/static/icons/arrow-right.png" />
      </view>

      <view class="menu-item" @tap="navigateToSettings">
        <view class="menu-item-left">
          <image class="icon" src="/static/icons/settings.png" />
          <text class="title">设置</text>
        </view>
        <image class="arrow" src="/static/icons/arrow-right.png" />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const userInfo = ref({
  avatar: '',
  name: '',
  professionalType: '',
})

// 获取用户信息
const getUserInfo = async () => {
  try {
    const res = await uniCloud.callFunction({
      name: 'getUserInfo',
    })
    if (res.result.code === 0) {
      userInfo.value = res.result.data
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 导航到时间安排页面
const navigateToTimeSchedule = () => {
  uni.navigateTo({
    url: '/weshares/my/time-schedule',
  })
}

// 导航到订单页面
const navigateToOrders = () => {
  uni.navigateTo({
    url: '/weshares/my/orders',
  })
}

// 导航到设置页面
const navigateToSettings = () => {
  uni.navigateTo({
    url: '/weshares/my/settings',
  })
}

onMounted(() => {
  getUserInfo()
})
</script>

<style lang="scss">
.my-container {
  min-height: 100vh;
  background-color: #f8f8f8;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 30px 20px;
  margin-bottom: 20px;
  background-color: #fff;

  .avatar {
    width: 80px;
    height: 80px;
    margin-right: 20px;
    border-radius: 50%;
  }

  .info {
    .name {
      display: block;
      margin-bottom: 8px;
      font-size: 20px;
      font-weight: bold;
      color: #333;
    }

    .type {
      font-size: 14px;
      color: #666;
    }
  }
}

.menu-list {
  background-color: #fff;

  .menu-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
    }

    .menu-item-left {
      display: flex;
      align-items: center;

      .icon {
        width: 24px;
        height: 24px;
        margin-right: 12px;
      }

      .title {
        font-size: 16px;
        color: #333;
      }
    }

    .arrow {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
