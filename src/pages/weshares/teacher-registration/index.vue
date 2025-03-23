<template>
  <view class="container">
    <page-header title="教员入驻" />

    <view class="process-bar">
      <view class="process-item active">
        <view class="process-icon">📝</view>
        <view class="process-text">基本信息</view>
      </view>
      <view class="process-item">
        <view class="process-icon">📎</view>
        <view class="process-text">上传资料</view>
      </view>
      <view class="process-item">
        <view class="process-icon">✓</view>
        <view class="process-text">完成</view>
      </view>
    </view>

    <view class="form-container">
      <view class="form-group">
        <view class="form-item">
          <text class="required">*</text>
          <text class="form-label">昵称</text>
          <input
            class="form-input"
            placeholder="请输入"
            v-model="form.nickname"
            :class="{ 'error-input': v$.nickname.$error }"
          />
          <text v-if="v$.nickname.$error" class="error-text">
            {{ v$.nickname.$errors[0].$message }}
          </text>
        </view>

        <view class="form-item">
          <text class="required">*</text>
          <text class="form-label">姓名</text>
          <input
            class="form-input"
            placeholder="请输入"
            v-model="form.name"
            :class="{ 'error-input': v$.name.$error }"
          />
          <text v-if="v$.name.$error" class="error-text">{{ v$.name.$errors[0].$message }}</text>
        </view>

        <view class="form-item">
          <text class="required">*</text>
          <text class="form-label">联系电话</text>
          <input
            class="form-input"
            placeholder="请输入"
            v-model="form.phone"
            :class="{ 'error-input': v$.phone.$error }"
          />
          <text v-if="v$.phone.$error" class="error-text">{{ v$.phone.$errors[0].$message }}</text>
        </view>

        <view class="form-item">
          <text class="required">*</text>
          <text class="form-label">价格</text>
          <input
            class="form-input"
            placeholder="请输入价格/小时"
            v-model="form.price"
            type="number"
            :class="{ 'error-input': v$.price.$error }"
          />
          <text v-if="v$.price.$error" class="error-text">{{ v$.price.$errors[0].$message }}</text>
        </view>

        <view class="form-item form-row">
          <view class="form-col">
            <text class="required">*</text>
            <text class="form-label">教学学科</text>
            <view
              class="select-wrapper"
              :class="{ 'error-input': v$.subject.$error }"
              @click="showSubjectPicker = true"
            >
              <text class="select-text">{{ form.subject || '请选择学科' }}</text>
              <text class="select-arrow">></text>
            </view>
            <text v-if="v$.subject.$error" class="error-text">
              {{ v$.subject.$errors[0].$message }}
            </text>
          </view>

          <view class="form-col">
            <text class="required">*</text>
            <text class="form-label">教龄</text>
            <input
              class="form-input"
              placeholder="请输入教龄"
              v-model="form.experience"
              type="number"
              :class="{ 'error-input': v$.experience.$error }"
            />
            <text v-if="v$.experience.$error" class="error-text">
              {{ v$.experience.$errors[0].$message }}
            </text>
          </view>
        </view>

        <view class="form-item">
          <text class="required">*</text>
          <text class="form-label">选择位置</text>
          <view
            class="select-wrapper"
            :class="{ 'error-input': v$.location.$error }"
            @click="showLocationPicker = true"
          >
            <text class="select-text location-icon">📍 {{ form.location || '请选择位置:' }}</text>
            <text class="select-arrow">></text>
          </view>
          <text v-if="v$.location.$error" class="error-text">
            {{ v$.location.$errors[0].$message }}
          </text>
        </view>

        <view class="form-item">
          <text class="required">*</text>
          <text class="form-label">上传照片</text>
          <view
            class="upload-area"
            :class="{ 'error-input': v$.photo.$error }"
            @click="choosePhoto"
          >
            <image v-if="form.photo" class="photo-preview" :src="form.photo" mode="aspectFill" />
            <text v-else class="upload-icon">+</text>
          </view>
          <text class="upload-tip">上传2寸图片</text>
          <text v-if="v$.photo.$error" class="error-text">{{ v$.photo.$errors[0].$message }}</text>
        </view>

        <view class="form-item">
          <text class="required">*</text>
          <text class="form-label">最高学历</text>
          <input
            class="form-input"
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
          <text class="form-label">毕业院校</text>
          <input
            class="form-input"
            placeholder="请输入"
            v-model="form.school"
            :class="{ 'error-input': v$.school.$error }"
          />
          <text v-if="v$.school.$error" class="error-text">
            {{ v$.school.$errors[0].$message }}
          </text>
        </view>

        <view class="form-item">
          <text class="required">*</text>
          <text class="form-label">授课方式</text>
          <view class="teaching-methods">
            <view
              v-for="(method, index) in teachingMethods"
              :key="index"
              class="method-option"
              :class="{ active: form.teachingMethod === method }"
              @click="form.teachingMethod = method"
            >
              <text>{{ method }}</text>
            </view>
          </view>
          <text v-if="v$.teachingMethod.$error" class="error-text">
            {{ v$.teachingMethod.$errors[0].$message }}
          </text>
        </view>
      </view>
    </view>

    <view class="next-button" @click="submitForm">
      <text>{{ submitting ? '提交中...' : '下一步' }}</text>
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
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, minLength, minValue, maxValue } from '@vuelidate/validators'
import PageHeader from '../../components/PageHeader.vue'

