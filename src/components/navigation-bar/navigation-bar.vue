<template>
  <view :class="'weui-navigation-bar ' + extClass">
    <view
      :class="'weui-navigation-bar__inner ' + (ios ? 'ios' : 'android')"
      :style="
        'color: ' +
        color +
        '; background: ' +
        background +
        '; ' +
        displayStyle +
        '; ' +
        innerPaddingRight +
        '; ' +
        safeAreaTop +
        ';'
      "
    >
      <!-- 左侧按钮 -->
      <view class="weui-navigation-bar__left" :style="leftWidth + ';'">
        <block v-if="back || homeButton">
          <!-- 返回上一页 -->
          <block v-if="back">
            <view class="weui-navigation-bar__buttons weui-navigation-bar__buttons_goback">
              <view
                @tap="backFun"
                class="weui-navigation-bar__btn_goback_wrapper"
                hover-class="weui-active"
                hover-stay-time="100"
                aria-role="button"
                aria-label="返回"
              >
                <view class="weui-navigation-bar__button weui-navigation-bar__btn_goback"></view>
              </view>
            </view>
          </block>
          <!-- 返回首页 -->
          <block v-if="homeButton">
            <view class="weui-navigation-bar__buttons weui-navigation-bar__buttons_home">
              <view
                @tap="home"
                class="weui-navigation-bar__btn_home_wrapper"
                hover-class="weui-active"
                aria-role="button"
                aria-label="首页"
              >
                <view class="weui-navigation-bar__button weui-navigation-bar__btn_home"></view>
              </view>
            </view>
          </block>
        </block>
        <block v-else>
          <slot name="left"></slot>
        </block>
      </view>

      <!-- 标题 -->
      <view class="weui-navigation-bar__center">
        <view v-if="loading" class="weui-navigation-bar__loading" aria-role="alert">
          <view class="weui-loading" aria-role="img" aria-label="加载中"></view>
        </view>
        <block v-if="title">
          <text>{{ title }}</text>
        </block>
        <block v-else>
          <slot name="center"></slot>
        </block>
      </view>

      <!-- 右侧留空 -->
      <view class="weui-navigation-bar__right">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      displayStyle: '',
      ios: '',
      innerPaddingRight: '',
      leftWidth: '',
      safeAreaTop: '',
    }
  },
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  props: {
    extClass: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    background: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    back: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    homeButton: {
      type: Boolean,
      default: false,
    },
    animated: {
      // 显示隐藏的时候opacity动画效果
      type: Boolean,
      default: true,
    },
    show: {
      // 显示隐藏导航，隐藏的时候navigation-bar的高度占位还在
      type: Boolean,

      default: true,
    },
    // back为true的时候，返回的页面深度
    delta: {
      type: Number,
      default: 1,
    },
  },
  mounted() {
    // 处理小程序 attached 生命周期
    this.attached()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    attached() {
      const rect = uni.getMenuButtonBoundingClientRect()
      uni.getSystemInfo({
        success: (res) => {
          const isAndroid = res.platform === 'android'
          const isDevtools = res.platform === 'devtools'
          this.setData({
            ios: !isAndroid,
            innerPaddingRight: `padding-right: ${res.windowWidth - rect.left}px`,
            leftWidth: `width: ${res.windowWidth - rect.left}px`,
            safeAreaTop:
              isDevtools || isAndroid
                ? `height: calc(var(--height) + ${res.safeArea.top}px); padding-top: ${res.safeArea.top}px`
                : ``,
          })
        },
      })
    },

    showChangeFun(show) {
      const animated = this.animated
      let displayStyle = ''
      if (animated) {
        displayStyle = `opacity: ${show ? '1' : '0'};transition:opacity 0.5s;`
      } else {
        displayStyle = `display: ${show ? '' : 'none'}`
      }
      this.setData({
        displayStyle,
      })
    },

    backFun() {
      if (this.delta) {
        uni.navigateBack({
          delta: this.delta,
        })
      }
      this.$emit(
        'back',
        {
          detail: {
            delta: this.delta,
          },
        },
        {},
      )
    },

    home() {
      console.log('占位：函数 home 未声明')
    },
  },
  created: function () {},
  watch: {
    show: {
      handler: function (show) {
        const animated = this.animated
        let displayStyle = ''
        if (animated) {
          displayStyle = `opacity: ${show ? '1' : '0'};transition:opacity 0.5s;`
        } else {
          displayStyle = `display: ${show ? '' : 'none'}`
        }
        this.setData({
          displayStyle,
        })
      },

      immediate: true,
    },
  },
}
</script>
<style>
@import './navigation-bar.css';
</style>
