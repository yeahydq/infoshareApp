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
      <text class="text">关于我们</text>
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
    // TODO: onLoad
    // const that = this
    // app.globalData.getUserInfo(function (userInfo) {
    //   console.log(userInfo)
    //   // 更新数据
    //   that.setData({
    //     userInfo,
    //   })
    // })
  },
  methods: {
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
