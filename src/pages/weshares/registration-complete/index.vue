<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '专业人员注册' },
}
</route>

<template>
  <view class="container">
    <view class="process-bar">
      <view class="process-item">
        <view class="process-icon">📝</view>
        <view class="process-text">基本信息</view>
      </view>
      <view class="process-item">
        <view class="process-icon">📎</view>
        <view class="process-text">上传资料</view>
      </view>
      <view class="process-item active">
        <view class="process-icon">✓</view>
        <view class="process-text">完成</view>
      </view>
    </view>

    <view class="completion-container">
      <view class="completion-image">
        <image
          class="illustration"
          src="https://source.unsplash.com/featured/?check,list,complete"
          mode="aspectFit"
        />
      </view>
      <view class="completion-text">填写完成</view>
      <view class="completion-message">
        您的专业人员资料已成功提交，我们将在3个工作日内审核完成
      </view>
    </view>

    <view class="registration-info" v-if="combinedFormData">
      <view class="info-title">提交的信息</view>

      <view class="info-section">
        <view class="section-title">基本信息</view>
        <view class="info-item">
          <text class="info-label">姓名:</text>
          <text class="info-value">{{ basicInfo.name }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">联系电话:</text>
          <text class="info-value">{{ basicInfo.phone }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">专业类型:</text>
          <text class="info-value">{{ basicInfo.subject }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">从业年限:</text>
          <text class="info-value">{{ basicInfo.experience }} 年</text>
        </view>
        <view class="info-item">
          <text class="info-label">服务方式:</text>
          <text class="info-value">{{ basicInfo.teachingMethod }}</text>
        </view>
      </view>

      <view class="info-section">
        <view class="section-title">个人展示</view>
        <view class="info-item">
          <text class="info-value intro-text">{{ docInfo.personalIntro }}</text>
        </view>
      </view>

      <view class="info-section">
        <view class="section-title">认证资料</view>
        <view class="info-item">
          <text class="info-label">身份证:</text>
          <text class="info-value">已上传</text>
        </view>
        <view class="info-item">
          <text class="info-label">学历证书:</text>
          <text class="info-value">
            {{
              docInfo.educationCerts.length > 0
                ? `已上传${docInfo.educationCerts.length}张`
                : '未上传'
            }}
          </text>
        </view>
        <view class="info-item">
          <text class="info-label">职业证书:</text>
          <text class="info-value">
            {{
              docInfo.professionalCerts.length > 0
                ? `已上传${docInfo.professionalCerts.length}张`
                : '未上传'
            }}
          </text>
        </view>
        <view class="info-item">
          <text class="info-label">荣誉证书:</text>
          <text class="info-value">
            {{ docInfo.honorCerts.length > 0 ? `已上传${docInfo.honorCerts.length}张` : '未上传' }}
          </text>
        </view>
      </view>
    </view>

    <view class="button-group">
      <view class="prev-button" @click="goBack">
        <text>上一步</text>
      </view>
      <view class="submit-button" @click="submitForm">
        <text>{{ submitting ? '提交中...' : '立即提交' }}</text>
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
          <text class="success-message">您的专业人员注册申请已成功提交</text>
          <text class="success-detail">请耐心等待审核，审核结果将通过短信通知您</text>
        </view>
        <view class="modal-footer">
          <view class="modal-btn" @click="goToHome">返回首页</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// 基本信息表单数据
const basicInfo = reactive({
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
  teachingMethod: '',
})

// 上传资料表单数据
const docInfo = reactive({
  personalIntro: '',
  idCardFront: '',
  idCardBack: '',
  educationCerts: [],
  professionalCerts: [],
  honorCerts: [],
})

// 合并的表单数据
const combinedFormData = ref(false)

// 显示成功模态框
const showSuccessModal = ref(false)

// 是否正在提交
const submitting = ref(false)

// 页面加载时从localStorage获取数据
onMounted(() => {
  // 获取基本信息
  const basicInfoStr = localStorage.getItem('professionalRegisterStep1')
  if (basicInfoStr) {
    try {
      const data = JSON.parse(basicInfoStr)
      Object.keys(data).forEach((key) => {
        if (key in basicInfo) {
          basicInfo[key] = data[key]
        }
      })
    } catch (e) {
      console.error('解析基本信息失败:', e)
    }
  }

  // 获取上传资料信息
  const docInfoStr = localStorage.getItem('professionalRegisterStep2')
  if (docInfoStr) {
    try {
      const data = JSON.parse(docInfoStr)
      Object.keys(data).forEach((key) => {
        if (key in docInfo) {
          docInfo[key] = data[key]
        }
      })
    } catch (e) {
      console.error('解析上传资料信息失败:', e)
    }
  }

  // 检查是否有数据
  if (basicInfo.name && docInfo.personalIntro) {
    combinedFormData.value = true
  } else {
    // 如果没有数据，可以设置默认数据（仅用于演示）
    basicInfo.name = '张三'
    basicInfo.phone = '13800138000'
    basicInfo.subject = '专业技能'
    basicInfo.experience = '5'
    basicInfo.teachingMethod = '线上/线下服务'

    docInfo.personalIntro =
      '我是一名拥有5年工作经验的专业人员，熟练掌握本专业的各项技能，注重服务质量和客户体验。可以提供专业、可靠、高效的服务。'
    docInfo.educationCerts = ['https://source.unsplash.com/featured/?diploma']
    docInfo.professionalCerts = []
    docInfo.honorCerts = ['https://source.unsplash.com/featured/?award']

    combinedFormData.value = true
  }
})

// 返回上一步
function goBack() {
  window.location.href = '/pages/upload-documents/index'
}

// 提交表单
function submitForm() {
  // 模拟API请求
  submitting.value = true

  setTimeout(() => {
    submitting.value = false
    showSuccessModal.value = true

    // 合并所有表单数据
    const allFormData = {
      ...basicInfo,
      ...docInfo,
    }

    // 将所有数据存储到localStorage（模拟API提交）
    localStorage.setItem('teacherRegistrationComplete', JSON.stringify(allFormData))

    console.log('提交所有表单数据:', allFormData)
  }, 1500)
}

// 返回首页
function goToHome() {
  // 清除localStorage中的临时数据
  localStorage.removeItem('teacherRegistrationBasicInfo')
  localStorage.removeItem('teacherRegistrationDocuments')

  // 跳转到首页
  window.location.href = '/pages/index/index'
}
</script>
<style>
@import './style.css';
</style>
