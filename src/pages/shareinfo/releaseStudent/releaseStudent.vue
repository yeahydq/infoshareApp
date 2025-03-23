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
    </view>

    <!-- 地址、年级、基础 -->
    <view class="student-info">
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
        <text class="gray-text">学历 :</text>
        <text style="padding-left: 10rpx">{{ student.trait_limit }}</text>
      </view>
    </view>

    <view class="address" @tap="getMap">
      <view class="addressDetail" style="position: relative; float: left; margin-right: 100rpx">
        <view>{{ student.addressDetail }}</view>
      </view>
      <view class="gray-text" style="position: absolute; right: 5rpx; float: right">
        <image class="mapIcon" src="/static/image/mapText.png"></image>
      </view>
    </view>

    <!-- 备注 -->
    <view class="remark">
      <text class="remark-title">自我介绍:</text>
      <text class="remark-int">{{ student.remark }}</text>
    </view>

    <view class="bottom">
      <view class="operation-left" @tap="deleteRelease">
        <view class="operation">
          <image class="delete-icon" src="/static/image/deleteRelease.png"></image>
          <text class="operation-text">删除</text>
        </view>
      </view>
      <view class="operation-right" @tap="modifyRelease">
        <view class="operation">
          <image class="modify-icon" src="/static/image/modify.png"></image>
          <text class="operation-text">修改</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// var Bmob = require('../../utils/bmob.js'); // TODO: Commented out Bmob import
export default {
  data() {
    return {
      student: {
        courseEnglish: '',
        course: '',
        name: '',
        salary: '',
        grade: '',
        basic: '',
        frequency: '',
        sex: '',
        trait_limit: '',
        addressDetail: '',
        remark: '',
      },
      photoUrl: '',
    }
  },
  onLoad: function (options) {
    // var currentUser = Bmob.User.current(); // TODO: Commented out Bmob related code
    // var currentUserId = currentUser.id; // TODO: Commented out Bmob related code
    // var user = Bmob.Object.extend('_User'); // TODO: Commented out Bmob related code
    // var queryUser = new Bmob.Query(user); // TODO: Commented out Bmob related code
    // queryUser.get(currentUserId, { // TODO: Commented out Bmob related code
    //     success: function (result) {
    //         // 查询成功，调用get方法获取对应属性的值
    //         var releaseId = result.get('release');
    //         var Student = Bmob.Object.extend('student');
    //         var query = new Bmob.Query(Student);
    //         query.get(releaseId, {
    //             success: function (results) {
    //                 that.setData({
    //                     student: results
    //                 });
    //                 console.log(that.data.student);
    //             },
    //             error: function (object, error) {
    //                 // 查询失败
    //             }
    //         });
    //     },
    //     error: function (object, error) {
    //         // 查询失败
    //     }
    // });
  },
  methods: {
    preview: function (e) {
      uni.previewImage({
        current: this.photoUrl,
        // 当前显示图片的http链接
        urls: [this.photoUrl], // 需要预览的图片http链接列表
      })
    },

    deleteRelease: function () {
      uni.showModal({
        title: '确认删除？',
        content: '删除后将不能寻找家教',
        success: function (res) {
          if (res.confirm) {
            uni.showLoading({
              title: '清除数据中...',
            })
            // var currentUser = Bmob.User.current(); // TODO: Commented out Bmob related code
            // var currentUserId = currentUser.id; // TODO: Commented out Bmob related code
            // var Student = Bmob.Object.extend('student'); // TODO: Commented out Bmob related code
            // var query = new Bmob.Query(Student); // TODO: Commented out Bmob related code
            // var user = Bmob.Object.extend('_User'); // TODO: Commented out Bmob related code
            // var queryUser = new Bmob.Query(user); // TODO: Commented out Bmob related code
            // var collect = Bmob.Object.extend('collect'); // TODO: Commented out Bmob related code
            // var queryCollect = new Bmob.Query(collect); // TODO: Commented out Bmob related code
            // var apply = Bmob.Object.extend('apply'); // TODO: Commented out Bmob related code
            // var queryApply = new Bmob.Query(apply); // TODO: Commented out Bmob related code
            // queryUser.get(currentUserId, { // TODO: Commented out Bmob related code
            //     success: function (resultUser) {
            //         var releaseId = resultUser.get('release');
            //         query.find({
            //             success: function (resultStudent) {
            //                 query.equalTo('objectId', releaseId);
            //                 query.destroyAll({
            //                     success: function () {
            //                         resultUser.set('release', '');
            //                         resultUser.set('register', false);
            //                         resultUser.save();
            //                         queryCollect.find({
            //                             success: function (resultCollect) {
            //                                 queryCollect.equalTo('collectStudent', releaseId);
            //                                 queryCollect.destroyAll({
            //                                     success: function () {
            //                                         queryApply.find({
            //                                             success: function (resultApply) {
            //                                                 queryApply.equalTo('applyStudent', releaseId);
            //                                                 queryApply.destroyAll({
            //                                                     success: function () {
            //                                                         uni.hideLoading();
            //                                                         uni.showToast({
            //                                                             title: '已删除',
            //                                                             icon: 'success',
            //                                                             success: function () {
            //                                                                 setTimeout(function () {
            //                                                                     if (uni.reLaunch) {
            //                                                                         uni.reLaunch({
            //                                                                             url: '/pages/teacherList/teacherList'
            //                                                                         });
            //                                                                     } else {
            //                                                                         uni.switchTab({
            //                                                                             url: '/pages/teacherList/teacherList'
            //                                                                         });
            //                                                                     }
            //                                                                 }, 2000);
            //                                                             }
            //                                                         });
            //                                                     },
            //                                                     error: function (err) {
            //                                                         // 删除失败
            //                                                     }
            //                                                 });
            //                                             }
            //                                         });
            //                                     },
            //                                     error: function (err) {
            //                                         // 删除失败
            //                                     }
            //                                 });
            //                             },
            //                             error: function (error) {}
            //                         });
            //                     },
            //                     error: function (object, error) {}
            //                 });
            //             },
            //             error: function (object, error) {}
            //         });
            //     },
            //     error: function (object, error) {}
            // });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        },
      })
    },

    modifyRelease: function () {
      uni.navigateTo({
        url: '../modifyStudent/modifyStudent',
      })
    },

    getMap: function () {
      uni.openLocation({
        latitude: this.data.student.attributes.latitude,
        longitude: this.data.student.attributes.longitude,
        name: this.data.student.attributes.addressName,
        address: this.data.student.attributes.addressDetail,
        scale: 28,
      })
    },
  },
}
</script>
<style>
@import './releaseStudent.css';
</style>
