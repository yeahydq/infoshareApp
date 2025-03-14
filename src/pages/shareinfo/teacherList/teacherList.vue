<template>
  <view class="page">
    <!-- 头部选择 -->
    <view class="nav">
      <view :class="'nav-son ' + (shownavindex == 1 ? 'active' : '')" data-nav="1">
        <view class="content" @tap="clickQD">青岛站</view>
      </view>
      <view
        :class="'nav-son ' + (shownavindex == 2 ? 'active' : '')"
        @tap="courseList"
        data-nav="2"
      >
        <view class="content">{{ choseCourse }}</view>
        <image class="icon" src="/static/image/downArrow2.png"></image>
      </view>
      <view
        :class="'nav-son ' + (shownavindex == 3 ? 'active' : '')"
        @tap="universityList"
        data-nav="3"
      >
        <view class="content">{{ choseUniversity }}</view>
        <image class="icon" src="/static/image/downArrow2.png"></image>
      </view>
    </view>

    <!-- 课程选择 -->
    <view
      :class="
        'temp temp1 ' + (courseOpen ? 'slidown' : 'slidup') + ' ' + (courseShow ? 'disappear' : '')
      "
    >
      <view
        :data-course="item"
        hover-class="navigator-hover"
        @tap="selectCourse"
        style="padding-left: 10px"
        v-for="(item, index) in content"
        :key="index"
      >
        {{ item }}
      </view>
    </view>

    <!-- 大学选择 -->
    <view
      :class="
        'temp temp2 ' +
        (universityOpen ? 'slidown' : 'slidup') +
        ' ' +
        (universityShow ? 'disappear' : '')
      "
    >
      <view
        :data-university="item"
        hover-class="navigator-hover"
        @tap="selectUniversity"
        style="padding-left: 10px"
        v-for="(item, index) in content"
        :key="index"
      >
        {{ item }}
      </view>
    </view>
    <!-- 背景变灰 -->
    <view :class="'fullbg ' + (isfull ? 'fullopacity' : '')" @tap="hidebg"></view>

    <view :class="'firstOpen ' + (!firstOpen ? 'firstOpenOpacity' : '')">
      <image src="/static/image/logoShow.png" class="logo"></image>
      <view class="openTitle">蜂鸟家教</view>
      <view class="openContent">
        <view class="detailText">家长和教师双向选择</view>
        <view class="detailText">完全不收中介费</view>
        <view class="detailText">信息公开透明</view>
        <view class="detailText">找家教 就来蜂鸟家教</view>
      </view>
      <view class="openButton" @tap="openNow"><text>立即体验</text></view>
    </view>

    <!-- 教师列表 -->
    <view
      class="row"
      @tap="showDetail"
      :data-index="index"
      v-for="(item, index) in teacher_list"
      :key="index"
    >
      <view class="item">
        <view class="item-left">
          <image class="teacherPhoto" :src="item.photo" />
        </view>
        <view class="item-middle">
          <view class="name-trait">
            <text class="teacher-name">{{ item.teacher_name }}</text>
            <view :class="'trait  ' + item.trait">
              <view calss="trait-text">{{ item.trait }}</view>
            </view>
          </view>
          <view class="teacher-university">{{ item.university }}</view>
          <view class="teacher-score">高考{{ item.teacher_score }}分</view>
        </view>

        <view class="item-right">
          <view class="teach-course">
            <text v-for="(item, index1) in item.teach_course" :key="index1">{{ item }}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="loading-indicator">
      {{ loadingTip }}
    </view>
  </view>
</template>

<script>
/* var Bmob = require('../../utils/bmob.js'); */ // TODO: Commented out Bmob import
// import { getTime } from '@service/util/util.ts'

const app = getApp()

