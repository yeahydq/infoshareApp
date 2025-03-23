<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '查找老师' },
}
</route>

<template>
  <view class="container">
    <page-header title="推荐老师" />

    <view class="form-container">
      <view class="form-item">
        <text class="required">*</text>
        <text class="label">姓名</text>
        <input
          class="input"
          placeholder="请输入"
          v-model="form.name"
          :class="{ 'error-input': v$.name.$error }"
        />
        <text v-if="v$.name.$error" class="error-text">{{ v$.name.$errors[0].$message }}</text>
      </view>

      <view class="form-item">
        <text class="required">*</text>
        <text class="label">联系电话</text>
        <input
          class="input"
          placeholder="请输入"
          v-model="form.phone"
          :class="{ 'error-input': v$.phone.$error }"
        />
        <text v-if="v$.phone.$error" class="error-text">{{ v$.phone.$errors[0].$message }}</text>
      </view>

      <view class="form-item">
        <text class="required">*</text>
        <text class="label">选择位置</text>
        <view
          class="location-picker"
          :class="{ 'error-input': v$.location.$error }"
          @click="showLocationPicker = true"
        >
          <text class="placeholder">{{ form.location || '请选择位置:' }}</text>
          <text class="arrow">></text>
        </view>
        <text v-if="v$.location.$error" class="error-text">
          {{ v$.location.$errors[0].$message }}
        </text>
      </view>

      <view class="form-item">
        <text class="required">*</text>
        <text class="label">教学学科</text>
        <view
          class="subject-picker"
          :class="{ 'error-input': v$.subject.$error }"
          @click="showSubjectPicker = true"
        >
          <text class="placeholder">{{ form.subject || '请选择学科:' }}</text>
          <text class="arrow">></text>
        </view>
        <text v-if="v$.subject.$error" class="error-text">
          {{ v$.subject.$errors[0].$message }}
        </text>
      </view>

      <view class="form-item">
        <text class="required">*</text>
        <text class="label">最高学历</text>
        <input
          class="input"
          placeholder="请输入"
          v-model="form.education"
          :class="{ 'error-input': v$.education.$error }"
        />
        <text v-if="v$.education.$error" class="error-text">
          {{ v$.education.$errors[0].$message }}
        </text>
      </view>

      <view class="form-item">
        <text class="required">*</text>
        <text class="label">授课方式</text>
        <view class="teaching-methods">
          <view
            v-for="(method, index) in teachingMethods"
            :key="index"
            class="method-option"
            :class="{ selected: form.teachingMethod === method }"
            @click="form.teachingMethod = method"
          >
            <text class="option-text">{{ method }}</text>
          </view>
        </view>
        <text v-if="v$.teachingMethod.$error" class="error-text">
          {{ v$.teachingMethod.$errors[0].$message }}
        </text>
      </view>

      <view class="form-item">
        <text class="label">备注</text>
        <textarea class="textarea" placeholder="" v-model="form.notes"></textarea>
      </view>
    </view>

    <view class="submit-button" @click="submitForm">
      <text class="button-text">{{ submitting ? '提交中...' : '立即提交' }}</text>
    </view>

    <!-- Location Picker Modal -->
    <view class="modal" v-if="showLocationPicker">
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">选择位置</text>
          <text class="modal-close" @click="showLocationPicker = false">×</text>
        </view>
        <view class="modal-body">
          <view
            v-for="(location, index) in locations"
            :key="index"
            class="modal-option"
            @click="selectLocation(location)"
          >
            <text>{{ location }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- Subject Picker Modal -->
    <view class="modal" v-if="showSubjectPicker">
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">选择学科</text>
          <text class="modal-close" @click="showSubjectPicker = false">×</text>
        </view>
        <view class="modal-body">
          <view
            v-for="(subject, index) in subjects"
            :key="index"
            class="modal-option"
            @click="selectSubject(subject)"
          >
            <text>{{ subject }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- Success Modal -->
    <view class="modal" v-if="showSuccessModal">
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">提交成功</text>
        </view>
        <view class="modal-body">
          <view class="success-icon">✓</view>
          <text class="success-message">您的推荐已成功提交</text>
        </view>
        <view class="modal-footer">
          <view class="modal-btn" @click="closeSuccessModal">确定</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, minLength, maxLength } from '@vuelidate/validators'
import PageHeader from '../../components/PageHeader.vue'

// 表单数据
const form = reactive({
  name: '',
  phone: '',
  location: '',
  subject: '',
  education: '',
  teachingMethod: '上门授课',
  notes: '',
})

// 教学方式选项
const teachingMethods = ['学生上门', '网络授课', '上门授课']

// 位置选项 (模拟数据)
const locations = ['北京市', '上海市', '广州市', '深圳市', '杭州市', '济南市', '青岛市', '南京市']

// 学科选项 (模拟数据)
const subjects = ['管理学', '医学', '农学', '工学', '理学', '历史学', '文学', '气象学']

// 验证规则
const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage('请输入姓名', required),
      minLength: helpers.withMessage('姓名至少2个字符', minLength(2)),
    },
    phone: {
      required: helpers.withMessage('请输入联系电话', required),
      phoneFormat: helpers.withMessage('请输入有效的11位手机号码', (value) => {
        return /^1[3-9]\d{9}$/.test(value)
      }),
    },
    location: { required: helpers.withMessage('请选择位置', required) },
    subject: { required: helpers.withMessage('请选择学科', required) },
    education: { required: helpers.withMessage('请输入最高学历', required) },
    teachingMethod: { required: helpers.withMessage('请选择授课方式', required) },
  }
})

