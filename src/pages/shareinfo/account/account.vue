<template>
  <view class="page">
    <view class="head">
      <view v-if="userStore.userInfo?.openid" class="head-box" @click="navigateToSettings">
        <image class="photo" :src="userInfo.avatarUrl"></image>
        <view class="name">{{ userStore.userInfo?.nickname }}</view>
      </view>
      <!-- <view class="login" v-if="!userInfo.avatarUrl" @click="login">点击登录</view> -->
      <!-- <wx-login v-if="!userInfo.avatarUrl" /> -->

      <view class="p-4">
        <view class="flex items-center leading-6" v-if="hasLogin"></view>
        <view class="flex items-center leading-6" v-else @click="login">
          <!-- <view class="i-carbon-user-avatar"></view> -->
          <view class="ml-2">点击登录</view>
        </view>
        <!-- <fly-login v-model="show" /> -->
        <!-- We need a page to login, but a page similar to fly-login to let user to input more detail -->
        <button v-if="hasLogin" class="mt-2" @click="logout">退出登录</button>
      </view>
    </view>
    <!-- <view class="form-box" v-if="showform & !showAuth"> -->

    <view @tap="collect" class="collect">
      <image class="icon" src="/static/image/collect-click.png"></image>
      <text class="text">我的收藏</text>
    </view>

    <view @tap="release" class="release">
      <image class="icon" src="/static/image/release.png"></image>
      <text class="text">我的发布</text>
    </view>

    <view @tap="apply" class="message">
      <image class="icon" src="/static/image/leter.png"></image>
      <text class="text">我的申请</text>
      <view class="newApply" v-if="Number(newApply) != 0">
        <view class="newApplyNumber">{{ newApply }}</view>
      </view>
    </view>

    <view @tap="useHelp" class="useHelp">
      <image class="icon" src="/static/image/useHelp.png"></image>
      <text class="text">使用帮助</text>
    </view>

    <view @tap="aboutUs" class="aboutUs">
      <image class="icon" src="/static/image/aboutUs.png"></image>
      <text class="text">关于系统</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/store'

const show = ref(false)
// const userStore = useUserStore()
const userStore = computed(() => useUserStore())
const hasLogin = computed(() => userStore.value.userInfo?.openid)

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
        userStore.value.clearUserInfo()
      }
    },
  })
}

// const login = () => {
//   uni.showModal({
//     title: '确认退出当前账号？',
//     success: (res) => {
//       if (res.confirm) {
//         userStore.value.clearUserInfo()
//       }
//     },
//   })
// }

const userInfo = ref({
  avatarUrl: '',
  nickName: '',
})

const newApply = ref('')

const onShow = () => {
  // let objectId
  // const that = this
  // const currentUser = Bmob.User.current()
  // objectId = currentUser.id
  // const user = Bmob.Object.extend('_User')
  // const query = new Bmob.Query(user)
  // const Apply = Bmob.Object.extend('apply')
  // const queryApply = new Bmob.Query(Apply)
  // queryApply.equalTo('getApplyUser', objectId)
  // queryApply.equalTo('open', false)
  // queryApply.count({
  //   success: function (count) {
  //     that.setData({
  //       newApply: count,
  //     })
  //   },
  //   error: function (error) {},
  // })
}

const onLoad = () => {
  console.log('onload')
  // 删除本地缓存
  wx.removeStorageSync('userInfo')
  // 获取个人信息，如果不存在，则跳转到认证页面
  // this.IsAuthor() // TODO  probably need to do it when user click the login button
  // userInfo = wx.getStorageSync('userInfo')
  // const userStore = useUserStore()
  // this.setData({
  //   userInfo: userStore.userInfo,
  // })
  // userStore.userInfo((userInfo) => {
  //   console.log(userInfo)
  //   // 更新数据
  //   this.setData({
  //     userInfo,
  //   })
  // })
  // this.setData({
  //   userInfo,
  // })
  // app.globalData.getUserInfo((userInfo) => {
  //   console.log(userInfo)
  //   // 更新数据
  //   this.setData({
  //     userInfo,
  //   })
  // })
}

// const login = () => {
//   uni.navigateTo({
//     url: '../login/index',
//   })
// }

