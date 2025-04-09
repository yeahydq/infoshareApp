<template>
  <div class="cloud-test-container">
    <h1>云存储访问测试</h1>

    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <h2>测试云存储路径访问权限</h2>
        </div>
      </template>

      <el-form :model="form" label-width="120px">
        <el-form-item label="云存储路径">
          <el-input
            v-model="form.cloudPath"
            placeholder="请输入cloud://格式的云存储路径"
            clearable
          ></el-input>
          <div class="input-tip">例如: cloud://xx-envid.bucket/path/to/image.jpg</div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="testDirectAccess" :loading="loading.direct">
            测试直接访问
          </el-button>
          <el-button type="success" @click="testSignedAccess" :loading="loading.signed">
            测试签名URL访问
          </el-button>
          <el-button @click="clearResults">清除结果</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card v-if="proxyUrl" class="result-card">
      <template #header>
        <div class="card-header">
          <h2>代理URL结果</h2>
        </div>
      </template>

      <div class="url-section">
        <div class="url-label">代理URL:</div>
        <div class="url-value">{{ proxyUrl }}</div>
        <el-button size="small" @click="copyUrl(proxyUrl)">复制</el-button>
      </div>

      <div class="image-preview">
        <h3>图片预览 (代理URL):</h3>
        <el-image
          :src="proxyUrl"
          fit="contain"
          :preview-src-list="[proxyUrl]"
          @error="handleImageError"
        >
          <template #error>
            <div class="image-error">
              <el-icon><PictureRounded /></el-icon>
              <div>加载失败</div>
            </div>
          </template>
        </el-image>
      </div>
    </el-card>

    <el-card v-if="signedUrl" class="result-card">
      <template #header>
        <div class="card-header">
          <h2>签名URL结果</h2>
        </div>
      </template>

      <div class="url-section">
        <div class="url-label">签名URL:</div>
        <div class="url-value">{{ signedUrl }}</div>
        <el-button size="small" @click="copyUrl(signedUrl)">复制</el-button>
      </div>

      <div class="image-preview">
        <h3>图片预览 (签名URL):</h3>
        <el-image
          :src="signedUrl"
          fit="contain"
          :preview-src-list="[signedUrl]"
          @error="handleSignedImageError"
        >
          <template #error>
            <div class="image-error">
              <el-icon><PictureRounded /></el-icon>
              <div>加载失败</div>
            </div>
          </template>
        </el-image>
      </div>
    </el-card>

    <el-card v-if="logs.length > 0" class="logs-card">
      <template #header>
        <div class="card-header">
          <h2>测试日志</h2>
          <el-button type="danger" size="small" @click="clearLogs">清除日志</el-button>
        </div>
      </template>

      <div class="logs-container">
        <div v-for="(log, index) in logs" :key="index" :class="['log-item', `log-${log.type}`]">
          <span class="log-time">{{ log.time }}</span>
          <span :class="['log-badge', `badge-${log.type}`]">{{ log.type }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
    </el-card>

    <el-dialog v-model="errorDialog.visible" :title="errorDialog.title" width="50%">
      <div class="error-details">
        <pre>{{ errorDialog.details }}</pre>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="errorDialog.visible = false">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 表单数据
const form = reactive({
  cloudPath: '',
})

// 加载状态
const loading = reactive({
  direct: false,
  signed: false,
})

// URL结果
const proxyUrl = ref('')
const signedUrl = ref('')

// 日志
const logs = ref<{ type: string; message: string; time: string }[]>([])

// 错误对话框
const errorDialog = reactive({
  visible: false,
  title: '',
  details: '',
})

// 添加日志
const addLog = (type: 'info' | 'success' | 'warning' | 'error', message: string) => {
  const time = new Date().toLocaleTimeString()
  logs.value.unshift({ type, message, time })
}

// 清除日志
const clearLogs = () => {
  logs.value = []
}

// 清除结果
const clearResults = () => {
  proxyUrl.value = ''
  signedUrl.value = ''
}

// 复制URL到剪贴板
const copyUrl = (url: string) => {
  navigator.clipboard
    .writeText(url)
    .then(() => {
      ElMessage.success('已复制到剪贴板')
    })
    .catch(() => {
      ElMessage.error('复制失败')
    })
}

// 测试直接访问
const testDirectAccess = () => {
  if (!form.cloudPath) {
    ElMessage.warning('请输入云存储路径')
    return
  }

  // 清理URL，移除空白字符
  const cloudPath = form.cloudPath.trim()

  if (!cloudPath.startsWith('cloud://')) {
    ElMessage.warning('云存储路径必须以cloud://开头')
    return
  }

  loading.direct = true
  addLog('info', `开始测试直接访问: ${cloudPath}`)

  // 构建代理URL
  proxyUrl.value = `/proxy/cloud-file?url=${encodeURIComponent(cloudPath)}`
  addLog('success', `生成代理URL: ${proxyUrl.value}`)

  loading.direct = false
}

// 测试签名URL访问
const testSignedAccess = async () => {
  if (!form.cloudPath) {
    ElMessage.warning('请输入云存储路径')
    return
  }

  // 清理URL，移除空白字符
  const cloudPath = form.cloudPath.trim()

  if (!cloudPath.startsWith('cloud://')) {
    ElMessage.warning('云存储路径必须以cloud://开头')
    return
  }

  loading.signed = true
  addLog('info', `开始测试签名URL访问: ${cloudPath}`)

  try {
    const response = await axios.post('/api/cloud/getSignedUrl', {
      url: cloudPath,
    })

    if (response.data && response.data.code === 0 && response.data.data) {
      signedUrl.value = response.data.data.url
      addLog('success', `获取签名URL成功: ${signedUrl.value}`)
    } else {
      addLog('error', `获取签名URL失败: ${response.data?.message || '未知错误'}`)
      showErrorDialog('获取签名URL失败', JSON.stringify(response.data, null, 2))
    }
  } catch (error) {
    console.error('获取签名URL失败:', error)

    let errorMessage = '未知错误'
    let errorDetails = ''

    if (axios.isAxiosError(error)) {
      errorMessage = `请求失败: ${error.message}`
      errorDetails = JSON.stringify(
        {
          status: error.response?.status,
          data: error.response?.data,
        },
        null,
        2,
      )
    } else if (error instanceof Error) {
      errorMessage = error.message
      errorDetails = error.stack || ''
    }

    addLog('error', `获取签名URL失败: ${errorMessage}`)
    showErrorDialog('获取签名URL失败', errorDetails)
  } finally {
    loading.signed = false
  }
}

// 显示错误详情对话框
const showErrorDialog = (title: string, details: string) => {
  errorDialog.title = title
  errorDialog.details = details
  errorDialog.visible = true
}

// 处理图片加载错误
const handleImageError = (e: Event) => {
  addLog('error', '代理URL图片加载失败')
  console.error('代理URL图片加载失败:', e)
}

// 处理签名图片加载错误
const handleSignedImageError = (e: Event) => {
  addLog('error', '签名URL图片加载失败')
  console.error('签名URL图片加载失败:', e)
}
</script>

<style scoped>
.cloud-test-container {
  max-width: 1200px;
  padding: 20px;
  margin: 0 auto;
}

.test-card,
.result-card,
.logs-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
}

