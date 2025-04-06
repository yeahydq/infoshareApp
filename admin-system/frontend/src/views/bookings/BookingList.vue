<template>
  <div class="booking-list">
    <div class="page-header">
      <h2>预约管理</h2>
      <div class="actions">
        <el-button type="primary" @click="exportData">导出数据</el-button>
      </div>
    </div>

    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索预约信息（用户名/专业人士/服务类型）"
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
        <el-option label="即将到来" value="upcoming" />
        <el-option label="已完成" value="completed" />
        <el-option label="已取消" value="cancelled" />
        <el-option label="已退款" value="refunded" />
      </el-select>

      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="YYYY-MM-DD"
        class="date-picker"
        @change="handleDateRangeChange"
      />

      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <el-table v-loading="loading" :data="bookings" style="width: 100%" border>
      <el-table-column label="用户信息" min-width="200">
        <template #default="{ row }">
          <div class="user-info">
            <el-avatar :size="40" :src="row.userAvatar" />
            <div class="info-text">
              <div class="name">{{ row.userName }}</div>
              <div class="phone">{{ row.userPhone }}</div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="专业人士" min-width="200">
        <template #default="{ row }">
          <div class="user-info">
            <el-avatar :size="40" :src="row.professionalAvatar" />
            <div class="info-text">
              <div class="name">{{ row.professionalName }}</div>
              <div class="phone">{{ row.professionalPhone }}</div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="服务类型" prop="serviceType" min-width="120" />

      <el-table-column label="预约时间" prop="bookingTime" min-width="150" sortable />

      <el-table-column label="创建时间" prop="createdAt" min-width="150" sortable />

      <el-table-column label="金额" min-width="100">
        <template #default="{ row }">¥{{ row.amount.toFixed(2) }}</template>
      </el-table-column>

      <el-table-column label="状态" min-width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)" effect="plain">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="备注" min-width="200">
        <template #default="{ row }">
          {{ row.remarks || '无' }}
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="150" fixed="right">
        <template #default="{ row }">
          <div class="action-buttons">
            <el-button link type="primary" @click="viewDetails(row)">查看详情</el-button>

            <template v-if="row.status === 'upcoming'">
              <el-button link type="warning" @click="openCancelDialog(row)">取消预约</el-button>
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

    <!-- 取消预约对话框 -->
    <el-dialog v-model="cancelDialogVisible" title="取消预约" width="500px">
      <el-form>
        <el-form-item label="取消原因" required>
          <el-input
            v-model="cancelForm.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入取消原因"
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="cancelForm.refund">退款给用户</el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmCancelBooking">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import axios from 'axios'

interface Booking {
  id: string
  userName: string
  userAvatar: string
  userPhone: string
  professionalName: string
  professionalAvatar: string
  professionalPhone: string
  serviceType: string
  bookingTime: string
  status: string
  amount: number
  createdAt: string
  payTime: string | null
  cancelTime: string | null
  cancelReason: string | null
  refundTime: string | null
  refundReason: string | null
  remarks: string | null
}

