<template>
  <view class="page">
    <view class="background">
      <view class="howGetTeacher" @tap="showHowGetTeacherFun">
        <text>您是家长，如何找到老师？</text>
        <image class="downArrow" src="/static/image/downArrow.png"></image>
      </view>

      <view class="detailHowGetTeacher" v-if="showHowGetTeacher === true">
        <text>
          1.首先您需要在本平台注册您的信息，当您点击“个人中心”以及使用“收藏”、“申请”等功能时，若检测到您尚未注册，将会提示您进行注册操作。\n
          2.注册完毕后，点击“找老师”，则进入教师列表页面，您可以选择相应的课程及教师所属学校，按需寻找适合您孩子的家教。\n
          3.点击您心仪的家教后将进入老师详情页面，您可更详细的去了解这位老师。点击“收藏”您将在个人中心的“我的收藏”中看到您收藏过的老师；点击“发送申请”后对方将收到您的信息，如有意向将通过您预留的手机号与您联系。\n
          注：为保证您和教师的隐私以及本平台的质量，一天仅可免费发送三次申请。
        </text>
      </view>

      <view class="howGetStudent" @tap="showHowGetStudentFun">
        <text>您是老师，如何找到家长？</text>
        <image class="downArrow" src="/static/image/downArrow.png"></image>
      </view>

      <view class="detailHowGetStudent" v-if="showHowGetStudent === true">
        <text>
          1.首先您需要在本平台注册您的信息，当您点击“个人中心”以及使用“收藏”、“申请”等功能时，若检测到您尚未注册，将会提示您进行注册操作。\n
          2.注册完毕后，点击“找学生”，则进入家长/学生列表页面，您可以选择相应的课程及年级，按需寻找适合您的家教。\n
          3.点击您心仪的家教后将进入学生详情页面，您可更详细的去了解这位学生。点击“收藏”您将在个人中心的“我的收藏”中看到您收藏过的学生；点击“发送申请”后对方将收到您的信息，如有意向将通过您预留的手机号与您联系。\n
          注：为保证您和教师的隐私以及本平台的质量，一天仅可免费发送三次申请。
        </text>
      </view>

      <view class="protectPrivacy" @tap="showProtectPrivacyFun">
        <text>您的隐私如何得到保障？</text>
        <image class="downArrow" src="/static/image/downArrow.png"></image>
      </view>

      <view class="detailProtectPrivacy" v-if="showProtectPrivacy === true">
        <text>
          1.您的电话
          <text style="color: #fe4c40">绝对</text>
          不会公开显示，仅当您主动给对方发送申请时，对方才可看到您的电话。\n
          2.若您是老师，当您在注册时我们会仅保留您的姓氏，将姓氏以后的内容自动替换为“老师”二字。\n
          3.若您是家长，我们建议您在注册时仅输入诸如“陈叔叔”、“王阿姨”等称呼。\n
          注：您甚至可以在“我的发布”里直接删除您所发布的信息，但是这样您将不能再使用我们的平台，谨慎操作。
        </text>
      </view>

      <view class="aboutSalary" @tap="showAboutSalaryFun">
        <text>课时费怎么定？如何发放？</text>
        <image class="downArrow" src="/static/image/downArrow.png"></image>
      </view>

      <view class="detailAboutSalary" v-if="showAboutSalary === true">
        <text>
          在家长发布信息时，本平台会根据您孩子的课程和年级，自动实时和全市和您孩子情况相似的家教数据进行对比，智能的为您建议合理的课时费；\n
          为您建议的课时费仅作参考，您在注册填写时可根据自身情况进行更改，实际具体价格会根据课程难度、学习目标及老师经验，由家长和教师当面沟通决定。\n
          <text style="color: #fe4c40">
            本平台不从家长和教师双方的课时费中收取任何中介费等无理费用。
          </text>
        </text>
      </view>

      <view class="security" @tap="showSecurityFun">
        <text>如何保障教学质量和双方的安全？</text>
        <image class="downArrow" src="/static/image/downArrow.png"></image>
      </view>

      <view class="detailSecurity" v-if="showSecurity === true">
        <text>
          教师： 1.要做好备课工作、制定教学计划。 2.若您是女教师，第一次上课时请尽量有同伴陪同前去。
          3.在教学时间方面请和家长协商在白天进行，如不得不在晚上上课，请尽量让同伴陪同。
          4.上下课一定要注意交通安全，不要坐黑车，上车前请记住车牌号。\n 家长：
          1.尽量与教师协商要求进行试讲，从而便于了解孩子是否适合此教师。
          2.不要让孩子和家教独处，教师上课时家里尽量有家长陪同
          3.家长有义务保证教师的人生安全，如不要把上课时间定的过晚等
          4.在教师没有上课质量差、无故缺课等情况下，家长必须按时交付课时费
        </text>
      </view>
    </view>

    <view class="bottom" @tap="feedback">
      <view class="iconText">
        <image class="feedbackIcon" src="/static/image/modify.png"></image>
        <text class="feedbackText">问题反馈</text>
      </view>
    </view>
  </view>
