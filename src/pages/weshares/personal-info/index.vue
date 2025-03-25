<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '修改信息' },
}
</route>

<template>
  <view class="container">
    <view class="avatar-section">
      <button
        class="bg-transparent flex items-center after:b-none w-full h-12 leading-12"
        open-type="chooseAvatar"
        @chooseavatar="onChooseAvatar"
        :disabled="false"
      >
        <image class="w-8 h-8 rounded-full" :src="avatarUrl"></image>
        <!-- <text class="ml-auto i-carbon-chevron-right"></text> -->
      </button>
      <!-- 
      <view class="avatar">
        <image class="avatar-img" src="/static/image/logo.png" mode="aspectFill" />
      </view>
      <view class="upload-text">
        <text>上传头像</text>
        <text class="upload-icon">📷</text>
      </view> -->
    </view>

    <view class="form-container">
      <view class="form-item">
        <text class="required">*</text>
        <text class="label">昵称</text>
        <!-- <text class="value">Dick</text> -->
        <input
          class="value"
          type="nickname"
          placeholder="请输入昵称"
          :value="nickName"
          :disabled="!isEditing"
          @input="(event) => (nickName = event.target.value)"
        />
      </view>
      <view class="divider" />
      <!-- 
      <view class="form-item">
        <text class="required">*</text>
        <text class="label">姓名</text>
        <text class="value">Dick</text>
      </view>
      <view class="divider" /> -->

      <view class="form-item">
        <text class="label">电话</text>
        <!-- <text class="placeholder">请输入电话</text> -->
        <input
          class="placeholder"
          placeholder="请输入手机号"
          v-model="phone"
          :disabled="!isEditing"
        />
      </view>
      <view class="divider" />

      <view class="form-item">
        <text class="label">地区</text>
        <!-- <select v-model="selectedRegion" :disabled="!isEditing">
          <option v-for="region in regions" :key="region.value" :value="region.value">
            {{ region.label }}
          </option>
        </select> -->
        <input
          type="text"
          class="placeholder"
          placeholder="请输入地址"
          v-model="address"
          :disabled="!isEditing"
        />
      </view>
    </view>

    <view class="submit-button" @click="toggleEdit">
      <text class="button-text">
        {{ isEditing ? (isButtonDisabled ? `${countdown}秒后可提交` : '提交') : '修改' }}
      </text>
    </view>
    <!-- <button
      size="default"
      type="default"
      :style="buttonStyle"
      class="text-center leading-12 w-40 my-4"
      @click="toggleEdit"
      :disabled="isButtonDisabled"
    >
      {{ isEditing ? (isButtonDisabled ? `${countdown}秒后可提交` : '提交') : '修改' }}
    </button> -->
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/store'
import defaultAvatarUrl from './defaultAvatar.png'

const userStore = useUserStore()
const userInfo = ref(userStore.userInfo)
const userid = ref(userStore.userInfo.id)
const isEditing = ref(false)
const avatarUrl = ref(userInfo.value.avatarUrl || defaultAvatarUrl)
const nickName = ref(userStore.userInfo.nickName || '')
const phone = ref(userInfo.value.phone || '')
const address = ref(userInfo.value.address || '')
const manager = ref(userInfo.value.manager || false)
const isButtonDisabled = ref(false)
const countdown = ref(3)

const regions = {}
const buttonStyle = computed(() => ({
  color: '#fff',
  backgroundColor: isButtonDisabled.value ? '#d3d3d3' : '#1aad19',
  borderColor: isButtonDisabled.value ? '#d3d3d3' : '#1aad19',
}))

const onChooseAvatar = (e) => {
  const { avatarUrl: url } = e.detail
  avatarUrl.value = url
  console.log(url)
}

const toggleEdit = () => {
  if (isEditing.value) {
    // Submit changes
    userStore.setUserInfo({
      nickName: nickName.value,
      avatarUrl: avatarUrl.value,
      phone: phone.value,
      address: address.value,
      // manager: manager.value,
    })

    updateDabaseRecord(userStore.userInfo)
    uni.showToast({
      title: '信息已更新',
      icon: 'success',
    })
  } else {
    // Disable button for 3 seconds
    isButtonDisabled.value = true
    countdown.value = 3
    const interval = setInterval(() => {
      countdown.value -= 1
      if (countdown.value === 0) {
        clearInterval(interval)
        isButtonDisabled.value = false
      }
    }, 1000)
  }
  isEditing.value = !isEditing.value
}

const updateDabaseRecord = (userInfo) => {
  // SubmitRegister(e) {
  // 保存
  uni.showLoading({
    mask: true,
    title: '正在保存...',
  })
  //   const name = userInfo.name
  //   const phone = userInfo.phone
  //   const avatarUrl = userInfo.avatarUrl
  //   const nickName = userInfo.nickName
  // 保存到数据库
  const dbname = 'UserList'
  const db = wx.cloud.database()
  db.collection(dbname)
    .doc(userid.value)
    .update({
      data: userInfo,
      success: function (res) {
        uni.hideLoading()
        if (res.errMsg === 'document.update:ok') {
          uni.showToast({
            title: '更改成功！',
            icon: 'none',
            duration: 1000,
          })
          // 修改库变量
          // userStore.setUserInfo(userInfo)
          // // 保存成功，更新本地缓存
          // uni.setStorageSync('userInfo', userInfo)
          // 页面跳转
          uni.navigateBack()
          // TODO  here is a bug, when new user update their setting, the page still show require login again
        } else {
          // 提示网络错误
          uni.showToast({
            title: '网络错误，更改失败，请检查网络后重试！',
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
