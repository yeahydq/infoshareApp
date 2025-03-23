<template>
  <view class="page">
    <view class="chose">
      <view class="become-teacher">我是老师</view>
      <view class="find-teacher" @tap="jumpStudent">我是家长</view>
    </view>

    <view>
      <div id="app">
        <div class="container">
          <div class="header">
            <div class="tabs">
              <div class="tab active">基本信息</div>
              <div class="tab">上传资料</div>
              <div class="tab">完成</div>
            </div>
          </div>
          <div class="form-group">
            <label for="nickname">昵称</label>
            <input type="text" id="nickname" placeholder="请输入" />
          </div>
          <div class="form-group">
            <label for="name">姓名</label>
            <input type="text" id="name" placeholder="请输入" />
          </div>
          <div class="form-group">
            <label for="phone">联系电话</label>
            <input type="text" id="phone" placeholder="请输入" />
          </div>
          <div class="form-group">
            <label for="price">价格</label>
            <input type="number" id="price" placeholder="请输入价格/小时" />
          </div>
          <div class="form-group">
            <label for="subject">教学学科</label>
            <select id="subject">
              <option value="">请选择学科</option>
            </select>
          </div>
          <div class="form-group">
            <label for="teaching-experience">教龄</label>
            <input type="text" id="teaching-experience" placeholder="请输入教龄" />
          </div>
          <div class="form-group">
            <label for="location">选择位置</label>
            <select id="location">
              <option value="">请选择位置:</option>
            </select>
          </div>
          <div class="form-group">
            <label for="photo">上传照片</label>
            <img
              src="https://placehold.co/100x100?text=+&bgColor=ffffff&txtColor=000000"
              alt="请上传2寸图片"
            />
          </div>
          <div class="form-group">
            <label for="education">最高学历</label>
            <input type="text" id="education" placeholder="请输入" />
          </div>
          <button class="button">下一步</button>
        </div>
      </div>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
// import type { ITeacher } from '@/typings.d'

function getTime() {
  return new Date().toISOString()
}

const inputText = ref('')
const sexArray = ref(['男老师', '女老师'])
const sexIndex = ref(0)
const sex = ref('请选择您的性别')
const universityArray = ref([
  '中国海洋大学',
  '中国石油大学',
  '青岛大学',
  '青岛理工大学',
  '青岛科技大学',
  '山东科技大学',
])
const universityIndex = ref(0)
const university = ref('请选择您的学校')
const trait = ref('')
const degreeArray = ref(['本科', '研究生'])
const degreeIndex = ref(0)
const degree = ref('请选择您的学历')
const courseList = ref([
  { name: '数学', chose: 'false' },
  { name: '英语', chose: 'false' },
  { name: '语文', chose: 'false' },
  { name: '物理', chose: 'false' },
  { name: '化学', chose: 'false' },
  { name: '生物', chose: 'false' },
  { name: '历史', chose: 'false' },
  { name: '地理', chose: 'false' },
  { name: '美术', chose: 'false' },
  { name: '钢琴', chose: 'false' },
  { name: '日语', chose: 'false' },
  { name: '韩语', chose: 'false' },
])
const choseCourse = ref<string[]>([])
const traitList = ref([
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
const choseTrait = ref<string[]>([])
const photo = ref('/static/image/photo111.png')
const loading = ref(true)
const imageWidth = ref(getApp().globalData.screenWidth / 4 - 10)
const images = ref<string[]>([])
const urlArr = ref<{ url: string }[]>([])
const inputName = ref<boolean | null>(null)
const inputTelephone = ref<boolean | null>(null)
const inputSex = ref<boolean | null>(null)
const inputUniversity = ref<boolean | null>(null)
const inputDegree = ref<boolean | null>(null)
const inputMajor = ref<boolean | null>(null)
const inputScore = ref<boolean | null>(null)
const inputSalary = ref<boolean | null>(null)

onMounted(() => {
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
  const abc = courseList.value
  console.log(abc[1].name)
})

function uploadPhoto() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      uni.showNavigationBarLoading()
      loading.value = false
      const tempFilePaths = res.tempFilePaths
      console.log(tempFilePaths)
      const newDate = new Date()
      const newDateStr = newDate.toLocaleDateString()
      let extension = /\.([^.]*)$/.exec(tempFilePaths[0])
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
          showPic(url)
        },
        (error) => {
          console.log(error)
        },
      )
    },
  })
}

