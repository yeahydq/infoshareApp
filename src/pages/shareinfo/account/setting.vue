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
        <input type="nickname" placeholder="请输入昵称" v-model="nickname" :disabled="!isEditing" />
      </view>

      <view
        class="flex items-center h-16 leading-16 border-b-gray-400 border-b-solid border-1 mt-4"
      >
        <text class="mr-4 flex-shrink-0">姓名</text>
        <input type="text" placeholder="请输入姓名" v-model="name" :disabled="!isEditing" />
      </view>

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

      <view
        class="flex items-center h-16 leading-16 border-b-gray-400 border-b-solid border-1 mt-4"
      >
        <text class="mr-4 flex-shrink-0">管理员</text>
        <input type="checkbox" v-model="manager" :disabled="!isEditing" />
      </view>

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
import { ref } from 'vue'
import { useUserStore } from '@/store'
import defaultAvatarUrl from './defaultAvatar.png'

const userStore = useUserStore()

const isEditing = ref(false)
const avatarUrl = ref(userStore.userInfo.avatarUrl || defaultAvatarUrl)
const nickname = ref(userStore.userInfo.nickname || '')
const name = ref(userStore.userInfo.name || '')
const phone = ref(userStore.userInfo.phone || '')
const address = ref(userStore.userInfo.address || '')
const manager = ref(userStore.userInfo.manager || false)

const onChooseAvatar = (e) => {
  const { avatarUrl: url } = e.detail
  avatarUrl.value = url
  console.log(url)
}

const toggleEdit = () => {
  if (isEditing.value) {
    // Submit changes
    userStore.setUserInfo({
      nickname: nickname.value,
      avatar: avatarUrl.value,
      name: name.value,
      phone: phone.value,
      address: address.value,
      manager: manager.value,
    })
    uni.showToast({
      title: '信息已更新',
      icon: 'success',
    })
  }
  isEditing.value = !isEditing.value
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
