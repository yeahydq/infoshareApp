<template>
  <div class="professional-review-container" v-loading="loading">
    <div class="page-header">
      <h2>专业人士审核</h2>
      <div class="actions">
        <el-button @click="goBack">返回列表</el-button>
      </div>
    </div>

    <div v-if="professional" class="review-content">
      <el-row :gutter="20">
        <el-col :span="16">
          <!-- 资质证书审核 -->
          <el-card class="review-card">
            <template #header>
              <div class="card-header">
                <span>资质证书审核</span>
              </div>
            </template>

            <div class="document-section">
              <div class="document-item" v-if="professional.idCardFront">
                <div class="doc-header">
                  <h4>身份证正面</h4>
                  <el-tag
                    v-if="reviewStatus.idCard"
                    :type="reviewStatus.idCard === 'pass' ? 'success' : 'danger'"
                  >
                    {{ reviewStatus.idCard === 'pass' ? '已通过' : '未通过' }}
                  </el-tag>
                </div>
                <el-image
                  :src="professional.idCardFront"
                  :preview-src-list="[professional.idCardFront]"
                  fit="cover"
                ></el-image>
                <div class="doc-actions">
                  <el-button type="success" size="small" @click="markDocument('idCard', 'pass')">
                    通过
                  </el-button>
                  <el-button type="danger" size="small" @click="markDocument('idCard', 'fail')">
                    不通过
                  </el-button>
                </div>
              </div>

              <div class="document-item" v-if="professional.idCardBack">
                <div class="doc-header">
                  <h4>身份证背面</h4>
                </div>
                <el-image
                  :src="professional.idCardBack"
                  :preview-src-list="[professional.idCardBack]"
                  fit="cover"
                ></el-image>
              </div>

              <div class="document-item" v-if="professional.qualification">
                <div class="doc-header">
                  <h4>资格证书</h4>
                  <el-tag
                    v-if="reviewStatus.qualification"
                    :type="reviewStatus.qualification === 'pass' ? 'success' : 'danger'"
                  >
                    {{ reviewStatus.qualification === 'pass' ? '已通过' : '未通过' }}
                  </el-tag>
                </div>
                <div
                  v-for="(url, index) in parseMultiUrls(professional.qualification)"
                  :key="`qualification-${index}`"
                  class="certificate-wrapper"
                >
                  <div class="certificate-label">证书 {{ index + 1 }}</div>
                  <el-image
                    :src="url"
                    :preview-src-list="parseMultiUrls(professional.qualification)"
                    :initial-index="index"
                    fit="cover"
                  ></el-image>
                </div>
                <div class="doc-actions">
                  <el-button
                    type="success"
                    size="small"
                    @click="markDocument('qualification', 'pass')"
                  >
                    通过
                  </el-button>
                  <el-button
                    type="danger"
                    size="small"
                    @click="markDocument('qualification', 'fail')"
                  >
                    不通过
                  </el-button>
                </div>
              </div>

              <div class="document-item" v-if="professional.professional">
                <div class="doc-header">
                  <h4>专业证书</h4>
                  <el-tag
                    v-if="reviewStatus.professional"
                    :type="reviewStatus.professional === 'pass' ? 'success' : 'danger'"
                  >
                    {{ reviewStatus.professional === 'pass' ? '已通过' : '未通过' }}
                  </el-tag>
                </div>
                <div
                  v-for="(url, index) in parseMultiUrls(professional.professional)"
                  :key="`professional-${index}`"
                  class="certificate-wrapper"
                >
                  <div class="certificate-label">证书 {{ index + 1 }}</div>
                  <el-image
                    :src="url"
                    :preview-src-list="parseMultiUrls(professional.professional)"
                    :initial-index="index"
                    fit="cover"
                  ></el-image>
                </div>
                <div class="doc-actions">
                  <el-button
                    type="success"
                    size="small"
                    @click="markDocument('professional', 'pass')"
                  >
                    通过
                  </el-button>
                  <el-button
                    type="danger"
                    size="small"
                    @click="markDocument('professional', 'fail')"
                  >
                    不通过
                  </el-button>
                </div>
              </div>

              <div class="document-item" v-if="professional.education">
                <div class="doc-header">
                  <h4>学历证书</h4>
                  <el-tag
                    v-if="reviewStatus.education"
                    :type="reviewStatus.education === 'pass' ? 'success' : 'danger'"
                  >
                    {{ reviewStatus.education === 'pass' ? '已通过' : '未通过' }}
                  </el-tag>
                </div>
                <div
                  v-for="(url, index) in parseMultiUrls(professional.education)"
                  :key="`education-${index}`"
                  class="certificate-wrapper"
                >
                  <div class="certificate-label">证书 {{ index + 1 }}</div>
                  <el-image
                    :src="url"
                    :preview-src-list="parseMultiUrls(professional.education)"
                    :initial-index="index"
                    fit="cover"
                  ></el-image>
                </div>
                <div class="doc-actions">
                  <el-button type="success" size="small" @click="markDocument('education', 'pass')">
                    通过
                  </el-button>
                  <el-button type="danger" size="small" @click="markDocument('education', 'fail')">
                    不通过
                  </el-button>
                </div>
              </div>

              <div class="document-item" v-if="professional.honor">
                <div class="doc-header">
                  <h4>荣誉证书</h4>
                  <el-tag
                    v-if="reviewStatus.honor"
                    :type="reviewStatus.honor === 'pass' ? 'success' : 'danger'"
                  >
                    {{ reviewStatus.honor === 'pass' ? '已通过' : '未通过' }}
                  </el-tag>
                </div>
                <div
                  v-for="(url, index) in parseMultiUrls(professional.honor)"
                  :key="`honor-${index}`"
                  class="certificate-wrapper"
                >
                  <div class="certificate-label">证书 {{ index + 1 }}</div>
                  <el-image
                    :src="url"
                    :preview-src-list="parseMultiUrls(professional.honor)"
                    :initial-index="index"
                    fit="cover"
                  ></el-image>
                </div>
                <div class="doc-actions">
                  <el-button type="success" size="small" @click="markDocument('honor', 'pass')">
                    通过
                  </el-button>
                  <el-button type="danger" size="small" @click="markDocument('honor', 'fail')">
                    不通过
                  </el-button>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 专业信息审核 -->
          <el-card class="review-card">
            <template #header>
              <div class="card-header">
                <span>专业信息审核</span>
              </div>
            </template>

            <el-descriptions direction="vertical" :column="1" border>
              <el-descriptions-item label="专业领域">
                <div>
                  <el-tag
                    v-for="(type, index) in professional.professionalTypes"
                    :key="index"
                    class="type-tag"
                  >
                    {{ type }}
                  </el-tag>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="服务描述">
                {{ professional.serviceDescription || '无' }}
              </el-descriptions-item>
              <el-descriptions-item label="工作经验">
                {{ professional.experience || '无' }}
              </el-descriptions-item>
              <el-descriptions-item label="服务地区">
                {{ professional.selectedCity }} {{ professional.selectedDistrict }}
              </el-descriptions-item>
            </el-descriptions>

            <div class="review-actions">
              <el-button type="success" @click="markProfessionalInfo('pass')">通过</el-button>
              <el-button type="danger" @click="markProfessionalInfo('fail')">不通过</el-button>
            </div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <!-- 申请人信息 -->
          <el-card class="profile-card">
            <template #header>
              <div class="card-header">
                <span>申请人信息</span>
              </div>
            </template>

            <div class="profile-content">
              <el-avatar :size="80" :src="professional.avatarUrl || ''" class="avatar">
                {{ professional.name ? professional.name.substring(0, 1) : '?' }}
              </el-avatar>
              <h3>{{ professional.name }}</h3>
              <p class="info-item">
                <el-icon><icon-phone /></el-icon>
                {{ professional.phone }}
              </p>
              <p class="info-item">
                <el-icon><icon-mail /></el-icon>
                {{ professional.email || '未设置' }}
              </p>
              <p class="info-item">
                <el-icon><icon-location /></el-icon>
                {{ professional.selectedCity }} {{ professional.selectedDistrict }}
              </p>
            </div>
          </el-card>

          <!-- 审核结果 -->
          <el-card class="result-card">
            <template #header>
              <div class="card-header">
                <span>审核结果</span>
              </div>
            </template>

            <div class="result-content">
              <el-form :model="reviewForm" label-position="top">
                <el-form-item label="审核结果">
                  <el-radio-group v-model="reviewForm.status">
                    <el-radio value="approved">通过</el-radio>
                    <el-radio value="rejected">拒绝</el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item label="审核备注" v-if="reviewForm.status === 'rejected'">
                  <el-input
                    v-model="reviewForm.reason"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入拒绝原因"
                  ></el-input>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="submitReview" :disabled="isSubmitting">
                    提交审核结果
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-empty description="未找到该专业人士" v-if="!loading && !professional"></el-empty>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getProfessionalDetail, reviewProfessional } from '@/api/professional'
import {
  Phone as IconPhone,
  Location as IconLocation,
  Message as IconMail,
} from '@element-plus/icons-vue'

