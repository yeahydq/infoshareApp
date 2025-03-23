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
    </view>

    <view class="aboutData">
      <image class="timeIcon" src="/static/image/time.png"></image>
      <view class="timeText">{{ teacher.modifyTime }}</view>

      <image class="collectIcon" src="/static/image/collectNumber.png"></image>
      <view class="collectText">{{ collectNumber }}</view>

      <image class="applyIcon" src="/static/image/applyNumber.png"></image>
      <view class="applyText">{{ applyNumber }}</view>
    </view>

    <!-- 薪资、教学范围 -->
    <view class="teachRange-salary">
      <view class="salary">
        <text class="gray-text">期望薪资 :</text>
        <text style="padding-left: 10rpx">{{ teacher.salary }}</text>
      </view>

      <view class="teachRange">
        <text class="gray-text">教学范围 :</text>
        <text style="padding-left: 10rpx">小学一年级 至 初中三年级</text>
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
    <view class="tip"></view>

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
        self_int: '',
      },
      photoUrl: '',
      imageArr: [],
      collectNumber: '',
      applyNumber: '',
      releaseId: '',
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
    //         var Teacher = Bmob.Object.extend('teacher');
    //         var query = new Bmob.Query(Teacher);
    //         query.get(releaseId, {
    //             success: function (results) {
    //                 var imageList = results.get('images');
    //                 var photoUrl = results.get('photo');
    //                 var imageArr = new Array();
    //                 for (var i = 0; i < imageList.length; i++) {
    //                     imageArr[i] = imageList[i].url;
    //                 }
    //                 this.setData({
    //                     teacher: results,
    //                     imageArr: imageArr,
    //                     releaseId: releaseId,
    //                     photoUrl: photoUrl
    //                 });
    //                 console.log(this.data.teacher);
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
    // var collect = Bmob.Object.extend('collect'); // TODO: Commented out Bmob related code
    // var queryCollect = new Bmob.Query(collect); // TODO: Commented out Bmob related code
    // queryCollect.equalTo('collectTeacher', this.data.releaseId); // TODO: Commented out Bmob related code
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
    // queryApply.equalTo('applyTeacherDetail', this.data.releaseId); // TODO: Commented out Bmob related code
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
  methods: {
    preview: function (e) {
      uni.previewImage({
        current: this.photoUrl,
        // 当前显示图片的http链接
        urls: [this.data.photoUrl], // 需要预览的图片http链接列表
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
            // var Teacher = Bmob.Object.extend('teacher'); // TODO: Commented out Bmob related code
            // var query = new Bmob.Query(Teacher); // TODO: Commented out Bmob related code
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
            //             success: function (resultTeacher) {
            //                 query.equalTo('objectId', releaseId);
            //                 query.destroyAll({
            //                     success: function () {
            //                         resultUser.set('release', '');
            //                         resultUser.set('register', false);
            //                         resultUser.save();
            //                         queryCollect.find({
            //                             success: function (resultCollect) {
            //                                 queryCollect.equalTo('collectTeacher', releaseId);
            //                                 queryCollect.destroyAll({
            //                                     success: function () {
            //                                         queryApply.find({
            //                                             success: function (resultApply) {
            //                                                 queryApply.equalTo('applyTeacher', releaseId);
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
        url: '../modifyTeacher/modifyTeacher',
      })
    },
  },
}
</script>
<style>
@import './releaseTeacher.css';
</style>
