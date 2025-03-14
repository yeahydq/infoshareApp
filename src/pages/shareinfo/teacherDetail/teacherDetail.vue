<template>
  <view class="page">
    <!-- 教师照片、名字、课程 -->
    <view class="teacher-sketch">
      <image class="teacherPhoto" @tap="preview" :src="teacher.photo" />
      <view class="name-course">
        <view class="teacher-name">{{ teacher.teacher_name }}</view>
        <view class="teach-course">
          <text>教授课程：</text>
          <text class="courseMargin" v-for="(item, index) in teacher.teach_course" :key="index">
            {{ item }}
          </text>
        </view>
      </view>

      <button class="complaint" @tap="complaint" :plain="true" style="height: 75rpx; border: 0">
        <image class="complaintIcon" @tap="complaint" src="/static/image/complaint.png" />
      </button>

      <!-- <button class="share" open-type="share" data-id="111" plain="true"  style="border:0;height:75rpx;">
                  <image class="shareIcon" bindtap="share"src="../../image/share.png" />
              </button>  -->
    </view>

    <view class="aboutData">
      <image class="timeIcon" src="/static/image/time.png"></image>
      <view class="timeText">{{ teacher.modifyTime }}</view>

      <image class="collectIcon" src="/static/image/collectNumber.png"></image>
      <view class="collectText">{{ collectNumber }}</view>

      <image class="applyIcon" src="/static/image/applyNumber.png"></image>
      <view class="applyText">{{ applyNumber }}</view>
    </view>

    <view
      class="course-check"
      style="
        width: 100%;
        padding: 0rpx 15rpx 20rpx 15rpx;
        padding-bottom: 20rpx;
        background-color: #fff;
      "
    >
      <view
        class="courseItem"
        style="color:; border: 1rpx solid #737373"
        v-for="(item, index) in traitList"
        :key="index"
      >
        <view style="padding: 10rpx">{{ item }}</view>
      </view>
    </view>

    <view :class="'fullbg ' + (isfull ? 'fullopacity' : '')" @tap="hidebg"></view>
    <view :class="'goldUser ' + (!goldUser ? 'goldUserOpacity' : '')">
      <image src="/static/image/logoShow.png" class="logo"></image>
      <text class="openTitle">获得金牌会员</text>
      <view class="openContent">
        <view class="detailText">
          转发至您的
          <text style="color: #fe4c40">家长群</text>
          或
          <text style="color: #fe4c40">班级群</text>
        </view>
        <view class="detailText">
          即可每日免费申请
          <text style="color: #fe4c40">6</text>
          位老师
        </view>
        <view class="detailText">好的东西 值得分享</view>
      </view>
      <button class="openButton" open-type="share" data-id="222"><text>立即转发</text></button>
      <view class="giveUp" @tap="giveUp">放弃使用</view>
    </view>

    <!-- 薪资、教学范围 -->
    <view class="teachRange-salary" style="margin-top: 0rpx">
      <view class="salary">
        <text class="gray-text">期望薪资 :</text>
        <text style="padding-left: 10rpx">{{ teacher.salary }}</text>
      </view>
    </view>

    <!-- 教师简介 -->
    <view class="teacher-info">
      <view class="teacher-university">
        <text class="gray-text">教育经历 :</text>
        <text style="padding-left: 10rpx">{{ teacher.university }}</text>
      </view>

      <view class="teacher-score">
        <text class="gray-text">高考分数 :</text>
        <text style="padding-left: 10rpx">{{ teacher.teacher_score }}</text>
      </view>

      <view class="degree">
        <text class="gray-text">学历 :</text>
        <text style="padding-left: 10rpx">{{ teacher.degree }}</text>
      </view>

      <view class="major">
        <text class="gray-text">专业 :</text>
        <text style="padding-left: 10rpx">{{ teacher.major }}</text>
      </view>
    </view>

    <view class="telephone" @tap="callPhone" v-if="showTelephone === 'true'">
      <text class="gray-text">联系电话 :</text>
      <text style="padding-left: 10rpx">{{ teacher.telephone }}</text>
      <image class="telephone-icon" src="/static/image/telephone.png"></image>
    </view>

    <!-- 自我介绍 -->
    <view class="self-introduction">
      <text class="self-title">自我介绍:</text>
      <text class="self-int">{{ teacher.self_int }}</text>
    </view>

    <view class="gallery">
      <view class="itemImage" v-for="(item, index) in imageArr" :key="index">
        <image
          class="thumb"
          :data-current="item"
          :style="'width: ' + 2 * image_width + 'rpx; height: ' + 2 * image_width + 'rpx'"
          :src="item"
          @tap="previewImage"
        />
      </view>
    </view>

    <view class="tip">
      <text>已经到底啦！快给{{ teacher.teacher_name }}发送申请吧</text>
    </view>

    <view class="bottom" v-if="showBottom === 'true'">
      <view class="share-left">
        <button
          class="share"
          open-type="share"
          data-id="111"
          :plain="true"
          style="height: 60rpx; border: 0"
        >
          <image class="shareIcon" @tap="share" src="/static/image/share2.png" />
        </button>
        <text class="collect-text" style="color: #fe4c40">分享</text>
      </view>
      <view class="collect-left" @tap="collect">
        <view class="collect" v-if="judgeCollect === false">
          <image class="collect-icon" src="/static/image/collect.png"></image>
          <text class="collect-text">收藏</text>
        </view>
        <view class="collect" v-else-if="judgeCollect === true">
          <image class="collect-icon" src="/static/image/collect-click.png"></image>
          <text class="collect-text">收藏</text>
        </view>
      </view>
      <view class="talk-right" @tap="talk">
        <text>发送申请</text>
      </view>
    </view>
  </view>
