<template>
  <view class="page">
    <!-- 教学课程、家长、薪资 -->
    <view class="student-sketch">
      <view :class="'course-circular  ' + student.courseEnglish">
        <text class="chenjian">{{ student.course }}</text>
      </view>
      <view class="name-salary">
        <view class="teacher-name">{{ student.name }}</view>
        <view class="teach-salary">{{ student.salary }}</view>
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
      <view class="timeText">{{ student.modifyTime }}</view>

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

    <!-- 地址、年级、基础 -->
    <view class="student-info" style="margin-top: 0rpx">
      <view class="grade">
        <text class="gray-text">年级 :</text>
        <text style="padding-left: 10rpx">{{ student.grade[0] }} {{ student.grade[1] }}</text>
      </view>

      <view class="basic">
        <text class="gray-text">基础 :</text>
        <text style="padding-left: 10rpx">{{ student.basic }}</text>
      </view>
    </view>

    <!-- 对家教要求 -->
    <view class="teacher-requirement">
      <view class="teach-time">
        <text class="gray-text">上课次数 :</text>
        <text style="padding-left: 10rpx">{{ student.frequency }}</text>
      </view>

      <view class="teacher-sex">
        <text class="gray-text">性别要求 :</text>
        <text style="padding-left: 10rpx">{{ student.sex }}</text>
      </view>

      <view class="degree">
        <text class="gray-text">学历要求:</text>
        <text style="padding-left: 10rpx">{{ student.trait_limit }}</text>
      </view>

      <view
        class="course-check"
        style="width: 100%; padding: 20rpx 15rpx 0rpx 0rpx; background-color: #fff"
      >
        <view
          class="courseItem"
          style="color:; border: 1rpx solid #737373"
          v-for="(item, index) in teacherTrait"
          :key="index"
        >
          <view style="padding: 10rpx">{{ item }}</view>
        </view>
      </view>
    </view>

    <view class="address" @tap="getMap">
      <view class="addressDetail" style="position: relative; float: left; margin-right: 100rpx">
        <view style="padding-left: 10rpx">{{ student.addressDetail }}</view>
      </view>
      <view class="gray-text" style="position: absolute; right: 5rpx; float: right">
        <image class="mapIcon" src="/static/image/mapText.png"></image>
      </view>
    </view>

    <view class="telephone" @tap="callPhone" v-if="showTelephone == 'true'">
      <text class="gray-text">联系电话 :</text>
      <text style="padding-left: 10rpx">{{ student.telephone }}</text>
      <image class="telephone-icon" src="/static/image/telephone.png"></image>
    </view>

    <!-- 备注 -->
    <view class="remark">
      <text class="remark-title">自我介绍:</text>
      <text class="remark-int">{{ student.remark }}</text>
    </view>

    <view class="tip">
      <text>已经到底啦！快给{{ student.name }}发送申请吧</text>
    </view>

    <view class="bottom" v-if="showBottom == 'true'">
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
        <view class="collect" v-if="judgeCollect == false">
          <image class="collect-icon" src="/static/image/collect.png"></image>
          <text class="collect-text">收藏</text>
        </view>
        <view class="collect" v-else-if="judgeCollect == true">
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
// var Bmob = require('../../utils/bmob.js'); // TODO: Commented out Bmob import
// import { getTime } from '@service/util/util'
// const utils = require('../../service/util.js')

