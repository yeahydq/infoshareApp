<template>
  <view class="page">
    <form @submit="registerSuccess" :report-submit="true">
      <view class="column">
        <view class="tip">补习科目：</view>
        <view class="inputColumn">
          <picker @change="courseChange" name="course" :value="courseIndex" :range="courseArray">
            <view class="picker">
              <text class="grey">{{ courseArray[courseIndex] }}</text>
            </view>
          </picker>
        </view>
        <image class="rightArrow" src="/static/image/rightArrow.png"></image>
      </view>

      <view class="column">
        <view class="tip">学生年级：</view>
        <view class="inputColumn">
          <picker
            mode="multiSelector"
            name="grade"
            @change="gradeChange"
            @columnchange="gradeColumnChange"
            :value="gradeIndex"
            :range="gradeArray"
          >
            <view class="gradePicker">
              <text class="grey">
                {{ gradeArray[0][gradeIndex[0]] }} {{ gradeArray[1][gradeIndex[1]] }}
              </text>
            </view>
          </picker>
        </view>
        <image class="rightArrow" src="/static/image/rightArrow.png"></image>
      </view>

      <view class="column">
        <view class="tip">学生基础：</view>
        <view class="inputColumn">
          <picker @change="basciChange" name="basic" :value="basicIndex" :range="basicArray">
            <view class="picker">
              <text class="grey">{{ basicArray[basicIndex] }}</text>
            </view>
          </picker>
        </view>
        <image class="rightArrow" src="/static/image/rightArrow.png"></image>
      </view>

      <view class="column">
        <view class="tip">教师资质：</view>
        <view class="inputColumn">
          <picker @change="traitChange" name="trait" :value="traitIndex" :range="traitArray">
            <view class="picker">
              <text class="grey">{{ traitArray[traitIndex] }}</text>
            </view>
          </picker>
        </view>
        <image class="rightArrow" src="/static/image/rightArrow.png"></image>
      </view>

      <view class="column">
        <view class="tip">教师性别：</view>
        <view class="inputColumn">
          <picker @change="sexChange" name="sex" :value="sexIndex" :range="sexArray">
            <view class="picker">
              <text class="grey">{{ sexArray[sexIndex] }}</text>
            </view>
          </picker>
        </view>
        <image class="rightArrow" src="/static/image/rightArrow.png"></image>
      </view>

      <view class="column">
        <view class="tip">补习次数：</view>
        <view class="inputColumn">
          <picker
            @change="frequencyChange"
            name="frequency"
            :value="frequencyIndex"
            :range="frequencyArray"
          >
            <view class="picker">
              <text class="grey">{{ frequencyArray[frequencyIndex] }}</text>
            </view>
          </picker>
        </view>
        <image class="rightArrow" src="/static/image/rightArrow.png"></image>
      </view>

      <view class="column">
        <view class="tip" style="margin: 0rpx 85rpx 0rpx 30rpx">课时费：</view>
        <view class="inputColumn">
          <input
            placeholder="如“XX元1小时”"
            :value="student.salary"
            name="salary"
            placeholder-style="color:#545454"
          />
        </view>
      </view>

      <view class="column">
        <view class="tip">您的电话：</view>
        <view class="inputColumn">
          <input
            type="number"
            :value="student.telephone"
            placeholder="用于教师及时和您沟通"
            name="telephone"
            placeholder-style="color:#545454"
          />
        </view>
      </view>

      <view class="column" style="border-bottom: 0">
        <text class="tip" style="margin-bottom: 0rpx">上课地点：</text>
        <text class="grey" style="margin-right: 20rpx" @tap="getAddress">点击获取地理位置</text>
        <image class="mapIcon" src="/static/image/map.png"></image>
        <image
          class="rightArrow"
          v-if="inputAddress == true"
          src="/static/image/inputRight.png"
        ></image>
        <image
          class="rightArrow"
          v-else-if="inputAddress == false"
          src="/static/image/inputError.png"
        ></image>
      </view>
      <view class="grey" style="margin: 0rpx 0rpx 0rpx 30rpx">{{ addressName }}</view>
      <view
        class="grey"
        style="
          padding: 20rpx 0rpx 0rpx 30rpx;
          padding-bottom: 20rpx;
          border-bottom: 20rpx solid #eee;
        "
      >
        {{ addressDetail }}
      </view>

      <view class="column" style="position: relative; height: 300rpx">
        <text class="tip" style="position: absolute; top: 10rpx; padding-top: 30rpx">
          其他备注：
        </text>
        <view
          class="inputRemark"
          style="position: absolute; top: 15rpx; padding-top: 30rpx; margin-left: 250rpx"
        >
          <textarea
            :value="student.remark"
            maxlength="500"
            name="remark"
            placeholder="请填写对老师更为详细的要求，以及您孩子的学习情况，和补习时间等"
            placeholder-style="color:#545454"
          />
        </view>
      </view>

      <button class="submitButton" formType="submit">提交</button>
    </form>
  </view>
