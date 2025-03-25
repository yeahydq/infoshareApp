<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '个人中心', navigationStyle: 'default' },
}
</route>
<template>
  <view class="container">
    <view class="header">
      <view class="profile-info">
        <view class="avatar">
          <image class="avatar-img" src="/static/image/logo.png" mode="aspectFill" />
        </view>
        <view class="user-info">
          <view v-if="userStore.userInfo?.openid" class="head-box">
            <view @click="navigateToSettings">
              <image class="photo" :src="userInfo.avatarUrl"></image>
              <view class="username">{{ userStore.userInfo?.nickName }}</view>
              <view class="user-tag">用户</view>
              <!-- <view class="user-id">ID:HY000054 {{ userStore.userInfo?.id }}</view> -->
            </view>
          </view>
          <view v-else class="head-box" @click="login">
            <image class="photo" src="/static/image/logo.png"></image>
            <view class="name">点击登录</view>
          </view>
        </view>
      </view>
      <view class="edit-button" @click="navigateTo(NavigationRoutes.PERSONAL_INFO)">
        <text>编辑资料</text>
      </view>
    </view>

    <view class="service-cards">
      <view class="service-card" @click="navigateTo(NavigationRoutes.FIND_TEACHERS)">
        <view class="service-icon">🔍</view>
        <view class="service-text">帮我找</view>
        <view class="service-icon-arrow">></view>
      </view>
      <view class="service-card" @click="navigateTo(NavigationRoutes.TEACHER_REGISTRATION)">
        <view class="service-icon">👩‍🏫</view>
        <view class="service-text">教员入驻</view>
        <view class="service-icon-arrow">></view>
      </view>
    </view>

    <view class="section-title">
      <text>全部功能</text>
    </view>

    <view class="features-grid">
      <view class="feature-item" @click="navigateTo(NavigationRoutes.QR_CODE)">
        <view class="feature-icon">📋</view>
        <view class="feature-text">推广二维码</view>
      </view>
      <view class="feature-item" @click="navigateTo(NavigationRoutes.HELP_CENTER)">
        <view class="feature-icon">❓</view>
        <view class="feature-text">帮助中心</view>
      </view>
      <view class="feature-item" @click="navigateTo(NavigationRoutes.ADDRESS)">
        <view class="feature-icon">📍</view>
        <view class="feature-text">我的地址</view>
      </view>
      <view class="feature-item" @click="navigateTo(NavigationRoutes.ANNOUNCEMENT)">
        <view class="feature-icon">🔔</view>
        <view class="feature-text">系统公告</view>
      </view>
    </view>

    <view class="info-links">
      <view class="info-link" @click="navigateTo(NavigationRoutes.ABOUT_US)">
        <view class="info-icon">ℹ️</view>
        <view class="info-text">关于我们</view>
        <view class="info-arrow">></view>
      </view>
      <view class="info-link" @click="navigateTo(NavigationRoutes.CUSTOMER_SERVICE)">
        <view class="info-icon">🎧</view>
        <view class="info-text">在线客服</view>
        <view class="info-arrow">></view>
      </view>
      <view class="info-link" @click="navigateTo(NavigationRoutes.CONTACT_US)">
        <view class="info-icon">📞</view>
        <view class="info-text">联系我们</view>
        <view class="info-arrow">></view>
      </view>
      <view class="info-link" @click="navigateTo(NavigationRoutes.SETTINGS)">
        <view class="info-icon">⚙️</view>
        <view class="info-text">系统设置</view>
        <view class="info-arrow">></view>
      </view>
      <view class="info-link" @tap="logout" v-if="hasLogin">
        <view class="info-icon">⚙️</view>
        <view class="info-text">退出登录</view>
        <view class="info-arrow">></view>
      </view>
    </view>
    <!-- 
    <view class="bottom-nav">
      <view class="nav-item" @click="navigateTo(NavigationRoutes.HOME)">
        <view class="nav-icon">🏠</view>
        <view class="nav-text">首页</view>
      </view>
      <view class="nav-item" @click="navigateTo(NavigationRoutes.FIND_TEACHERS)">
        <view class="nav-icon">👨‍🏫</view>
        <view class="nav-text">找老师</view>
      </view>
      <view class="nav-item" @click="navigateTo(NavigationRoutes.ORDERS)">
        <view class="nav-icon">📝</view>
        <view class="nav-text">订单</view>
      </view>
      <view class="nav-item active">
        <view class="nav-icon">👤</view>
        <view class="nav-text">我的</view>
      </view>
    </view> -->
  </view>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/store'

