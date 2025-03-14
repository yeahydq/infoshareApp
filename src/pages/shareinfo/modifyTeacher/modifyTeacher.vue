<template>
  <view class="page">
    <form @submit="registerSuccess" :report-submit="true">
      <view class="column-photo">
        <view class="tip-photo">您的照片：</view>
        <image class="photo" :src="photo" @tap="uploadPhoto" />
      </view>

      <view class="column">
        <view class="tip">您的电话：</view>
        <view class="inputColumn">
          <input
            type="number"
            :value="teacher.telephone"
            placeholder="用于家长及时和您沟通"
            name="telephone"
            placeholder-style="color:#545454"
          />
        </view>
      </view>

      <view class="column">
        <view class="tip">教育经历：</view>
        <view class="inputColumn">
          <picker
            @change="universityChange"
            name="university"
            :value="universityIndex"
            :range="universityArray"
          >
            <view class="picker">
              <text class="grey">{{ universityArray[universityIndex] }}</text>
            </view>
          </picker>
        </view>
        <image class="rightArrow" src="/static/image/rightArrow.png"></image>
      </view>

      <view class="column">
        <view class="tip">您的学历：</view>
        <view class="inputColumn">
          <picker @change="degreeChange" name="degree" :value="degreeIndex" :range="degreeArray">
            <view class="picker">
              <text class="grey">{{ degreeArray[degreeIndex] }}</text>
            </view>
          </picker>
        </view>
        <image class="rightArrow" src="/static/image/rightArrow.png"></image>
      </view>

      <view class="column">
        <view class="tip">您的专业：</view>
        <view class="inputColumn">
          <input
            placeholder="本科或研究生专业"
            :value="teacher.major"
            name="major"
            placeholder-style="color:#545454"
          />
        </view>
      </view>

      <view class="column" style="border-bottom: 20rpx solid #eee">
        <view class="tip">期望薪资：</view>
        <view class="inputColumn">
          <input
            placeholder="如“XX元1小时”"
            :value="teacher.salary"
            name="salary"
            placeholder-style="color:#545454"
          />
        </view>
      </view>

      <view class="tip-check">请选择您可教学的科目，最多三项</view>
      <view class="course-check" style="padding-bottom: 20rpx; border-bottom: 20rpx solid #eee">
        <checkbox-group name="course" @change="courseboxChange">
          <view class="checkbox" v-for="(item, index) in course" :key="index">
            <label class="checkbox" v-for="(item, index1) in item" :key="index1">
              <checkbox color="#fe4c40" :value="item.name" :checked="item.checked" />

              <text class="grey">{{ item.value }}</text>
            </label>
          </view>
        </checkbox-group>
      </view>

      <view
        class="column"
        style="position: relative; height: 300rpx; border-bottom: 20rpx solid #eee"
      >
        <text class="tip" style="position: absolute; top: 10rpx; padding-top: 30rpx">
          其他备注：
        </text>
        <view
          class="inputRemark"
          style="position: absolute; top: 15rpx; padding-top: 30rpx; margin-left: 250rpx"
        >
          <textarea
            :value="teacher.self_int"
            maxlength="500"
            name="remark"
            placeholder="请填写对老师更为详细的要求，以及您孩子的学习情况，和补习时间等"
            placeholder-style="color:#545454"
          />
        </view>
      </view>

      <view class="image">请上传相关证书，若无则可不上传</view>
      <view class="gallery">
        <view class="item" v-for="(item, index) in urlArr" :key="index">
          <image
            class="thumb"
            :data-current="item"
            :style="'width: ' + 2 * image_width + 'rpx; height: ' + 2 * image_width + 'rpx'"
            :src="item.url"
            @tap="previewImage"
          />

          <image
            class="delete"
            src="/static/image/deleteImage.png"
            :data-index="index"
            @tap="deleteFun"
          ></image>
        </view>
        <image
          class="thumb"
          :style="'width: ' + 2 * image_width + 'rpx; height: ' + 2 * image_width + 'rpx'"
          src="/static/image/upload.png"
          @tap="upImg"
        />
      </view>

      <button class="submitButton" formType="submit">确定修改</button>
    </form>
  </view>
