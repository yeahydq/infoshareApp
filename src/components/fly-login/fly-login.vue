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
    avatar: avatarUrl.value,
  })
  // IsAuthor(nickname.value, avatarUrl.value)
}

const IsAuthor = (inputNickname, inputAvatarUrl) => {
  // wx.showLoading({
  //   title: '加载中...',
  //   mask: true,
  // })
  wx.getSetting({
    success: (res) => {
      console.log(res)
      if (res.authSetting['scope.userInfo']) {
        wx.getUserInfo({
          success: (res) => {
            // console.log(res)
            const userInfo = res.userInfo
            const nickName = inputNickname
            const avatarUrl = inputAvatarUrl
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
            InitInfo(updatedUserInfo)
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

const InitInfo = (userInfo: any) => {
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
        userInfo.name = result[0].name
        userInfo.phone = result[0].phone
        userInfo.address = result[0].address
        // 修改库变量
        userStore.value.setUserInfo(userInfo)
        userInfo.value = userStore.value.userInfo

        // 缓存到本地
        wx.setStorageSync('userInfo', userInfo)
        // 修改全局变量为已登录
        // app.IsLogon()
        // 跳转到home
        // wx.switchTab({
        //   url: '../home/home',
        // })
      } else {
        // wx.showToast({
        //   title: '你还未注册，请填写注册信息！',
        //   icon: 'none',
        //   duration: 2500,
        //   mask: true,
        // })
        // 未注册，页面跳转到授权注册页面
        // wx.redirectTo({
        //   url: '../login/login?id=register',
        // })
        SubmitRegister(userInfo)
        uni.navigateTo({
          url: '../login/login?id=register',
        })
        // // 显示注册页面，并提示注册
        // this.setData({
        //   showAuth: false,
        //   showform: true,
        // })
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

// 提交注册信息

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
      mamager: false,
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
        // 跳转到home
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