.input-tip {
  margin-top: 5px;
  font-size: 12px;
  color: #909399;
}

.url-section {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.url-label {
  margin-right: 10px;
  font-weight: bold;
  white-space: nowrap;
}

.url-value {
  flex: 1;
  margin-right: 10px;
  font-family: monospace;
  color: #409eff;
  word-break: break-all;
}

.image-preview {
  margin-top: 20px;
}

.image-preview h3 {
  margin-bottom: 10px;
  font-size: 16px;
}

.image-preview .el-image {
  width: 100%;
  max-height: 300px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  color: #909399;
  background-color: #f5f7fa;
}

.image-error .el-icon {
  margin-bottom: 10px;
  font-size: 40px;
}

.logs-container {
  max-height: 300px;
  overflow-y: auto;
}

.log-item {
  padding: 8px 12px;
  margin-bottom: 5px;
  font-family: monospace;
  border-radius: 4px;
}

.log-info {
  background-color: #f4f4f5;
}

.log-success {
  background-color: #f0f9eb;
}

.log-warning {
  background-color: #fdf6ec;
}

.log-error {
  background-color: #fef0f0;
}

.log-time {
  margin-right: 10px;
  color: #606266;
}

.log-badge {
  display: inline-block;
  padding: 2px 6px;
  margin-right: 10px;
  font-size: 12px;
  line-height: 1;
  color: white;
  border-radius: 4px;
}

.badge-info {
  background-color: #909399;
}

.badge-success {
  background-color: #67c23a;
}

.badge-warning {
  background-color: #e6a23c;
}

.badge-error {
  background-color: #f56c6c;
}

.log-message {
  word-break: break-all;
}

.error-details {
  max-height: 300px;
  padding: 10px;
  overflow-y: auto;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.error-details pre {
  margin: 0;
  word-break: break-all;
  white-space: pre-wrap;
}
</style>
