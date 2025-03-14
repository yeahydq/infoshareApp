<template>
  <view class="page">
    <view class="chose">
      <view class="become-teacher" @tap="jumpTeacher">我是老师</view>
      <view class="find-teacher">我是家长</view>
    </view>

    <form @submit="registerSuccess" :report-submit="true">
      <view class="tip-photo">基本信息</view>
      <view class="column">
        <image class="registerIcon" src="/static/registerIcon/name.png"></image>
        <text class="tip">您的称呼：</text>
        <view class="inputColumn">
          <input
            placeholder="如“王阿姨”"
            @blur="inputNameRight"
            name="name"
            placeholder-style="color:#969696"
          />
        </view>
        <image
          class="rightArrow"
          v-if="inputName === true"
          src="/static/image/inputRight.png"
        ></image>
        <image
          class="rightArrow"
          v-else-if="inputName === false"
          src="/static/image/inputError.png"
        ></image>
      </view>

      <view class="column">
        <image class="registerIcon" src="/static/registerIcon/telephone.png"></image>
        <text class="tip">您的电话：</text>
        <view class="inputColumn">
          <input
            type="number"
            @blur="inputTelephoneRight"
            placeholder="用于教师及时和您沟通"
            name="telephone"
            placeholder-style="color:#969696"
          />
        </view>
        <image
          class="rightArrow"
          v-if="inputTelephone === true"
          src="/static/image/inputRight.png"
        ></image>
        <image
          class="rightArrow"
          v-else-if="inputTelephone === false"
          src="/static/image/inputError.png"
        ></image>
      </view>

      <view class="tip-photo" style="margin-top: 40rpx">学生信息</view>

      <view class="column">
        <image class="registerIcon" src="/static/registerIcon/university.png"></image>
        <text class="tip">补习科目：</text>
        <view class="inputColumn">
          <picker @change="courseChange" name="course" :value="courseArray" :range="courseArray">
            <view class="picker">
              <text class="grey">{{ course }}</text>
            </view>
          </picker>
        </view>
        <image class="rightArrow" src="/static/image/rightArrow.png"></image>
        <image
          class="rightArrow"
          v-if="inputCourse === true"
          src="/static/image/inputRight.png"
        ></image>
        <image
          class="rightArrow"
          v-else-if="inputCourse === false"
          src="/static/image/inputError.png"
        ></image>
      </view>

      <view class="column">
        <image class="registerIcon" src="/static/registerIcon/grade.png"></image>
        <text class="tip">学生年级：</text>
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
              <!-- <text class="grey">{{gradeArray[0][gradeIndex[0]]}}  {{gradeArray[1][gradeIndex[1]]}}</text> -->
              <text class="grey">{{ gradeFirst }} {{ gradeSecond }}</text>
            </view>
          </picker>
        </view>
        <image class="rightArrow" src="/static/image/rightArrow.png"></image>
        <image
          class="rightArrow"
          v-if="inputGrade === true"
          src="/static/image/inputRight.png"
        ></image>
        <image
          class="rightArrow"
          v-else-if="inputGrade === false"
          src="/static/image/inputError.png"
        ></image>
      </view>

      <view class="column">
        <image class="registerIcon" src="/static/registerIcon/basic.png"></image>
        <text class="tip">学生基础：</text>
        <view class="inputColumn">
          <picker @change="basciChange" name="basic" :value="basicIndex" :range="basicArray">
            <view class="picker">
              <text class="grey">{{ basic }}</text>
            </view>
          </picker>
        </view>
        <image class="rightArrow" src="/static/image/rightArrow.png"></image>
        <image
          class="rightArrow"
          v-if="inputBasic === true"
          src="/static/image/inputRight.png"
        ></image>
        <image
          class="rightArrow"
          v-else-if="inputBasic === false"
          src="/static/image/inputError.png"
        ></image>
      </view>

      <!-- 
                <view class="column">
                    <view class="tip">大致地点：</view>
                    <view class="inputColumn">
                        <picker mode="multiSelector"  name="address"  bindchange="addressChange" bindcolumnchange="addressColumnChange" value="{{addressIndex}}" range="{{addressArray}}">
                            <view class="addressPicker">
                                <text class="grey">{{addressArray[0][addressIndex[0]]}}  {{addressArray[1][addressIndex[1]]}}</text>
                            </view>
                        </picker>
                    </view>
                </view> -->

      <view class="column">
        <image class="registerIcon" src="/static/registerIcon/frequency.png"></image>
        <text class="tip">补习次数：</text>
        <view class="inputColumn">
          <picker
            @change="frequencyChange"
            name="frequency"
            :value="frequencyIndex"
            :range="frequencyArray"
          >
            <view class="picker">
              <text class="grey">{{ frequency }}</text>
            </view>
          </picker>
        </view>
        <image class="rightArrow" src="/static/image/rightArrow.png"></image>
        <image
          class="rightArrow"
          v-if="inputFrequency === true"
          src="/static/image/inputRight.png"
        ></image>
        <image
          class="rightArrow"
          v-else-if="inputFrequency === false"
          src="/static/image/inputError.png"
        ></image>
      </view>

      <view class="column">
        <image class="registerIcon" src="/static/registerIcon/salary.png"></image>
        <text class="tip">课时费用：</text>
        <view class="inputColumn">
          <input
            @blur="inputSalaryRight"
            placeholder="如“XX元1小时”"
            name="salary"
            placeholder-style="color:#545454"
          />
        </view>
        <image
          class="rightArrow"
          v-if="inputSalary === true"
          src="/static/image/inputRight.png"
        ></image>
        <image
          class="rightArrow"
          v-else-if="inputSalary === false"
          src="/static/image/inputError.png"
        ></image>
      </view>

      <view class="tip-photo" style="margin: 80rpx 0rpx 10rpx 0rpx">存在问题</view>
      <view style="margin: 0rpx 0rpx 20rpx 10rpx; font-size: 30rpx; color: #fe4c40">
        请选择在学习方面存在的问题
      </view>
      <view class="course-check" style="padding-bottom: 20rpx">
        <view
          class="courseItem"
          :data-index="index"
          @tap="choseStudentTraitFun"
          :style="
            item.chose === 'true'
              ? 'background-color: #fe4c40;border: 1rpx solid #fe4c40; color:#fff'
              : ' background-color: #fff;  border: 1rpx solid #c6c4c4;'
          "
          v-for="(item, index) in studentTraitList"
          :key="index"
        >
          <view style="padding: 15rpx">{{ item.name }}</view>
        </view>
      </view>

      <view class="tip-photo" style="margin-top: 40rpx">上课地点</view>
      <view class="addressColumn" style="border-bottom: 0">
        <text class="tip" style="margin-bottom: 0rpx">上课地点：</text>
        <text class="grey" style="margin-right: 20rpx; font-size: 35rpx" @tap="getAddress">
          点击获取地理位置
        </text>
        <image class="mapIcon" src="/static/image/map.png"></image>
        <image
          class="rightArrow"
          v-if="inputAddress === true"
          src="/static/image/inputRight.png"
        ></image>
        <image
          class="rightArrow"
          v-else-if="inputAddress === false"
          src="/static/image/inputError.png"
        ></image>
      </view>
      <view class="grey" style="margin: 0rpx 0rpx 0rpx 30rpx; font-size: 35rpx">
        {{ addressName }}
      </view>
      <view
        class="grey"
        style="padding: 20rpx 0rpx 0rpx 30rpx; padding-bottom: 20rpx; font-size: 35rpx"
      >
        {{ addressDetail }}
      </view>

      <view class="tip-photo" style="margin-top: 80rpx">教师要求</view>
      <view class="column">
        <image class="registerIcon" src="/static/registerIcon/trait.png"></image>
        <text class="tip">教师资质：</text>
        <view class="inputColumn">
          <picker @change="traitChange" name="trait" :value="traitIndex" :range="traitArray">
            <view class="picker">
              <text class="grey">{{ teacherTrait }}</text>
            </view>
          </picker>
        </view>
        <image class="rightArrow" src="/static/image/rightArrow.png"></image>
        <image
          class="rightArrow"
          v-if="inputTrait === true"
          src="/static/image/inputRight.png"
        ></image>
        <image
          class="rightArrow"
          v-else-if="inputTrait === false"
          src="/static/image/inputError.png"
        ></image>
      </view>

      <view class="column">
        <image class="registerIcon" src="/static/registerIcon/sex.png"></image>
        <text class="tip">教师性别：</text>
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
          v-if="inputSex === true"
          src="/static/image/inputRight.png"
        ></image>
        <image
          class="rightArrow"
          v-else-if="inputSex === false"
          src="/static/image/inputError.png"
        ></image>
      </view>

      <view class="tip-photo" style="margin: 80rpx 0rpx 10rpx 0rpx">教学特点</view>
      <view style="margin: 0rpx 0rpx 20rpx 10rpx; font-size: 30rpx; color: #fe4c40">
        请选择您期望教师所具备的特点
      </view>
      <view class="course-check" style="padding-bottom: 20rpx">
        <view
          class="courseItem"
          :data-index="index"
          @tap="choseTeacherTraitFun"
          :style="
            item.chose === 'true'
              ? 'background-color: #fe4c40;border: 1rpx solid #fe4c40; color:#fff'
              : ' background-color: #fff;  border: 1rpx solid #c6c4c4;'
          "
          v-for="(item, index) in teacherTraitList"
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
      <button class="submitButton" formType="submit" style="margin-top: 30rpx">提交</button>
    </form>
  </view>
