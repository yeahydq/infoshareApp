<template>
  <div class="professional-list">
    <div class="page-header">
      <h2>专业人士管理</h2>
      <div class="actions">
        <el-button type="primary" @click="exportData">导出数据</el-button>
      </div>
    </div>

    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索专业人士姓名/手机号/专业/地区"
        class="search-input"
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <el-select
        v-model="statusFilter"
        placeholder="状态"
        class="filter-select"
        @change="handleStatusFilterChange"
      >
        <el-option label="全部" value="all" />
        <el-option label="待审核" value="pending" />
        <el-option label="已认证" value="approved" />
        <el-option label="已拒绝" value="rejected" />
        <el-option label="已冻结" value="frozen" />
      </el-select>

      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <el-table v-loading="loading" :data="professionals" style="width: 100%" border>
      <el-table-column label="基本信息" min-width="250">
        <template #default="{ row }">
          <div class="professional-info">
            <el-avatar :size="50" :src="row.avatar" />
            <div class="info-text">
              <div class="name">{{ row.name }}</div>
              <div class="phone">{{ row.phone }}</div>
              <div class="tags">
                <el-tag size="small">{{ row.profession }}</el-tag>
                <el-tag size="small" type="info">{{ row.specialization }}</el-tag>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="服务地区" prop="region" min-width="100" />

      <el-table-column label="服务内容" min-width="150">
        <template #default="{ row }">
          <div class="service-types">
            <el-tag
              v-for="(type, index) in row.serviceTypes"
              :key="index"
              size="small"
              class="service-tag"
            >
              {{ type }}
            </el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="从业经验" min-width="100">
        <template #default="{ row }">{{ row.experience }} 年</template>
      </el-table-column>

      <el-table-column label="评分" min-width="120">
        <template #default="{ row }">
          <div v-if="row.reviewCount > 0">
            <el-rate v-model="row.rating" disabled text-color="#ff9900" />
            <div class="review-count">{{ row.reviewCount }} 条评价</div>
          </div>
          <div v-else>暂无评价</div>
        </template>
      </el-table-column>

      <el-table-column label="注册时间" min-width="150" prop="registerTime" />

      <el-table-column label="状态" min-width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)" effect="plain">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="180" fixed="right">
        <template #default="{ row }">
          <div class="action-buttons">
            <el-button link type="primary" @click="viewDetails(row)">查看详情</el-button>

            <template v-if="row.status === 'pending'">
              <el-button link type="primary" @click="reviewApplication(row)">审核</el-button>
            </template>

            <template v-if="row.status === 'approved'">
              <el-button link type="warning" @click="freezeAccount(row)">冻结</el-button>
            </template>

            <template v-if="row.status === 'frozen'">
              <el-button link type="success" @click="unfreezeAccount(row)">解冻</el-button>
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import router from '@/router'
import axios from 'axios'

interface Professional {
  id: string
  name: string
  avatar: string
  phone: string
  gender: string
  profession: string
  specialization: string
  serviceTypes: string[]
  experience: number
  region: string
  city: string
  status: string
  rating: number
  reviewCount: number
  registerTime: string
  lastActiveTime: string
}

const loading = ref(true)
const professionals = ref<Professional[]>([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const searchQuery = ref('')
const statusFilter = ref('all')

// 获取专业人士列表
const fetchProfessionals = async () => {
  loading.value = true
  try {
    console.log('开始请求专业人士列表数据')
    // 调用后端API获取数据
    const response = await axios.get('/api/professionals', {
      params: {
        page: currentPage.value,
        pageSize: pageSize.value,
        query: searchQuery.value,
        status: statusFilter.value !== 'all' ? statusFilter.value : undefined,
      },
    })

    console.log('获取到专业人士列表数据:', response.data)

    if (response.data && response.data.data) {
      // 确保每个专业人士对象都有id字段
      professionals.value = response.data.data.map((pro: any) => ({
        ...pro,
        id: pro.id || pro._id, // 确保有id字段，优先使用id，如果没有则使用_id
      }))

      if (response.data.pagination) {
        total.value = response.data.pagination.total
      }
    } else {
      console.error('返回数据格式错误:', response.data)
      professionals.value = []
      total.value = 0
    }

    loading.value = false
  } catch (error) {
    console.error('获取专业人士列表失败', error)
    loading.value = false
    ElMessage.error('获取数据失败，请重试')

    // 清空数据
    professionals.value = []
    total.value = 0
  }
}

// 查看详情
const viewDetails = (professional: Professional) => {
  router.push(`/professionals/detail/${professional.id}`)
}

// 审核申请
const reviewApplication = (professional: Professional) => {
  router.push(`/professionals/review/${professional.id}`)
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchProfessionals()
}

// 状态过滤变更
const handleStatusFilterChange = () => {
  currentPage.value = 1
  fetchProfessionals()
}

// 分页大小变更
const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchProfessionals()
}

// 分页页码变更
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchProfessionals()
}

