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
        <input class="placeholder" placeholder="请输入手机号" v-model="phone" />
      </view>
      <view class="divider" />

      <view class="form-item">
        <text class="label">地区</text>
        <!-- <select v-model="selectedRegion" :disabled="!isEditing">
          <option v-for="region in regions" :key="region.value" :value="region.value">
            {{ region.label }}
          </option>
        </select> -->
        <input type="text" class="placeholder" placeholder="请输入地址" v-model="address" />
      </view>
    </view>

    <!-- <view class="submit-button" @click="toggleEdit">
      <text class="button-text">
        {{ isEditing ? (isButtonDisabled ? `${countdown}秒后可提交` : '提交') : '修改' }}
      </text>
    </view> -->
    <view class="submit-button" @click="toggleEdit">
      <text class="button-text">修改</text>
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
  uploadFile(url)
  console.log(url) // "http://tmp/A2TDlqiAIYP5f420fa5178b846d0d5bac3f680a853a9.jpeg"
}

const uploadFile = (url) => {
  const fileName = url
  const dotPosition = fileName.lastIndexOf('.')
  const extension = fileName.slice(dotPosition)
  const cloudPath = `${Date.now()}-${Math.floor(Math.random(0, 1) * 10000000)}${extension}`
  wx.cloud.uploadFile({
    cloudPath,
    filePath: fileName,
    success(res) {
      wx.hideLoading()
      // console.log('imgs', res, imgPathList.length, that.data.imgList.length)
      // imgPathList.push(res.fileID)
      // if (imgPathList.length == that.data.imgList.length) {
      //   // 保存信息
      //   that.SubmitEntrust(imgPathList)
      // }
      console.log('上传成功', res.fileID)
      // updateDabaseRecord({ avatarUrl: res.fileID })
      userStore.setUserInfo({
        avatarUrlCloud: res.fileID,
      })
    },
    fail: function (err) {
      console.error('Upload failed', err)
      uni.showToast({
        title: '图片保存失败',
        icon: 'none',
        duration: 2000,
      })
    },
    complete: (res) => {},
  })
}
// const uploadAvatar = () => {
//   uni.chooseImage({
//     count: 1,
//     sizeType: ['compressed'],
//     sourceType: ['album', 'camera'],
//     success: (res) => {
//       const tempFilePaths = res.tempFilePaths
//       console.log(tempFilePaths)
//       uni.uploadFile({
//         url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
//         filePath: tempFilePaths[0],
//         name: 'file',
//         formData: {
//           user: 'test',
//         },
//         success: (res) => {
//           const data = res.data
//           //do something
//         },
//       })
//     },
//   })
// }

const toggleEdit = () => {
  // if (isEditing.value) {
  // Submit changes
  userStore.setUserInfo({
    nickName: nickName.value,
    avatarUrl: avatarUrl.value,
    // avatarUrlCloud: avatarUrlCloud.value,
    phone: phone.value,
    address: address.value,
    // manager: manager.value,
  })

  updateDabaseRecord(userStore.userInfo)
  uni.showToast({
    title: '信息已更新',
    icon: 'success',
  })
  // }
  // else {
  //   // Disable button for 3 seconds
  //   isButtonDisabled.value = true
  //   countdown.value = 3
  //   const interval = setInterval(() => {
  //     countdown.value -= 1
  //     if (countdown.value === 0) {
  //       clearInterval(interval)
  //       isButtonDisabled.value = false
  //     }
  //   }, 1000)
  // }
  // isEditing.value = !isEditing.value
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
          // 页面跳转
          uni.navigateBack()
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