const loading = ref(true)
const bookings = ref<Booking[]>([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const searchQuery = ref('')
const statusFilter = ref('all')
const dateRange = ref<[Date, Date] | null>(null)
const cancelDialogVisible = ref(false)
const cancelForm = reactive({
  reason: '',
  refund: true,
})
const currentBooking = ref<Booking | null>(null)

// 获取预约列表
const fetchBookings = async () => {
  loading.value = true
  try {
    // 调用后端API获取数据
    const response = await axios.get('/api/bookings', {
      params: {
        page: currentPage.value,
        pageSize: pageSize.value,
        query: searchQuery.value,
        status: statusFilter.value !== 'all' ? statusFilter.value : undefined,
        startDate: dateRange.value ? dateRange.value[0].toISOString().split('T')[0] : undefined,
        endDate: dateRange.value ? dateRange.value[1].toISOString().split('T')[0] : undefined,
      },
    })

    bookings.value = response.data.data.list
    total.value = response.data.data.total
    loading.value = false
  } catch (error) {
    console.error('获取预约列表失败', error)
    loading.value = false
    ElMessage.error('获取数据失败，请重试')

    // 开发阶段使用模拟数据（后期可移除）
    const mockData = [
      {
        id: 'booking_001',
        userName: '张三',
        userAvatar: 'https://placeholder.pics/svg/100/DEDEDE/555555/User1',
        userPhone: '13800138001',
        professionalName: '张医生',
        professionalAvatar: 'https://placeholder.pics/svg/100/DEDEDE/555555/Doctor1',
        professionalPhone: '13900139001',
        serviceType: '心理咨询',
        bookingTime: '2023-09-15 15:00:00',
        status: 'upcoming',
        amount: 200.0,
        createdAt: '2023-09-10 09:22:15',
        payTime: '2023-09-10 09:25:33',
        cancelTime: null,
        cancelReason: null,
        refundTime: null,
        refundReason: null,
        remarks: '用户希望专注讨论工作压力问题',
      },
      {
        id: 'booking_002',
        userName: '李四',
        userAvatar: 'https://placeholder.pics/svg/100/DEDEDE/555555/User2',
        userPhone: '13700137001',
        professionalName: '王老师',
        professionalAvatar: 'https://placeholder.pics/svg/100/DEDEDE/555555/Teacher1',
        professionalPhone: '13600136001',
        serviceType: '教育辅导',
        bookingTime: '2023-09-05 14:00:00',
        status: 'completed',
        amount: 150.0,
        createdAt: '2023-08-30 16:40:33',
        payTime: '2023-08-30 16:45:22',
        cancelTime: null,
        cancelReason: null,
        refundTime: null,
        refundReason: null,
        remarks: null,
      },
      {
        id: 'booking_003',
        userName: '王五',
        userAvatar: 'https://placeholder.pics/svg/100/DEDEDE/555555/User3',
        userPhone: '13500135001',
        professionalName: '李律师',
        professionalAvatar: 'https://placeholder.pics/svg/100/DEDEDE/555555/Lawyer1',
        professionalPhone: '13800138002',
        serviceType: '法律咨询',
        bookingTime: '2023-09-12 10:30:00',
        status: 'cancelled',
        amount: 300.0,
        createdAt: '2023-09-08 11:05:47',
        payTime: '2023-09-08 11:10:22',
        cancelTime: '2023-09-09 14:33:19',
        cancelReason: '用户临时有事无法赴约',
        refundTime: '2023-09-09 15:20:45',
        refundReason: '用户提前24小时取消，符合全额退款条件',
        remarks: null,
      },
    ]

    bookings.value = mockData
    total.value = mockData.length
  }
}

// 查看详情
const viewDetails = (booking: Booking) => {
  // 在实际应用中，这里可能会打开一个详情对话框或导航到详情页面
  ElMessage.info('查看预约详情功能将在后续实现')
}

// 获取状态标签类型
const getStatusTagType = (status: string) => {
  const statusMap: Record<string, string> = {
    upcoming: 'primary',
    completed: 'success',
    cancelled: 'info',
    refunded: 'warning',
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    upcoming: '即将到来',
    completed: '已完成',
    cancelled: '已取消',
    refunded: '已退款',
  }
  return statusMap[status] || '未知'
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchBookings()
}

// 状态过滤变更
const handleStatusFilterChange = () => {
  currentPage.value = 1
  fetchBookings()
}

// 日期范围变更
const handleDateRangeChange = () => {
  currentPage.value = 1
  fetchBookings()
}

// 分页大小变更
const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchBookings()
}

// 分页页码变更
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchBookings()
}

// 打开取消对话框
const openCancelDialog = (booking: Booking) => {
  currentBooking.value = booking
  cancelForm.reason = ''
  cancelForm.refund = true
  cancelDialogVisible.value = true
}

// 确认取消预约
const confirmCancelBooking = async () => {
  if (!currentBooking.value) return

  try {
    // 调用后端API取消预约
    await axios.post(`/api/bookings/${currentBooking.value.id}/cancel`, {
      reason: cancelForm.reason,
      refund: cancelForm.refund,
    })

    // 重新获取列表数据
    await fetchBookings()

    cancelDialogVisible.value = false
    ElMessage.success('预约已取消')
  } catch (error) {
    console.error('取消预约失败', error)
    ElMessage.error('取消预约失败，请重试')
  }
}

// 导出数据
const exportData = async () => {
  try {
    const response = await axios.get('/api/bookings/export', {
      params: {
        query: searchQuery.value,
        status: statusFilter.value !== 'all' ? statusFilter.value : undefined,
        startDate: dateRange.value ? dateRange.value[0].toISOString().split('T')[0] : undefined,
        endDate: dateRange.value ? dateRange.value[1].toISOString().split('T')[0] : undefined,
      },
      responseType: 'blob',
    })

    // 创建下载链接
    const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `预约数据_${new Date().toISOString().split('T')[0]}.xlsx`
    link.click()
    URL.revokeObjectURL(link.href)

    ElMessage.success('数据导出成功')
  } catch (error) {
    console.error('导出数据失败', error)
    ElMessage.error('导出数据失败，请重试')
  }
}

onMounted(() => {
  fetchBookings()
})
</script>

<style scoped>
.booking-list {
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

.date-picker {
  width: 300px;
}

.user-info {
  display: flex;
  gap: 10px;
  align-items: center;
}

.info-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.name {
  font-weight: bold;
}

.phone {
  font-size: 13px;
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
