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

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const courseArray = ref([
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
])
const courseEnglish = ref([
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
])
const courseIndex = ref(0)
const course = ref('请选择您要补习的课程')
const basicArray = ref(['较差', '中下', '中等', '中上', '较好'])
const basicIndex = ref(0)
const basic = ref('请选择孩子的学习基础')
const gradeArray = ref([
  ['小学', '初中', '高中'],
  ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
])
const gradeIndex = ref([0, 0])
const gradeArr = ref<string[]>([])
const gradeFirst = ref('请选择您孩子的年级')
const gradeSecond = ref('')
const traitArray = ref(['有能力即可', '211高校', '985高校', '研究生'])
const traitIndex = ref(0)
const teacherTrait = ref('请选择教师资质')
const sexArray = ref(['无要求', '男老师', '女老师'])
const sexIndex = ref(0)
const sex = ref('请选择教师性别')
const frequencyArray = ref([
  '一周一次',
  '一周两次',
  '一周三次',
  '一周四次',
  '一周五次',
  '一周六次',
  '一周七次',
])
const frequencyIndex = ref(0)
const frequency = ref('请选择补习次数')
const studentTraitList = ref([
  { name: '学习主动性差', chose: 'false' },
  { name: '学习速度慢', chose: 'false' },
  { name: '抵触心理大', chose: 'false' },
  { name: '叛逆', chose: 'false' },
  { name: '内向', chose: 'false' },
  { name: '没有耐心', chose: 'false' },
  { name: '自卑', chose: 'false' },
  { name: '粗心大意', chose: 'false' },
  { name: '偏科', chose: 'false' },
  { name: '公式、单词记不住', chose: 'false' },
  { name: '贪玩', chose: 'false' },
  { name: '沉迷手机、电脑', chose: 'false' },
  { name: '注意力不集中', chose: 'false' },
])
const choseStudentTrait = ref<string[]>([])
const teacherTraitList = ref([
  { name: '教学经验丰富', chose: 'false' },
  { name: '有成功案例', chose: 'false' },
  { name: '提分快', chose: 'false' },
  { name: '注重基础', chose: 'false' },
  { name: '严厉', chose: 'false' },
  { name: '有耐心', chose: 'false' },
  { name: '和学生交朋友', chose: 'false' },
  { name: '心理辅导', chose: 'false' },
  { name: '幽默风趣', chose: 'false' },
  { name: '沟通能力强', chose: 'false' },
  { name: '备课详细', chose: 'false' },
  { name: '引导学生自主学习', chose: 'false' },
  { name: '善于鼓励', chose: 'false' },
])
const choseTeacherTrait = ref<string[]>([])
const addressName = ref('')
const addressDetail = ref('')
const latitude = ref('')
const longitude = ref('')
const inputName = ref<boolean | null>(null)
const inputTelephone = ref<boolean | null>(null)
const inputCourse = ref<boolean | null>(null)
const inputGrade = ref<boolean | null>(null)
const inputBasic = ref<boolean | null>(null)
const inputTrait = ref<boolean | null>(null)
const inputSex = ref<boolean | null>(null)
const inputFrequency = ref<boolean | null>(null)
const inputSalary = ref<boolean | null>(null)
const inputAddress = ref<boolean | null>(null)

onMounted(() => {
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
})

function inputNameRight(e: any) {
  if (!e.detail.value) {
    inputName.value = false
  } else {
    inputName.value = true
  }
}

function inputTelephoneRight(e: any) {
  if (!e.detail.value) {
    inputTelephone.value = false
  } else {
    inputTelephone.value = true
  }
}

function inputSalaryRight(e: any) {
  if (!e.detail.value) {
    inputSalary.value = false
  } else {
    inputSalary.value = true
  }
}

function courseChange(e: any) {
  console.log('picker发送选择改变，携带值为', e.detail.value)
  courseIndex.value = e.detail.value
  course.value = courseArray.value[e.detail.value]
  if (!courseArray.value[e.detail.value]) {
    inputCourse.value = false
  } else {
    inputCourse.value = true
  }
}

function gradeChange(e: any) {
  console.log('picker发送选择改变，携带值为', e.detail.value)
  const A = gradeArray.value[0][gradeIndex.value[0]]
  const B = gradeArray.value[1][gradeIndex.value[1]]
  gradeIndex.value = e.detail.value
  gradeArr.value = [A, B]
  gradeFirst.value = A
  gradeSecond.value = B
  console.log(gradeArr.value)
  if (!A || !B) {
    inputGrade.value = false
  } else {
    inputGrade.value = true
  }
}

