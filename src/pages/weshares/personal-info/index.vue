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
import { updateUserDatabase } from '@/service/auth'
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
  // 从本地文件路径中提取文件名
  const originalFileName = fileName.split('/').pop()
  console.log('原始文件名:', originalFileName)

  // 提取文件扩展名
  const dotPosition = originalFileName.lastIndexOf('.')
  const extension = originalFileName.slice(dotPosition)

  // 使用原始文件名作为云存储路径，确保本地与云端文件名一致
  // 但添加时间戳避免重名
  const cloudPath = `avatars/${Date.now()}_${originalFileName}`

  uni.showLoading({
    title: '上传中...',
    mask: true,
  })

  wx.cloud.uploadFile({
    cloudPath,
    filePath: fileName,
    success(res) {
      wx.hideLoading()
      console.log('上传成功', res.fileID)

      // 更新用户头像云存储路径
      const cloudFileID = res.fileID
      userStore.setUserInfo({
        avatarUrlCloud: cloudFileID,
        avatarUrl: url,
        avatarFileName: originalFileName, // 保存原始文件名
      })

      // 更新数据库
      updateUserDatabase(userid.value, {
        avatarUrlCloud: cloudFileID,
        avatarUrl: url,
        avatarFileName: originalFileName, // 保存原始文件名到数据库
      })
        .then(() => {
          console.log('头像路径和文件名已同步到云存储')

          // 保存文件名映射，便于后续比较
          try {
            const fileNameMap = uni.getStorageSync('fileNameMap') || {}
            fileNameMap[url] = originalFileName
            uni.setStorageSync('fileNameMap', fileNameMap)
          } catch (err) {
            console.error('保存文件名映射失败:', err)
          }
        })
        .catch((err) => {
          console.error('同步头像路径到云存储失败:', err)
        })
    },
    fail: function (err) {
      wx.hideLoading()
      console.error('Upload failed', err)
      uni.showToast({
        title: '图片保存失败',
        icon: 'none',
        duration: 2000,
      })
    },
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

  // 使用公共函数更新数据库
  updateUserDatabase(userid.value, userStore.userInfo)
    .then(() => {
      uni.showToast({
        title: '信息已更新',
        icon: 'success',
      })
      uni.navigateBack() // 更新成功后返回上一页
    })
    .catch((err) => {
      console.error('更新信息失败:', err)
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
</script>

<style>
@import './style.css';
</style>