</template>

<script>
// var Bmob = require('../../utils/bmob.js'); // TODO: Commented out Bmob import
// const utils = require('../../service/util.js')
// import { getTime } from '@service/util/util'

export default {
  data() {
    return {
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
      course: '请选择您要补习的课程',
      basicArray: ['较差', '中下', '中等', '中上', '较好'],
      basicIndex: 0,
      basic: '请选择孩子的学习基础',
      gradeArray: [
        ['小学', '初中', '高中'],
        ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
      ],
      gradeIndex: [0, 0],
      gradeArr: [],
      gradeFirst: '请选择您孩子的年级',
      gradeSecond: '',
      traitArray: ['有能力即可', '211高校', '985高校', '研究生'],
      traitIndex: 0,
      teacherTrait: '请选择教师资质',
      sexArray: ['无要求', '男老师', '女老师'],
      sexIndex: 0,
      sex: '请选择教师性别',
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
      frequency: '请选择补习次数',
      studentTraitList: [
        {
          name: '学习主动性差',
          chose: 'false',
        },
        {
          name: '学习速度慢',
          chose: 'false',
        },
        {
          name: '抵触心理大',
          chose: 'false',
        },
        {
          name: '叛逆',
          chose: 'false',
        },
        {
          name: '内向',
          chose: 'false',
        },
        {
          name: '没有耐心',
          chose: 'false',
        },
        {
          name: '自卑',
          chose: 'false',
        },
        {
          name: '粗心大意',
          chose: 'false',
        },
        {
          name: '偏科',
          chose: 'false',
        },
        {
          name: '公式、单词记不住',
          chose: 'false',
        },
        {
          name: '贪玩',
          chose: 'false',
        },
        {
          name: '沉迷手机、电脑',
          chose: 'false',
        },
        {
          name: '注意力不集中',
          chose: 'false',
        },
      ],
      choseStudentTrait: [],
      teacherTraitList: [
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
      choseTeacherTrait: [],
      addressName: '',
      addressDetail: '',
      latitude: '',
      longitude: '',
      inputName: null,
      inputTelephone: null,
      inputCourse: null,
      inputGrade: null,
      inputBasic: null,
      inputTrait: null,
      inputSex: null,
      inputFrequency: null,
      inputSalary: null,
      inputAddress: null,
    }
  },
  onLoad: function () {
    uni.showModal({
      title: '您的电话不会公开显示',
      content: '为保护您的隐私，仅当您主动向教师发送申请时，对方才可看到您的电话',
      showCancel: false,
      confirmText: '我知道啦',
      success: function (res) {
        if (res.confirm) {
          // This block is intentionally left empty because no further action is needed
        }
      },
    })
  },
  methods: {
    inputNameRight: function (e) {
      if (!e.detail.value) {
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

    courseChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        courseIndex: e.detail.value,
        course: this.data.courseArray[e.detail.value],
      })
      if (!this.data.courseArray[e.detail.value]) {
        this.setData({
          inputCourse: false,
        })
      } else {
        this.setData({
          inputCourse: true,
        })
      }
    },

    gradeChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      const A = this.gradeArray[0][this.gradeIndex[0]]
      const B = this.gradeArray[1][this.gradeIndex[1]]
      this.setData({
        gradeIndex: e.detail.value,
        gradeArr: [A, B],
        gradeFirst: A,
        gradeSecond: B,
      })
      console.log(this.gradeArr)
      if (!A || !B) {
        this.setData({
          inputGrade: false,
        })
      } else {
        this.setData({
          inputGrade: true,
        })
      }
    },

    gradeColumnChange: function (e) {
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
              data.gradeArray[1] = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级']
              break
            case 1:
              data.gradeArray[1] = ['一年级', '二年级', '三年级']
              break
            case 2:
              data.gradeArray[1] = ['一年级', '二年级', '三年级']
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
        basic: this.data.basicArray[e.detail.value],
      })
      if (!e.detail.value) {
        this.setData({
          inputBasic: false,
        })
      } else {
        this.setData({
          inputBasic: true,
        })
      }
    },

    traitChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        traitIndex: e.detail.value,
        teacherTrait: this.data.traitArray[e.detail.value],
      })
      if (!e.detail.value) {
        this.setData({
          inputTrait: false,
        })
      } else {
        this.setData({
          inputTrait: true,
        })
      }
    },

    sexChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        sexIndex: e.detail.value,
        sex: this.data.sexArray[e.detail.value],
      })
      if (!e.detail.value) {
        this.setData({
          inputSex: false,
        })
      } else {
        this.setData({
          inputSex: true,
        })
      }
    },

    frequencyChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        frequencyIndex: e.detail.value,
        frequency: this.data.frequencyArray[e.detail.value],
      })
      if (!e.detail.value) {
        this.setData({
          inputFrequency: false,
        })
      } else {
        this.setData({
          inputFrequency: true,
        })
      }
    },

    bindTextAreaBlur: function (e) {
      console.log(e.detail.value)
    },

    choseStudentTraitFun: function (e) {
      const index = e.currentTarget.dataset.index // 获取自定义的ID值
      const choseStudentTrait = this.choseStudentTrait
      const studentTraitListNow = this.studentTraitList
      if (this.studentTraitList[index].chose === 'false') {
        if (this.choseStudentTrait.length >= 5) {
          uni.showToast({
            title: '最多只可选择五项',
            image: '../../image/warn.png',
            duration: 2000,
          })
        } else {
          choseStudentTrait.push(this.studentTraitList[index].name)
          studentTraitListNow[index].chose = 'true'
          this.setData({
            // id: index,
            studentTraitList: studentTraitListNow,
            choseStudentTrait,
          })
          console.log(this.studentTraitList)
          console.log(this.choseStudentTrait)
        }
      } else if (this.studentTraitList[index].chose === 'true') {
        studentTraitListNow[index].chose = 'false'
        for (let i = 0; i < choseStudentTrait.length; i++) {
          if (choseStudentTrait[i] === studentTraitListNow[index].name) {
            choseStudentTrait.splice(i, 1)
            break
          }
        }
        this.setData({
          // id: index,
          studentTraitList: studentTraitListNow,
          choseStudentTrait,
        })
        console.log(this.traitList)
        console.log(this.choseStudentTrait)
      }
    },

    choseTeacherTraitFun: function (e) {
      const index = e.currentTarget.dataset.index // 获取自定义的ID值
      const choseTeacherTrait = this.choseTeacherTrait
      const teacherTraitListNow = this.teacherTraitList
      if (this.teacherTraitList[index].chose === 'false') {
        if (this.choseTeacherTrait.length >= 5) {
          uni.showToast({
            title: '最多只可选择五项',
            image: '../../image/warn.png',
            duration: 2000,
          })
        } else {
          choseTeacherTrait.push(this.teacherTraitList[index].name)
          teacherTraitListNow[index].chose = 'true'
          this.setData({
            // id: index,
            teacherTraitList: teacherTraitListNow,
            choseTeacherTrait,
          })
          console.log(this.teacherTraitList)
          console.log(this.choseTeacherTrait)
        }
      } else if (this.teacherTraitList[index].chose === 'true') {
        teacherTraitListNow[index].chose = 'false'
        for (let i = 0; i < choseTeacherTrait.length; i++) {
          if (choseTeacherTrait[i] === teacherTraitListNow[index].name) {
            choseTeacherTrait.splice(i, 1)
            break
          }
        }
        this.setData({
          // id: index,
          teacherTraitList: teacherTraitListNow,
          choseTeacherTrait,
        })
        console.log(this.traitList)
        console.log(this.choseTeacherTrait)
      }
    },

    registerSuccess: function (e) {
      // const nowTime = getTime()
      const addressIndex = this.addressIndex
      const gradeIndex = this.gradeIndex
      const name = e.detail.value.name
      const telephone = e.detail.value.telephone
      const choseTeacherTrait = this.choseTeacherTrait
      const choseStudentTrait = this.choseStudentTrait
      const course = this.courseArray[this.courseIndex]
      let courseEnglish
      for (let i = 0; i < this.courseEnglish.length; i++) {
        if (course === this.courseArray[i]) {
          courseEnglish = this.courseEnglish[i]
        }
      }
      console.log(courseEnglish)
      if (this.gradeArr.length === 0) {
        const grade = ['小学', '一年级']
      } else {
        const grade = this.gradeArr
      }
      const basic = this.basicArray[this.basicIndex]
      const trait = this.traitArray[this.traitIndex]
      const sex = this.sexArray[this.sexIndex]
      const addressName = this.addressName
      const addressDetail = this.addressDetail
      const latitude = this.latitude
      const longitude = this.longitude
      console.log(latitude)
      console.log(longitude)
      const frequency = this.frequencyArray[this.frequencyIndex]
      const salary = e.detail.value.salary
      const remark = e.detail.value.remark
      if (!name) {
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
      } else if (this.course === '请选择您要补习的课程') {
        uni.showToast({
          title: '请选择您要补习的课程',
          image: '../../image/warn.png',
          duration: 2000,
        })
        this.setData({
          inputCourse: false,
        })
      } else if (!this.gradeSecond) {
        uni.showToast({
          title: '请选择您孩子的年级',
          image: '../../image/warn.png',
          duration: 2000,
        })
        this.setData({
          inputGrade: false,
        })
      } else if (this.basic === '请选择孩子的学习基础') {
        uni.showToast({
          title: '请选择孩子的学习基础',
          image: '../../image/warn.png',
          duration: 2000,
        })
        this.setData({
          inputBasic: false,
        })
      } else if (this.teacherTrait === '请选择教师资质') {
        uni.showToast({
          title: '请选择教师资质',
          image: '../../image/warn.png',
          duration: 2000,
        })
        this.setData({
          inputTrait: false,
        })
      } else if (this.sex === '请选择教师性别') {
        uni.showToast({
          title: '请选择教师性别',
          image: '../../image/warn.png',
          duration: 2000,
        })
        this.setData({
          inputSex: false,
        })
      } else if (this.frequency === '请选择补习次数') {
        uni.showToast({
          title: '请选择补习次数',
          image: '../../image/warn.png',
          duration: 2000,
        })
        this.setData({
          inputFrequency: false,
        })
      } else if (!salary) {
        uni.showToast({
          title: '请填写课时费（最终可与教师商议）',
          image: '../../image/warn.png',
          duration: 2000,
        })
        this.setData({
          inputSalary: false,
        })
      } else if (!this.addressName || !this.addressDetail) {
        uni.showToast({
          title: '请选择您的上课地点',
          image: '../../image/warn.png',
          duration: 2000,
        })
        this.setData({
          inputAddress: false,
        })
      } else if (!remark) {
        uni.showToast({
          title: '请尽量详细填写你的备注',
          image: '../../image/warn.png',
          duration: 2000,
        })
      } else {
        // var user = Bmob.Object.extend('_User'); // TODO: Commented out Bmob related code
        // var UserModel = new user(); // TODO: Commented out Bmob related code
        // var Student = Bmob.Object.extend('student'); // TODO: Commented out Bmob related code
        // var student = new Student(); // TODO: Commented out Bmob related code
        // var query = new Bmob.Query(user); // TODO: Commented out Bmob related code
        // var objectId; // TODO: Commented out Bmob related code
        // var currentUser = Bmob.User.current(); // TODO: Commented out Bmob related code
        // objectId = currentUser.id; // TODO: Commented out Bmob related code
        // student.set('name', name); // TODO: Commented out Bmob related code
        // student.set('telephone', telephone); // TODO: Commented out Bmob related code
        // student.set('course', course); // TODO: Commented out Bmob related code
        // student.set('gradeIndex', gradeIndex); // TODO: Commented out Bmob related code
        // student.set('grade', grade); // TODO: Commented out Bmob related code
        // student.set('basic', basic); // TODO: Commented out Bmob related code
        // student.set('trait_limit', trait); // TODO: Commented out Bmob related code
        // student.set('sex', sex); // TODO: Commented out Bmob related code
        // student.set('frequency', frequency); // TODO: Commented out Bmob related code
        // student.set('salary', salary); // TODO: Commented out Bmob related code
        // student.set('addressName', addressName); // TODO: Commented out Bmob related code
        // student.set('studentTrait', choseStudentTrait); // TODO: Commented out Bmob related code
        // student.set('teacherTrait', choseTeacherTrait); // TODO: Commented out Bmob related code
        // student.set('addressDetail', addressDetail); // TODO: Commented out Bmob related code
        // student.set('latitude', latitude); // TODO: Commented out Bmob related code
        // student.set('longitude', longitude); // TODO: Commented out Bmob related code
        // student.set('remark', remark); // TODO: Commented out Bmob related code
        // student.set('courseEnglish', courseEnglish); // TODO: Commented out Bmob related code
        // student.set('own', objectId); // TODO: Commented out Bmob related code
        // student.set('modifyTime', nowTime); // TODO: Commented out Bmob related code
        // student.save(null, { // TODO: Commented out Bmob related code
        //     success: function (result) {
        //         var releaseId = result.id;
        //         query.get(objectId, {
        //             success: function (result) {
        //                 result.set('release', releaseId);
        //                 result.set('register', true);
        //                 result.set('role', 'student');
        //                 result.save();
        //                 uni.showToast({
        //                     title: '发布成功',
        //                     icon: 'success',
        //                     success: function () {
        //                         setTimeout(function () {
        //                             if (uni.reLaunch) {
        //                                 uni.reLaunch({
        //                                     url: '/pages/teacherList/teacherList'
        //                                 });
        //                             } else {
        //                                 uni.switchTab({
        //                                     url: '/pages/teacherList/teacherList'
        //                                 });
        //                             }
        //                         }, 2000);
        //                     }
        //                 });
        //             },
        //             error: function (object, error) {
        //                 console.log('111');
        //                 uni.showToast({
        //                     title: '网络错误',
        //                     image: '../../image/warn.png',
        //                     duration: 2000
        //                 });
        //             }
        //         });
        //     },
        //     error: function (result, error) {
        //         console.log('222');
        //         uni.showToast({
        //             title: '网络错误',
        //             image: '../../image/warn.png',
        //             duration: 2000
        //         });
        //     }
        // });
      }
    },

    jumpTeacher: function () {
      uni.redirectTo({
        url: '../teacher-register/teacher-register',
      })
    },

    getAddress: function () {
      uni.chooseLocation({
        success: (res) => {
          console.log(res)
          this.setData({
            addressName: res.name,
            addressDetail: res.address,
            latitude: res.latitude,
            longitude: res.longitude,
            inputAddress: true,
          })
        },
        fail: () => {
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
                      // This block is intentionally left empty because no further action is needed
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
@import './student-register.css';
</style>
