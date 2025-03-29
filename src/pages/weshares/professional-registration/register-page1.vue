<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '专业人员注册' },
}
</route>

<template>
  <view class="register-container">
    <view class="header">
      <text class="title">专业人员注册</text>
      <text class="subtitle">请填写基本信息，带 * 为必填项</text>
    </view>

    <view class="form">
      <!-- 专业类型选择 -->
      <view class="form-item">
        <text class="label">
          专业类型
          <text class="required">*</text>
        </text>
        <picker :range="professionalTypes" @change="handleTypeChange" class="picker">
          <view class="picker-text">
            {{ formData.professionalType || '请选择专业类型' }}
          </view>
        </picker>
      </view>

      <!-- 自定义专业类型 -->
      <view class="form-item" v-if="formData.professionalType === '其他'">
        <text class="label">
          请输入专业类型
          <text class="required">*</text>
        </text>
        <input
          v-model="formData.customType"
          type="text"
          placeholder="请输入专业类型（不超过5个字）"
          class="input"
          maxlength="5"
        />
      </view>

      <!-- 姓名 -->
      <view class="form-item">
        <text class="label">
          姓名
          <text class="required">*</text>
        </text>
        <input v-model="formData.name" type="text" placeholder="请输入真实姓名" class="input" />
      </view>

      <!-- 性别 -->
      <view class="form-item">
        <text class="label">
          性别
          <text class="required">*</text>
        </text>
        <picker :range="sexOptions" @change="handleSexChange" class="picker">
          <view class="picker-text">
            {{ formData.sex || '请选择性别' }}
          </view>
        </picker>
      </view>

      <!-- 联系电话 -->
      <view class="form-item">
        <text class="label">
          联系电话
          <text class="required">*</text>
        </text>
        <input v-model="formData.phone" type="number" placeholder="请输入联系电话" class="input" />
      </view>

      <!-- 学历 -->
      <view class="form-item">
        <text class="label">
          学历
          <text class="required">*</text>
        </text>
        <picker :range="educationOptions" @change="handleEducationChange" class="picker">
          <view class="picker-text">
            {{ formData.education || '请选择学历' }}
          </view>
        </picker>
      </view>

      <!-- 专业 -->
      <view class="form-item">
        <text class="label">
          专业
          <text class="required">*</text>
        </text>
        <input v-model="formData.major" type="text" placeholder="请输入专业" class="input" />
      </view>

      <!-- 期望薪资 -->
      <view class="form-item">
        <text class="label">
          期望薪资
          <text class="required">*</text>
        </text>
        <view class="salary-input-group">
          <input
            v-model="formData.salary"
            type="number"
            placeholder="请输入金额"
            class="input salary-input"
          />
          <picker
            :range="salaryTypes"
            @change="handleSalaryTypeChange"
            class="picker salary-type-picker"
          >
            <view class="picker-text">
              {{ formData.salaryType || '请选择计费方式' }}
            </view>
          </picker>
        </view>
      </view>

      <!-- 个人简介 -->
      <view class="form-item">
        <text class="label">
          个人简介
          <text class="required">*</text>
        </text>
        <textarea
          v-model="formData.introduction"
          placeholder="请简要介绍您的专业背景和工作经验"
          class="textarea"
        />
      </view>

      <!-- 空闲时间安排 -->
      <time-schedule ref="timeScheduleRef" />

      <button class="submit-btn" @tap="handleNext">下一步</button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import TimeSchedule from '@/components/TimeSchedule.vue'

const professionalTypes = ref([
  'IT/互联网',
  '金融/财务',
  '医疗/健康',
  '教育/培训',
  '法律/咨询',
  '设计/创意',
  '其他',
])

const sexOptions = ref(['男', '女'])
const educationOptions = ref(['专科', '本科', '硕士', '博士'])
const salaryTypes = ref(['次', '天', '小时'])

const formData = ref({
  professionalType: '',
  customType: '',
  name: '',
  sex: '',
  phone: '',
  education: '',
  major: '',
  salary: '',
  salaryType: '',
  introduction: '',
})

