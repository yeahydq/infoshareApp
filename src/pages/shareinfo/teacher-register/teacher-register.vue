<template>
  <view class="page">
    <view class="chose">
      <view class="become-teacher">我是老师</view>
      <view class="find-teacher" @tap="jumpStudent">我是家长</view>
    </view>

    <form @submit="registerSuccess" :report-submit="true">
      <view class="column-photo">
        <view class="tip-photo">您的照片</view>
        <image class="photo" :src="photo" @tap="uploadPhoto" />

        <image
          class="rightArrowPhoto"
          v-if="inputName == true"
          src="/static/image/inputRight.png"
        ></image>
        <image
          class="rightArrowPhoto"
          v-else-if="inputName == false"
          src="/static/image/inputError.png"
        ></image>
      </view>

      <view class="tip-photo">基本信息</view>

      <view class="column">
        <image class="registerIcon" src="/static/registerIcon/name.png"></image>
        <view class="tip">您的姓氏：</view>
        <view class="inputColumn">
          <input
            :value="inputText"
            name="teacherName"
            maxlength="3"
            @blur="teacherInput"
            placeholder="为保护教师隐私，仅输入姓氏即可"
            placeholder-style="color:#969696;  font-size: 25rpx;"
          />
        </view>
        <image
          class="rightArrow"
          v-if="inputName == true"
          src="/static/image/inputRight.png"
        ></image>
        <image
          class="rightArrow"
          v-else-if="inputName == false"
          src="/static/image/inputError.png"
        ></image>
      </view>

      <view class="column">
        <image class="registerIcon" src="/static/registerIcon/telephone.png"></image>
        <view class="tip">您的电话：</view>
        <view class="inputColumn">
          <input
            type="number"
            @blur="inputTelephoneRight"
            placeholder="用于家长及时和您沟通"
            name="telephone"
            placeholder-style="color:#969696"
          />
        </view>
        <image
          class="rightArrow"
          v-if="inputTelephone == true"
          src="/static/image/inputRight.png"
        ></image>
        <image
          class="rightArrow"
          v-else-if="inputTelephone == false"
          src="/static/image/inputError.png"
        ></image>
      </view>

      <view class="column">
        <image class="registerIcon" src="/static/registerIcon/sex.png"></image>
        <view class="tip">您的性别：</view>
        <view class="inputColumn">
          <picker @change="sexChange" name="sex" :value="sexIndex" :range="sexArray">
            <view class="picker">
              <text class="grey">{{ sex }}</text>
            </view>
          </picker>
        </view>
        <image class="rightArrow" src="/static/image/rightArrow.png"></image>
        <image
          class="rightArrow"
          v-if="inputSex == true"
          src="/static/image/inputRight.png"
        ></image>
        <image
          class="rightArrow"
          v-else-if="inputSex == false"
          src="/static/image/inputError.png"
        ></image>
      </view>

      <view class="column">
        <image class="registerIcon" src="/static/registerIcon/university.png"></image>
        <view class="tip">教育经历：</view>
        <view class="inputColumn">
          <picker
            @change="universityChange"
            name="university"
            :value="universityIndex"
            :range="universityArray"
          >
            <view class="picker">
              <text class="grey">{{ university }}</text>
            </view>
          </picker>
        </view>
        <image class="rightArrow" src="/static/image/rightArrow.png"></image>
        <image
          class="rightArrow"
          v-if="inputUniversity == true"
          src="/static/image/inputRight.png"
        ></image>
        <image
          class="rightArrow"
          v-else-if="inputUniversity == false"
          src="/static/image/inputError.png"
        ></image>
      </view>

      <view class="column">
        <image class="registerIcon" src="/static/registerIcon/degree.png"></image>
        <view class="tip">您的学历：</view>
        <view class="inputColumn">
          <picker @change="degreeChange" name="degree" :value="degreeIndex" :range="degreeArray">
            <view class="picker">
              <text class="grey">{{ degree }}</text>
            </view>
          </picker>
        </view>
        <image class="rightArrow" src="/static/image/rightArrow.png"></image>
        <image
          class="rightArrow"
          v-if="inputDegree == true"
          src="/static/image/inputRight.png"
        ></image>
        <image
          class="rightArrow"
          v-else-if="inputDegree == false"
          src="/static/image/inputError.png"
        ></image>
      </view>

      <view class="column">
        <image class="registerIcon" src="/static/registerIcon/major.png"></image>
        <view class="tip">您的专业：</view>
        <view class="inputColumn">
          <input
            placeholder="本科或研究生专业"
            @blur="inputMajorRight"
            name="major"
            placeholder-style="color:#969696"
          />
        </view>
        <image
          class="rightArrow"
          v-if="inputMajor == true"
          src="/static/image/inputRight.png"
        ></image>
        <image
          class="rightArrow"
          v-else-if="inputMajor == false"
          src="/static/image/inputError.png"
        ></image>
      </view>

      <view class="column">
        <image class="registerIcon" src="/static/registerIcon/score.png"></image>
        <view class="tip">高考分数：</view>
        <view class="inputColumn">
          <input
            type="number"
            placeholder="请填写您的高考分数"
            @blur="inputScoreRight"
            name="teacherScore"
            placeholder-style="color:#969696"
          />
        </view>
        <image
          class="rightArrow"
          v-if="inputScore == true"
          src="/static/image/inputRight.png"
        ></image>
        <image
          class="rightArrow"
          v-else-if="inputScore == false"
          src="/static/image/inputError.png"
        ></image>
      </view>

      <view class="column">
        <image class="registerIcon" src="/static/registerIcon/salary.png"></image>
        <view class="tip">期望薪资：</view>
        <view class="inputColumn">
          <input
            placeholder="如“XX元1小时”"
            @blur="inputSalaryRight"
            name="salary"
            placeholder-style="color:#969696"
          />
        </view>
        <image
          class="rightArrow"
          v-if="inputSalary == true"
          src="/static/image/inputRight.png"
        ></image>
        <image
          class="rightArrow"
          v-else-if="inputSalary == false"
          src="/static/image/inputError.png"
        ></image>
      </view>

      <view class="tip-photo" style="margin: 40rpx 0rpx 40rpx 0rpx">教学科目</view>
      <view class="course-check" style="padding-bottom: 20rpx">
        <view
          class="courseItem"
          :data-index="index"
          @tap="choseCourseFun"
          :style="
            item.chose == 'true'
              ? 'background-color: #fe4c40;border: 1rpx solid #fe4c40; color:#fff'
              : ' background-color: #fff;  border: 1rpx solid #c6c4c4;'
          "
          v-for="(item, index) in courseList"
          :key="index"
        >
          <view
            :style="'width: ' + 2 * image_width + 'rpx;padding-top:15rpx;padding-bottom:15rpx;'"
          >
            {{ item.name }}
          </view>
        </view>
      </view>

      <view class="tip-photo" style="margin: 40rpx 0rpx 40rpx 0rpx">教学特点</view>
      <view class="course-check" style="padding-bottom: 20rpx">
        <view
          class="courseItem"
          :data-index="index"
          @tap="choseTraitFun"
          :style="
            item.chose == 'true'
              ? 'background-color: #fe4c40;border: 1rpx solid #fe4c40; color:#fff'
              : ' background-color: #fff;  border: 1rpx solid #c6c4c4;'
          "
          v-for="(item, index) in traitList"
          :key="index"
        >
          <view style="padding: 15rpx">{{ item.name }}</view>
        </view>
      </view>

      <view class="tip-photo" style="margin: 40rpx 0rpx 40rpx 0rpx">其他备注</view>

      <view
        class="column"
        style="position: relative; height: 300rpx; border: 1rpx dashed #fe4c40; border-radius: 0rpx"
      >
        <view class="inputRemark" style="position: absolute; top: 15rpx; padding-top: 30rpx">
          <textarea
            maxlength="500"
            name="remark"
            placeholder="请填写对老师更为详细的要求，以及您孩子的学习情况，和补习时间等"
            placeholder-style="color:#969696"
          />
        </view>
      </view>

      <view class="tip-photo" style="margin: 40rpx 0rpx 40rpx 0rpx">相关证书</view>
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

      <button class="submitButton" formType="submit">提交</button>
    </form>
  </view>
