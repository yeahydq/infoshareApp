<template>
  <div class="professional-list-container">
    <div class="header-actions">
      <div class="search-container">
        <el-input
          v-model="searchQuery"
          placeholder="搜索专业人士"
          class="search-input"
          clearable
          @clear="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
          <template #append>
            <el-button @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
        <el-select
          v-model="statusFilter"
          placeholder="状态筛选"
          class="status-filter"
          @change="handleSearch"
        >
          <el-option label="全部" value="" />
          <el-option label="待审核" value="pending" />
          <el-option label="已通过" value="approved" />
          <el-option label="已拒绝" value="rejected" />
        </el-select>
      </div>
      <el-button type="primary" @click="exportData">导出数据</el-button>
    </div>

    <el-table v-loading="loading" :data="professionals" style="width: 100%" border>
      <el-table-column label="头像" width="80">
        <template #default="scope">
          <el-avatar :size="40" :src="scope.row.avatar || DEFAULT_AVATAR" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="phone" label="电话" width="120" />
      <el-table-column prop="serviceType" label="服务类型" width="120" />
      <el-table-column prop="registerTime" label="注册时间" width="180" sortable />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusTagType(scope.row.status)" effect="plain">
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="reviewTime" label="审核时间" width="180" sortable />
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="scope">
          <el-button link type="primary" @click="viewDetails(scope.row)">查看详情</el-button>
          <template v-if="scope.row.status === 'pending'">
            <el-button link type="success" @click="approveApplication(scope.row)">通过</el-button>
            <el-button link type="danger" @click="openRejectDialog(scope.row)">拒绝</el-button>
          </template>
          <template v-else-if="scope.row.status === 'approved'">
            <el-button link type="danger" @click="disableAccount(scope.row)">禁用</el-button>
          </template>
          <template v-else-if="scope.row.status === 'disabled'">
            <el-button link type="success" @click="enableAccount(scope.row)">启用</el-button>
          </template>
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

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="专业人士详情"
      width="800px"
      class="detail-dialog"
    >
      <template v-if="selectedProfessional">
        <div class="profile-header">
          <el-avatar :size="80" :src="selectedProfessional.avatar || DEFAULT_AVATAR" />
          <div class="profile-info">
            <h2>{{ selectedProfessional.name }}</h2>
            <p>{{ selectedProfessional.serviceType }}</p>
            <p>注册时间: {{ selectedProfessional.registerTime }}</p>
          </div>
          <div class="profile-status">
            <el-tag :type="getStatusTagType(selectedProfessional.status)">
              {{ getStatusText(selectedProfessional.status) }}
            </el-tag>
          </div>
        </div>

        <el-divider />

        <el-descriptions title="基本信息" :column="2" border>
          <el-descriptions-item label="手机号">
            {{ selectedProfessional.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="电子邮箱">
            {{ selectedProfessional.email || '未设置' }}
          </el-descriptions-item>
          <el-descriptions-item label="性别">
            {{ selectedProfessional.gender === 'male' ? '男' : '女' }}
          </el-descriptions-item>
          <el-descriptions-item label="年龄">
            {{ selectedProfessional.age || '未设置' }}
          </el-descriptions-item>
          <el-descriptions-item label="服务价格">
            ¥{{ selectedProfessional.price }}/小时
          </el-descriptions-item>
          <el-descriptions-item label="服务次数">
            {{ selectedProfessional.serviceCount || 0 }}次
          </el-descriptions-item>
          <el-descriptions-item label="联系地址" :span="2">
            {{ selectedProfessional.address || '未设置' }}
          </el-descriptions-item>
          <el-descriptions-item label="简介" :span="2">
            {{ selectedProfessional.bio || '暂无简介' }}
          </el-descriptions-item>
        </el-descriptions>

        <el-descriptions
          v-if="selectedProfessional.qualifications"
          title="资质信息"
          :column="1"
          border
        >
          <el-descriptions-item
            v-for="(item, index) in selectedProfessional.qualifications"
            :key="index"
            :label="`证书 ${index + 1}`"
          >
            <div class="qualification-item">
              <el-image
                :src="item.image"
                :preview-src-list="[item.image]"
                fit="cover"
                style="width: 120px; height: 80px"
              />
              <div class="qualification-info">
                <p>{{ item.name }}</p>
                <p>发证机构: {{ item.issuer }}</p>
                <p>有效期: {{ item.validUntil }}</p>
              </div>
            </div>
          </el-descriptions-item>
        </el-descriptions>

        <template v-if="selectedProfessional.status === 'pending'">
          <div class="action-buttons">
            <el-button type="success" @click="approveApplication(selectedProfessional)">
              通过申请
            </el-button>
            <el-button type="danger" @click="openRejectDialog(selectedProfessional)">
              拒绝申请
            </el-button>
          </div>
        </template>
      </template>
    </el-dialog>

    <!-- 拒绝原因对话框 -->
    <el-dialog v-model="rejectDialogVisible" title="拒绝原因" width="500px">
      <el-form :model="rejectForm" ref="rejectFormRef">
        <el-form-item
          label="拒绝原因"
          :rules="[{ required: true, message: '请输入拒绝原因', trigger: 'blur' }]"
          prop="reason"
        >
          <el-input
            v-model="rejectForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入拒绝原因，这将会发送给申请者"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="rejectDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="rejectApplication">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { DEFAULT_AVATAR } from '@/assets/index'

const loading = ref(true)
const professionals = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const searchQuery = ref('')
const statusFilter = ref('')
const detailDialogVisible = ref(false)
const rejectDialogVisible = ref(false)
const selectedProfessional = ref(null)
const rejectForm = reactive({
  reason: '',
})
const rejectFormRef = ref(null)

// 获取专业人士列表
const fetchProfessionals = async () => {
  loading.value = true
  try {
    // 模拟API调用
    setTimeout(() => {
      // 这里应该是实际调用API的代码
      // axios.get('/api/professionals', {
      //   params: {
      //     page: currentPage.value,
      //     pageSize: pageSize.value,
      //     query: searchQuery.value,
      //     status: statusFilter.value
      //   }
      // })

      // 模拟数据
      const mockData = [
        {
          id: '1',
          name: '张医生',
          phone: '13800138000',
          email: 'zhang@example.com',
          serviceType: '医疗咨询',
          gender: 'male',
          age: 35,
          price: 200,
          serviceCount: 120,
          address: '北京市朝阳区健康路123号',
          bio: '从事医疗工作10年，擅长心理健康咨询和常见疾病诊断。',
          registerTime: '2023-03-15 14:30:22',
          status: 'approved',
          reviewTime: '2023-03-16 09:45:11',
          qualifications: [
            {
              name: '医师资格证',
              issuer: '中国卫生部',
              validUntil: '2030-12-31',
              image: 'https://placeholder.pics/svg/300x200/DEDEDE/555555/Certificate',
            },
          ],
        },
        {
          id: '2',
          name: '李律师',
          phone: '13900139000',
          email: 'li@example.com',
          serviceType: '法律咨询',
          gender: 'female',
          age: 42,
          price: 300,
          serviceCount: 85,
          address: '上海市静安区法治路456号',
          bio: '执业律师15年，专注于婚姻家庭和合同纠纷案件。',
          registerTime: '2023-04-20 10:15:30',
          status: 'pending',
          reviewTime: null,
          qualifications: [
            {
              name: '律师执业证',
              issuer: '中国司法部',
              validUntil: '2028-10-31',
              image: 'https://placeholder.pics/svg/300x200/DEDEDE/555555/Certificate',
            },
          ],
        },
        {
          id: '3',
          name: '王老师',
          phone: '13700137000',
          email: 'wang@example.com',
          serviceType: '教育辅导',
          gender: 'male',
          age: 38,
          price: 150,
          serviceCount: 210,
          address: '广州市天河区教育路789号',
          bio: '资深高中数学教师，有丰富的高考辅导经验。',
          registerTime: '2023-02-10 16:20:45',
          status: 'rejected',
          reviewTime: '2023-02-11 11:30:18',
          rejectReason: '提供的教师资格证书已过期，请更新后重新提交。',
          qualifications: [
            {
              name: '教师资格证',
              issuer: '中国教育部',
              validUntil: '2022-12-31',
              image: 'https://placeholder.pics/svg/300x200/DEDEDE/555555/Certificate',
            },
          ],
        },
        {
          id: '4',
          name: '赵工程师',
          phone: '13600136000',
          email: 'zhao@example.com',
          serviceType: '技术咨询',
          gender: 'male',
          age: 31,
          price: 250,
          serviceCount: 65,
          address: '深圳市南山区科技路101号',
          bio: '资深软件工程师，精通Web开发和移动应用开发。',
          registerTime: '2023-05-05 09:10:55',
          status: 'approved',
          reviewTime: '2023-05-06 14:22:33',
          qualifications: [
            {
              name: '计算机专业学位证书',
              issuer: '清华大学',
              validUntil: 'N/A',
              image: 'https://placeholder.pics/svg/300x200/DEDEDE/555555/Certificate',
            },
          ],
        },
        {
          id: '5',
          name: '孙会计',
          phone: '13500135000',
          email: 'sun@example.com',
          serviceType: '财务咨询',
          gender: 'female',
          age: 40,
          price: 180,
          serviceCount: 150,
          address: '成都市锦江区财富路202号',
          bio: '注册会计师，擅长个人税务规划和小企业财务管理。',
          registerTime: '2023-01-18 13:45:10',
          status: 'disabled',
          reviewTime: '2023-01-19 10:20:40',
          qualifications: [
            {
              name: '注册会计师证书',
              issuer: '中国财政部',
              validUntil: '2025-06-30',
              image: 'https://placeholder.pics/svg/300x200/DEDEDE/555555/Certificate',
            },
          ],
        },
      ]

      professionals.value = mockData
      total.value = mockData.length
      loading.value = false
    }, 1000)
  } catch (error) {
    console.error('获取专业人士列表失败', error)
    loading.value = false
    ElMessage.error('获取数据失败，请重试')
  }
}

// 获取状态标签类型
const getStatusTagType = (status) => {
  const statusMap = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
    disabled: 'info',
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝',
    disabled: '已禁用',
  }
  return statusMap[status] || '未知'
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchProfessionals()
}

// 分页大小变更
const handleSizeChange = (size) => {
  pageSize.value = size
  fetchProfessionals()
}

// 分页页码变更
const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchProfessionals()
}

