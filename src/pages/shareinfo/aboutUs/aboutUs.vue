<template>
  <view class="page">
    <view class="head"></view>
    <view class="head2"></view>

    <image class="logo" src="/static/image/logo.png"></image>

    <view class="wave1">
      <image
        :style="'width:1500rpx;height:400rpx;transform:rotate(' + lean + 'deg) ;'"
        src="/static/image/first.png"
      ></image>
    </view>

    <view class="wave2">
      <image
        :style="'width:1500rpx;height:400rpx;transform:rotate(' + lean + 'deg) ;'"
        src="/static/image/second.png"
      ></image>
    </view>

    <view class="name">蜂鸟家教</view>
    <!-- <view class="what">致力于打造去中介化、信息透明的家教平台</view> -->

    <!-- <view class="contact">联系方式：350306878@qq.com</view> -->
    <!-- 
      <view class="supportUs">
        <image src="../../image/supportUs.png">支持我们</image>
      </view>
 -->
  </view>
</template>

<script>
// useHelp.js
let that
export default {
  data() {
    return {
      screenWidth: getApp().globalData.screenWidth,
      lean: '',
    }
  },
  onLoad: function (options) {
    // TODO: on load
    // that = this
    // that.lean()
  },
  onShow: function () {},
  methods: {
    leanFun: function () {
      uni.startAccelerometer()
      uni.onAccelerometerChange(function (res) {
        console.log(res.x)
        const lean = -15 * res.x
        that.setData({
          lean,
        })
      })
    },
  },
}
</script>
<style>
@import './aboutUs.css';
</style>
