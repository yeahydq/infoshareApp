import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  globalStyle: {
    navigationStyle: 'default',
    navigationBarTitleText: '',
    navigationBarBackgroundColor: '#f8f8f8',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FFFFFF',
  },
  easycom: {
    autoscan: true,
    custom: {
      '^wd-(.*)': 'wot-design-uni/components/wd-$1/wd-$1.vue',
      '^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)':
        'z-paging/components/z-paging$1/z-paging$1.vue',
    },
  },
  tabBar: {
    color: '#8a8a8a',
    selectedColor: '#2B5CFF',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    height: '56px',
    fontSize: '12px',
    iconWidth: '28px',
    spacing: '4px',
    list: [
      {
        pagePath: 'pages/weshares/index/index',
        iconPath: '/static/tabbar/home.png',
        selectedIconPath: '/static/tabbar/home-active.png',
        text: '首页',
      },
      {
        pagePath: 'pages/weshares/search/ai-assistant',
        iconPath: '/static/tabbar/home.png',
        selectedIconPath: '/static/tabbar/home-active.png',
        text: 'AI搜索',
      },
      {
        pagePath: 'pages/weshares/orders/index',
        iconPath: '/static/tabbar/message.png',
        selectedIconPath: '/static/tabbar/message-active.png',
        text: '订单',
      },
      {
        pagePath: 'pages/weshares/personal-center/index',
        iconPath: '/static/tabbar/mine.png',
        selectedIconPath: '/static/tabbar/mine-active.png',
        text: '我的',
      },
    ],
  },
})