export default {
  data() {
    return {
      choseCourse: '全部课程',
      choseUniversity: '全部学校',
      content: [],
      course: [],
      university: [],
      courseOpen: false,
      universityOpen: false,
      courseShow: false,
      universityShow: false,
      isfull: false,
      shownavindex: '',
      teacher_list: [],
      pageIndex: 0,
      loadingTip: '上拉加载更多',
      has_more: true,
      refreshTeacher: false,
      firstOpen: null,
    }
  },
  onLoad: function () {
    const firstOpen = uni.getStorageSync('firstOpen')
    if (!firstOpen) {
      this.setData({
        firstOpen: true,
        isfull: true,
      })
      uni.setStorageSync('firstOpen', true)
    }
    console.log(firstOpen)
    uni.showShareMenu({
      withShareTicket: true, // 要求小程序返回分享目标信息
    })
    this.filterTeacher()
    this.setData({
      course: [
        '全部课程',
        '数学',
        '英语',
        '语文',
        '物理',
        '化学',
        '生物',
        '政治',
        '历史',
        '地理',
        '美术',
        '钢琴',
        '日语',
        '韩语',
      ],
      university: [
        '全部学校',
        '中国海洋大学',
        '中国石油大学',
        '青岛大学',
        '青岛理工大学',
        '青岛科技大学',
        '山东科技大学',
      ],
    })
  },
  onReachBottom: function () {
    if (!this.data.has_more) {
      return
    }
    let pageIndex = this.data.pageIndex
    this.setData({
      pageIndex: ++pageIndex,
    })
    this.filterTeacher()
  },
  onPullDownRefresh: function () {
    this.setData({
      pageIndex: 0,
      teacher_list: [],
      has_more: true,
    })
    this.filterTeacher()
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '找家教 就来蜂鸟家教',
      path: '/pages/teacherList/teacherList',
      imageUrl: '/static/image/shareImage.png',
      success: function (res) {
        /* var currentUser = Bmob.User.current();
                var user = Bmob.Object.extend('_User');
                var queryUser = new Bmob.Query(user);
                queryUser.get(currentUser.id, {
                    success: function (result) {
                        result.set('applyNumberLimit', '6');
                        result.save();
                        uni.showToast({
                            title: '申请次数提升为6次！',
                            icon: 'success',
                            duration: 3000
                        });
                    },
                    error: function (object, error) {
                        // 查询失败
                        console.log('升级失败');
                    }
                }); */
        // TODO: Commented out Bmob related code
      },
      fail: function (res) {
        // 转发失败
      },
    }
  },
  methods: {
    courseList: function (e) {
      if (this.courseOpen) {
        this.setData({
          courseOpen: false,
          universityOpen: false,
          courseShow: false,
          universityShow: true,
          isfull: false,
          shownavindex: 0,
        })
      } else {
        this.setData({
          content: this.course,
          courseOpen: true,
          universityOpen: false,
          courseShow: false,
          universityShow: true,
          isfull: true,
          shownavindex: e.currentTarget.dataset.nav,
        })
      }
    },

    universityList: function (e) {
      if (this.universityOpen) {
        this.setData({
          courseOpen: false,
          universityOpen: false,
          courseShow: true,
          universityShow: false,
          isfull: false,
          shownavindex: 0,
        })
      } else {
        this.setData({
          content: this.university,
          courseOpen: false,
          universityOpen: true,
          courseShow: true,
          universityShow: false,
          isfull: true,
          shownavindex: e.currentTarget.dataset.nav,
        })
      }
      console.log(e.target)
    },

    selectCourse: function (e) {
      this.setData({
        courseOpen: false,
        universityOpen: false,
        courseShow: false,
        universityShow: true,
        isfull: false,
        choseCourse: e.currentTarget.dataset.course,
        pageIndex: 0,
        teacher_list: [],
        has_more: true,
      })
      this.filterTeacher()
    },

    selectUniversity: function (e) {
      this.setData({
        courseOpen: false,
        universityOpen: false,
        courseShow: true,
        universityShow: false,
        isfull: false,
        choseUniversity: e.currentTarget.dataset.university,
        pageIndex: 0,
        teacher_list: [],
        has_more: true,
      })
      this.filterTeacher()
    },

    hidebg: function (e) {
      this.setData({
        courseOpen: false,
        universityOpen: false,
        courseShow: true,
        universityShow: true,
        isfull: false,
        shownavindex: 0,
      })
    },

    openNow: function () {
      this.setData({
        isfull: false,
        firstOpen: false,
      })
      uni.setStorage({
        key: 'firstOpen',
        data: 'false',
      })
    },

    filterTeacher: function () {
      const Course = this.choseCourse
      const University = this.choseUniversity
      const pageSize = 10
      /* var teacher = Bmob.Object.extend('teacher');
            var query = new Bmob.Query(teacher);
            query.descending('updatedAt');
            query.skip(this.data.pageIndex * page_size);
            query.limit(page_size); */ // TODO: Commented out Bmob related code
      uni.showLoading({
        title: '加载中...',
      })
      if (Course !== '全部课程' && University !== '全部学校') {
        /* query.equalTo('teach_course', Course);
                query.equalTo('university', University);
                query.find({
                    success: function (results) {
                        uni.hideLoading();
                        var teacher_list = this.data.teacher_list;
                        this.setData({
                            teacher_list: teacher_list.concat(results)
                        });
                        console.log(results);
                        if (results.length < page_size) {
                            this.setData({
                                loadingTip: '过几天再刷刷，会有更多老师哦',
                                has_more: false
                            });
                        }
                    },
                    error: function (error) {}
                }); */
        // TODO: Commented out Bmob related code
      } else if (Course !== '全部课程' && University === '全部学校') {
        /* query.equalTo('teach_course', Course);
                query.find({
                    success: function (results) {
                        uni.hideToast();
                        var teacher_list = this.data.teacher_list;
                        this.setData({
                            teacher_list: teacher_list.concat(results)
                        });
                        console.log(results);
                        if (results.length < page_size) {
                            this.setData({
                                loadingTip: '过几天再刷刷，会有更多老师哦',
                                has_more: false
                            });
                        }
                    },
                    error: function (error) {}
                }); */
        // TODO: Commented out Bmob related code
      } else if (Course === '全部课程' && University !== '全部学校') {
        /* query.equalTo('university', University);
                query.find({
                    success: function (results) {
                        uni.hideToast();
                        var teacher_list = this.data.teacher_list;
                        this.setData({
                            teacher_list: teacher_list.concat(results)
                        });
                        console.log(results);
                        if (results.length < page_size) {
                            this.setData({
                                loadingTip: '过几天再刷刷，会有更多老师哦',
                                has_more: false
                            });
                        }
                    },
                    error: function (error) {}
                }); */
        // TODO: Commented out Bmob related code
      } else if (Course === '全部课程' && University === '全部学校') {
        /* query.find({
                    success: function (results) {
                        uni.hideToast();
                        var teacher_list = this.data.teacher_list;
                        this.setData({
                            teacher_list: teacher_list.concat(results)
                        });
                        console.log(results);
                        if (results.length < page_size) {
                            this.setData({
                                loadingTip: '过几天再刷刷，会有更多老师哦',
                                has_more: false
                            });
                        }
                    },
                    error: function (error) {}
                }); */
        // TODO: Commented out Bmob related code
      }
    },

    clickQD: function () {
      uni.showToast({
        title: '更多地区待开通中...',
        icon: 'none',
        duration: 3000,
      })
    },

    showDetail: function (e) {
      const index = e.currentTarget.dataset.index
      const objectId = this.data.teacher_list[index].id
      uni.navigateTo({
        url:
          '../teacherDetail/teacherDetail?showTelephone=false&showBottom=true&objectId=' + objectId,
      })
    },
  },
}
</script>
<style>
@import './teacherList.css';
</style>