const timeScheduleRef = ref()

const handleTypeChange = (e: any) => {
  formData.value.professionalType = professionalTypes.value[e.detail.value]
}

const handleSexChange = (e: any) => {
  formData.value.sex = sexOptions.value[e.detail.value]
}

const handleEducationChange = (e: any) => {
  formData.value.education = educationOptions.value[e.detail.value]
}

const handleSalaryTypeChange = (e: any) => {
  formData.value.salaryType = salaryTypes.value[e.detail.value]
}

const handleNext = () => {
  // 表单验证
  if (!formData.value.professionalType) {
    uni.showToast({
      title: '请选择专业类型',
      icon: 'none',
    })
    return
  }
  if (!formData.value.name) {
    uni.showToast({
      title: '请输入姓名',
      icon: 'none',
    })
    return
  }
  if (!formData.value.sex) {
    uni.showToast({
      title: '请选择性别',
      icon: 'none',
    })
    return
  }
  if (!formData.value.phone) {
    uni.showToast({
      title: '请输入联系电话',
      icon: 'none',
    })
    return
  }
  if (!formData.value.education) {
    uni.showToast({
      title: '请选择学历',
      icon: 'none',
    })
    return
  }
  if (!formData.value.major) {
    uni.showToast({
      title: '请输入专业',
      icon: 'none',
    })
    return
  }
  if (!formData.value.salary) {
    uni.showToast({
      title: '请输入期望薪资',
      icon: 'none',
    })
    return
  }
  if (!formData.value.salaryType) {
    uni.showToast({
      title: '请选择计费方式',
      icon: 'none',
    })
    return
  }
  if (!formData.value.introduction) {
    uni.showToast({
      title: '请输入个人简介',
      icon: 'none',
    })
    return
  }

  // 获取时间安排数据
  const timeSchedule = timeScheduleRef.value?.getSelectedTimes()
  if (
    !timeSchedule ||
    timeSchedule.selectedDays.length === 0 ||
    timeSchedule.selectedSlots.length === 0
  ) {
    uni.showToast({
      title: '请选择空闲时间',
      icon: 'none',
    })
    return
  }

  // 保存表单数据并跳转到下一步
  const formDataWithSchedule = {
    ...formData.value,
    timeSchedule,
  }
  uni.setStorageSync('professionalFormData', formDataWithSchedule)
  uni.navigateTo({
    url: '/weshares/professional-registration/register-page2',
  })
}
</script>

<style lang="scss">
.register-container {
  min-height: 100vh;
  padding: 20px;
  background-color: #f8f8f8;
}

.header {
  margin-bottom: 30px;

  .title {
    display: block;
    margin-bottom: 10px;
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }

  .subtitle {
    font-size: 14px;
    color: #999;
  }
}

.form {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}

.form-item {
  margin-bottom: 20px;

  .label {
    display: block;
    margin-bottom: 8px;
    font-size: 16px;
    color: #333;

    .required {
      margin-left: 4px;
      color: #ff4d4f;
    }
  }

  .input {
    width: 100%;
    height: 44px;
    padding: 0 12px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 4px;

    &:focus {
      border-color: #5bbdca;
    }
  }

  .picker {
    display: flex;
    align-items: center;
    width: 100%;
    height: 44px;
    padding: 0 12px;
    border: 1px solid #ddd;
    border-radius: 4px;

    .picker-text {
      font-size: 14px;
      color: #333;
    }
  }

  .textarea {
    width: 100%;
    height: 100px;
    padding: 12px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 4px;

    &:focus {
      border-color: #5bbdca;
    }
  }
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 44px;
  margin-top: 30px;
  font-size: 16px;
  color: #fff;
  background-color: #5bbdca;
  border-radius: 4px;

  &:active {
    opacity: 0.8;
  }
}

.salary-input-group {
  display: flex;
  gap: 10px;
  align-items: center;

  .salary-input {
    flex: 2;
  }

  .salary-type-picker {
    flex: 1;
  }
}
</style>
