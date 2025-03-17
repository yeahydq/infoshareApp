<template>
  <view class="setting-page">
    <view class="setting-content px-4">
      <view class="font-bold h-16 leading-16">个人基本信息</view>

      <view
        class="flex items-center h-16 leading-16 border-b-gray-400 border-b-solid border-[1rpx]"
      >
        <text class="mr-4 flex-shrink-0">头像</text>
        <button
          class="bg-transparent flex items-center after:b-none w-full h-12 leading-12"
          open-type="chooseAvatar"
          @chooseavatar="onChooseAvatar"
          :disabled="!isEditing"
        >
          <image class="w-8 h-8 rounded-full" :src="avatarUrl"></image>
          <text class="ml-auto i-carbon-chevron-right"></text>
        </button>
      </view>

      <view
        class="flex items-center h-16 leading-16 border-b-gray-400 border-b-solid border-1 mt-4"
      >
        <text class="mr-4 flex-shrink-0">昵称</text>
        <input
          type="nickname"
          placeholder="请输入昵称"
          :value="nickName"
          :disabled="!isEditing"
          @input="(event) => (nickName = event.target.value)"
        />
      </view>

      <!-- <view
        class="flex items-center h-16 leading-16 border-b-gray-400 border-b-solid border-1 mt-4"
      >
        <text class="mr-4 flex-shrink-0">姓名</text>
        <input type="text" placeholder="请输入姓名" v-model="nickName" :disabled="!isEditing" />
      </view> -->

      <view
        class="flex items-center h-16 leading-16 border-b-gray-400 border-b-solid border-1 mt-4"
      >
        <text class="mr-4 flex-shrink-0">手机号</text>
        <input type="tel" placeholder="请输入手机号" v-model="phone" :disabled="!isEditing" />
      </view>

      <view
        class="flex items-center h-16 leading-16 border-b-gray-400 border-b-solid border-1 mt-4"
      >
        <text class="mr-4 flex-shrink-0">地址</text>
        <input type="text" placeholder="请输入地址" v-model="address" :disabled="!isEditing" />
      </view>

      <!-- <view
        class="flex items-center h-16 leading-16 border-b-gray-400 border-b-solid border-1 mt-4"
      >
        <text class="mr-4 flex-shrink-0">管理员</text>
        <input type="checkbox" v-model="manager" :disabled="!isEditing" />
      </view> -->

      <button
        size="default"
        type="default"
        style="color: #fff; background-color: #1aad19; border-color: #1aad19"
        class="text-center leading-12 w-40 my-4"
        @click="toggleEdit"
      >
        {{ isEditing ? '提交' : '修改' }}
      </button>
    </view>
  </view>
</template>

<script lang="ts" setup>
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

// const avatarUrl = computed(() => userStore.userInfo?.avatarUrl || defaultAvatarUrl)
// const nickName = computed(() => userStore.userInfo?.nickName || '')
// const phone = computed(() => userStore.userInfo?.phone || '')
// const address = computed(() => userStore.userInfo?.address || '')
// const manager = computed(() => userStore.userInfo?.manager || false)

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
      manager: manager.value,
    })

    updateDabaseRecord(userStore.userInfo)
    uni.showToast({
      title: '信息已更新',
      icon: 'success',
    })
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
          userStore.setUserInfo(userInfo)
          // 保存成功，更新本地缓存
          uni.setStorageSync('userInfo', userInfo)
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

<style lang="scss" scoped>
.setting-page {
  position: fixed;
  inset: 0;

  .setting-content {
    position: fixed;
    right: 0;
    bottom: var(--window-bottom);
    left: 0;
    background-color: #fff;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }
}
</style>