function gradeColumnChange(e: any) {
  console.log('修改的列为', e.detail.column, '，值为', e.detail.value)
  const data = {
    gradeArray: gradeArray.value,
    gradeIndex: gradeIndex.value,
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
  gradeArray.value = data.gradeArray
  gradeIndex.value = data.gradeIndex
}

function basciChange(e: any) {
  console.log('picker发送选择改变，携带值为', e.detail.value)
  basicIndex.value = e.detail.value
  basic.value = basicArray.value[e.detail.value]
  if (!e.detail.value) {
    inputBasic.value = false
  } else {
    inputBasic.value = true
  }
}

function traitChange(e: any) {
  console.log('picker发送选择改变，携带值为', e.detail.value)
  traitIndex.value = e.detail.value
  teacherTrait.value = traitArray.value[e.detail.value]
  if (!e.detail.value) {
    inputTrait.value = false
  } else {
    inputTrait.value = true
  }
}

function sexChange(e: any) {
  console.log('picker发送选择改变，携带值为', e.detail.value)
  sexIndex.value = e.detail.value
  sex.value = sexArray.value[e.detail.value]
  if (!e.detail.value) {
    inputSex.value = false
  } else {
    inputSex.value = true
  }
}

function frequencyChange(e: any) {
  console.log('picker发送选择改变，携带值为', e.detail.value)
  frequencyIndex.value = e.detail.value
  frequency.value = frequencyArray.value[e.detail.value]
  if (!e.detail.value) {
    inputFrequency.value = false
  } else {
    inputFrequency.value = true
  }
}

function bindTextAreaBlur(e: any) {
  console.log(e.detail.value)
}

function choseStudentTraitFun(e: any) {
  const index = e.currentTarget.dataset.index // 获取自定义的ID值
  const studentTraitListNow = studentTraitList.value
  if (studentTraitListNow[index].chose === 'false') {
    if (choseStudentTrait.value.length >= 5) {
      uni.showToast({
        title: '最多只可选择五项',
        image: '../../image/warn.png',
        duration: 2000,
      })
    } else {
      choseStudentTrait.value.push(studentTraitListNow[index].name)
      studentTraitListNow[index].chose = 'true'
      studentTraitList.value = studentTraitListNow
      console.log(studentTraitList.value)
      console.log(choseStudentTrait.value)
    }
  } else if (studentTraitListNow[index].chose === 'true') {
    studentTraitListNow[index].chose = 'false'
    for (let i = 0; i < choseStudentTrait.value.length; i++) {
      if (choseStudentTrait.value[i] === studentTraitListNow[index].name) {
        choseStudentTrait.value.splice(i, 1)
        break
      }
    }
    studentTraitList.value = studentTraitListNow
    console.log(studentTraitList.value)
    console.log(choseStudentTrait.value)
  }
}

function choseTeacherTraitFun(e: any) {
  const index = e.currentTarget.dataset.index // 获取自定义的ID值
  const teacherTraitListNow = teacherTraitList.value
  if (teacherTraitListNow[index].chose === 'false') {
    if (choseTeacherTrait.value.length >= 5) {
      uni.showToast({
        title: '最多只可选择五项',
        image: '../../image/warn.png',
        duration: 2000,
      })
    } else {
      choseTeacherTrait.value.push(teacherTraitListNow[index].name)
      teacherTraitListNow[index].chose = 'true'
      teacherTraitList.value = teacherTraitListNow
      console.log(teacherTraitList.value)
      console.log(choseTeacherTrait.value)
    }
  } else if (teacherTraitListNow[index].chose === 'true') {
    teacherTraitListNow[index].chose = 'false'
    for (let i = 0; i < choseTeacherTrait.value.length; i++) {
      if (choseTeacherTrait.value[i] === teacherTraitListNow[index].name) {
        choseTeacherTrait.value.splice(i, 1)
        break
      }
    }
    teacherTraitList.value = teacherTraitListNow
    console.log(teacherTraitList.value)
    console.log(choseTeacherTrait.value)
  }
}

function registerSuccess(e: any) {
  const name = e.detail.value.name
  const telephone = e.detail.value.telephone
  const choseTeacherTraitValue = choseTeacherTrait.value
  const choseStudentTraitValue = choseStudentTrait.value
  const courseValue = courseArray.value[courseIndex.value]
  let courseEnglishValue = ''
  for (let i = 0; i < courseEnglish.value.length; i++) {
    if (courseValue === courseArray.value[i]) {
      courseEnglishValue = courseEnglish.value[i]
    }
  }
  console.log(courseEnglishValue)
  const gradeValue = gradeArr.value.length === 0 ? ['小学', '一年级'] : gradeArr.value
  const basicValue = basicArray.value[basicIndex.value]
  const traitValue = traitArray.value[traitIndex.value]
  const sexValue = sexArray.value[sexIndex.value]
  const addressNameValue = addressName.value
  const addressDetailValue = addressDetail.value
  const latitudeValue = latitude.value
  const longitudeValue = longitude.value
  console.log(latitudeValue)
  console.log(longitudeValue)
  const frequencyValue = frequencyArray.value[frequencyIndex.value]
  const salary = e.detail.value.salary
  const remark = e.detail.value.remark
  if (!name) {
    uni.showToast({
      title: '请填写您的称呼',
      image: '../../image/warn.png',
      duration: 2000,
    })
    inputName.value = false
  } else if (!telephone) {
    uni.showToast({
      title: '请填写您的电话',
      image: '../../image/warn.png',
      duration: 2000,
    })
    inputTelephone.value = false
  } else if (course.value === '请选择您要补习的课程') {
    uni.showToast({
      title: '请选择您要补习的课程',
      image: '../../image/warn.png',
      duration: 2000,
    })
    inputCourse.value = false
  } else if (!gradeSecond.value) {
    uni.showToast({
      title: '请选择您孩子的年级',
      image: '../../image/warn.png',
      duration: 2000,
    })
    inputGrade.value = false
  } else if (basic.value === '请选择孩子的学习基础') {
    uni.showToast({
      title: '请选择孩子的学习基础',
      image: '../../image/warn.png',
      duration: 2000,
    })
    inputBasic.value = false
  } else if (teacherTrait.value === '请选择教师资质') {
    uni.showToast({
      title: '请选择教师资质',
      image: '../../image/warn.png',
      duration: 2000,
    })
    inputTrait.value = false
  } else if (sex.value === '请选择教师性别') {
    uni.showToast({
      title: '请选择教师性别',
      image: '../../image/warn.png',
      duration: 2000,
    })
    inputSex.value = false
  } else if (frequency.value === '请选择补习次数') {
    uni.showToast({
      title: '请选择补习次数',
      image: '../../image/warn.png',
      duration: 2000,
    })
    inputFrequency.value = false
  } else if (!salary) {
    uni.showToast({
      title: '请填写课时费（最终可与教师商议）',
      image: '../../image/warn.png',
      duration: 2000,
    })
    inputSalary.value = false
  } else if (!addressName.value || !addressDetail.value) {
    uni.showToast({
      title: '请选择您的上课地点',
      image: '../../image/warn.png',
      duration: 2000,
    })
    inputAddress.value = false
  } else if (!remark) {
    uni.showToast({
      title: '请尽量详细填写你的备注',
      image: '../../image/warn.png',
      duration: 2000,
    })
  } else {
    const student: IStudent = {
      name,
      telephone,
      course: courseValue,
      grade: gradeValue,
      basic: basicValue,
      trait_limit: traitValue,
      sex: sexValue,
      frequency: frequencyValue,
      salary,
      addressName: addressNameValue,
      studentTrait: choseStudentTraitValue,
      teacherTrait: choseTeacherTraitValue,
      addressDetail: addressDetailValue,
      latitude: latitudeValue,
      longitude: longitudeValue,
      remark,
      courseEnglish: courseEnglishValue,
    }
    uniCloud.callFunction({
      name: 'registerStudent',
      data: {
        student,
      },
      success: function (res) {
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
      fail: function (err) {
        console.error('Error occurred:', err)
        uni.showToast({
          title: '网络错误，请稍后重试',
          image: '../../image/warn.png',
          duration: 2000,
        })
      },
    })
  }
}

function jumpTeacher() {
  uni.redirectTo({
    url: '../teacher-register/teacher-register',
  })
}

function getAddress() {
  uni.chooseLocation({
    success: (res) => {
      console.log(res)
      addressName.value = res.name
      addressDetail.value = res.address
      latitude.value = res.latitude.toString()
      longitude.value = res.longitude.toString()
      inputAddress.value = true
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
}
</script>
<style>
@import './student-register.css';
</style>