// 查看详情
const viewDetails = (professional) => {
  selectedProfessional.value = professional
  detailDialogVisible.value = true
}

// 通过申请
const approveApplication = (professional) => {
  ElMessageBox.confirm(`确定通过 ${professional.name} 的申请吗？`, '审核确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info',
  })
    .then(() => {
      // 这里应该是调用API的代码
      // axios.post(`/api/professionals/${professional.id}/approve`)

      // 模拟API调用
      loading.value = true
      setTimeout(() => {
        const index = professionals.value.findIndex((p) => p.id === professional.id)
        if (index !== -1) {
          professionals.value[index].status = 'approved'
          professionals.value[index].reviewTime = new Date().toLocaleString()
          if (detailDialogVisible.value) {
            selectedProfessional.value = { ...professionals.value[index] }
          }
        }
        loading.value = false
        detailDialogVisible.value = false
        ElMessage.success('已通过申请')
      }, 500)
    })
    .catch(() => {})
}

// 打开拒绝对话框
const openRejectDialog = (professional) => {
  selectedProfessional.value = professional
  rejectForm.reason = ''
  rejectDialogVisible.value = true
}

// 拒绝申请
const rejectApplication = async () => {
  if (!rejectFormRef.value) return

  try {
    await rejectFormRef.value.validate()

    // 这里应该是调用API的代码
    // axios.post(`/api/professionals/${selectedProfessional.value.id}/reject`, {
    //   reason: rejectForm.reason
    // })

    // 模拟API调用
    loading.value = true
    setTimeout(() => {
      const index = professionals.value.findIndex((p) => p.id === selectedProfessional.value.id)
      if (index !== -1) {
        professionals.value[index].status = 'rejected'
        professionals.value[index].reviewTime = new Date().toLocaleString()
        professionals.value[index].rejectReason = rejectForm.reason
      }
      loading.value = false
      rejectDialogVisible.value = false
      detailDialogVisible.value = false
      ElMessage.success('已拒绝申请')
    }, 500)
  } catch (error) {
    console.error('表单验证失败', error)
  }
}