</template>

<script>
// var Bmob = require('../../utils/bmob.js'); // TODO: Bmob integration
// var utils = require('../../utils/util.js'); // TODO: Bmob integration
export default {
  data() {
    return {
      student: {
        salary: '',
        telephone: '',
        remark: '',
      },

      courseArray: [
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
      courseEnglish: [
        'math',
        'english',
        'chinese',
        'physics',
        'chemistry',
        'biology',
        'politics',
        'history',
        'geography',
        'art',
        'piano',
        'Japanese',
        'korean',
      ],
      courseIndex: 0,
      basicArray: ['较差', '中下', '中等', '中上', '较好'],
      basicIndex: 0,
      levelArray: [
        ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
        ['一年级', '二年级', '三年级'],
        ['一年级', '二年级', '三年级'],
      ],
      gradeArray: [
        ['小学', '初中', '高中'],
        ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
      ],
      gradeIndex: [0, 0],
      gradeArr: [],
      traitArray: ['有能力即可', '211高校', '985高校', '研究生'],
      traitIndex: 0,
      sexArray: ['无要求', '男老师', '女老师'],
      sexIndex: 0,
      frequencyArray: [
        '一周一次',
        '一周两次',
        '一周三次',
        '一周四次',
        '一周五次',
        '一周六次',
        '一周七次',
      ],
      frequencyIndex: 0,
      addressName: '',
      addressDetail: '',
      latitude: '',
      longitude: '',
      inputAddress: false,
    }
  },
  onLoad: function (options) {
    // var currentUser = Bmob.User.current(); // TODO: Bmob integration
    // var currentUserId = currentUser.id; // TODO: Bmob integration
    // var student = Bmob.Object.extend('student'); // TODO: Bmob integration
    // var query = new Bmob.Query(student); // TODO: Bmob integration
    // query.equalTo('own', currentUserId); // TODO: Bmob integration
    // query.find({ // TODO: Bmob integration
    //     success: function (result) { // TODO: Bmob integration
    //         for (var i = 0; i < that.data.courseArray.length; i++) {
    //             if (result[0].get('course') == that.data.courseArray[i]) {
    //                 var courseIndex = i;
    //             }
    //         }
    //         var gradeIndex = result[0].get('gradeIndex');
    //         for (var i = 0; i < 3; i++) {
    //             if (gradeIndex[0] == i) {
    //                 that.setData({
    //                     gradeArray: [['小学', '初中', '高中'], that.data.levelArray[i]]
    //                 });
    //             }
    //         }
    //         for (var i = 0; i < that.data.basicArray.length; i++) {
    //             if (result[0].get('basic') == that.data.basicArray[i]) {
    //                 var basicIndex = i;
    //             }
    //         }
    //         for (var i = 0; i < that.data.traitArray.length; i++) {
    //             if (result[0].get('trait_limit') == that.data.traitArray[i]) {
    //                 var traitIndex = i;
    //             }
    //         }
    //         for (var i = 0; i < that.data.sexArray.length; i++) {
    //             if (result[0].get('sex') == that.data.sexArray[i]) {
    //                 var sexIndex = i;
    //             }
    //         }
    //         for (var i = 0; i < that.data.frequencyArray.length; i++) {
    //             if (result[0].get('frequency') == that.data.frequencyArray[i]) {
    //                 var frequencyIndex = i;
    //             }
    //         }
    //         that.setData({
    //             student: result[0],
    //             courseIndex: courseIndex,
    //             gradeIndex: gradeIndex,
    //             basicIndex: basicIndex,
    //             traitIndex: traitIndex,
    //             sexIndex: sexIndex,
    //             frequencyIndex: frequencyIndex,
    //             addressName: result[0].attributes.addressName,
    //             addressDetail: result[0].attributes.addressDetail,
    //             latitude: result[0].attributes.latitude,
    //             longitude: result[0].attributes.longitude
    //         });
    //         console.log(that.data.student);
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
    courseChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        courseIndex: e.detail.value,
      })
    },

    gradeChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      const A = this.gradeArray[0][this.gradeIndex[0]]
      const B = this.gradeArray[1][this.gradeIndex[1]]
      this.setData({
        gradeIndex: e.detail.value,
        gradeArr: [A, B],
      })
      console.log(this.gradeArr)
    },

    gradeColumnChange: function (e) {
      console.log(this.levelArray[0])
      console.log(this.levelArray[1])
      console.log(this.levelArray[2])
      console.log('修改的列为', e.detail.column, '，值为', e.detail.value)
      const data = {
        gradeArray: this.gradeArray,
        gradeIndex: this.gradeIndex,
      }
      data.gradeIndex[e.detail.column] = e.detail.value
      switch (e.detail.column) {
        case 0:
          switch (data.gradeIndex[0]) {
            case 0:
              data.gradeArray[1] = this.levelArray[0]
              break
            case 1:
              data.gradeArray[1] = this.levelArray[1]
              break
            case 2:
              data.gradeArray[1] = this.levelArray[2]
              break
          }
          data.gradeIndex[1] = 0
          break
      }
      this.setData(data)
    },

    basciChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        basicIndex: e.detail.value,
      })
    },

    traitChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        traitIndex: e.detail.value,
      })
    },

    sexChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        sexIndex: e.detail.value,
      })
    },

    frequencyChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        frequencyIndex: e.detail.value,
      })
    },

    bindTextAreaBlur: function (e) {
      console.log(e.detail.value)
    },

    registerSuccess: function (e) {
      // var nowTime = utils.getTime(); // TODO: Bmob integration
      // var course = this.courseArray[this.courseIndex]; // TODO: Bmob integration
      // var courseEnglish; // TODO: Bmob integration
      // for (var i = 0; i < this.courseEnglish.length; i++) { // TODO: Bmob integration
      //     if (course == this.courseArray[i]) { // TODO: Bmob integration
      //         courseEnglish = this.courseEnglish[i]; // TODO: Bmob integration
      //     }
      // }
      // if (this.gradeArr.length == 0) { // TODO: Bmob integration
      //     var grade = ['小学', '一年级']; // TODO: Bmob integration
      // } else {
      //     var grade = this.gradeArr; // TODO: Bmob integration
      // }
      // var gradeIndex = this.gradeIndex; // TODO: Bmob integration
      // var basic = this.basicArray[this.basicIndex]; // TODO: Bmob integration
      // var trait = this.traitArray[this.traitIndex]; // TODO: Bmob integration
      // var sex = this.sexArray[this.sexIndex]; // TODO: Bmob integration
      // var frequency = this.frequencyArray[this.frequencyIndex]; // TODO: Bmob integration
      // var salary = e.detail.value.salary; // TODO: Bmob integration
      // var telephone = e.detail.value.telephone; // TODO: Bmob integration
      // var remark = e.detail.value.remark; // TODO: Bmob integration
      // var addressName = this.addressName; // TODO: Bmob integration
      // var addressDetail = this.addressDetail; // TODO: Bmob integration
      // var latitude = this.latitude; // TODO: Bmob integration
      // var longitude = this.longitude; // TODO: Bmob integration
      // if (!salary) { // TODO: Bmob integration
      //     uni.showToast({
      //         title: '请填写课时费（最终可与教师商议）',
      //         image: '../../image/warn.png',
      //         duration: 2000
      //     });
      // } else if (!telephone) { // TODO: Bmob integration
      //     uni.showToast({
      //         title: '请填写您的电话',
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
      //     var Student = Bmob.Object.extend('student'); // TODO: Bmob integration
      //     var queryStudent = new Bmob.Query(Student); // TODO: Bmob integration
      //     var currentUser = Bmob.User.current(); // TODO: Bmob integration
      //     var currentUserId = currentUser.id; // TODO: Bmob integration
      //     var user = Bmob.Object.extend('_User'); // TODO: Bmob integration
      //     var queryUser = new Bmob.Query(user); // TODO: Bmob integration
      //     queryUser.get(currentUserId, { // TODO: Bmob integration
      //         success: function (result) { // TODO: Bmob integration
      //             var releaseId = result.get('release'); // TODO: Bmob integration
      //             queryStudent.get(releaseId, { // TODO: Bmob integration
      //                 success: function (results) { // TODO: Bmob integration
      //                     results.set('course', course); // TODO: Bmob integration
      //                     results.set('gradeIndex', gradeIndex); // TODO: Bmob integration
      //                     results.set('grade', grade); // TODO: Bmob integration
      //                     results.set('basic', basic); // TODO: Bmob integration
      //                     results.set('trait_limit', trait); // TODO: Bmob integration
      //                     results.set('frequency', frequency); // TODO: Bmob integration
      //                     results.set('salary', salary); // TODO: Bmob integration
      //                     results.set('telephone', telephone); // TODO: Bmob integration
      //                     results.set('remark', remark); // TODO: Bmob integration
      //                     results.set('courseEnglish', courseEnglish); // TODO: Bmob integration
      //                     results.set('remark', remark); // TODO: Bmob integration
      //                     results.set('modifyTime', nowTime); // TODO: Bmob integration
      //                     results.set('addressName', addressName); // TODO: Bmob integration
      //                     results.set('addressDetail', addressDetail); // TODO: Bmob integration
      //                     results.set('latitude', latitude); // TODO: Bmob integration
      //                     results.set('longitude', longitude); // TODO: Bmob integration
      //                     results.save(); // TODO: Bmob integration
      //                     uni.showToast({
      //                         title: '修改成功',
      //                         icon: 'success',
      //                         success: function () {
      //                             setTimeout(function () {
      //                                 uni.navigateTo({
      //                                     url: '../releaseStudent/releaseStudent'
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

    getAddress: function () {
      uni.chooseLocation({
        success: function (res) {
          console.log(res)
          this.setData({
            addressName: res.name,
            addressDetail: res.address,
            latitude: res.latitude,
            longitude: res.longitude,
            inputAddress: true,
          })
        },
        fail: function () {
          uni.getSetting({
            success: (res) => {
              console.log(res)
              if (!res.authSetting['scope.userLocation']) {
                uni.showModal({
                  title: '警告',
                  content:
                    '若不授权您的地理信息，将无法正常使用蜂鸟家教，因为教师需要权衡到达上课地点的距离，这是优秀教师是否愿意上课的重要主观因素。\n仅获取您的大致地址，绝不会泄露您的隐私',
                  confirmText: '授权',
                  confirmColor: '#2ba945',
                  cancelColor: '#bdbdbd',
                  success: function (res) {
                    if (res.confirm) {
                      uni.openSetting({
                        success: (res) => {
                          res.authSetting = {
                            'scope.userLocation': true,
                          }
                        },
                      })
                    } else if (res.cancel) {
                      // Add appropriate code or comment explaining why the block is empty
                    }
                  },
                })
              }
            },
          })
        },
      })
    },
  },
}
</script>
<style>
@import './modifyStudent.css';
</style>
