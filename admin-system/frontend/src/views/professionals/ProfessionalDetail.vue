<template>
  <div class="professional-detail">
    <div class="page-header">
      <h2>专业人士详情</h2>
      <div class="actions">
        <el-button @click="goBack">返回列表</el-button>
      </div>
    </div>

    <el-card v-loading="loading">
      <template v-if="professional">
        <div class="section basic-info">
          <h3>基本信息</h3>
          <div class="profile-header">
            <el-avatar
              :size="100"
              :src="professional.avatarUrl || professional.avatar"
              @error="(e) => handleImageError('头像加载失败', e)"
            >
              <div class="avatar-fallback">
                {{ professional.name ? professional.name.substring(0, 1) : '?' }}
              </div>
            </el-avatar>
            <div class="profile-info">
              <h2 class="name">{{ professional.name || '未提供姓名' }}</h2>
              <div class="status">
                <el-tag :type="getStatusTagType(professional.status)" effect="dark">
                  {{ getStatusText(professional.status) }}
                </el-tag>
              </div>
              <div class="basic-meta">
                <div>
                  <strong>手机号:</strong>
                  {{ professional.phone || '未提供' }}
                </div>
                <div>
                  <strong>邮箱:</strong>
                  {{ professional.email || '未提供' }}
                </div>
                <div>
                  <strong>注册时间:</strong>
                  {{ formatDate(professional.createTime) }}
                </div>
              </div>
            </div>
            <div class="profile-actions">
              <template v-if="professional.status === 'pending'">
                <el-button
                  type="success"
                  @click="
                    router.push(`/professionals/review/${professional.id || professional._id}`)
                  "
                >
                  审核申请
                </el-button>
              </template>
              <template v-if="professional.status === 'approved'">
                <el-button type="warning" @click="freezeAccount">冻结账号</el-button>
              </template>
              <template
                v-if="professional.status === 'frozen' || professional.status === 'disabled'"
              >
                <el-button type="success" @click="unfreezeAccount">解冻账号</el-button>
              </template>
            </div>
          </div>
        </div>

        <div class="section service-info">
          <h3>服务信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="服务类型">
              <el-tag
                v-for="(type, index) in professional.professionalTypes"
                :key="index"
                class="service-tag"
              >
                {{ type }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="从业经验">
              {{ professional.experience || '未提供' }}
            </el-descriptions-item>
            <el-descriptions-item label="服务区域">
              {{ professional.serviceArea || professional.selectedCity || '未提供' }}
            </el-descriptions-item>
            <el-descriptions-item label="服务描述" :span="2">
              {{ professional.serviceDescription || '未提供服务描述' }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="section certificates">
          <h3>资质证书</h3>
          <el-collapse>
            <el-collapse-item title="身份证" name="idCard">
              <div
                v-if="professional.idCardFront || professional.idCardBack"
                class="certificate-images"
              >
                <div v-if="professional.idCardFront" class="certificate-item">
                  <h4>身份证正面</h4>
                  <el-image
                    :src="professional.idCardFront"
                    :preview-src-list="[professional.idCardFront]"
                    fit="cover"
                    @error="(e) => handleImageError('身份证正面加载失败', e)"
                  >
                    <template #error>
                      <div class="image-error">
                        <el-icon><PictureRounded /></el-icon>
                        <div class="error-text">身份证正面加载失败</div>
                      </div>
                    </template>
                  </el-image>
                </div>
                <div v-if="professional.idCardBack" class="certificate-item">
                  <h4>身份证反面</h4>
                  <el-image
                    :src="professional.idCardBack"
                    :preview-src-list="[professional.idCardBack]"
                    fit="cover"
                    @error="(e) => handleImageError('身份证反面加载失败', e)"
                  >
                    <template #error>
                      <div class="image-error">
                        <el-icon><PictureRounded /></el-icon>
                        <div class="error-text">身份证反面加载失败</div>
                      </div>
                    </template>
                  </el-image>
                </div>
              </div>
              <el-empty v-else description="未上传身份证照片"></el-empty>
            </el-collapse-item>
            <el-collapse-item title="资格证书" name="qualification">
              <div v-if="professional.qualification" class="certificate-images">
                <div class="certificate-item">
                  <el-image
                    :src="professional.qualification"
                    :preview-src-list="[professional.qualification]"
                    fit="cover"
                    @error="(e) => handleImageError('资格证书加载失败', e)"
                  >
                    <template #error>
                      <div class="image-error">
                        <el-icon><PictureRounded /></el-icon>
                        <div class="error-text">资格证书加载失败</div>
                      </div>
                    </template>
                  </el-image>
                </div>
              </div>
              <el-empty v-else description="未上传资格证书"></el-empty>
            </el-collapse-item>
            <el-collapse-item title="教育证明" name="education">
              <div v-if="professional.education" class="certificate-images">
                <div class="certificate-item">
                  <el-image
                    :src="professional.education"
                    :preview-src-list="[professional.education]"
                    fit="cover"
                    @error="(e) => handleImageError('教育证明加载失败', e)"
                  >
                    <template #error>
                      <div class="image-error">
                        <el-icon><PictureRounded /></el-icon>
                        <div class="error-text">教育证明加载失败</div>
                      </div>
                    </template>
                  </el-image>
                </div>
              </div>
              <el-empty v-else description="未上传教育证明"></el-empty>
            </el-collapse-item>
            <el-collapse-item title="职业资格" name="professional">
              <div v-if="professional.professional" class="certificate-images">
                <div class="certificate-item">
                  <el-image
                    :src="professional.professional"
                    :preview-src-list="[professional.professional]"
                    fit="cover"
                    @error="(e) => handleImageError('职业资格证明加载失败', e)"
                  >
                    <template #error>
                      <div class="image-error">
                        <el-icon><PictureRounded /></el-icon>
                        <div class="error-text">职业资格证明加载失败</div>
                      </div>
                    </template>
                  </el-image>
                </div>
              </div>
              <el-empty v-else description="未上传职业资格证明"></el-empty>
            </el-collapse-item>
            <el-collapse-item title="荣誉证书" name="honor">
              <div v-if="professional.honor" class="certificate-images">
                <div class="certificate-item">
                  <el-image
                    :src="professional.honor"
                    :preview-src-list="[professional.honor]"
                    fit="cover"
                    @error="(e) => handleImageError('荣誉证书加载失败', e)"
                  >
                    <template #error>
                      <div class="image-error">
                        <el-icon><PictureRounded /></el-icon>
                        <div class="error-text">荣誉证书加载失败</div>
                      </div>
                    </template>
                  </el-image>
                </div>
              </div>
              <el-empty v-else description="未上传荣誉证书"></el-empty>
            </el-collapse-item>
          </el-collapse>
        </div>

        <div v-if="professional.status === 'rejected'" class="section reject-info">
          <h3>拒绝原因</h3>
          <el-alert type="error" :closable="false" show-icon>
            <div class="reject-reason">{{ professional.rejectReason || '无具体原因提供' }}</div>
            <div class="reject-time" v-if="professional.updateTime">
              拒绝时间: {{ formatDate(professional.updateTime) }}
            </div>
          </el-alert>
        </div>
      </template>
      <template v-else-if="!loading">
        <el-empty description="未找到专业人士信息"></el-empty>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import ElMessageBox from 'element-plus/es/components/message-box/index'
import {
  processCloudUrl,
  processMultiUrls,
  handleImageError as handleCloudImageError,
} from '@/utils/cloudUtils'
import axios from 'axios'

interface Professional {
  _id?: string
  id?: string
  name?: string
  avatarUrl?: string
  avatar?: string
  phone?: string
  email?: string
  status?: string
  createTime?: string
  updateTime?: string
  professionalTypes?: string[]
  experience?: string
  serviceArea?: string
  selectedCity?: string
  serviceDescription?: string
  idCardFront?: string
  idCardBack?: string
  qualification?: string
  education?: string
  professional?: string
  honor?: string
  rejectReason?: string
}

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const professional = ref<Professional | null>(null)

// 获取专业人士详情
const fetchProfessionalDetail = async () => {
  const id = route.params.id
  console.log('获取专业人士详情，ID:', id)

  if (!id) {
    ElMessage.error('缺少专业人士ID')
    loading.value = false
    return
  }

  try {
    loading.value = true
    console.log(`请求API: /api/professionals/${id}`)
    const response = await axios.get(`/api/professionals/${id}`)
    console.log('专业人士详情响应:', response.data)

    if (response.data && response.data.code === 0 && response.data.data) {
      // 处理数据
      const data = response.data.data

      // 处理证书URL
      if (data.idCardFront) data.idCardFront = processCloudUrl(data.idCardFront)
      if (data.idCardBack) data.idCardBack = processCloudUrl(data.idCardBack)
      if (data.qualification) data.qualification = processMultiUrls(data.qualification)
      if (data.education) data.education = processMultiUrls(data.education)
      if (data.professional) data.professional = processMultiUrls(data.professional)
      if (data.honor) data.honor = processMultiUrls(data.honor)
      if (data.avatarUrl) data.avatarUrl = processCloudUrl(data.avatarUrl)

      professional.value = {
        ...data,
        id: data.id || data._id, // 确保ID字段统一
        // 确保其他必要字段
        status: data.status || 'pending',
        professionalTypes: data.professionalTypes || (data.serviceType ? [data.serviceType] : []),
        phone: data.phone || '未提供',
        email: data.email || '未提供',
        name: data.name || '未命名专业人士',
        avatar: processCloudUrl(data.avatar),
      }
      console.log('处理后的专业人士数据:', professional.value)
    } else {
      console.error('返回数据格式错误:', response.data)
      ElMessage.error(response.data?.message || '获取专业人士详情失败')
      professional.value = null
    }
  } catch (error) {
    console.error('获取专业人士详情失败', error)
    if (axios.isAxiosError(error) && error.response) {
      console.error('API错误响应:', error.response.data)
      ElMessage.error(error.response.data?.message || '获取专业人士详情失败，请重试')
    } else {
      ElMessage.error('网络错误，请检查连接并重试')
    }
    professional.value = null
  } finally {
    loading.value = false
  }
}

// 冻结账号
const freezeAccount = async () => {
  if (!professional.value) return
  try {
    await ElMessageBox.confirm('确定要冻结该专业人士账号吗？冻结后将暂停其接单功能。', '冻结账号', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const id = professional.value.id || professional.value._id
    // 调用后端API冻结账号
    const response = await axios.post(`/api/professionals/${id}/freeze`)
    console.log('冻结账号响应:', response.data)

    if (response.data && response.data.code === 0) {
      ElMessage.success('账号已冻结')
      // 重新获取详情
      await fetchProfessionalDetail()
    } else {
      throw new Error(response.data?.message || '操作失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('冻结账号失败', error)
      ElMessage.error(error instanceof Error ? error.message : '冻结账号失败，请重试')
    }
  }
}

// 解冻账号
const unfreezeAccount = async () => {
  if (!professional.value) return
  try {
    await ElMessageBox.confirm('确定要解冻该专业人士账号吗？解冻后将恢复其接单功能。', '解冻账号', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success',
    })

    const id = professional.value.id || professional.value._id
    // 调用后端API解冻账号
    const response = await axios.post(`/api/professionals/${id}/unfreeze`)
    console.log('解冻账号响应:', response.data)

    if (response.data && response.data.code === 0) {
      ElMessage.success('账号已解冻')
      // 重新获取详情
      await fetchProfessionalDetail()
    } else {
      throw new Error(response.data?.message || '操作失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('解冻账号失败', error)
      ElMessage.error(error instanceof Error ? error.message : '解冻账号失败，请重试')
    }
  }
}

// 返回列表页
const goBack = () => {
  router.push('/professionals')
}

// 日期格式化
const formatDate = (dateString) => {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  return date.toLocaleString()
}

// 获取状态标签类型
const getStatusTagType = (status) => {
  const statusMap = {
    approved: 'success',
    pending: 'warning',
    rejected: 'info',
    frozen: 'danger',
    disabled: 'danger',
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    approved: '已认证',
    pending: '待审核',
    rejected: '已拒绝',
    frozen: '已冻结',
    disabled: '已禁用',
  }
  return statusMap[status] || '未知'
}

// 图片加载失败处理
const handleImageError = (message: string, event?: Event) => {
  console.error(`图片加载失败: ${message}`)

  // 使用工具函数处理图片加载错误
  if (event) {
    handleCloudImageError(event)
  }
}

onMounted(() => {
  fetchProfessionalDetail()
})
</script>

<style scoped>
.professional-detail {
  padding: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section {
  margin-bottom: 30px;
}

.section h3 {
  padding-bottom: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.profile-header {
  display: flex;
  margin-bottom: 20px;
}

.profile-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-left: 20px;
}

.profile-info .name {
  margin: 0 0 10px 0;
}

.profile-info .status {
  margin-bottom: 10px;
}

.basic-meta {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 10px;
}

.profile-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
  justify-content: center;
}

.service-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.certificate-images {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.certificate-item {
  width: 300px;
}

.certificate-item h4 {
  margin-bottom: 10px;
}

.certificate-item .el-image {
  width: 100%;
  height: 200px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.reject-info {
  padding: 15px;
  background-color: #fef0f0;
  border: 1px solid #f56c6c;
  border-radius: 4px;
}

.reject-reason {
  font-weight: bold;
}

.reject-time {
  margin-top: 10px;
  font-size: 0.9em;
  color: #666;
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  background-color: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.image-error .el-icon {
  margin-bottom: 10px;
  font-size: 48px;
  color: #909399;
}

.error-text {
  font-size: 14px;
  color: #909399;
}

.avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 36px;
  font-weight: bold;
  color: #909399;
  background-color: #f5f7fa;
}
</style>