const NavigationRoutes = {
  FIND_TEACHERS: '../find-teachers/index',
  TEACHER_REGISTRATION: '../teacher-registration/index',
  PERSONAL_INFO: '../personal-info/index',
  QR_CODE: '../qr-code/index',
  HELP_CENTER: '../help-center/index',
  ADDRESS: '../address-management/index',
  ANNOUNCEMENT: '../system-announcement/index',
  ABOUT_US: null, // This page doesn't exist yet
  CUSTOMER_SERVICE: null, // This page doesn't exist yet
  CONTACT_US: null, // This page doesn't exist yet
  SETTINGS: '../system-settings/index',
  HOME: '../index/index',
  ORDERS: '../index/index', // This page doesn't exist yet, so navigate to home
}

function navigateTo(route) {
  if (route) {
    console.log(`Navigating to ${route}`)
    uni.navigateTo({ url: route })
  } else {
    console.log('This page does not exist yet')
  }
}

const show = ref(false)
// const userStore = useUserStore()
// const userStore = computed(() => useUserStore())
const userStore = useUserStore()
// const hasLogin = computed(() => userStore.value.userInfo?.openid)
const hasLogin = computed(() => userStore.userInfo?.openid)

const navigateToSettings = () => {
  uni.navigateTo({
    url: '../account/setting',
  })
}

const logout = () => {
  uni.showModal({
    title: '确认退出当前账号？',
    success: (res) => {
      if (res.confirm) {
        userStore.clearUserInfo()
      }
    },
  })
}

const userInfo = ref({
  avatarUrl: '',
  nickName: '',
})

const onLoad = () => {
  console.log('onload')
  // 删除本地缓存
  wx.removeStorageSync('userInfo')
}

const login = () => {
  wx.showLoading({
    title: '加载中...',
    mask: true,
  })
  wx.getSetting({
    success: (res) => {
      console.log(res)
      if (res.authSetting['scope.userInfo']) {
        wx.getUserInfo({
          success: (res) => {
            // console.log(res)
            const userInfo = res.userInfo
            const nickName = userInfo.nickName // NOte: this is empty, need  to update later
            const avatarUrl = userInfo.avatarUrl // Note: this is empty, need  to update later
            const gender = userInfo.gender // 性别 0：未知、1：男、2：女
            const province = userInfo.province
            const city = userInfo.city
            const country = userInfo.country
            const updatedUserInfo = {
              nickName,
              avatarUrl,
              gender,
              province,
              city,
              country,
            }
            // 获取数据库的用户信息
            InitInfo(updatedUserInfo, true)
          },
        })
      } else {
        // TODO 未授权，跳转到授权页面
        // uni.navigateTo({
        //   url: '../login/login?id=auth',
        // })
      }
    },
    fail: (err) => {
      console.error(err)
      wx.hideLoading()
    },
  })
}

const InitInfo = (userInfo: any, registerIdc: boolean) => {
  wx.showLoading({
    title: '正在加载...',
    mask: true,
  })
  wx.cloud.callFunction({
    name: 'InitInfo',
    data: {
      type: 'INIT',
    },
    success: (res) => {
      wx.hideLoading()
      console.log('res', res)
      const result = res.result.data
      // 判断是否已经注册
      if (result.length) {
        // 已注册，拉取公告、推荐列表
        userInfo.openid = result[0]._openid
        userInfo.id = result[0]._id
        userInfo.nickName = result[0].nickName
        userInfo.phone = result[0].phone
        userInfo.address = result[0].address
        // 修改库变量
        userStore.setUserInfo(userInfo)

        // 缓存到本地
        wx.setStorageSync('userInfo', userInfo)
      } else if (registerIdc) {
        SubmitRegister(userInfo)
      }
    },
    fail: (err) => {
      wx.hideLoading()
      console.log('err', err)
      wx.showToast({
        title: '网络错误，信息获取失败...',
        icon: 'none',
        duration: 2000,
      })
    },
    complete: (res) => {
      console.log('complete', res)
    },
  })
}
const SubmitRegister = (userInfo) => {
  // SubmitRegister(e) {
  // 保存
  uni.showLoading({
    mask: true,
    title: '正在保存...',
  })
  const name = userInfo.name
  const phone = userInfo.phone
  const avatarUrl = userInfo.avatarUrl
  const nickName = userInfo.nickName
  // 保存到数据库
  const dbname = 'UserList'
  const db = wx.cloud.database()
  db.collection(dbname).add({
    data: {
      name,
      phone,
      address: '',
      avatarUrl,
      nickName,
      manager: false,
    },
    success: function (res) {
      uni.hideLoading()
      if (res.errMsg === 'collection.add:ok') {
        uni.showToast({
          title: '恭喜,注册成功！',
          icon: 'none',
          duration: 1000,
        })
        InitInfo(userInfo, false)
      } else {
        // 提示网络错误
        uni.showToast({
          title: '网络错误，注册失败，请检查网络后重试！',
          icon: 'none',
          duration: 2000,
        })
      }
    },
    fail: function (err) {
      uni.hideLoading()
      console.error(err)
    },
  })
}
</script>

<style>
@import './style.css';
</style>
