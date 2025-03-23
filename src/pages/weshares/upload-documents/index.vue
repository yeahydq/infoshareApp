<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '教员入驻' },
}
</route>

<template>
  <view class="container">
    <page-header title="教员入驻" />

    <view class="process-bar">
      <view class="process-item">
        <view class="process-icon">📝</view>
        <view class="process-text">基本信息</view>
      </view>
      <view class="process-item active">
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
        <view class="form-title">
          <text class="required">*</text>
          <text>个人展示</text>
        </view>
        <view class="textarea-container" :class="{ 'error-input': v$.personalIntro.$error }">
          <textarea
            class="form-textarea"
            placeholder="请输入个人介绍、教学特色等信息"
            v-model="form.personalIntro"
          ></textarea>
        </view>
        <text v-if="v$.personalIntro.$error" class="error-text">
          {{ v$.personalIntro.$errors[0].$message }}
        </text>
      </view>

      <view class="form-group">
        <view class="form-title">
          <text class="required">*</text>
          <text>身份证</text>
        </view>
        <view class="document-upload">
          <view
            class="id-front"
            :class="{ 'error-input': v$.idCardFront.$error }"
            @click="chooseIdCardFront"
          >
            <image
              v-if="form.idCardFront"
              class="id-front-img"
              :src="form.idCardFront"
              mode="aspectFit"
            />
            <text v-else>点击上传正面</text>
          </view>
          <view
            class="id-back"
            :class="{ 'error-input': v$.idCardBack.$error }"
            @click="chooseIdCardBack"
          >
            <image
              v-if="form.idCardBack"
              class="id-back-img"
              :src="form.idCardBack"
              mode="aspectFit"
            />
            <text v-else>点击上传反面</text>
          </view>
        </view>
        <text v-if="v$.idCardFront.$error || v$.idCardBack.$error" class="error-text">
          请上传身份证正反面照片
        </text>
      </view>

      <view class="form-group">
        <view class="form-title">
          <text>学历证书</text>
          <text class="action-text">选填</text>
        </view>
        <view class="document-upload">
          <view class="upload-box" @click="chooseEducationCert">
            <text v-if="form.educationCerts.length > 0" class="cert-count">
              已上传{{ form.educationCerts.length }}张
            </text>
            <text v-else class="upload-icon">+</text>
          </view>
          <view v-if="form.educationCerts.length > 0" class="preview-box">
            <image class="preview-img" :src="form.educationCerts[0]" mode="aspectFit" />
          </view>
        </view>
        <view class="upload-tip">
          <text>图片最多上传9张</text>
        </view>
      </view>

      <view class="form-group">
        <view class="form-title">
          <text>职业证书</text>
          <text class="action-text">选填</text>
        </view>
        <view class="document-upload">
          <view class="upload-box" @click="chooseProfessionalCert">
            <text v-if="form.professionalCerts.length > 0" class="cert-count">
              已上传{{ form.professionalCerts.length }}张
            </text>
            <text v-else class="upload-icon">+</text>
          </view>
          <view v-if="form.professionalCerts.length > 0" class="preview-box">
            <image class="preview-img" :src="form.professionalCerts[0]" mode="aspectFit" />
          </view>
        </view>
        <view class="upload-tip">
          <text>图片最多上传9张</text>
        </view>
      </view>

      <view class="form-group">
        <view class="form-title">
          <text>荣誉证书</text>
          <text class="action-text">选填</text>
        </view>
        <view class="document-upload">
          <view class="upload-box" @click="chooseHonorCert">
            <text v-if="form.honorCerts.length > 0" class="cert-count">
              已上传{{ form.honorCerts.length }}张
            </text>
            <text v-else class="upload-icon">+</text>
          </view>
          <view v-if="form.honorCerts.length > 0" class="preview-box">
            <image class="preview-img" :src="form.honorCerts[0]" mode="aspectFit" />
          </view>
        </view>
        <view class="upload-tip">
          <text>图片最多上传9张</text>
        </view>
      </view>
    </view>

    <view class="button-group">
      <view class="prev-button" @click="goBack">
        <text>上一步</text>
      </view>
      <view class="next-button" @click="submitForm">
        <text>{{ submitting ? '提交中...' : '下一步' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, minLength } from '@vuelidate/validators'
import PageHeader from '../../../components/PageHeader/PageHeader.vue'

// 表单数据
const form = reactive({
  personalIntro: '',
  idCardFront: '',
  idCardBack: '',
  educationCerts: [],
  professionalCerts: [],
  honorCerts: [],
})

// 表单验证规则
const rules = computed(() => {
  return {
    personalIntro: {
      required: helpers.withMessage('请输入个人介绍', required),
      minLength: helpers.withMessage('个人介绍至少10个字符', minLength(10)),
    },
    idCardFront: { required: helpers.withMessage('请上传身份证正面照片', required) },
    idCardBack: { required: helpers.withMessage('请上传身份证反面照片', required) },
  }
})

// 初始化Vuelidate
const v$ = useVuelidate(rules, form)

// 是否正在提交
const submitting = ref(false)

// 选择身份证正面照片
function chooseIdCardFront() {
  // 模拟选择图片
  form.idCardFront = 'https://source.unsplash.com/featured/?id,card'
  console.log('选择身份证正面照片成功')
}

// 选择身份证反面照片
function chooseIdCardBack() {
  // 模拟选择图片
  form.idCardBack = 'https://source.unsplash.com/featured/?id,card,back'
  console.log('选择身份证反面照片成功')
}

// 选择学历证书
function chooseEducationCert() {
  // 模拟选择图片
  if (form.educationCerts.length < 9) {
    form.educationCerts.push('https://source.unsplash.com/featured/?diploma,education')
    console.log('选择学历证书成功')
  } else {
    console.log('最多上传9张图片')
  }
}

// 选择职业证书
function chooseProfessionalCert() {
  // 模拟选择图片
  if (form.professionalCerts.length < 9) {
    form.professionalCerts.push('https://source.unsplash.com/featured/?certificate,professional')
    console.log('选择职业证书成功')
  } else {
    console.log('最多上传9张图片')
  }
}

// 选择荣誉证书
function chooseHonorCert() {
  // 模拟选择图片
  if (form.honorCerts.length < 9) {
    form.honorCerts.push('https://source.unsplash.com/featured/?award,honor')
    console.log('选择荣誉证书成功')
  } else {
    console.log('最多上传9张图片')
  }
}

// 返回上一步
function goBack() {
  console.log('返回上一步')
  // 返回到基本信息页面
  window.location.href = '/pages/teacher-registration/index'
}

// 提交表单
async function submitForm() {
  const isFormValid = await v$.value.$validate()

  if (!isFormValid) {
    console.log('表单验证失败')
    console.log('请正确填写所有必填项')
    return
  }

  // 模拟API请求
  submitting.value = true

  setTimeout(() => {
    submitting.value = false

    // 将数据存储到localStorage，实际环境中应该使用API提交
    localStorage.setItem('teacherRegistrationDocuments', JSON.stringify(form))

    // 跳转到下一步
    console.log('提交表单数据:', form)

    // 跳转到完成页面
    window.location.href = '/pages/registration-complete/index'
  }, 1500)
}
</script>

<style>
@import './style.css';
</style>