// 初始化Vuelidate
const v$ = useVuelidate(rules, form)

// 控制模态框显示
const showLocationPicker = ref(false)
const showSubjectPicker = ref(false)
const showSuccessModal = ref(false)
const submitting = ref(false)

// 选择位置
function selectLocation(location) {
  form.location = location
  showLocationPicker.value = false
}

// 选择学科
function selectSubject(subject) {
  form.subject = subject
  showSubjectPicker.value = false
}

// 提交表单
async function submitForm() {
  const isFormValid = await v$.value.$validate()

  if (!isFormValid) {
    uni.showToast({
      title: '请正确填写所有必填项',
      icon: 'none',
      duration: 2000,
    })
    return
  }

  // 模拟API请求
  submitting.value = true

  setTimeout(() => {
    submitting.value = false
    showSuccessModal.value = true

    // 可以在这里添加实际的API调用
    console.log('提交表单数据:', form)
  }, 1500)
}

// 关闭成功提示并重置表单
function closeSuccessModal() {
  showSuccessModal.value = false
  v$.value.$reset()

  // 重置表单数据
  Object.keys(form).forEach((key) => {
    if (key === 'teachingMethod') {
      form[key] = '上门授课'
    } else {
      form[key] = ''
    }
  })
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  padding-bottom: 80px;
  background-color: #f8f8f8;
}

.form-container {
  padding: 15px;
  background-color: white;
}

.form-item {
  position: relative;
  margin-bottom: 20px;
}

.required {
  position: absolute;
  left: -10px;
  margin-right: 2px;
  color: #ff4d4f;
}

.label {
  display: block;
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
}

.input {
  width: 100%;
  height: 40px;
  padding: 0 10px;
  font-size: 14px;
  color: #333;
  border: 1px solid #eee;
  border-radius: 4px;
}

.error-input {
  background-color: #fff2f0;
  border-color: #ff4d4f;
}

.error-text {
  margin-top: 5px;
  font-size: 12px;
  color: #ff4d4f;
}

.location-picker,
.subject-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  padding: 0 10px;
  font-size: 14px;
  color: #999;
  border: 1px solid #eee;
  border-radius: 4px;
}

.arrow {
  color: #999;
}

.teaching-methods {
  display: flex;
  margin-top: 10px;
}

.method-option {
  padding: 8px 15px;
  margin-right: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.selected {
  background-color: #e0f7fa;
}

.option-text {
  font-size: 14px;
  color: #333;
}

.textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  font-size: 14px;
  color: #333;
  border: 1px solid #eee;
  border-radius: 4px;
}

.submit-button {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 15px;
  background-color: #5bbdca;
  border-radius: 25px;
}

.button-text {
  font-size: 16px;
  font-weight: 500;
  color: white;
}
/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  width: 80%;
  max-height: 70vh;
  overflow: hidden;
  background-color: white;
  border-radius: 8px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.modal-close {
  font-size: 20px;
  color: #999;
}

.modal-body {
  max-height: 50vh;
  padding: 15px;
  overflow-y: auto;
}

.modal-option {
  padding: 12px 0;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 10px 15px;
  border-top: 1px solid #f0f0f0;
}

.modal-btn {
  padding: 8px 20px;
  font-size: 14px;
  color: white;
  background-color: #5bbdca;
  border-radius: 4px;
}
/* Success Modal Styles */
.success-icon {
  margin: 20px 0;
  font-size: 60px;
  color: #52c41a;
  text-align: center;
}

.success-message {
  margin-bottom: 20px;
  font-size: 16px;
  color: #333;
  text-align: center;
}
</style>
