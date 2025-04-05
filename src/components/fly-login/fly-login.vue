<template>
  <view class="fly-login" v-if="modelValue">
    <view class="fly-login-mask" />
    <view class="fly-login-content px-4">
      <view class="font-bold h-16 leading-16">获取您的昵称、头像</view>
      <view
        class="rounded-full bg-light-600 w-6 h-6 text-center absolute top-4 right-4"
        @click="onClose"
      >
        <view class="i-carbon-close text-gray-700" />
      </view>

      <view
        class="flex items-center h-16 leading-16 border-b-gray-400 border-b-solid border-[1rpx]"
      >
        <text class="mr-4 flex-shrink-0">头像</text>
        <button
          class="bg-transparent flex items-center after:b-none w-full h-12 leading-12"
          open-type="chooseAvatar"
          @chooseavatar="onChooseAvatar"
        >
          <image class="w-8 h-8 rounded-full" :src="avatarUrl"></image>
          <text class="ml-auto i-carbon-chevron-right"></text>
        </button>
      </view>

      <view
        class="flex items-center h-16 leading-16 border-b-gray-400 border-b-solid border-1 mt-4"
      >
        <text class="mr-4 flex-shrink-0">昵称</text>
        <input type="nickname" placeholder="请输入昵称" @change="onChange" @blur="onChange" />
      </view>

      <button
        size="default"
        type="default"
        style="color: #fff; background-color: #1aad19; border-color: #1aad19"
        class="text-center leading-12 w-40 my-4"
        @click="onSubmit"
      >
        确定
      </button>
    </view>
  </view>
</template>

<script lang="ts">
// 导出组件需要使用的函数
export function SubmitRegister(userInfo: any) {
  // 保存
  uni.showLoading({
    mask: true,
    title: '正在保存...',
  })

  // 确保必要字段存在
  const name = userInfo.name || ''
  const phone = userInfo.phone || ''
  const avatarUrl = userInfo.avatarUrl || ''
  const nickname = userInfo.nickname || (userInfo.nickName ? userInfo.nickName : '') // 兼容不同命名方式

  // 保存到数据库
  const dbname = 'UserList'
  const db = wx.cloud.database()
  db.collection(dbname).add({
    data: {
      name,
      phone,
      address: '',
      avatarUrl,
      nickname, // 使用统一的命名
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
        // 保存成功，更新本地缓存
        uni.setStorageSync('userInfo', userInfo)
        // 页面跳转
        uni.switchTab({
          url: '../shareinfo/accout/accout',
        })
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

<script lang="ts" setup>
import { useUserStore } from '@/store'
import defaultAvatarUrl from './defaultAvatar.png'

const emit = defineEmits(['update:modelValue'])
defineProps<{ modelValue: boolean }>()

const userStore = useUserStore()

const avatarUrl = ref(defaultAvatarUrl)
const nickname = ref('')

const onClose = () => {
  emit('update:modelValue', false)
}

const onChooseAvatar = (e) => {
  const { avatarUrl: url } = e.detail
  avatarUrl.value = url
  // 这里就要上传，加快速度，提升体验（用户多次选择头像就多次上传吧，总有取舍）
  console.log(url)
}

const onChange = (e) => {
  const { value } = e.detail
  nickname.value = value
  console.log(value)
}

const onSubmit = () => {
  // 1、上传刚刚的图片，并返回网络地址
  // 2、把用户信息存起来
  if (avatarUrl.value === defaultAvatarUrl) {
    uni.showToast({
      title: '请选择头像',
      icon: 'none',
    })
    return
  }
  if (!nickname.value) {
    uni.showToast({
      title: '请填写昵称',
      icon: 'none',
    })
    return
  }

  emit('update:modelValue', false)
  console.log('保存用户信息')
  userStore.setUserInfo({
    nickname: nickname.value,
    avatarUrl: avatarUrl.value,
  })
  // IsAuthor(nickname.value, avatarUrl.value)
}

/* eslint-disable @typescript-eslint/no-unused-vars */
// 判断用户是否是管理员，保留以备将来使用
const IsAuthor = (userInfo) => {
  // 代码实现...
}
/* eslint-enable @typescript-eslint/no-unused-vars */
</script>

<style lang="scss" scoped>
.fly-login {
  position: fixed;
  inset: 0;

  .fly-login-mask {
    position: fixed;
    inset: 0;
    background-color: rgb(0 0 0 / 30%);
  }

  .fly-login-content {
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
