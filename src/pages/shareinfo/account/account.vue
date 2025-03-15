<template>
  <view class="page">
    <view class="head">
      <image class="photo" :src="userInfo.avatarUrl"></image>
      <view class="name">{{ userInfo.nickName }}</view>
    </view>

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
      <view class="newApply" v-if="newApply != 0">
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

<script>
// const Bmob = require('../../utils/bmob.js')
// const app = getApp()

export default {
  data() {
    return {
      userInfo: {
        avatarUrl: '',
        nickName: '',
      },
      newApply: '',
    }
  },
  onShow: function () {
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
  },
  onLoad: function () {
    console.log('onload')
    // 删除本地缓存
    wx.removeStorageSync('userInfo')
    // 获取个人信息，如果不存在，则跳转到认证页面
    this.IsAuthor()
    // app.globalData.getUserInfo((userInfo) => {
    //   console.log(userInfo)
    //   // 更新数据
    //   this.setData({
    //     userInfo,
    //   })
    // })

    // wx.getSetting({
    //   success: (res) => {
    //     console.log(res)
    //     if (res.authSetting['scope.userInfo']) {
    //       wx.getUserInfo({
    //         success: (res) => {
    //           // console.log(res)
    //           const userInfo = res.userInfo
    //           const nickName = userInfo.nickName
    //           const avatarUrl = userInfo.avatarUrl
    //           const gender = userInfo.gender // 性别 0：未知、1：男、2：女
    //           const province = userInfo.province
    //           const city = userInfo.city
    //           const country = userInfo.country
    //           const updatedUserInfo = {
    //             nickName,
    //             avatarUrl,
    //             gender,
    //             province,
    //             city,
    //             country,
    //           }
    //           // 获取数据库的用户信息
    //           this.InitInfo(updatedUserInfo)
    //         },
    //       })
    //     } else {
    //       // 未授权，跳转到授权页面
    //       wx.redirectTo({
    //         url: '../login/login?id=auth',
    //       })
    //     }
    //   },
    //   fail: (err) => {
    //     console.error(err)
    //     wx.hideLoading()
    //   },
    // })
  },

  methods: {
    /**
     * 检查授权情况
     */
    IsAuthor() {
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
                const nickName = userInfo.nickName
                const avatarUrl = userInfo.avatarUrl
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
                this.InitInfo(updatedUserInfo)
              },
            })
          } else {
            // 未授权，跳转到授权页面
            wx.redirectTo({
              url: '../login/login?id=auth',
            })
          }
        },
        fail: (err) => {
          console.error(err)
          wx.hideLoading()
        },
      })
    },

    // 获取个人信息
    InitInfo(userInfo) {
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
            // 缓存到本地
            wx.setStorageSync('userInfo', userInfo)
            // 修改全局变量为已登录
            // app.IsLogon()
            // 跳转到home
            // wx.switchTab({
            //   url: '../home/home',
            // })
          } else {
            // 显示注册页面，并提示注册
            this.setData({
              showAuth: false,
              showform: true,
            })
            wx.showToast({
              title: '你还未注册，请填写注册信息！',
              icon: 'none',
              duration: 2500,
              mask: true,
            })
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
    },
    collect: function () {
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
    },

    apply: function () {
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
    },

    release: function () {
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
    },

    useHelp: function () {
      uni.navigateTo({
        url: '../useHelp/useHelp',
      })
    },

    aboutUs: function () {
      uni.navigateTo({
        url: '../aboutUs/aboutUs',
      })
    },
  },
}
</script>
<style>
@import './account.css';
</style>