// 专业人士类型定义
interface Professional {
  _id?: string
  id?: string
  name?: string
  avatarUrl?: string
  phone?: string
  email?: string
  status?: string
  professionalTypes?: string[]
  serviceDescription?: string
  experience?: string
  selectedCity?: string
  selectedDistrict?: string
  idCardFront?: string
  idCardBack?: string
  qualification?: string
  education?: string
  professional?: string
  professionalCert?: string
  honor?: string
  [key: string]: any
}

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const professional = ref<Professional | null>(null)
const isSubmitting = ref(false)

// 审核表单
const reviewForm = reactive({
  status: 'approved',
  reason: '',
})

// 文档审核状态
const reviewStatus = reactive({
  idCard: '',
  qualification: '',
  professional: '',
  education: '',
  honor: '',
  professionalInfo: '',
})

// 获取专业人士详情
const fetchProfessionalDetail = async () => {
  loading.value = true
  try {
    const id = route.params.id as string
    const response = await getProfessionalDetail(id)
    professional.value = response.data
    loading.value = false
  } catch (error) {
    console.error('获取专业人士详情失败', error)
    loading.value = false
    ElMessage.error('获取专业人士详情失败')
  }
}

// 标记文档审核结果
const markDocument = (type, status) => {
  reviewStatus[type] = status
}