</template>

<script>
/* var Bmob = require('../../utils/bmob.js'); */ // TODO: Commented out Bmob import
// var utils = require('../../service/util.js');
// import { getTime } from '@service/util/util'

export default {
  data() {
    return {
      image_width: getApp().globalData.screenWidth / 4 - 10,
      teacher: {
        photo: '',
        teacher_name: '',
        teach_course: [],
        modifyTime: '',
        salary: '',
        university: '',
        teacher_score: '',
        degree: '',
        major: '',
        telephone: '',
        self_int: '',
      },
      photoUrl: '',
      objectId: '',
      judgeCollect: false,
      showTelephone: 'false',
      showBottom: 'true',
      own: '',
      telephone: '',
      imageArr: [],
      collectNumber: '',
      applyNumber: '',
      isfull: false,
      goldUser: null,
      traitList: [],
    }
  },
  created() {
    // Remove aliasing of 'this'
    // ...existing code...
  },
  onLoad: function (options) {
    uni.showShareMenu({
      withShareTicket: true, // 要求小程序返回分享目标信息
    })
    /* uni.setClipboardData({
            data: '8OCw5j661P',
            success: function (res) {
                uni.getClipboardData({
                    success: function (res) {
                        console.log(res.data); // data
                    }
                });
            }
        }); */ // TODO: Commented out Bmob related code
    this.setData({
      showTelephone: options.showTelephone,
      showBottom: options.showBottom,
    })
    console.log(this.data.showTelephone)
    const objectId = options.objectId
    /* var teacher = Bmob.Object.extend('teacher');
        var currentUser = Bmob.User.current();
        var currentUserId = currentUser.id;
        var User = Bmob.Object.extend('_User');
        var user = new User();
        var queryUser = new Bmob.Query(User);
        var query = new Bmob.Query(teacher);
        //查询单条数据，第一个参数是这条数据的objectId值
        query.get(objectId, {
            success: function (result) {
                console.log(result);
                var photoUrl = result.get('photo');
                var own = result.get('own');
                var telephone = result.get('telephone');
                var traitList = result.get('teach_trait');
                var imageList = result.get('images');
                var imageArr = new Array();
                var data = result.get('upDateAt');
                for (var i = 0; i < imageList.length; i++) {
                    imageArr[i] = imageList[i].url;
                }
                // 查询成功，调用get方法获取对应属性的值
                self.setData({
                    own: own,
                    teacher: result,
                    photoUrl: photoUrl,
                    objectId: objectId,
                    telephone: telephone,
                    imageArr: imageArr,
                    traitList: traitList
                });
                console.log(self.data.traitList);
            },
            error: function (object, error) {
                uni.showToast({
                    title: '网络错误',
                    image: '../../image/warn.png',
                    duration: 2000
                });
            }
        });
        queryUser.get(currentUserId, {
            success: function (result) {
                var collectArr = result.get('collect');
                console.log(collectArr);
                for (var i = 0; i <= collectArr.length; i++) {
                    if (collectArr[i] === objectId) {
                        self.setData({
                            judgeCollect: true
                        });
                    }
                }
            },
            error: function (object, error) {
                uni.showToast({
                    title: '网络错误',
                    image: '../../image/warn.png',
                    duration: 2000
                });
            }
        });
        var collect = Bmob.Object.extend('collect');
        var queryCollect = new Bmob.Query(collect);
        queryCollect.equalTo('collectTeacher', objectId);
        queryCollect.count({
            success: function (countCollect) {
                console.log('共有 ' + countCollect + ' 条记录');
                self.setData({
                    collectNumber: countCollect + '次收藏'
                });
            },
            error: function (error) {}
        });
        var apply = Bmob.Object.extend('apply');
        var queryApply = new Bmob.Query(apply);
        queryApply.equalTo('applyTeacherDetail', objectId);
        queryApply.count({
            success: function (countApply) {
                console.log('共有 ' + countApply + ' 条记录');
                self.setData({
                    applyNumber: countApply + '次申请'
                });
            },
            error: function (error) {
                // 查询失败
            }
        }); */ // TODO: Commented out Bmob related code
  },
  onShareAppMessage: function (res) {
    const objectId = this.data.objectId
    if (res.from === 'button') {
      console.log(res)
    }
    if (res.target.dataset.id === '111') {
      return {
        title: '给你推荐个很棒的家教',
        path: '/pages/teacherDetail/teacherDetail?objectId=' + objectId,
        success: function (res) {
          uni.showToast({
            title: '转发成功',
            icon: 'success',
            duration: 3000,
          })
        },
        fail: function (res) {
          // 转发失败
        },
      }
    } else if (res.target.dataset.id === '222') {
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
              this.setData({
                isfull: false,
                goldUser: false,
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
    }
  },
  methods: {
    complaint: function () {
      const objectId = this.data.objectId
      uni.navigateTo({
        url: '../complaintTeacher/complaintTeacher?role=teacher&objectId=' + objectId,
      })
    },

    collect: function () {
      const currentUser = Bmob.User.current()
      const currentUserId = currentUser.id
      const User = Bmob.Object.extend('_User')
      const user = new User()
      const query = new Bmob.Query(User)
      query.get(currentUserId, {
        success: (result) => {
          const register = result.get('register')
          if (register === false) {
            uni.showModal({
              title: '您尚未注册',
              content: '注册后可更快速找到合适的家教',
              confirmText: '立即注册',
              confirmColor: '#fe4c40',
              cancelColor: '#bdbdbd',
              success: function (res) {
                if (res.confirm) {
                  uni.navigateTo({
                    url: '../teacher-register/teacher-register',
                  })
                } else if (res.cancel) {
                  someFunctionCall()
                }
              },
            })
          } else if (register === true) {
            const role = result.get('role')
            console.log(role)
            if (role === 'teacher') {
              uni.showToast({
                title: '您是教师，仅可收藏家长',
                image: '../../image/warn.png',
                duration: 2000,
              })
            } else if (role === 'student') {
              const collectArr = result.get('collect')
              console.log(collectArr)
              let hadCollect
              for (let i = 0; i <= collectArr.length; i++) {
                if (collectArr[i] === this.data.objectId) {
                  hadCollect = true
                }
              }
              if (hadCollect === true) {
                uni.showToast({
                  title: '已结收藏过啦',
                  icon: 'success',
                  duration: 1000,
                })
              } else {
                result.add('collect', this.data.objectId)
                result.save()
                const currentUser = Bmob.User.current()
                const Teacher = Bmob.Object.extend('teacher')
                const teacherModel = new Teacher()
                teacherModel.id = this.data.objectId
                const Collect = Bmob.Object.extend('collect')
                const collect = new Collect()
                collect.set('currentUser', currentUserId)
                collect.set('collectTeacher', teacherModel)
                collect.save(null, {
                  success: function (result) {
                    // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
                    console.log('日记创建成功, objectId:' + result.id)
                  },
                  error: function (result, error) {
                    // 添加失败
                    console.log('创建日记失败')
                  },
                })
                this.judgeCollect = true
                uni.showToast({
                  title: '收藏成功',
                  icon: 'success',
                  duration: 1000,
                })
              }
            }
          }
        },
      })
    },

    talk: function () {
      // const nowTime = getTime()
      const nowTime = new Date().toLocaleDateString()
      const currentUser = Bmob.User.current()
      const currentUserId = currentUser.id
      const Apply = Bmob.Object.extend('apply')
      const queryApply = new Bmob.Query(Apply)
      queryApply.equalTo('applyUser', currentUserId)
      queryApply.equalTo('applyTime', nowTime)
      const user = Bmob.Object.extend('_User')
      const query = new Bmob.Query(user)
      query.get(currentUserId, {
        success: (result) => {
          const applyNumberLimit = result.get('applyNumberLimit')
          const releaseId = result.get('release')
          const register = result.get('register')
          if (register === false) {
            uni.showModal({
              title: '您尚未注册',
              content: '注册后可更快速找到合适的家教',
              confirmText: '立即注册',
              confirmColor: '#fe4c40',
              cancelColor: '#bdbdbd',
              success: function (res) {
                if (res.confirm) {
                  uni.navigateTo({
                    url: '../teacher-register/teacher-register',
                  })
                } else if (res.cancel) {
                  anotherFunctionCall()
                }
              },
            })
          } else if (register === true) {
            const role = result.get('role')
            if (role === 'teacher') {
              uni.showToast({
                title: '您是教师，仅可向家长发送申请',
                image: '../../image/warn.png',
                duration: 2000,
              })
            } else if (role === 'student') {
              const excludeApply = new Bmob.Query(Apply)
              excludeApply.equalTo('applyStudent', releaseId)
              excludeApply.equalTo('applyTeacherDetail', this.data.objectId)
              excludeApply.find({
                success: (results) => {
                  if (results.length !== 0) {
                    uni.showToast({
                      title: '您已经给对方发送过啦！',
                      image: '../../image/warn.png',
                      duration: 2000,
                    })
                  } else {
                    queryApply.find({
                      success: (resultTime) => {
                        if (resultTime.length < applyNumberLimit) {
                          const surplus = applyNumberLimit - resultTime.length
                          console.log('您还可发送' + surplus + '次')
                          console.log('已经发送' + resultTime.length)
                          uni.showModal({
                            confirmColor: '#fe4c40',
                            cancelText: '再多看看',
                            confirmText: '立即发送',
                            title: '您今日还可发送' + surplus + '次申请',
                            content:
                              '对方将收到您的信息，如果有意向对方会通过您预留的手机号与您联系',
                            success: (res) => {
                              if (res.confirm) {
                                const Student = Bmob.Object.extend('student')
                                const studentModel = new Student()
                                studentModel.id = releaseId
                                const Teacher = Bmob.Object.extend('teacher')
                                const teacherModel = new Teacher()
                                teacherModel.id = this.data.objectId
                                const Apply = Bmob.Object.extend('apply')
                                const apply = new Apply()
                                apply.set('applyTime', nowTime)
                                apply.set('applyUser', currentUserId)
                                apply.set('getApplyUser', this.data.own)
                                apply.set('applyStudent', studentModel)
                                apply.set('applyTeacherDetail', teacherModel)
                                apply.set('open', false)
                                apply.set('delete', false)
                                apply.set('deleteSet', false)
                                apply.save(null, {
                                  success: (result) => {
                                    this.firstApply()
                                  },
                                  error: function (result, error) {
                                    console.log('创建日记失败')
                                  },
                                })
                              } else if (res.cancel) {
                                console.log('用户点击取消')
                              }
                            },
                          })
                        } else if (resultTime.length >= 3) {
                          console.log('您今天的发送次数已经用完，明天再来吧')
                          uni.showToast({
                            title: '您今天的发送次数已经用完，明天再来吧',
                            image: '../../image/warn.png',
                            duration: 2000,
                          })
                        }
                      },
                      error: function (error) {
                        console.log('查询失败: ' + error.code + ' ' + error.message)
                      },
                    })
                  }
                },
                error: function (error) {
                  console.log('查询失败: ' + error.code + ' ' + error.message)
                },
              })
            }
          }
        },
      })
    },

    firstApply: function () {
      const currentUser = Bmob.User.current()
      const currentUserId = currentUser.id
      const Apply = Bmob.Object.extend('apply')
      const firstApplyQuery = new Bmob.Query(Apply)
      firstApplyQuery.equalTo('applyUser', currentUserId)
      firstApplyQuery.count({
        success: (count) => {
          console.log(count)
          if (count === 1) {
            this.isfull = true
            this.goldUser = true
          } else {
            uni.showToast({
              title: '发送成功！',
              icon: 'success',
              duration: 2000,
            })
          }
        },
        error: function (error) {
          console.error('Error occurred:', error)
          uni.showToast({
            title: '操作失败，请稍后重试',
            icon: 'none',
            duration: 2000,
          })
        },
      })
    },

    callPhone: function () {
      uni.makePhoneCall({
        phoneNumber: this.telephone,
      })
    },

    preview: function (e) {
      const current = e.currentTarget.dataset.current
      uni.previewImage({
        current,
        // 当前显示图片的http链接
        urls: [this.photoUrl], // 需要预览的图片http链接列表
      })
    },

    previewImage: function (e) {
      const current = e.currentTarget.dataset.current
      uni.previewImage({
        current,
        // 当前显示图片的http链接
        urls: this.imageArr, // 需要预览的图片http链接列表
      })
    },

    giveUp: function () {
      uni.showModal({
        title: '放弃后每日只可申请三次',
        content: '申请的次数直接决定能否找到更合适的家教',
        confirmText: '继续使用',
        cancelText: '确定放弃',
        confirmColor: '#fe4c40',
        cancelColor: '#bdbdbd',
        success: (res) => {
          if (res.confirm) {
            uni.navigateTo({})
          } else if (res.cancel) {
            this.isfull = false
            this.goldUser = false
          }
        },
      })
    },

    hidebg() {
      console.log('占位：函数 hidebg 未声明')
    },

    share() {
      console.log('占位：函数 share 未声明')
    },

    handleError(callback) {
      callback((err) => {
        if (err) {
          console.error(err)
        }
        // ...existing code...
      })
    },

    someAsyncFunction() {
      // ...existing code...
      someAsyncFunction((err, result) => {
        if (err) {
          console.error(err)
          // Handle the error appropriately here
        }
        // ...existing code...
        // Process the result
      })
      // ...existing code...
    },
  },
}
</script>
<style>
@import './teacherDetail.css';
</style>
