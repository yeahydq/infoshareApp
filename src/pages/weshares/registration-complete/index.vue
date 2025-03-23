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
      <view class="completion-message">您的教员资料已成功提交，我们将在3个工作日内审核完成</view>
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
          <text class="info-label">教学科目:</text>
          <text class="info-value">{{ basicInfo.subject }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">教龄:</text>
          <text class="info-value">{{ basicInfo.experience }} 年</text>
        </view>
        <view class="info-item">
          <text class="info-label">授课方式:</text>
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
          <text class="success-message">您的教员入驻申请已成功提交</text>
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
import PageHeader from '../../components/PageHeader.vue'

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
  const basicInfoStr = localStorage.getItem('teacherRegistrationBasicInfo')
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
  const docInfoStr = localStorage.getItem('teacherRegistrationDocuments')
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
    basicInfo.subject = '数学'
    basicInfo.experience = '5'
    basicInfo.teachingMethod = '网络授课'

    docInfo.personalIntro =
      '我是一名有着5年教学经验的数学老师，擅长通过生动形象的例子帮助学生理解难点知识。'
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

.completion-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  margin-top: 20px;
  background-color: white;
}

.completion-image {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
}

.illustration {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.completion-text {
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: 500;
  color: #333;
}

.completion-message {
  font-size: 14px;
  color: #666;
  text-align: center;
}

.registration-info {
  padding: 15px;
  margin-top: 20px;
  background-color: white;
}

.info-title {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.info-section {
  margin-bottom: 20px;
}

.section-title {
  padding-bottom: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #5bbdca;
  border-bottom: 1px solid #f0f0f0;
}

.info-item {
  display: flex;
  margin-bottom: 10px;
}

.info-label {
  width: 80px;
  font-size: 14px;
  color: #666;
}

.info-value {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.intro-text {
  line-height: 1.5;
}

.button-group {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  height: 50px;
}

.prev-button {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  color: #999;
  background-color: white;
  border-top: 1px solid #f0f0f0;
}

.submit-button {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
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

.modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 15px;
}

.success-icon {
  margin-bottom: 15px;
  font-size: 60px;
  color: #52c41a;
  text-align: center;
}

.success-message {
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
  text-align: center;
}

.success-detail {
  font-size: 14px;
  color: #666;
  text-align: center;
}

.modal-footer {
  display: flex;
  justify-content: center;
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
</style>