</template>

<script>
// useHelp.js
export default {
  data() {
    return {
      showHowGetTeacher: false,
      showHowGetStudent: false,
      showProtectPrivacy: false,
      showAboutSalary: false,
      showSecurity: false,
    }
  },
  onLoad: function (options) {},
  onShow: function () {},
  methods: {
    showHowGetTeacherFun: function () {
      if (this.showHowGetTeacher === false) {
        this.setData({
          showHowGetTeacher: true,
          showHowGetStudent: false,
          showProtectPrivacy: false,
          showAboutSalary: false,
          showSecurity: false,
        })
      } else {
        this.setData({
          showHowGetTeacher: false,
          showHowGetStudent: false,
          showProtectPrivacy: false,
          showAboutSalary: false,
          showSecurity: false,
        })
      }
    },

    showHowGetStudentFun: function () {
      if (this.showHowGetStudent === false) {
        this.setData({
          showHowGetTeacher: false,
          showHowGetStudent: true,
          showProtectPrivacy: false,
          showAboutSalary: false,
          showSecurity: false,
        })
      } else {
        this.setData({
          showHowGetTeacher: false,
          showHowGetStudent: false,
          showProtectPrivacy: false,
          showAboutSalary: false,
          showSecurity: false,
        })
      }
    },

    showProtectPrivacyFun: function () {
      if (this.showProtectPrivacy === false) {
        this.setData({
          showHowGetTeacher: false,
          showHowGetStudent: false,
          showProtectPrivacy: true,
          showAboutSalary: false,
          showSecurity: false,
        })
      } else {
        this.setData({
          showHowGetTeacher: false,
          showHowGetStudent: false,
          showProtectPrivacy: false,
          showAboutSalary: false,
          showSecurity: false,
        })
      }
    },

    showAboutSalaryFun: function () {
      if (this.showAboutSalary === false) {
        this.setData({
          showHowGetTeacher: false,
          showHowGetStudent: false,
          showProtectPrivacy: false,
          showAboutSalary: true,
          showSecurity: false,
        })
      } else {
        this.setData({
          showHowGetTeacher: false,
          showHowGetStudent: false,
          showProtectPrivacy: false,
          showAboutSalary: false,
          showSecurity: false,
        })
      }
    },

    showSecurityFun: function () {
      if (this.showSecurity === false) {
        this.setData({
          showHowGetTeacher: false,
          showHowGetStudent: false,
          showProtectPrivacy: false,
          showAboutSalary: false,
          showSecurity: true,
        })
      } else {
        this.setData({
          showHowGetTeacher: false,
          showHowGetStudent: false,
          showProtectPrivacy: false,
          showAboutSalary: false,
          showSecurity: false,
        })
      }
    },

    feedback: function () {
      uni.navigateTo({
        url: '../feedback/feedback',
      })
    },
  },
}
</script>
<style>
@import './useHelp.css';
</style>