const collect = () => {
  //   const currentUser = Bmob.User.current()
  //   const currentUserId = currentUser.id
  //   const User = Bmob.Object.extend('_User')
  //   const user = new User()
  //   const query = new Bmob.Query(User)
  //   query.get(currentUserId, {
  //     success: function (result) {
  //       const register = result.get('register')
  //       const role = result.get('role')
  //       if (register == false) {
  //         uni.showModal({
  //           title: '尚未注册',
  //           content: '注册后可更快速找到合适的家教',
  //           confirmText: '立即注册',
  //           confirmColor: '#fe4c40',
  //           cancelColor: '#bdbdbd',
  //           success: function (res) {
  //             if (res.confirm) {
  //               uni.navigateTo({
  //                 url: '../teacher-register/teacher-register',
  //               })
  //             } else if (res.cancel) {
  //             }
  //           },
  //         })
  //       } else if (register == true) {
  //         if (role == 'teacher') {
  //           uni.navigateTo({
  //             url: '../collectStudent/collectStudent',
  //           })
  //         } else if (role == 'student') {
  //           uni.navigateTo({
  //             url: '../collectTeacher/collectTeacher',
  //           })
  //         }
  //       }
  //     },
  //     error: function (error) {},
  //   })
}

const apply = () => {
  //   const currentUser = Bmob.User.current()
  //   const currentUserId = currentUser.id
  //   const User = Bmob.Object.extend('_User')
  //   const user = new User()
  //   const query = new Bmob.Query(User)
  //   query.get(currentUserId, {
  //     success: function (result) {
  //       const register = result.get('register')
  //       const role = result.get('role')
  //       if (register == false) {
  //         uni.showModal({
  //           title: '尚未注册',
  //           content: '注册后可更快速找到合适的家教',
  //           confirmText: '立即注册',
  //           confirmColor: '#fe4c40',
  //           cancelColor: '#bdbdbd',
  //           success: function (res) {
  //             if (res.confirm) {
  //               uni.navigateTo({
  //                 url: '../teacher-register/teacher-register',
  //               })
  //             } else if (res.cancel) {
  //             }
  //           },
  //         })
  //       } else if (register == true) {
  //         if (role == 'teacher') {
  //           uni.navigateTo({
  //             url: '../applyStudent/applyStudent',
  //           })
  //         } else if (role == 'student') {
  //           uni.navigateTo({
  //             url: '../applyTeacher/applyTeacher',
  //           })
  //         }
  //       }
  //     },
  //     error: function (error) {},
  //   })
}

const release = () => {
  //   const currentUser = Bmob.User.current()
  //   const currentUserId = currentUser.id
  //   const User = Bmob.Object.extend('_User')
  //   const user = new User()
  //   const query = new Bmob.Query(User)
  //   query.get(currentUserId, {
  //     success: function (result) {
  //       const register = result.get('register')
  //       const role = result.get('role')
  //       if (register == false) {
  //         uni.showModal({
  //           title: '尚未注册',
  //           content: '注册后可更快速找到合适的家教',
  //           confirmText: '立即注册',
  //           confirmColor: '#fe4c40',
  //           cancelColor: '#bdbdbd',
  //           success: function (res) {
  //             if (res.confirm) {
  //               uni.navigateTo({
  //                 url: '../teacher-register/teacher-register',
  //               })
  //             } else if (res.cancel) {
  //             }
  //           },
  //         })
  //       } else if (register == true) {
  //         if (role == 'teacher') {
  //           uni.navigateTo({
  //             url: '../releaseTeacher/releaseTeacher',
  //           })
  //         } else if (role == 'student') {
  //           uni.navigateTo({
  //             url: '../releaseStudent/releaseStudent',
  //           })
  //         }
  //       }
  //     },
  //     error: function (error) {},
  //   })
}

const useHelp = () => {
  uni.navigateTo({
    url: '../useHelp/useHelp',
  })
}

const aboutUs = () => {
  uni.navigateTo({
    url: '../aboutUs/aboutUs',
  })
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
        // uni.navigateTo({
        //   url: '../login/login?id=register',
        // })
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
        // 修改库变量
        userStore.value.setUserInfo(userInfo)
        userInfo.value = userStore.value.userInfo
        // 保存成功，更新本地缓存
        uni.setStorageSync('userInfo', userInfo)
        // 页面跳转
        // 跳转到home
        uni.switchTab({
          url: '../shareinfo/account/account',
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
<style>
@import './account.css';
</style>
