<template>
  <view class="page">
    <view class="hello">
      <image class="helloIcon" src="/static/image/bulb.png" />
      <view class="helloText">欢迎使用智能匹配功能</view>
    </view>
    <view class="warnText">本功能处于测试阶段，正在优化算法，匹配结果仅供参考</view>

    <view class="rotate" v-if="matching === false && teacherResult === false">
      <view class="container">
        <view class="Nitem Nitem-1"></view>
        <view class="Nitem Nitem-2"></view>
        <view class="Nitem Nitem-3"></view>
        <view class="Nitem Nitem-4"></view>
      </view>
    </view>

    <view
      class="rotate"
      v-if="matching === true && teacherResult === false && studentResult === false"
    >
      <view class="container">
        <view class="Yitem Yitem-1"></view>
        <view class="Yitem Yitem-2"></view>
        <view class="Yitem Yitem-3"></view>
        <view class="Yitem Yitem-4"></view>
      </view>
    </view>

    <view class="resultTeacher" @tap="showDetail" v-if="teacherResult === true">
      <view class="collect-teacher">
        <view class="left">
          <image class="teacherPhoto" :src="getTeacherResult.photo" />
          <text>{{ getTeacherResult.teacher_name }}</text>
        </view>
        <view class="right">
          <view class="teacher-university">{{ getTeacherResult.university }}</view>
          <view class="teach-course">
            <text v-for="(item, index) in getTeacherResult.teach_course" :key="index">
              {{ item }}
            </text>
          </view>
        </view>
      </view>
    </view>

    <view class="resultTeacher" @tap="showDetail" v-if="studentResult === true">
      <view class="collect-student">
        <view class="left">
          <view class="course-circular">
            <text>{{ getStudentResult.course }}</text>
          </view>
          <view class="name">{{ getStudentResult.name }}</view>
        </view>
        <view class="right">
          <view class="address">{{ getStudentResult.address[0] }}区</view>
          <view>{{ getStudentResult.address[1] }}</view>
          <view class="salary">{{ getStudentResult.salary }}</view>
        </view>
      </view>
    </view>

    <view class="matching" @tap="matchingFun" v-if="matching === false">开始匹配</view>
    <view class="matching" v-if="matching === true">匹配中...</view>
    <view
      class="matching"
      @tap="changeResult"
      v-if="teacherResult === true || studentResult === true"
    >
      换一个
    </view>
  </view>
</template>