// 标记专业信息审核结果
const markProfessionalInfo = (status) => {
  reviewStatus.professionalInfo = status
  if (status === 'pass') {
    ElMessage.success('已通过专业信息审核')
  } else {
    ElMessage.warning('已标记专业信息不通过')
  }
}

// 检查是否有未通过的文档
const hasFailedDocuments = () => {
  for (const key in reviewStatus) {
    if (reviewStatus[key] === 'fail') {
      return true
    }
  }
  return false
}

// 提交审核
const submitReview = async () => {
  // 如果有未通过的文档但选择了通过，提示确认
  if (reviewForm.status === 'approved' && hasFailedDocuments()) {
    try {
      await ElMessageBox.confirm('有未通过的文档审核项，确定要通过该申请吗？', '确认提交', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
    } catch (e) {
      return // 用户取消
    }
  }

  // 如果拒绝但没有填写原因，提示
  if (reviewForm.status === 'rejected' && !reviewForm.reason) {
    ElMessage.warning('请填写拒绝原因')
    return
  }

  isSubmitting.value = true
  try {
    const id = route.params.id as string
    const response = await reviewProfessional(
      id,
      reviewForm.status,
      reviewForm.status === 'rejected' ? reviewForm.reason : undefined,
    )

    if (response.code === 0) {
      ElMessage.success('审核提交成功')
      // 跳转回列表页面
      router.push('/professionals')
    } else {
      throw new Error(response.message || '操作失败')
    }
  } catch (error) {
    console.error('审核提交失败', error)
    ElMessage.error('审核提交失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}

// 返回列表
const goBack = () => {
  router.push('/professionals')
}

// 处理逗号分隔的URL列表
const parseMultiUrls = (urlString: string): string[] => {
  if (!urlString) return []

  // 如果包含逗号，按逗号分割
  if (urlString.includes(',')) {
    return urlString
      .split(',')
      .map((url) => url.trim())
      .filter((url) => url)
  }

  // 否则返回单个URL的数组
  return [urlString]
}

onMounted(() => {
  fetchProfessionalDetail()
})
</script>

<style scoped>
.professional-review-container {
  padding: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
}

.review-content {
  margin-top: 20px;
}

.review-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.document-section {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.document-item {
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #e9e9e9;
  border-radius: 4px;
}

.doc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.doc-header h4 {
  margin: 0;
}

.doc-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.review-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
}

.profile-card {
  margin-bottom: 20px;
}

.profile-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.avatar {
  margin-bottom: 15px;
}

.info-item {
  display: flex;
  align-items: center;
  margin: 5px 0;
  color: #606266;
}

.info-item .el-icon {
  margin-right: 8px;
}

.result-card {
  margin-bottom: 20px;
}

.type-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

.el-image {
  width: 100%;
  height: 200px;
  border-radius: 4px;
}

.certificate-wrapper {
  margin-bottom: 15px;
}

.certificate-label {
  margin-bottom: 5px;
  font-size: 13px;
  color: #606266;
}
</style>
