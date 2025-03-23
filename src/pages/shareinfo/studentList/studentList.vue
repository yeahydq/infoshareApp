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
      <view :class="'nav-son ' + (shownavindex == 3 ? 'active' : '')" @tap="gradeList" data-nav="3">
        <view class="content">{{ choseGrade }}</view>
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

    <!-- 年级选择 -->
    <view
      :class="
        'temp temp2 ' + (gradeOpen ? 'slidown' : 'slidup') + ' ' + (gradeShow ? 'disappear' : '')
      "
    >
      <view
        :data-grade="item"
        hover-class="navigator-hover"
        @tap="selectgrade"
        style="padding-left: 10px"
        v-for="(item, index) in content"
        :key="index"
      >
        {{ item }}
      </view>
    </view>
    <!-- 背景变灰 -->
    <view :class="'fullbg ' + (isfull ? 'fullopacity' : '')" @tap="hidebg"></view>

    <!-- 学生列表 -->
    <view
      class="row"
      @tap="showDetail"
      :data-index="index"
      v-for="(item, index) in student_list"
      :key="index"
    >
      <view class="item">
        <view class="item-left">
          <view :class="'course-circular ' + item.courseEnglish">
            <text class="chenjian">{{ item.course }}</text>
          </view>
        </view>
        <view class="item-right">
          <view class="item-right-top">
            <text class="student-name">{{ item.name }}</text>
            <text class="teach-salary">{{ item.salary }}</text>
          </view>
          <view class="item-right-bottom">
            <text class="student-position">地点：{{ item.addressName }}</text>
            <text class="teach-time">频次：{{ item.frequency }}</text>
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
// const Bmob = require('../../utils/bmob.js')
export default {
  data() {
    return {
      choseCourse: '全部课程',
      choseGrade: '全部年级',
      content: [],
      course: [],
      grade: [],
      studentCourse: '数学',
      courseOpen: false,
      gradeOpen: false,
      courseShow: false,
      gradeShow: false,
      isfull: false,
      shownavindex: '',
      student_list: [],
      pageIndex: 0,
      loadingTip: '上拉加载更多',
      has_more: true,
      refreshStudent: false,
    }
  },
  onLoad: function () {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    uni.setClipboardData({
      data: '8OCw5j661P',
      success: function (res) {
        uni.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          },
        })
      },
    })
    uni.showShareMenu({
      withShareTicket: true, // 要求小程序返回分享目标信息
    })
    self.filterStudent()
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
      grade: ['全部年级', '小学', '初中', '高中'],
    })
  },
  onReachBottom: function () {
    if (!self.data.has_more) {
      return
    }
    let pageIndex = self.data.pageIndex
    self.setData({
      pageIndex: ++pageIndex,
    })
    self.filterStudent()
  },
  onPullDownRefresh: function () {
    self.setData({
      pageIndex: 0,
      student_list: [],
      has_more: true,
    })
    self.filterStudent()
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
        const currentUser = Bmob.User.current()
        const user = Bmob.Object.extend('_User')
        const queryUser = new Bmob.Query(user)
        queryUser.get(currentUser.id, {
          success: function (result) {
            result.set('applyNumberLimit', '6')
            result.save()
            uni.showToast({
              title: '申请次数提升为6次！',
              icon: 'success',
              duration: 3000,
            })
          },
          error: function (object, error) {
            // 查询失败
            console.log('升级失败')
          },
        })
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
          gradeOpen: false,
          courseShow: false,
          gradeShow: true,
          isfull: false,
          shownavindex: 0,
        })
      } else {
        this.setData({
          content: this.course,
          courseOpen: true,
          gradeOpen: false,
          courseShow: false,
          gradeShow: true,
          isfull: true,
          shownavindex: e.currentTarget.dataset.nav,
        })
      }
    },

    gradeList: function (e) {
      if (this.gradeOpen) {
        this.setData({
          courseOpen: false,
          gradeOpen: false,
          courseShow: true,
          gradeShow: false,
          isfull: false,
          shownavindex: 0,
        })
      } else {
        this.setData({
          content: this.grade,
          courseOpen: false,
          gradeOpen: true,
          courseShow: true,
          gradeShow: false,
          isfull: true,
          shownavindex: e.currentTarget.dataset.nav,
        })
      }
      console.log(e.target)
    },

    // 课程列表选择
    selectCourse: function (e) {
      this.setData({
        courseOpen: false,
        gradeOpen: false,
        courseShow: false,
        gradeShow: true,
        isfull: false,
        choseCourse: e.currentTarget.dataset.course,
        pageIndex: 0,
        student_list: [],
        has_more: true,
      })
      self.filterStudent()
    },

    // 年级列表选择
    selectgrade: function (e) {
      this.setData({
        courseOpen: false,
        gradeOpen: false,
        courseShow: true,
        gradeShow: false,
        isfull: false,
        choseGrade: e.currentTarget.dataset.grade,
        pageIndex: 0,
        student_list: [],
        has_more: true,
      })
      self.filterStudent()
    },

    hidebg: function (e) {
      this.setData({
        courseOpen: false,
        gradeOpen: false,
        courseShow: true,
        gradeShow: true,
        isfull: false,
        shownavindex: 0,
      })
    },

    filterStudent: function () {
      // TODO: Commented out Bmob import
      //   const Course = this.choseCourse
      //   const Grade = this.choseGrade
      //   const page_size = 10
      //   const student = Bmob.Object.extend('student')
      //   const query = new Bmob.Query(student)
      //   query.descending('updatedAt')
      //   query.skip(self.data.pageIndex * page_size)
      //   query.limit(page_size)
      //   uni.showLoading({
      //     title: '加载中...',
      //   })
      //   if (Course != '全部课程' && Grade != '全部年级') {
      //     query.equalTo('course', Course)
      //     query.equalTo('grade', Grade)
      //     query.find({
      //       success: function (results) {
      //         uni.hideLoading()
      //         const student_list = self.data.student_list
      //         self.setData({
      //           student_list: student_list.concat(results),
      //         })
      //         console.log(results)
      //         // 判断无更多数据
      //         if (results.length < page_size) {
      //           self.setData({
      //             loadingTip: '过几天再刷刷，会有更多信息哦',
      //             has_more: false,
      //           })
      //         }
      //       },
      //       error: function (error) {},
      //     })
      //   } else if (Course != '全部课程' && Grade == '全部年级') {
      //     query.equalTo('course', Course)
      //     query.find({
      //       success: function (results) {
      //         uni.hideToast()
      //         const student_list = self.data.student_list
      //         self.setData({
      //           student_list: student_list.concat(results),
      //         })
      //         console.log(results)
      //         // 判断无更多数据
      //         if (results.length < page_size) {
      //           self.setData({
      //             loadingTip: '过几天再刷刷，会有更多信息哦',
      //             has_more: false,
      //           })
      //         }
      //       },
      //       error: function (error) {},
      //     })
      //   } else if (Course == '全部课程' && Grade != '全部年级') {
      //     query.equalTo('grade', Grade)
      //     query.find({
      //       success: function (results) {
      //         uni.hideToast()
      //         const student_list = self.data.student_list
      //         self.setData({
      //           student_list: student_list.concat(results),
      //         })
      //         console.log(results)
      //         // 判断无更多数据
      //         if (results.length < page_size) {
      //           self.setData({
      //             loadingTip: '过几天再刷刷，会有更多信息哦',
      //             has_more: false,
      //           })
      //         }
      //       },
      //       error: function (error) {},
      //     })
      //   } else if (Course == '全部课程' && Grade == '全部年级') {
      //     query.find({
      //       success: function (results) {
      //         uni.hideToast()
      //         const student_list = self.data.student_list
      //         self.setData({
      //           student_list: student_list.concat(results),
      //         })
      //         console.log(results)
      //         // 判断无更多数据
      //         if (results.length < page_size) {
      //           self.setData({
      //             loadingTip: '过几天再刷刷，会有更多信息哦',
      //             has_more: false,
      //           })
      //         }
      //       },
      //       error: function (error) {},
      //     })
      //   }
    },

    showDetail: function (e) {
      const index = e.currentTarget.dataset.index
      const objectId = self.data.student_list[index].id
      uni.navigateTo({
        url:
          '../studentDetail/studentDetail?showTelephone=false&showBottom=true&objectId=' + objectId,
      })
    },

    clickQD: function () {
      uni.showToast({
        title: '更多地区待开通中...',
        icon: 'none',
        duration: 3000,
      })
    },
  },
}
</script>
<style>
@import './studentList.css';
</style>