function teacherInput(e: any) {
  const Firts = e.detail.value.substring(0, 1)
  const inputTextValue = Firts + '老师'
  inputText.value = inputTextValue
  console.log(inputText.value)
  if (!e.detail.value || e.detail.value === '老师' || e.detail.value === '老老师') {
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

function inputMajorRight(e: any) {
  if (!e.detail.value) {
    inputMajor.value = false
  } else {
    inputMajor.value = true
  }
}

function inputScoreRight(e: any) {
  if (!e.detail.value) {
    inputScore.value = false
  } else {
    inputScore.value = true
  }
}

function inputSalaryRight(e: any) {
  if (!e.detail.value) {
    inputSalary.value = false
  } else {
    inputSalary.value = true
  }
}

function sexChange(e: any) {
  console.log('picker发送选择改变，携带值为', e.detail.value)
  sexIndex.value = e.detail.value
  sex.value = sexArray.value[e.detail.value]
  if (!sexArray.value[e.detail.value]) {
    inputSex.value = false
  } else {
    inputSex.value = true
  }
}

function universityChange(e: any) {
  console.log('picker发送选择改变，携带值为', e.detail.value)
  universityIndex.value = e.detail.value
  university.value = universityArray.value[e.detail.value]
  if (!universityArray.value[e.detail.value]) {
    inputUniversity.value = false
  } else {
    inputUniversity.value = true
  }
}

function degreeChange(e: any) {
  console.log('picker发送选择改变，携带值为', e.detail.value)
  degreeIndex.value = e.detail.value
  degree.value = degreeArray.value[e.detail.value]
  if (!degreeArray.value[e.detail.value]) {
    inputDegree.value = false
  } else {
    inputDegree.value = true
  }
}

function choseCourseFun(e: any) {
  const index = e.currentTarget.dataset.index // 获取自定义的ID值
  const courseListNow = courseList.value
  if (courseListNow[index].chose === 'false') {
    if (choseCourse.value.length >= 3) {
      uni.showToast({
        title: '最多只可选择三项教学科目',
        image: '../../image/warn.png',
        duration: 2000,
      })
    } else {
      choseCourse.value.push(courseListNow[index].name)
      courseListNow[index].chose = 'true'
      courseList.value = courseListNow
      console.log(courseList.value)
      console.log(choseCourse.value)
    }
  } else if (courseListNow[index].chose === 'true') {
    courseListNow[index].chose = 'false'
    for (let i = 0; i < choseCourse.value.length; i++) {
      if (choseCourse.value[i] === courseListNow[index].name) {
        choseCourse.value.splice(i, 1)
        break
      }
    }
    courseList.value = courseListNow
    console.log(courseList.value)
    console.log(choseCourse.value)
  }
}

function choseTraitFun(e: any) {
  const index = e.currentTarget.dataset.index // 获取自定义的ID值
  const traitListNow = traitList.value
  if (traitListNow[index].chose === 'false') {
    if (choseTrait.value.length >= 5) {
      uni.showToast({
        title: '最多只可选择五项教学特点',
        image: '../../image/warn.png',
        duration: 2000,
      })
    } else {
      choseTrait.value.push(traitListNow[index].name)
      traitListNow[index].chose = 'true'
      traitList.value = traitListNow
      console.log(traitList.value)
      console.log(choseTrait.value)
    }
  } else if (traitListNow[index].chose === 'true') {
    traitListNow[index].chose = 'false'
    for (let i = 0; i < choseTrait.value.length; i++) {
      if (choseTrait.value[i] === traitListNow[index].name) {
        choseTrait.value.splice(i, 1)
        break
      }
    }
    traitList.value = traitListNow
    console.log(traitList.value)
    console.log(choseTrait.value)
  }
}

function registerSuccess(e: any) {
  const nowTime = getTime()
  const teacherName = e.detail.value.teacherName
  const telephone = e.detail.value.telephone
  const photoValue = photo.value
  const choseCourseValue = choseCourse.value
  const choseTraitValue = choseTrait.value
  const major = e.detail.value.major
  const teacherScore = e.detail.value.teacherScore
  const salary = e.detail.value.salary
  const remark = e.detail.value.remark
  const sexValue = sexArray.value[sexIndex.value]
  const universityValue = universityArray.value[universityIndex.value]
  const degreeValue = degreeArray.value[degreeIndex.value]
  if (universityValue === '中国海洋大学') {
    trait.value = '985'
  } else if (universityValue === '中国石油大学') {
    trait.value = '211'
  } else if (
    universityValue === '中国海洋大学' ||
    universityValue === '中国石油大学' ||
    degreeValue === '研究生'
  ) {
    trait.value = '研究生'
  } else if (
    universityValue !== '中国海洋大学' &&
    universityValue !== '中国石油大学' &&
    degreeValue !== '研究生'
  ) {
    trait.value = 'null'
  }
  if (!teacherName || teacherName === '老师' || teacherName === '老老师') {
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
  } else if (photoValue === '/static/image/photo111.png') {
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
    inputMajor.value = false
  } else if (!teacherScore) {
    uni.showToast({
      title: '请填写您的高考分数',
      image: '../../image/warn.png',
      duration: 2000,
    })
    inputScore.value = false
  } else if (!salary) {
    uni.showToast({
      title: '请填写您的期望薪资',
      image: '../../image/warn.png',
      duration: 2000,
    })
    inputSalary.value = false
  } else if (choseCourseValue.length === 0) {
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
  } else {
    const teacher: ITeacher = {
      teacherName,
      telephone,
      major,
      teacherScore,
      salary,
      remark,
      sex: sexValue,
      university: universityValue,
      degree: degreeValue,
      teachCourse: choseCourseValue,
      teachTrait: choseTraitValue,
      photo: photoValue,
      trait: trait.value,
      images: urlArr.value,
    }
    uniCloud.callFunction({
      name: 'registerTeacher',
      data: {
        teacher,
        nowTime,
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

function jumpStudent() {
  uni.navigateTo({
    url: '../student-register/student-register',
  })
}

function upImg() {
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
}

function previewImage(e: any) {
  const current = e.currentTarget.dataset.current
  uni.previewImage({
    current,
    urls: images.value,
  })
}

function deleteFun(e: any) {
  const index = e.currentTarget.dataset.index
  images.value.splice(index, 1)
  urlArr.value.splice(index, 1)
  console.log(urlArr.value)
}

function showPic(url: string) {
  loading.value = true
  photo.value = url
}
</script>
<style>
@import './teacher-register.css';
</style>