const app = getApp()
export default {
  data() {
    return {
      student: {
        courseEnglish: '',
        course: '',
        name: '',
        salary: '',
        modifyTime: '',
        grade: '',
        basic: '',
        frequency: '',
        sex: '',
        trait_limit: '',
        addressDetail: '',
        telephone: '',
        remark: '',
      },
      objectId: '',
      judgeCollect: false,
      showTelephone: 'false',
      showBottom: 'true',
      own: '',
      telephone: '',
      collectNumber: '',
      applyNumber: '',
      isfull: false,
      goldUser: null,
      addressName: '',
      addressDetail: '',
      latitude: '',
      longitude: '',
      traitList: [],
      teacherTrait: [],
    }
  },
  onLoad: function (options) {
    uni.showShareMenu({
      withShareTicket: true, // 要求小程序返回分享目标信息
    })
    this.setData({
      showTelephone: options.showTelephone,
      showBottom: options.showBottom,
    })
    console.log(this.data.showTelephone)
    const objectId = options.objectId
    // var student = Bmob.Object.extend('student'); // TODO: Commented out Bmob related code
    // var currentUser = Bmob.User.current(); // TODO: Commented out Bmob related code
    // var currentUserId = currentUser.id; // TODO: Commented out Bmob related code
    // var User = Bmob.Object.extend('_User'); // TODO: Commented out Bmob related code
    // var user = new User(); // TODO: Commented out Bmob related code
    // var queryUser = new Bmob.Query(User); // TODO: Commented out Bmob related code
    // var query = new Bmob.Query(student); // TODO: Commented out Bmob related code
    // query.get(objectId, { // TODO: Commented out Bmob related code
    //     success: function (result) {
    //         console.log(result);
    //         var own = result.get('own');
    //         var telephone = result.get('telephone');
    //         var latitude = result.get('latitude');
    //         var longitude = result.get('longitude');
    //         var addressName = result.get('addressName');
    //         var addressDetail = result.get('addressDetail');
    //         var traitList = result.get('studentTrait');
    //         var teacherTrait = result.get('teacherTrait');
    //         this.setData({
    //             own: own,
    //             student: result,
    //             objectId: objectId,
    //             telephone: telephone,
    //             latitude: latitude,
    //             longitude: longitude,
    //             addressName: addressName,
    //             addressDetail: addressDetail,
    //             traitList: traitList,
    //             teacherTrait: teacherTrait
    //         });
    //     },
    //     error: function (object, error) {
    //         uni.showToast({
    //             title: '网络错误',
    //             image: '../../image/warn.png',
    //             duration: 2000
    //         });
    //     }
    // });
    // queryUser.get(currentUserId, { // TODO: Commented out Bmob related code
    //     success: function (result) {
    //         var collectArr = result.get('collect');
    //         console.log(collectArr);
    //         for (var i = 0; i <= collectArr.length; i++) {
    //             if (collectArr[i] === objectId) {
    //                 this.setData({
    //                     judgeCollect: true
    //                 });
    //             }
    //         }
    //     },
    //     error: function (object, error) {
    //         uni.showToast({
    //             title: '网络错误',
    //             image: '../../image/warn.png',
    //             duration: 2000
    //         });
    //     }
    // });
    // var collect = Bmob.Object.extend('collect'); // TODO: Commented out Bmob related code
    // var queryCollect = new Bmob.Query(collect); // TODO: Commented out Bmob related code
    // queryCollect.equalTo('collectStudent', objectId); // TODO: Commented out Bmob related code
    // queryCollect.count({ // TODO: Commented out Bmob related code
    //     success: function (countCollect) {
    //         console.log('共有 ' + countCollect + ' 条记录');
    //         this.setData({
    //             collectNumber: countCollect + '次收藏'
    //         });
    //     },
    //     error: function (error) {}
    // });
    // var apply = Bmob.Object.extend('apply'); // TODO: Commented out Bmob related code
    // var queryApply = new Bmob.Query(apply); // TODO: Commented out Bmob related code
    // queryApply.equalTo('applyStudentDetail', objectId); // TODO: Commented out Bmob related code
    // queryApply.count({ // TODO: Commented out Bmob related code
    //     success: function (countApply) {
    //         console.log('共有 ' + countApply + ' 条记录');
    //         this.setData({
    //             applyNumber: countApply + '次申请'
    //         });
    //     },
    //     error: function (error) {
    //         // 查询失败
    //     }
    // });
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
          // var currentUser = Bmob.User.current(); // TODO: Commented out Bmob related code
          // var user = Bmob.Object.extend('_User'); // TODO: Commented out Bmob related code
          // var queryUser = new Bmob.Query(user); // TODO: Commented out Bmob related code
          // queryUser.get(currentUser.id, { // TODO: Commented out Bmob related code
          //     success: function (result) {
          //         result.set('applyNumberLimit', '6');
          //         result.save();
          //         uni.showToast({
          //             title: '申请次数提升为6次！',
          //             icon: 'success',
          //             duration: 3000
          //         });
          //         this.setData({
          //             isfull: false,
          //             goldUser: false
          //         });
          //     },
          //     error: function (object, error) {
          //         // 查询失败
          //         console.log('升级失败');
          //     }
          // });
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
        url: '../complaintStudent/complaintStudent?role=student&objectId=' + objectId,
      })
    },

    collect: function () {
      // var currentUser = Bmob.User.current(); // TODO: Commented out Bmob related code
      // var currentUserId = currentUser.id; // TODO: Commented out Bmob related code
      // var User = Bmob.Object.extend('_User'); // TODO: Commented out Bmob related code
      // var user = new User(); // TODO: Commented out Bmob related code
      // var query = new Bmob.Query(User); // TODO: Commented out Bmob related code
      // query.get(currentUserId, { // TODO: Commented out Bmob related code
      //     success: function (result) {
      //         var register = result.get('register');
      //         if (register === false) {
      //             uni.showModal({
      //                 title: '您尚未注册',
      //                 content: '注册后可更快速找到合适的家教',
      //                 confirmText: '立即注册',
      //                 confirmColor: '#fe4c40',
      //                 cancelColor: '#bdbdbd',
      //                 success: function (res) {
      //                     if (res.confirm) {
      //                         uni.navigateTo({
      //                             url: '../teacher-register/teacher-register'
      //                         });
      //                     } else if (res.cancel) {
      //                         result;
      //                     }
      //                 }
      //             });
      //         } else if (register === true) {
      //             var role = result.get('role');
      //             console.log(role);
      //             if (role === 'student') {
      //                 uni.showToast({
      //                     title: '您是家长/学生，仅可收藏教师',
      //                     image: '../../image/warn.png',
      //                     duration: 2000
      //                 });
      //             } else if (role === 'teacher') {
      //                 var collectArr = result.get('collect');
      //                 console.log(collectArr);
      //                 var hadCollect;
      //                 for (var i = 0; i <= collectArr.length; i++) {
      //                     if (collectArr[i] === this.data.objectId) {
      //                         hadCollect = true;
      //                     }
      //                 }
      //                 if (hadCollect === true) {
      //                     uni.showToast({
      //                         title: '已结收藏过啦',
      //                         icon: 'success',
      //                         duration: 1000
      //                     });
      //                 } else {
      //                     result.add('collect', this.data.objectId);
      //                     result.save();
      //                     var currentUser = Bmob.User.current();
      //                     var Student = Bmob.Object.extend('student');
      //                     var studentModel = new Student();
      //                     var Collect = Bmob.Object.extend('collect');
      //                     var collect = new Collect();
      //                     studentModel.id = this.data.objectId;
      //                     collect.set('currentUser', currentUserId);
      //                     collect.set('collectStudent', studentModel);
      //                     collect.save(null, {
      //                         success: function (result) {
      //                             // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
      //                             console.log('日记创建成功, objectId:' + result.id);
      //                         },
      //                         error: function (result, error) {
      //                             // 添加失败
      //                             console.log('创建日记失败');
      //                         }
      //                     });
      //                     this.setData({
      //                         judgeCollect: true
      //                     });
      //                     uni.showToast({
      //                         title: '收藏成功',
      //                         icon: 'success',
      //                         duration: 1000
      //                     });
      //                 }
      //             }
      //         }
      //     }
      // });
    },

    talk: function () {
      //   const nowTime = getTime()
      // var currentUser = Bmob.User.current(); // TODO: Commented out Bmob related code
      // var currentUserId = currentUser.id; // TODO: Commented out Bmob related code
      // var Apply = Bmob.Object.extend('apply'); // TODO: Commented out Bmob related code
      // var queryApply = new Bmob.Query(Apply); // TODO: Commented out Bmob related code
      // queryApply.equalTo('applyUser', currentUserId); // TODO: Commented out Bmob related code
      // queryApply.equalTo('applyTime', nowTime); // TODO: Commented out Bmob related code
      // var user = Bmob.Object.extend('_User'); // TODO: Commented out Bmob related code
      // var query = new Bmob.Query(user); // TODO: Commented out Bmob related code
      // query.get(currentUserId, { // TODO: Commented out Bmob related code
      //     success: function (result) {
      //         var applyNumberLimit = result.get('applyNumberLimit');
      //         var releaseId = result.get('release');
      //         var register = result.get('register');
      //         if (register === false) {
      //             uni.showModal({
      //                 title: '您尚未注册',
      //                 content: '注册后可更快速找到合适的家教',
      //                 confirmText: '立即注册',
      //                 confirmColor: '#fe4c40',
      //                 cancelColor: '#bdbdbd',
      //                 success: function (res) {
      //                     if (res.confirm) {
      //                         uni.navigateTo({
      //                             url: '../teacher-register/teacher-register'
      //                         });
      //                     } else if (res.cancel) {
      //                         result;
      //                     }
      //                 }
      //             });
      //         } else if (register === true) {
      //             var role = result.get('role');
      //             if (role === 'student') {
      //                 uni.showToast({
      //                     title: '您是家长，仅可向教师发送申请',
      //                     image: '../../image/warn.png',
      //                     duration: 2000
      //                 });
      //             } else if (role === 'teacher') {
      //                 var excludeApply = new Bmob.Query(Apply);
      //                 excludeApply.equalTo('applyTeacher', releaseId);
      //                 excludeApply.equalTo('applyStudentDetail', this.data.objectId);
      //                 excludeApply.find({
      //                     success: function (results) {
      //                         if (results.length != 0) {
      //                             uni.showToast({
      //                                 title: '您已经给对方发送过啦！',
      //                                 image: '../../image/warn.png',
      //                                 duration: 2000
      //                             });
      //                         } else {
      //                             queryApply.find({
      //                                 success: function (resultTime) {
      //                                     if (resultTime.length < applyNumberLimit) {
      //                                         var surplus = applyNumberLimit - resultTime.length;
      //                                         console.log('您还可发送' + surplus + '次');
      //                                         console.log('已经发送' + resultTime.length);
      //                                         uni.showModal({
      //                                             confirmColor: '#fe4c40',
      //                                             cancelText: '再多看看',
      //                                             confirmText: '立即发送',
      //                                             title: '您今日还可发送' + surplus + '次申请',
      //                                             content: '对方将收到您的信息，如果有意向对方会通过您预留的手机号与您联系',
      //                                             success: function (res) {
      //                                                 if (res.confirm) {
      //                                                     var Teacher = Bmob.Object.extend('teacher');
      //                                                     var teacherModel = new Teacher();
      //                                                     teacherModel.id = releaseId;
      //                                                     var Student = Bmob.Object.extend('student');
      //                                                     var studentModel = new Student();
      //                                                     studentModel.id = this.data.objectId;
      //                                                     var Apply = Bmob.Object.extend('apply');
      //                                                     var apply = new Apply();
      //                                                     apply.set('applyTime', nowTime);
      //                                                     apply.set('applyUser', currentUserId);
      //                                                     apply.set('getApplyUser', this.data.own);
      //                                                     apply.set('applyTeacher', teacherModel);
      //                                                     apply.set('applyStudentDetail', studentModel);
      //                                                     apply.set('open', false);
      //                                                     apply.set('delete', false);
      //                                                     apply.set('deleteSet', false);
      //                                                     apply.save(null, {
      //                                                         success: function (result) {
      //                                                             this.firstApply();
      //                                                         },
      //                                                         error: function (result, error) {
      //                                                             console.log('创建日记失败');
      //                                                         }
      //                                                     });
      //                                                 } else if (res.cancel) {
      //                                                     console.log('用户点击取消');
      //                                                 }
      //                                             }
      //                                         });
      //                                     } else if (resultTime.length >= 3) {
      //                                         console.log('您今天的发送次数已经用完，明天再来吧');
      //                                         uni.showToast({
      //                                             title: '您今天的发送次数已经用完，明天再来吧',
      //                                             image: '../../image/warn.png',
      //                                             duration: 2000
      //                                         });
      //                                     }
      //                                 },
      //                                 error: function (error) {
      //                                     console.log('查询失败: ' + error.code + ' ' + error.message);
      //                                 }
      //                             });
      //                         }
      //                     },
      //                     error: function (error) {
      //                         console.log('查询失败: ' + error.code + ' ' + error.message);
      //                     }
      //                 });
      //             }
      //         }
      //     }
      // });
    },

    firstApply: function () {
      // var currentUser = Bmob.User.current(); // TODO: Commented out Bmob related code
      // var currentUserId = currentUser.id; // TODO: Commented out Bmob related code
      // var Apply = Bmob.Object.extend('apply'); // TODO: Commented out Bmob related code
      // var firstApplyQuery = new Bmob.Query(Apply); // TODO: Commented out Bmob related code
      // firstApplyQuery.equalTo('applyUser', currentUserId); // TODO: Commented out Bmob related code
      // firstApplyQuery.count({ // TODO: Commented out Bmob related code
      //     success: function (count) {
      //         console.log(count);
      //         if (count === 1) {
      //             this.setData({
      //                 goldUser: true,
      //                 isfull: true
      //             });
      //         } else {
      //             uni.showToast({
      //                 title: '发送成功！',
      //                 icon: 'success',
      //                 duration: 2000
      //             });
      //         }
      //     },
      //     error: function (error) {}
      // });
    },

    callPhone: function () {
      uni.makePhoneCall({
        phoneNumber: this.data.telephone,
      })
    },

    collectClick: function () {},

    giveUp: function () {
      uni.showModal({
        title: '放弃后每日只可申请三次',
        content: '申请的次数直接决定能否找到更合适的家教',
        confirmText: '继续使用',
        cancelText: '确定放弃',
        confirmColor: '#fe4c40',
        cancelColor: '#bdbdbd',
        success: function (res) {
          if (res.confirm) {
            uni.navigateTo({})
          } else if (res.cancel) {
            this.setData({
              isfull: false,
              goldUser: false,
            })
          }
        },
      })
    },

    getMap: function () {
      uni.openLocation({
        latitude: this.data.latitude,
        longitude: this.data.longitude,
        name: this.data.addressName,
        address: this.data.addressDetail,
        scale: 28,
      })
    },

    hidebg() {
      console.log('占位：函数 hidebg 未声明')
    },

    share() {
      console.log('占位：函数 share 未声明')
    },
  },
}
</script>
<style>
@import './studentDetail.css';
</style>
