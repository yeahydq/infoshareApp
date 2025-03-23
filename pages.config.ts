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
    color: '#999999',
    selectedColor: '#018d71',
    backgroundColor: '#F8F8F8',
    borderStyle: 'black',
    height: '50px',
    fontSize: '10px',
    iconWidth: '24px',
    spacing: '3px',
    list: [
      // {
      //   iconPath: 'static/tabbar/home.png',
      //   selectedIconPath: 'static/tabbar/homeHL.png',
      //   pagePath: 'pages/shareinfo/home/home',
      //   text: '首页',
      // },
      // // {
      // //   iconPath: 'static/tabbar/home.png',
      // //   selectedIconPath: 'static/tabbar/homeHL.png',
      // //   pagePath: 'pages/shareinfo/studentList/studentList',
      // //   text: '市场',
      // // },
      // {
      //   iconPath: 'static/tabbar/home.png',
      //   selectedIconPath: 'static/tabbar/homeHL.png',
      //   pagePath: 'pages/shareinfo/recommend/recommend',
      //   text: 'AI推荐',
      // },
      // {
      //   iconPath: 'static/tabbar/example.png',
      //   selectedIconPath: 'static/tabbar/exampleHL.png',
      //   pagePath: 'pages/shareinfo/account/account',
      //   text: '我的',
      // },
      // // {
      // //   iconPath: 'static/tabbar/home.png',
      // //   selectedIconPath: 'static/tabbar/homeHL.png',
      // //   pagePath: 'pages/index/index',
      // //   text: '首页old',
      // // },
      // // {
      // //   iconPath: 'static/tabbar/example.png',
      // //   selectedIconPath: 'static/tabbar/exampleHL.png',
      // //   pagePath: 'pages/about/about',
      // //   text: '关于',
      // // },
      // {
      //   iconPath: 'static/tabbar/example.png',
      //   selectedIconPath: 'static/tabbar/exampleHL.png',
      //   pagePath: 'pages/testpage/sample3',
      //   // pagePath: 'pages/shareinfo/useHelp/useHelp',
      //   text: 'test',
      // },
      // {
      //   iconPath: 'static/tabbar/example.png',
      //   selectedIconPath: 'static/tabbar/exampleHL.png',
      //   pagePath: 'pages/shareinfo/teacher-register/teacher-register',
      //   // pagePath: 'pages/shareinfo/useHelp/useHelp',
      //   text: 'test',
      // },

      {
        pagePath: 'pages/weshares/index/index',
        iconPath: 'static/tabbar/homeHL.png',
        selectedIconPath: 'static/tabbar/homeHL.png',
        text: '首页',
      },
      // {
      //   pagePath: 'pages/weshares/find-teachers/index',
      //   iconPath: 'static/tabbar/homeHL.png',
      //   selectedIconPath: 'static/tabbar/homeHL.png',
      //   text: '找老师',
      // },
      {
        pagePath: 'pages/weshares/orders/index',
        iconPath: 'static/tabbar/homeHL.png',
        selectedIconPath: 'static/tabbar/homeHL.png',
        text: '订单',
      },
      {
        pagePath: 'pages/weshares/personal-center/index',
        iconPath: 'static/tabbar/homeHL.png',
        selectedIconPath: 'static/tabbar/homeHL.png',
        text: '个人中心',
      },
    ],
  },
})