// 冻结账号
const freezeAccount = async (professional: Professional) => {
  try {
    await ElMessageBox.confirm(
      `确定要冻结 ${professional.name} 的账号吗？冻结后将暂停其接单功能。`,
      '冻结账号',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      },
    )

    // 调用后端API冻结账号
    await axios.post(`/api/professionals/${professional.id}/freeze`)

    // 重新获取列表数据
    await fetchProfessionals()

    ElMessage.success('账号已冻结')
  } catch (error) {
    if (error !== 'cancel') {
      // 不是用户取消操作
      console.error('冻结账号失败', error)
      ElMessage.error('冻结账号失败，请重试')
    }
  }
}

// 解冻账号
const unfreezeAccount = async (professional: Professional) => {
  try {
    await ElMessageBox.confirm(
      `确定要解冻 ${professional.name} 的账号吗？解冻后将恢复其接单功能。`,
      '解冻账号',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
      },
    )

    // 调用后端API解冻账号
    await axios.post(`/api/professionals/${professional.id}/unfreeze`)

    // 重新获取列表数据
    await fetchProfessionals()

    ElMessage.success('账号已解冻')
  } catch (error) {
    if (error !== 'cancel') {
      // 不是用户取消操作
      console.error('解冻账号失败', error)
      ElMessage.error('解冻账号失败，请重试')
    }
  }
}

// 拒绝申请
const rejectApplication = async (professional: Professional) => {
  try {
    // 在实际实现中，可能需要一个弹窗输入拒绝原因
    await ElMessageBox.confirm(`确定要拒绝 ${professional.name} 的入驻申请吗？`, '拒绝申请', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    // 调用后端API拒绝申请
    await axios.post(`/api/professionals/${professional.id}/reject`, {
      reason: '资质不符合平台要求', // 在实际实现中，这应该是从用户输入获取的
    })

    // 重新获取列表数据
    await fetchProfessionals()

    ElMessage.success('已拒绝该申请')
  } catch (error) {
    if (error !== 'cancel') {
      // 不是用户取消操作
      console.error('拒绝申请失败', error)
      ElMessage.error('拒绝申请失败，请重试')
    }
  }
}

// 导出数据
const exportData = async () => {
  try {
    const response = await axios.get('/api/professionals/export', {
      params: {
        query: searchQuery.value,
        status: statusFilter.value !== 'all' ? statusFilter.value : undefined,
      },
      responseType: 'blob',
    })

    // 创建下载链接
    const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `专业人士数据_${new Date().toISOString().split('T')[0]}.xlsx`
    link.click()
    URL.revokeObjectURL(link.href)

    ElMessage.success('数据导出成功')
  } catch (error) {
    console.error('导出数据失败', error)
    ElMessage.error('导出数据失败，请重试')
  }
}

// 获取状态标签类型
const getStatusTagType = (status: string) => {
  const statusMap: Record<string, string> = {
    approved: 'success',
    pending: 'warning',
    rejected: 'info',
    frozen: 'danger',
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    approved: '已认证',
    pending: '待审核',
    rejected: '已拒绝',
    frozen: '已冻结',
  }
  return statusMap[status] || '未知'
}

onMounted(() => {
  fetchProfessionals()
})
</script>

<style scoped>
.professional-list {
  padding: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.actions {
  display: flex;
  gap: 10px;
}

.search-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.search-input {
  width: 300px;
}

.filter-select {
  width: 140px;
}

.professional-info {
  display: flex;
  gap: 10px;
  align-items: center;
}

.info-text {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.name {
  font-weight: bold;
}

.phone {
  font-size: 13px;
  color: #666;
}

.tags {
  display: flex;
  gap: 5px;
}

.service-types {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.service-tag {
  margin-bottom: 5px;
}

.review-count {
  margin-top: 3px;
  font-size: 12px;
  color: #666;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