// 表单数据
const form = reactive({
  nickname: '',
  name: '',
  phone: '',
  price: '',
  subject: '',
  experience: '',
  location: '',
  photo: '',
  education: '',
  school: '',
  teachingMethod: '学生上门',
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
    nickname: {
      required: helpers.withMessage('请输入昵称', required),
      minLength: helpers.withMessage('昵称至少2个字符', minLength(2)),
    },
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
    price: {
      required: helpers.withMessage('请输入价格', required),
      minValue: helpers.withMessage('价格必须大于0', minValue(1)),
    },
    subject: { required: helpers.withMessage('请选择学科', required) },
    experience: {
      required: helpers.withMessage('请输入教龄', required),
      minValue: helpers.withMessage('教龄必须大于0', minValue(1)),
      maxValue: helpers.withMessage('教龄不能超过50年', maxValue(50)),
    },
    location: { required: helpers.withMessage('请选择位置', required) },
    photo: { required: helpers.withMessage('请上传照片', required) },
    education: { required: helpers.withMessage('请输入最高学历', required) },
    school: { required: helpers.withMessage('请输入毕业院校', required) },
    teachingMethod: { required: helpers.withMessage('请选择授课方式', required) },
  }
})

// 初始化Vuelidate
const v$ = useVuelidate(rules, form)

// 控制模态框显示
const showLocationPicker = ref(false)
const showSubjectPicker = ref(false)
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

// 选择照片 (模拟功能)
function choosePhoto() {
  // 在真实环境中，这里应该调用uni.chooseImage等原生API
  // 这里只是模拟选择照片
  form.photo = 'https://source.unsplash.com/featured/?portrait'

  // 弹出提示
  console.log('选择照片成功')
}

// 提交表单
async function submitForm() {
  const isFormValid = await v$.value.$validate()

  if (!isFormValid) {
    console.log('表单验证失败')
    // 这里应该使用uni.showToast，但为了避免错误，使用console.log
    console.log('请正确填写所有必填项')
    return
  }

  // 模拟API请求
  submitting.value = true

  setTimeout(() => {
    submitting.value = false

    // 将数据存储到localStorage，实际环境中应该使用API提交
    localStorage.setItem('teacherRegistrationBasicInfo', JSON.stringify(form))

    // 跳转到下一步
    console.log('提交表单数据:', form)

    // 跳转到上传资料页面
    // 使用模拟导航代替uni.navigateTo
    window.location.href = '/pages/upload-documents/index'
  }, 1500)
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  padding-bottom: 60px;
  background-color: #f8f8f8;
}

.process-bar {
  display: flex;
  justify-content: space-around;
  padding: 15px 0;
  background-color: white;
}

.process-item {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  color: #999;
}

.process-icon {
  margin-bottom: 5px;
  font-size: 24px;
}

.process-text {
  font-size: 14px;
}

.active {
  color: #5bbdca;
}

.form-container {
  padding: 15px;
  margin-top: 15px;
  background-color: white;
}

.form-group {
  margin-bottom: 15px;
}

.form-item {
  position: relative;
  margin-bottom: 15px;
}

.required {
  position: absolute;
  top: 0;
  left: -8px;
  color: #ff4d4f;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

.form-input {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  font-size: 14px;
  color: #333;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
}

.error-input {
  background-color: #fff2f0;
  border-color: #ff4d4f !important;
}

.error-text {
  margin-top: 5px;
  font-size: 12px;
  color: #ff4d4f;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-col {
  position: relative;
  flex: 1;
}

.select-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  padding: 0 12px;
  font-size: 14px;
  color: #999;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
}

.select-text {
  flex: 1;
}

.location-icon {
  display: flex;
  align-items: center;
}

.select-arrow {
  color: #ccc;
}

.upload-area {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  margin-bottom: 8px;
  overflow: hidden;
  border: 1px dashed #ccc;
}

.photo-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-icon {
  font-size: 30px;
  color: #ccc;
}

.upload-tip {
  font-size: 12px;
  color: #999;
}

.teaching-methods {
  display: flex;
  gap: 10px;
}

.method-option {
  padding: 8px 15px;
  font-size: 14px;
  color: #666;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.method-option.active {
  color: #5bbdca;
  background-color: #e0f7fa;
}

.next-button {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  font-size: 16px;
  color: white;
  background-color: #5bbdca;
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
</style>