</template>

<script>
// var Bmob = require('../../utils/bmob.js');
// import { getTime } from '@service/util/util'

export default {
  data() {
    return {
      inputText: '',
      sexArray: ['男老师', '女老师'],
      sexIndex: 0,
      sex: '请选择您的性别',
      universityArray: [
        '中国海洋大学',
        '中国石油大学',
        '青岛大学',
        '青岛理工大学',
        '青岛科技大学',
        '山东科技大学',
      ],
      universityIndex: 0,
      university: '请选择您的学校',
      trait: '',
      degreeArray: ['本科', '研究生'],
      degreeIndex: 0,
      degree: '请选择您的学历',
      courseList: [
        {
          name: '数学',
          chose: 'false',
        },
        {
          name: '英语',
          chose: 'false',
        },
        {
          name: '语文',
          chose: 'false',
        },
        {
          name: '物理',
          chose: 'false',
        },
        {
          name: '化学',
          chose: 'false',
        },
        {
          name: '生物',
          chose: 'false',
        },
        {
          name: '历史',
          chose: 'false',
        },
        {
          name: '地理',
          chose: 'false',
        },
        {
          name: '美术',
          chose: 'false',
        },
        {
          name: '钢琴',
          chose: 'false',
        },
        {
          name: '日语',
          chose: 'false',
        },
        {
          name: '韩语',
          chose: 'false',
        },
      ],
      // ["数学", "英语", "语文", "物理", "化学", "生物", "历史", "地理", "美术", "钢琴", "日语", "韩语"],
      // id: null,
      choseCourse: [],
      traitList: [
        {
          name: '教学经验丰富',
          chose: 'false',
        },
        {
          name: '有成功案例',
          chose: 'false',
        },
        {
          name: '提分快',
          chose: 'false',
        },
        {
          name: '注重基础',
          chose: 'false',
        },
        {
          name: '严厉',
          chose: 'false',
        },
        {
          name: '有耐心',
          chose: 'false',
        },
        {
          name: '和学生交朋友',
          chose: 'false',
        },
        {
          name: '心理辅导',
          chose: 'false',
        },
        {
          name: '幽默风趣',
          chose: 'false',
        },
        {
          name: '沟通能力强',
          chose: 'false',
        },
        {
          name: '备课详细',
          chose: 'false',
        },
        {
          name: '引导学生自主学习',
          chose: 'false',
        },
        {
          name: '善于鼓励',
          chose: 'false',
        },
      ],
      choseTrait: [],
      photo: '/static/image/photo111.png',
      loading: true,
      image_width: getApp().globalData.screenWidth / 4 - 10,
      images: [],
      urlArr: [],
      inputName: null,
      inputTelephone: null,
      inputSex: null,
      inputUniversity: null,
      inputDegree: null,
      inputMajor: null,
      inputScore: null,
      inputSalary: null,
    }
  },
  onLoad: function () {
    uni.showModal({
      title: '您的电话不会公开显示',
      content: '为保护您的隐私，仅当您主动向家长发送申请时，对方才可看到您的电话',
      showCancel: false,
      confirmText: '我知道啦',
      success: function (res) {
        if (res.confirm) {
          // This block is intentionally left empty because...
        }
      },
    })
    let abc = []
    abc = this.courseList
    // for(var i=0;i<abc.length;i++){
    // console.log(abc[i])
    // }
    console.log(abc[1].name)
  },
  methods: {
    uploadPhoto: function () {
      uni.chooseImage({
        count: 1,
        // 默认9
        sizeType: ['compressed'],
        // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'],
        // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
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
            (res) => {
              uni.hideNavigationBarLoading()
              const url = res.url()
              console.log(url)
              showPic(url, this)
            },
            function (error) {
              console.log(error)
            },
          )
        },
      })
    },

    teacherInput: function (e) {
      const Firts = e.detail.value.substring(0, 1)
      const inputText = Firts + '老师'
      this.setData({
        inputText,
      })
      console.log(this.inputText)
      if (!e.detail.value || e.detail.value === '老师' || e.detail.value === '老老师') {
        this.setData({
          inputName: false,
        })
      } else {
        this.setData({
          inputName: true,
        })
      }
    },

    inputTelephoneRight: function (e) {
      if (!e.detail.value) {
        this.setData({
          inputTelephone: false,
        })
      } else {
        this.setData({
          inputTelephone: true,
        })
      }
    },

    inputMajorRight: function (e) {
      if (!e.detail.value) {
        this.setData({
          inputMajor: false,
        })
      } else {
        this.setData({
          inputMajor: true,
        })
      }
    },

    inputScoreRight: function (e) {
      if (!e.detail.value) {
        this.setData({
          inputScore: false,
        })
      } else {
        this.setData({
          inputScore: true,
        })
      }
    },

    inputSalaryRight: function (e) {
      if (!e.detail.value) {
        this.setData({
          inputSalary: false,
        })
      } else {
        this.setData({
          inputSalary: true,
        })
      }
    },

    sexChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        sexIndex: e.detail.value,
        sex: this.sexArray[e.detail.value],
      })
      if (!this.sexArray[e.detail.value]) {
        this.setData({
          inputSex: false,
        })
      } else {
        this.setData({
          inputSex: true,
        })
      }
    },

    universityChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        universityIndex: e.detail.value,
        university: this.universityArray[e.detail.value],
      })
      if (!this.universityArray[e.detail.value]) {
        this.setData({
          inputUniversity: false,
        })
      } else {
        this.setData({
          inputUniversity: true,
        })
      }
    },

    degreeChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        degreeIndex: e.detail.value,
        degree: this.degreeArray[e.detail.value],
      })
      if (!this.degreeArray[e.detail.value]) {
        this.setData({
          inputDegree: false,
        })
      } else {
        this.setData({
          inputDegree: true,
        })
      }
    },

    choseCourseFun: function (e) {
      const index = e.currentTarget.dataset.index // 获取自定义的ID值
      const choseCourse = this.choseCourse
      const courseListNow = this.courseList
      if (this.courseList[index].chose === 'false') {
        if (this.choseCourse.length >= 3) {
          uni.showToast({
            title: '最多只可选择三项教学科目',
            image: '../../image/warn.png',
            duration: 2000,
          })
        } else {
          choseCourse.push(this.courseList[index].name)
          courseListNow[index].chose = 'true'
          this.setData({
            // id: index,
            courseList: courseListNow,
            choseCourse,
          })
          console.log(this.courseList)
          console.log(this.choseCourse)
        }
      } else if (this.courseList[index].chose === 'true') {
        courseListNow[index].chose = 'false'
        for (let i = 0; i < choseCourse.length; i++) {
          if (choseCourse[i] === courseListNow[index].name) {
            choseCourse.splice(i, 1)
            break
          }
        }
        this.setData({
          // id: index,
          courseList: courseListNow,
          choseCourse,
        })
        console.log(this.courseList)
        console.log(this.choseCourse)
      }
    },

    choseTraitFun: function (e) {
      const index = e.currentTarget.dataset.index // 获取自定义的ID值
      const choseTrait = this.choseTrait
      const traitListNow = this.traitList
      if (this.traitList[index].chose === 'false') {
        if (this.choseTrait.length >= 5) {
          uni.showToast({
            title: '最多只可选择五项教学特点',
            image: '../../image/warn.png',
            duration: 2000,
          })
        } else {
          choseTrait.push(this.traitList[index].name)
          traitListNow[index].chose = 'true'
          this.setData({
            // id: index,
            traitList: traitListNow,
            choseTrait,
          })
          console.log(this.traitList)
          console.log(this.choseTrait)
        }
      } else if (this.traitList[index].chose === 'true') {
        traitListNow[index].chose = 'false'
        for (let i = 0; i < choseTrait.length; i++) {
          if (choseTrait[i] === traitListNow[index].name) {
            choseTrait.splice(i, 1)
            break
          }
        }
        this.setData({
          // id: index,
          traitList: traitListNow,
          choseTrait,
        })
        console.log(this.traitList)
        console.log(this.choseTrait)
      }
    },

    registerSuccess: function (e) {
      const nowTime = getTime()
      const teacherName = e.detail.value.teacherName
      const telephone = e.detail.value.telephone
      const photo = this.photo
      const choseCourse = this.choseCourse
      const choseTrait = this.choseTrait
      const major = e.detail.value.major
      const teacherScore = e.detail.value.teacherScore
      const salary = e.detail.value.salary
      const remark = e.detail.value.remark
      const sex = this.sexArray[this.sexIndex]
      const university = this.universityArray[this.universityIndex]
      const degree = this.degreeArray[this.degreeIndex]
      if (university === '中国海洋大学') {
        this.setData({
          trait: '985',
        })
      } else if (university === '中国石油大学') {
        this.setData({
          trait: '211',
        })
      } else if (
        (university === '中国海洋大学' && university === '中国石油大学') ||
        degree === '研究生'
      ) {
        this.setData({
          trait: '研究生',
        })
      } else if (
        university !== '中国海洋大学' ||
        university !== '中国石油大学' ||
        degree !== '研究生'
      ) {
        this.setData({
          trait: 'null',
        })
      }
      if (!teacherName || teacherName === '老师' || teacherName === '老老师') {
        uni.showToast({
          title: '请填写您的称呼',
          image: '../../image/warn.png',
          duration: 2000,
        })
        this.setData({
          inputName: false,
        })
      } else if (!telephone) {
        uni.showToast({
          title: '请填写您的电话',
          image: '../../image/warn.png',
          duration: 2000,
        })
        this.setData({
          inputTelephone: false,
        })
      } else if (photo === '/static/image/photo111.png') {
        uni.showToast({
          title: '请添加您的头像',
          image: '../../image/warn.png',
          duration: 2000,
        })
      } else if (!major) {
        uni.showToast({
          title: '请填写您的专业',
          image: '../../image/warn.png',
          duration: 2000,
        })
        this.setData({
          inputMajor: false,
        })
      } else if (!teacherScore) {
        uni.showToast({
          title: '请填写您的高考分数',
          image: '../../image/warn.png',
          duration: 2000,
        })
        this.setData({
          inputScore: false,
        })
      } else if (!salary) {
        uni.showToast({
          title: '请填写您的期望薪资',
          image: '../../image/warn.png',
          duration: 2000,
        })
        this.setData({
          inputSalary: false,
        })
      } else if (choseCourse.length === 0) {
        uni.showToast({
          title: '请选择教学科目',
          image: '../../image/warn.png',
          duration: 2000,
        })
      } else if (!remark) {
        uni.showToast({
          title: '请尽量详细填写你的备注',
          image: '../../image/warn.png',
          duration: 2000,
        })
      }
      // TODO: Commented out Bmob import
      else {
        const User = Bmob.Object.extend('_User')
        const UserModel = new User()
        const Teacher = Bmob.Object.extend('teacher')
        const teacher = new Teacher()
        const query = new Bmob.Query(User)
        const currentUser = Bmob.User.current()
        const objectId = currentUser.id
        teacher.set('teacher_name', teacherName)
        teacher.set('telephone', telephone)
        teacher.set('major', major)
        teacher.set('teacher_score', teacherScore)
        teacher.set('salary', salary)
        teacher.set('self_int', remark)
        teacher.set('sex', sex)
        teacher.set('university', university)
        teacher.set('degree', degree)
        teacher.set('teach_course', choseCourse)
        teacher.set('teach_trait', choseTrait)
        teacher.set('photo', photo)
        teacher.set('trait', this.trait)
        teacher.set('own', objectId)
        teacher.set('images', this.urlArr)
        teacher.set('modifyTime', nowTime)
        teacher.save(null, {
          success: function (result) {
            const releaseId = result.id
            console.log('日记创建成功, objectId:' + result.id)
            query.get(objectId, {
              success: function (result) {
                result.set('release', releaseId)
                result.set('register', true)
                result.set('role', 'teacher')
                result.save()
                uni.showToast({
                  title: '发布成功',
                  icon: 'success',
                  success: function () {
                    setTimeout(function () {
                      if (uni.reLaunch) {
                        uni.reLaunch({
                          url: '/pages/teacherList/teacherList',
                        })
                      } else {
                        uni.switchTab({
                          url: '/pages/teacherList/teacherList',
                        })
                      }
                    }, 2000)
                  },
                })
              },
              error: function (object, error) {
                uni.showToast({
                  title: '网络错误',
                  image: '../../image/warn.png',
                  duration: 2000,
                })
              },
            })
          },
          error: function (result, error) {
            uni.showToast({
              title: '网络错误',
              image: '../../image/warn.png',
              duration: 2000,
            })
          },
        })
      }
    },

    jumpStudent: function () {
      uni.redirectTo({
        url: '../student-register/student-register',
      })
    },

    upImg: function () {
      // TODO: Commented out Bmob import
      //   const self = this
      //   uni.chooseImage({
      //     count: 9,
      //     // 默认9
      //     sizeType: ['compressed'],
      //     // 可以指定是原图还是压缩图，默认二者都有
      //     sourceType: ['album', 'camera'],
      //     // 可以指定来源是相册还是相机，默认二者都有
      //     success: function (res) {
      //       uni.showNavigationBarLoading()
      //       self.setData({
      //         loading: false,
      //       })
      //       const urlArr = self.urlArr
      //       // var urlArr={};
      //       const tempFilePaths = res.tempFilePaths
      //       const images = self.images
      //       self.setData({
      //         images: images.concat(tempFilePaths),
      //       })
      //       const imgLength = tempFilePaths.length
      //       if (imgLength > 0) {
      //         const newDate = new Date()
      //         const newDateStr = newDate.toLocaleDateString()
      //         let j = 0
      //         // 如果想顺序变更，可以for (var i = imgLength; i > 0; i--)
      //         for (var i = 0; i < imgLength; i++) {
      //           const tempFilePath = [tempFilePaths[i]]
      //           let extension = /\.([^.]*)$/.exec(tempFilePath[0])
      //           if (extension) {
      //             extension = extension[1].toLowerCase()
      //           }
      //           const name = newDateStr + '.' + extension // 上传的图片的别名
      //           const file = new Bmob.File(name, tempFilePath)
      //           file.save().then(
      //             function (res) {
      //               uni.hideNavigationBarLoading()
      //               const url = res.url()
      //               console.log('第' + i + '张Url' + url)
      //               urlArr.push({
      //                 url,
      //               })
      //               j++
      //               console.log(j, imgLength)
      //               // if (imgLength == j) {
      //               //   console.log(imgLength, urlArr);
      //               // 如果担心网络延时问题，可以去掉这几行注释，就是全部上传完成后显示。
      //               // showPic(urlArr, self)
      //               self.setData({
      //                 urlArr,
      //                 loading: true,
      //               })
      //               // }
      //             },
      //             function (error) {
      //               console.log(error)
      //             },
      //           )
      //         }
      //       }
      //     },
      //   })
      //   console.log(self.urlArr)
    },

    previewImage: function (e) {
      const current = e.currentTarget.dataset.current
      uni.previewImage({
        current,
        // 当前显示图片的http链接
        urls: this.images, // 需要预览的图片http链接列表
      })
    },

    deleteFun: function (e) {
      // 获取本地显示的图片数组
      const index = e.currentTarget.dataset.index
      const images = this.images
      const urlArr = this.urlArr
      urlArr.splice(index, 1)
      images.splice(index, 1)
      this.setData({
        images,
        urlArr,
      })
      console.log(this.urlArr)
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
@import './teacher-register.css';
</style>