<script>
// TODO
// const Bmob = require('../../utils/bmob.js')
let that
export default {
  data() {
    return {
      matching: false,
      teacherResult: false,
      studentResult: false,
      getTeacherResult: {
        photo: '',
        teacher_name: '',
        university: '',
        teach_course: [],
      },
      getStudentResult: {
        course: '',
        name: '',
        address: '',
        salary: '',
      },
      role: '',
      objectId: '',
    }
  },
  onLoad: function (options) {
    // that = this
    // const currentUser = Bmob.User.current()
    // const currentUserId = currentUser.id
    // const User = Bmob.Object.extend('_User')
    // const queryUser = new Bmob.Query(User)
    // queryUser.get(currentUserId, {
    //   success: function (result) {
    //     const role = result.get('role')
    //     that.setData({
    //       role,
    //     })
    //   },
    //   error: function (object, error) {
    //     console.error(error);
    //   },
    // })
  },
  onShow: function () {},
  methods: {
    matchingFun: function () {
      const currentUser = Bmob.User.current()
      const currentUserId = currentUser.id
      const User = Bmob.Object.extend('_User')
      const queryUser = new Bmob.Query(User)
      const teacher = Bmob.Object.extend('teacher')
      const student = Bmob.Object.extend('student')
      const queryTeacher = new Bmob.Query(teacher)
      const queryStudent = new Bmob.Query(student)
      const role = that.data.role
      queryUser.get(currentUserId, {
        success: function (result) {
          const register = result.get('register')
          if (register === false) {
            uni.showModal({
              title: '尚未注册',
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
                  // User canceled the registration
                }
              },
            })
          } else if (register === true) {
            if (role === 'teacher') {
              that.setData({
                matching: true,
              })
              setTimeout(function () {
                if (role === 'teacher') {
                  queryStudent.find({
                    success: function (results) {
                      console.log('共查询到 ' + results.length + ' 条记录')
                      function randomNum(Min, Max) {
                        const Range = Max - Min
                        const Rand = Math.random()
                        const num = Min + Math.round(Rand * Range)
                        that.setData({
                          getStudentResult: results[num],
                          objectId: results[num].id,
                        })
                      }
                      randomNum(0, results.length)
                      console.log(that.data.getStudentResult)
                    },
                    error: function (error) {
                      console.log('查询失败: ' + error.code + ' ' + error.message)
                    },
                  })
                }
                that.setData({
                  studentResult: true,
                })
              }, 3000)
            } else if (role === 'student') {
              that.setData({
                matching: true,
              })
              setTimeout(function () {
                if (role === 'student') {
                  queryTeacher.find({
                    success: function (results) {
                      console.log('共查询到 ' + results.length + ' 条记录')
                      function randomNum(Min, Max) {
                        const Range = Max - Min
                        const Rand = Math.random()
                        const num = Min + Math.round(Rand * Range)
                        that.setData({
                          getTeacherResult: results[num],
                          objectId: results[num].id,
                        })
                      }
                      randomNum(0, results.length)
                      console.log(that.data.getTeacherResult)
                    },
                    error: function (error) {
                      console.log('查询失败: ' + error.code + ' ' + error.message)
                    },
                  })
                }
                that.setData({
                  teacherResult: true,
                })
              }, 3000)
            }
          }
        },
        error: function (error) {
          console.error(error)
        },
      })
    },

    changeResult: function () {
      const currentUser = Bmob.User.current()
      const currentUserId = currentUser.id
      const User = Bmob.Object.extend('_User')
      const queryUser = new Bmob.Query(User)
      const teacher = Bmob.Object.extend('teacher')
      const student = Bmob.Object.extend('student')
      const queryTeacher = new Bmob.Query(teacher)
      const queryStudent = new Bmob.Query(student)
      const role = that.data.role
      if (role === 'teacher') {
        that.setData({
          matching: true,
          studentResult: false,
        })
        setTimeout(function () {
          queryStudent.find({
            success: function (results) {
              console.log('共查询到 ' + results.length + ' 条记录')
              function randomNum(Min, Max) {
                const Range = Max - Min
                const Rand = Math.random()
                const num = Min + Math.round(Rand * Range)
                that.setData({
                  getStudentResult: results[num],
                  objectId: results[num].id,
                })
                console.log(num)
              }
              randomNum(0, results.length)
              console.log(that.data.getStudentResult)
            },
            error: function (error) {
              console.log('查询失败: ' + error.code + ' ' + error.message)
            },
          })
          that.setData({
            studentResult: true,
          })
        }, 3000)
      } else if (role === 'student') {
        that.setData({
          matching: true,
          teacherResult: false,
        })
        setTimeout(function () {
          if (role === 'student') {
            queryTeacher.find({
              success: function (results) {
                console.log('共查询到 ' + results.length + ' 条记录')
                function randomNum(Min, Max) {
                  const Range = Max - Min
                  const Rand = Math.random()
                  const num = Min + Math.round(Rand * Range)
                  that.setData({
                    getTeacherResult: results[num],
                    objectId: results[num].id,
                  })
                  console.log(num)
                }
                randomNum(0, results.length)
                console.log(that.data.getTeacherResult)
              },
              error: function (error) {
                console.log('查询失败: ' + error.code + ' ' + error.message)
              },
            })
          }
          that.setData({
            teacherResult: true,
          })
        }, 3000)
      }
    },

    showDetail: function () {
      const objectId = that.data.objectId
      console.log(objectId)
      if (that.data.role === 'teacher') {
        uni.navigateTo({
          url: '../studentDetail/studentDetail?objectId=' + objectId,
        })
      } else if (that.data.role === 'student') {
        uni.navigateTo({
          url: '../teacherDetail/teacherDetail?objectId=' + objectId,
        })
      }
    },
  },
}
</script>
<style>
@import './recommend.css';
</style>
