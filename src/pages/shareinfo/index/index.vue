<template>
  <view>
    <!-- index.wxml -->
    <navigation-bar title="Weixin" :back="false" color="black" background="#FFF"></navigation-bar>
    <scroll-view class="scrollarea" scroll-y type="list">
      <view class="container">Weixin</view>
    </scroll-view>
  </view>
</template>

<script>
import navigationBar from '@/components/navigation-bar/navigation-bar.vue'
// index.js
export default {
  components: {
    navigationBar,
  },
  data() {
    return {}
  },
  methods: {},
}
</script>
<style>
@import './index.css';
</style>