// 禁用账号
const disableAccount = (professional) => {
  ElMessageBox.confirm(`确定要禁用 ${professional.name} 的账号吗？`, '操作确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 这里应该是调用API的代码
      // axios.post(`/api/professionals/${professional.id}/disable`)

      // 模拟API调用
      loading.value = true
      setTimeout(() => {
        const index = professionals.value.findIndex((p) => p.id === professional.id)
        if (index !== -1) {
          professionals.value[index].status = 'disabled'
          if (detailDialogVisible.value && selectedProfessional.value.id === professional.id) {
            selectedProfessional.value = { ...professionals.value[index] }
          }
        }
        loading.value = false
        ElMessage.success('账号已禁用')
      }, 500)
    })
    .catch(() => {})
}

// 启用账号
const enableAccount = (professional) => {
  ElMessageBox.confirm(`确定要启用 ${professional.name} 的账号吗？`, '操作确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 这里应该是调用API的代码
      // axios.post(`/api/professionals/${professional.id}/enable`)

      // 模拟API调用
      loading.value = true
      setTimeout(() => {
        const index = professionals.value.findIndex((p) => p.id === professional.id)
        if (index !== -1) {
          professionals.value[index].status = 'approved'
          if (detailDialogVisible.value && selectedProfessional.value.id === professional.id) {
            selectedProfessional.value = { ...professionals.value[index] }
          }
        }
        loading.value = false
        ElMessage.success('账号已启用')
      }, 500)
    })
    .catch(() => {})
}

// 导出数据
const exportData = () => {
  ElMessage.success('数据导出功能将在后续版本中实现')
}

onMounted(() => {
  fetchProfessionals()
})
</script>

<style scoped>
.professional-list-container {
  padding: 20px;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-container {
  display: flex;
  gap: 10px;
}

.search-input {
  width: 300px;
}

.status-filter {
  width: 150px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.detail-dialog :deep(.el-dialog__body) {
  padding: 20px;
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.profile-info {
  flex: 1;
  margin-left: 20px;
}

.profile-info h2 {
  margin: 0 0 5px 0;
}

.profile-info p {
  margin: 5px 0;
  color: #666;
}

.profile-status {
  margin-left: auto;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.qualification-item {
  display: flex;
  gap: 15px;
}

.qualification-info {
  flex: 1;
}

.qualification-info p {
  margin: 5px 0;
}
</style>