</template>

<script>
// var Bmob = require('../../utils/bmob.js'); // TODO: Bmob integration
// var utils = require('../../utils/util.js'); // TODO: Bmob integration
export default {
  data() {
    return {
      teacher: {
        telephone: '',
        major: '',
        salary: '',
        self_int: '',
      },
      universityArray: [
        '中国海洋大学',
        '中国石油大学',
        '青岛大学',
        '青岛理工大学',
        '青岛科技大学',
        '山东科技大学',
      ],
      universityIndex: 0,
      trait: '',
      degreeArray: ['本科', '研究生'],
      degreeIndex: 0,
      course: [
        [
          {
            name: '数学',
            value: '数学',
          },
          {
            name: '英语',
            value: '英语',
          },
          {
            name: '语文',
            value: '语文',
          },
          {
            name: '物理',
            value: '物理',
          },
        ],
        [
          {
            name: '化学',
            value: '化学',
          },
          {
            name: '生物',
            value: '生物',
          },
          {
            name: '历史',
            value: '历史',
          },
          {
            name: '地理',
            value: '地理',
          },
        ],
        [
          {
            name: '美术',
            value: '美术',
          },
          {
            name: '钢琴',
            value: '钢琴',
          },
          {
            name: '日语',
            value: '日语',
          },
          {
            name: '韩语',
            value: '韩语',
          },
        ],
      ],
      courseArr: [],
      photo: '',
      image_width: getApp().globalData.screenWidth / 4 - 10,
      loading: false,
      images: [],
      urlArr: [],
    }
  },
  onLoad: function (options) {
    // var currentUser = Bmob.User.current(); // TODO: Bmob integration
    // var currentUserId = currentUser.id; // TODO: Bmob integration
    // var Teacher = Bmob.Object.extend('teacher'); // TODO: Bmob integration
    // var query = new Bmob.Query(Teacher); // TODO: Bmob integration
    // query.equalTo('own', currentUserId); // TODO: Bmob integration
    // query.find({ // TODO: Bmob integration
    //     success: function (result) { // TODO: Bmob integration
    //         for (var i = 0; i < that.data.universityArray.length; i++) {
    //             if (result[0].get('university') == that.data.universityArray[i]) {
    //                 var universityIndex = i;
    //             }
    //         }
    //         if (result[0].get('degree') == '本科') {
    //             var degreeIndex = 0;
    //         } else if (result[0].get('degree') == '研究生') {
    //             var degreeIndex = 1;
    //         }
    //         that.setData({
    //             teacher: result[0],
    //             photo: result[0].get('photo'),
    //             urlArr: result[0].get('images'),
    //             universityIndex: universityIndex,
    //             degreeIndex: degreeIndex
    //         });
    //         console.log(that.data.teacher);
    //     },
    //     error: function (error) { // TODO: Bmob integration
    //         uni.showToast({
    //             title: '网络错误',
    //             image: '../../image/warn.png',
    //             duration: 2000
    //         });
    //     }
    // });
  },
  methods: {
    universityChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        universityIndex: e.detail.value,
      })
    },

    degreeChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        degreeIndex: e.detail.value,
      })
    },

    courseboxChange: function (e) {
      const courseArr = e.detail.value
      console.log('checkbox发生change事件，携带value值为：', e.detail.value)
      if (courseArr.length > 3) {
        uni.showToast({
          title: '最多只可选择三项教学科目',
          image: '../../image/warn.png',
          duration: 2000,
        })
      }
      this.setData({
        courseArr,
      })
    },

    registerSuccess: function (e) {
      // var nowTime = utils.getTime(); // TODO: Bmob integration
      // var photo = this.photo; // TODO: Bmob integration
      // var telephone = e.detail.value.telephone; // TODO: Bmob integration
      // var major = e.detail.value.major; // TODO: Bmob integration
      // var salary = e.detail.value.salary; // TODO: Bmob integration
      // var remark = e.detail.value.remark; // TODO: Bmob integration
      // var university = this.universityArray[this.universityIndex]; // TODO: Bmob integration
      // var degree = this.degreeArray[this.degreeIndex]; // TODO: Bmob integration
      // var course = this.courseArr; // TODO: Bmob integration
      // if (university == '中国海洋大学') { // TODO: Bmob integration
      //     this.setData({
      //         trait: '985'
      //     });
      // } else if (university == '中国石油大学') { // TODO: Bmob integration
      //     this.setData({
      //         trait: '211'
      //     });
      // } else if ((university == '中国海洋大学' && university == '中国石油大学') || degree == '研究生') { // TODO: Bmob integration
      //     this.setData({
      //         trait: '研究生'
      //     });
      // } else if (university != '中国海洋大学' || university != '中国石油大学' || degree != '研究生') { // TODO: Bmob integration
      //     this.setData({
      //         trait: 'null'
      //     });
      // }
      // if (!major) { // TODO: Bmob integration
      //     uni.showToast({
      //         title: '请填写您的专业',
      //         image: '../../image/warn.png',
      //         duration: 2000
      //     });
      // } else if (!telephone) { // TODO: Bmob integration
      //     uni.showToast({
      //         title: '请填写您的电话',
      //         image: '../../image/warn.png',
      //         duration: 2000
      //     });
      // } else if (!salary) { // TODO: Bmob integration
      //     uni.showToast({
      //         title: '请填写您的期望薪资',
      //         image: '../../image/warn.png',
      //         duration: 2000
      //     });
      // } else if (course.length > 3) { // TODO: Bmob integration
      //     uni.showToast({
      //         title: '最多只可选择三项教学科目',
      //         image: '../../image/warn.png',
      //         duration: 2000
      //     });
      // } else if (course.length == 0) { // TODO: Bmob integration
      //     uni.showToast({
      //         title: '请选择您可教学的科目',
      //         image: '../../image/warn.png',
      //         duration: 2000
      //     });
      // } else if (!remark) { // TODO: Bmob integration
      //     uni.showToast({
      //         title: '请尽量详细填写你的备注',
      //         image: '../../image/warn.png',
      //         duration: 2000
      //     });
      // } else {
      //     var Teacher = Bmob.Object.extend('teacher'); // TODO: Bmob integration
      //     var queryTeacher = new Bmob.Query(Teacher); // TODO: Bmob integration
      //     var currentUser = Bmob.User.current(); // TODO: Bmob integration
      //     var currentUserId = currentUser.id; // TODO: Bmob integration
      //     var user = Bmob.Object.extend('_User'); // TODO: Bmob integration
      //     var queryUser = new Bmob.Query(user); // TODO: Bmob integration
      //     queryUser.get(currentUserId, { // TODO: Bmob integration
      //         success: function (result) { // TODO: Bmob integration
      //             var releaseId = result.get('release'); // TODO: Bmob integration
      //             queryTeacher.get(releaseId, { // TODO: Bmob integration
      //                 success: function (results) { // TODO: Bmob integration
      //                     results.set('major', major); // TODO: Bmob integration
      //                     results.set('salary', salary); // TODO: Bmob integration
      //                     results.set('telephone', telephone); // TODO: Bmob integration
      //                     results.set('self_int', remark); // TODO: Bmob integration
      //                     results.set('university', university); // TODO: Bmob integration
      //                     results.set('degree', degree); // TODO: Bmob integration
      //                     results.set('teach_course', course); // TODO: Bmob integration
      //                     results.set('photo', photo); // TODO: Bmob integration
      //                     results.set('images', that.data.urlArr); // TODO: Bmob integration
      //                     results.set('trait', that.data.trait); // TODO: Bmob integration
      //                     results.set('modifyTime', nowTime); // TODO: Bmob integration
      //                     results.save(); // TODO: Bmob integration
      //                     uni.showToast({
      //                         title: '修改成功',
      //                         icon: 'success',
      //                         success: function () {
      //                             setTimeout(function () {
      //                                 uni.redirectTo({
      //                                     url: '../releaseTeacher/releaseTeacher'
      //                                 });
      //                             }, 2000);
      //                         }
      //                     });
      //                 },
      //                 error: function (object, error) { // TODO: Bmob integration
      //                     uni.showToast({
      //                         title: '网络错误',
      //                         image: '../../image/warn.png',
      //                         duration: 2000
      //                     });
      //                 }
      //             });
      //         },
      //         error: function (object, error) { // TODO: Bmob integration
      //             uni.showToast({
      //                 title: '网络错误',
      //                 image: '../../image/warn.png',
      //                 duration: 2000
      //             });
      //         }
      //     });
      // }
    },

    uploadPhoto: function () {
      uni.chooseImage({
        count: 1,
        // 默认9
        sizeType: ['compressed'],
        // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'],
        // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          uni.showNavigationBarLoading()
          this.setData({
            loading: false,
          })
          const Photo = this.photo
          const tempFilePaths = res.tempFilePaths
          console.log(tempFilePaths)
          const newDate = new Date()
          const newDateStr = newDate.toLocaleDateString()
          let extension = /\.([^.]*)$/.exec(tempFilePaths)
          if (extension) {
            extension = extension[1].toLowerCase()
          }
          const name = newDateStr + '.' + extension // 上传的图片的别名
          const file = new Bmob.File(name, tempFilePaths)
          file.save().then(
            function (res) {
              uni.hideNavigationBarLoading()
              const url = res.url()
              console.log(url)
              showPic(url, this)
            },
            function (error) {
              console.error(error)
            },
          )
        },
      })
    },

    upImg: function () {
      uni.chooseImage({
        count: 9,
        // 默认9
        sizeType: ['compressed'],
        // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'],
        // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          uni.showNavigationBarLoading()
          this.setData({
            loading: false,
          })
          const urlArr = this.urlArr
          // var urlArr={};
          const tempFilePaths = res.tempFilePaths
          const images = this.images
          this.setData({
            images: images.concat(tempFilePaths),
          })
          const imgLength = tempFilePaths.length
          if (imgLength > 0) {
            const newDate = new Date()
            const newDateStr = newDate.toLocaleDateString()
            let j = 0
            // 如果想顺序变更，可以for (var i = imgLength; i > 0; i--)
            for (let i = 0; i < imgLength; i++) {
              const tempFilePath = [tempFilePaths[i]]
              let extension = /\.([^.]*)$/.exec(tempFilePath[0])
              if (extension) {
                extension = extension[1].toLowerCase()
              }
              const name = newDateStr + '.' + extension // 上传的图片的别名
              const file = new Bmob.File(name, tempFilePath)
              file.save().then(
                function (res) {
                  uni.hideNavigationBarLoading()
                  const url = res.url()
                  console.log('第' + i + '张Url' + url)
                  urlArr.push({
                    url,
                  })
                  j++
                  console.log(j, imgLength)
                  // if (imgLength == j) {
                  //   console.log(imgLength, urlArr);
                  // 如果担心网络延时问题，可以去掉这几行注释，就是全部上传完成后显示。
                  // showPic(urlArr, this)
                  this.setData({
                    urlArr,
                    loading: true,
                  })
                  // }
                },
                function (error) {
                  console.error(error)
                },
              )
            }
          }
        },
      })
      console.log(this.urlArr)
    },

    deleteFun: function (e) {
      // 获取本地显示的图片数组
      const index = e.currentTarget.dataset.index
      const images = this.data.images
      const urlArr = this.data.urlArr
      urlArr.splice(index, 1)
      images.splice(index, 1)
      this.setData({
        images,
        urlArr,
      })
      console.log(this.data.urlArr)
    },

    previewImage() {
      console.log('占位：函数 previewImage 未声明')
    },
  },
}
function showPic(url, t) {
  t.setData({
    loading: true,
    photo: url,
  })
}
</script>
<style>
@import './modifyTeacher.css';
</style>
