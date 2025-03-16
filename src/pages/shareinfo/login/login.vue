<template>
  <view>
    <!-- pages/login/login.wxml -->
    <view v-if="showform & !showAuth">
      <van-nav-bar title="注册登录" left-text="返回首页" @click-left="onClickLeft" />
    </view>

    <view class="form-box" v-if="showform & !showAuth">
      <!-- 输入框 -->
      <view class="cu-form-group border-top-left-radius">
        <view class="title">
          <text :decode="true">
            &nbsp;&nbsp;
            <text :decode="true" style="color: #ee0a24">*</text>
            姓名：
          </text>
        </view>
        <input
          placeholder="输入你的真实姓名"
          class="radius"
          id="name"
          type="text"
          maxlength="5"
          style="color: #0080ff"
          @input="InputData"
        />
      </view>
      <!-- 输入框 -->
      <view class="cu-form-group">
        <view class="title">
          <text :decode="true">
            &nbsp;&nbsp;
            <text :decode="true" style="color: #ee0a24">*</text>
            手机：
          </text>
        </view>
        <input
          placeholder="输入你的手机号码"
          class="radius"
          id="phone"
          type="number"
          maxlength="11"
          style="color: #0080ff"
          @input="InputData"
        />
      </view>
      <!-- 说明 -->
      <view class="desc">
        <text :decode="true">说明：请填写你的真实姓名和有效的手机号，方便我们及时联系到您。</text>
      </view>
      <!-- 按钮 -->
      <view class="cu-form-group" style="margin-top: 10px">
        <button
          class="cu-btn"
          style="color: #ffffff; background-color: #1989fa"
          @tap="SubmitRegister"
        >
          注 册
        </button>
      </view>
    </view>

    <view wx:if="{{showAuth}}">
      <button open-type="getUserInfo" lang="zh_CN" bindgetuserinfo="onGotUserInfo">
        获取用户信息
      </button>
    </view>

    <view class="auth-box" v-if="showAuth">
      <view class="card-box">
        <view class="card-content">
          <button open-type="getUserInfo" lang="zh_CN" @getuserinfo="onGotUserInfo">确 定</button>
        </view>
        <!-- <image src="/static/pages/image/modal.png"></image> -->
      </view>
    </view>
  </view>
</template>

<script>
import { useUserStore } from '@/store'
const userStore = useUserStore()

export default {
  data() {
    return {
      showAuth: true,
      showform: true,
      userInfo: {},
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    console.log(option.id)
    // const id = e.id
    if (option.id === 'register') {
      this.show = true
      this.showAuth = false
    } else if (option.id === 'auth') {
      this.show = true
      this.showAuth = true
    }
    this.userInfo = userStore.userInfo
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  methods: {
    // 授权获取用户信息
    onGotUserInfo: function (e) {
      console.log(e)
      console.log(e.detail.errMsg)
      console.log(e.detail.userInfo)
      console.log(e.detail.rawData)
      if (e.detail.errMsg === 'getUserInfo:ok') {
        // userStore
        const userInfo = e.detail.userInfo
        // const nickName = userInfo.nickName
        // const avatarUrl = userInfo.avatarUrl
        const gender = userInfo.gender // 性别 0：未知、1：男、2：女
        const province = userInfo.province
        const city = userInfo.city
        const country = userInfo.country
        const userData = {
          userInfo,
          nickName,
          avatarUrl,
          gender,
          province,
          city,
          country,
        }
        // this.setData({
        //   userInfo: userData,
        // })
        // 获取数据库的用户信息
        this.InitInfo(userData)
      } else {
        // 提示需要授权
        uni.showToast({
          title: '使用前请先授权登录',
          icon: 'none',
          duration: 1000,
          mask: true,
        })
      }
    },

    // 获取个人信息
    InitInfo(userInfo) {
      uni.showLoading({
        title: '正在加载...',
        mask: true,
      })
      uniCloud.callFunction({
        name: 'InitInfo',
        data: {
          type: 'INIT',
        },
        success: (res) => {
          uni.hideLoading()
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
            uni.setStorageSync('userInfo', userInfo)
            // 修改全局变量为已登录
            app.globalData.IsLogon()
            // 跳转到home
            uni.switchTab({
              url: '../account/account',
            })
          } else {
            // 显示注册页面，并提示注册
            // this.setData({
            this.showAuth = false
            this.showform = true
            // })
            uni.showToast({
              title: '你还未注册，请填写注册信息！',
              icon: 'none',
              duration: 2500,
              mask: true,
            })
          }
        },
        fail: (err) => {
          uni.hideLoading()
          console.log('err', err)
          uni.showToast({
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

    // 获取输入框数据
    InputData: function (e) {
      console.log(e, e.currentTarget.id, e.detail.value)
      const userInfo = this.userInfo
      const id = e.currentTarget.id
      const value = e.detail.value
      userInfo[id] = value
      this.setData({
        userInfo,
      })
    },

    // 提交注册信息
    SubmitRegister(e) {
      // 保存
      uni.showLoading({
        mask: true,
        title: '正在保存...',
      })
      const userInfo = this.userInfo
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
              url: '../home/home',
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
    },

    // 返回首页
    onClickLeft() {
      uni.switchTab({
        url: '../home/home',
      })
    },
  },
}
</script>
<style>
@import './login.css';
</style>
