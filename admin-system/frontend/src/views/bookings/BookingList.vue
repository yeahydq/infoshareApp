<template>
  <div class="booking-list-container">
    <div class="header-actions">
      <div class="search-container">
        <el-input
          v-model="searchQuery"
          placeholder="搜索预约"
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
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          class="date-picker"
          @change="handleSearch"
        />
      </div>
      <el-button type="primary" @click="exportData">导出数据</el-button>
    </div>

    <el-table v-loading="loading" :data="bookings" style="width: 100%" border>
      <el-table-column prop="id" label="预约ID" width="100" />
      <el-table-column label="用户信息" width="180">
        <template #default="scope">
          <div class="user-info">
            <el-avatar :size="30" :src="scope.row.userAvatar || DEFAULT_AVATAR" />
            <span>{{ scope.row.userName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="专业人士" width="180">
        <template #default="scope">
          <div class="user-info">
            <el-avatar :size="30" :src="scope.row.professionalAvatar || DEFAULT_AVATAR" />
            <span>{{ scope.row.professionalName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="serviceType" label="服务类型" width="120" />
      <el-table-column prop="bookingTime" label="预约时间" width="180" sortable />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusTagType(scope.row.status)">
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" width="100">
        <template #default="scope">¥{{ scope.row.amount.toFixed(2) }}</template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180" sortable />
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <el-button link type="primary" @click="viewDetails(scope.row)">查看详情</el-button>
          <el-button
            v-if="scope.row.status === 'upcoming'"
            link
            type="danger"
            @click="cancelBooking(scope.row)"
          >
            取消
          </el-button>
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

    <!-- 预约详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="预约详情" width="700px" class="detail-dialog">
      <template v-if="selectedBooking">
        <el-descriptions title="基本信息" :column="2" border>
          <el-descriptions-item label="预约ID">{{ selectedBooking.id }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusTagType(selectedBooking.status)">
              {{ getStatusText(selectedBooking.status) }}
            </el-tag>
          </el-descriptions-item>

          <el-descriptions-item label="用户">{{ selectedBooking.userName }}</el-descriptions-item>
          <el-descriptions-item label="用户电话">
            {{ selectedBooking.userPhone }}
          </el-descriptions-item>

          <el-descriptions-item label="专业人士">
            {{ selectedBooking.professionalName }}
          </el-descriptions-item>
          <el-descriptions-item label="专业人士电话">
            {{ selectedBooking.professionalPhone }}
          </el-descriptions-item>

          <el-descriptions-item label="服务类型">
            {{ selectedBooking.serviceType }}
          </el-descriptions-item>
          <el-descriptions-item label="服务金额">
            ¥{{ selectedBooking.amount.toFixed(2) }}
          </el-descriptions-item>

          <el-descriptions-item label="预约时间" :span="2">
            {{ selectedBooking.bookingTime }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ selectedBooking.createdAt }}
          </el-descriptions-item>
          <el-descriptions-item label="支付时间">
            {{ selectedBooking.payTime || '未支付' }}
          </el-descriptions-item>

          <el-descriptions-item
            v-if="selectedBooking.status === 'cancelled' || selectedBooking.status === 'refunded'"
            label="取消/退款时间"
          >
            {{ selectedBooking.cancelTime || selectedBooking.refundTime || '未记录' }}
          </el-descriptions-item>
          <el-descriptions-item
            v-if="selectedBooking.status === 'cancelled' || selectedBooking.status === 'refunded'"
            label="取消/退款原因"
          >
            {{ selectedBooking.cancelReason || selectedBooking.refundReason || '未提供原因' }}
          </el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">预约备注</el-divider>
        <div class="booking-remarks">
          <p v-if="selectedBooking.remarks">{{ selectedBooking.remarks }}</p>
          <p v-else class="empty-text">无备注</p>
        </div>

        <div v-if="selectedBooking.status === 'upcoming'" class="action-buttons">
          <el-button type="danger" @click="cancelBookingFromDialog">取消预约</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 取消预约对话框 -->
    <el-dialog v-model="cancelDialogVisible" title="取消预约" width="500px">
      <el-form :model="cancelForm" ref="cancelFormRef">
        <el-form-item
          label="取消原因"
          :rules="[{ required: true, message: '请输入取消原因', trigger: 'blur' }]"
          prop="reason"
        >
          <el-input
            v-model="cancelForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入取消预约的原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="confirmCancelBooking">确认取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { DEFAULT_AVATAR } from '@/assets/index'

const loading = ref(true)
const bookings = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const searchQuery = ref('')
const statusFilter = ref('')
const dateRange = ref([])
const detailDialogVisible = ref(false)
const cancelDialogVisible = ref(false)
const selectedBooking = ref(null)
const cancelForm = reactive({
  reason: '',
})
const cancelFormRef = ref(null)

// 获取预约列表
const fetchBookings = async () => {
  loading.value = true
  try {
    // 模拟API调用
    setTimeout(() => {
      // 这里应该是实际调用API的代码
      // axios.get('/api/bookings', {
      //   params: {
      //     page: currentPage.value,
      //     pageSize: pageSize.value,
      //     query: searchQuery.value,
      //     status: statusFilter.value,
      //     startDate: dateRange.value ? dateRange.value[0] : undefined,
      //     endDate: dateRange.value ? dateRange.value[1] : undefined
      //   }
      // })

      // 模拟数据
      const mockData = [
        {
          id: 'booking_001',
          userName: '张三',
          userAvatar: 'https://placeholder.pics/svg/100/DEDEDE/555555/User1',
          userPhone: '13800138000',
          professionalName: '张医生',
          professionalAvatar: 'https://placeholder.pics/svg/100/DEDEDE/555555/Doctor',
          professionalPhone: '13900139000',
          serviceType: '心理咨询',
          bookingTime: '2023-08-15 15:00:00',
          status: 'completed',
          amount: 200.0,
          createdAt: '2023-08-10 09:22:15',
          payTime: '2023-08-10 09:25:33',
          remarks: '希望能够解决焦虑问题',
        },
        {
          id: 'booking_002',
          userName: '李四',
          userAvatar: 'https://placeholder.pics/svg/100/DEDEDE/555555/User2',
          userPhone: '13700137000',
          professionalName: '李律师',
          professionalAvatar: 'https://placeholder.pics/svg/100/DEDEDE/555555/Lawyer',
          professionalPhone: '13600136000',
          serviceType: '法律咨询',
          bookingTime: '2023-08-20 10:30:00',
          status: 'completed',
          amount: 300.0,
          createdAt: '2023-08-15 16:40:33',
          payTime: '2023-08-15 16:45:10',
          remarks: '关于合同纠纷的咨询',
        },
        {
          id: 'booking_003',
          userName: '张三',
          userAvatar: 'https://placeholder.pics/svg/100/DEDEDE/555555/User1',
          userPhone: '13800138000',
          professionalName: '王老师',
          professionalAvatar: 'https://placeholder.pics/svg/100/DEDEDE/555555/Teacher',
          professionalPhone: '13500135000',
          serviceType: '教育辅导',
          bookingTime: '2023-09-05 14:00:00',
          status: 'upcoming',
          amount: 150.0,
          createdAt: '2023-08-25 11:15:47',
          payTime: '2023-08-25 11:20:05',
          remarks: '孩子数学学习问题咨询',
        },
        {
          id: 'booking_004',
          userName: '王五',
          userAvatar: 'https://placeholder.pics/svg/100/DEDEDE/555555/User3',
          userPhone: '13400134000',
          professionalName: '张医生',
          professionalAvatar: 'https://placeholder.pics/svg/100/DEDEDE/555555/Doctor',
          professionalPhone: '13900139000',
          serviceType: '心理咨询',
          bookingTime: '2023-08-18 16:30:00',
          status: 'cancelled',
          amount: 200.0,
          createdAt: '2023-08-12 10:05:22',
          payTime: '2023-08-12 10:10:45',
          cancelTime: '2023-08-15 09:30:15',
          cancelReason: '有急事，无法按时参加',
        },
        {
          id: 'booking_005',
          userName: '赵六',
          userAvatar: 'https://placeholder.pics/svg/100/DEDEDE/555555/User4',
          userPhone: '13300133000',
          professionalName: '赵工程师',
          professionalAvatar: 'https://placeholder.pics/svg/100/DEDEDE/555555/Engineer',
          professionalPhone: '13200132000',
          serviceType: '技术咨询',
          bookingTime: '2023-09-10 11:00:00',
          status: 'refunded',
          amount: 250.0,
          createdAt: '2023-08-28 14:33:19',
          payTime: '2023-08-28 14:40:22',
          refundTime: '2023-08-30 16:20:45',
          refundReason: '专业人士临时有事，无法提供服务',
        },
      ]

      bookings.value = mockData
      total.value = mockData.length
      loading.value = false
    }, 1000)
  } catch (error) {
    console.error('获取预约列表失败', error)
    loading.value = false
    ElMessage.error('获取数据失败，请重试')
  }
}

// 获取状态标签类型
const getStatusTagType = (status) => {
  const statusMap = {
    upcoming: 'primary',
    completed: 'success',
    cancelled: 'info',
    refunded: 'warning',
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
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

// 分页大小变更
const handleSizeChange = (size) => {
  pageSize.value = size
  fetchBookings()
}

// 分页页码变更
const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchBookings()
}

// 查看详情
const viewDetails = (booking) => {
  selectedBooking.value = booking
  detailDialogVisible.value = true
}

// 取消预约
const cancelBooking = (booking) => {
  selectedBooking.value = booking
  cancelForm.reason = ''
  cancelDialogVisible.value = true
}

// 从详情对话框取消预约
const cancelBookingFromDialog = () => {
  if (!selectedBooking.value) return
  cancelForm.reason = ''
  cancelDialogVisible.value = true
}

// 确认取消预约
const confirmCancelBooking = async () => {
  if (!cancelFormRef.value || !selectedBooking.value) return

  try {
    await cancelFormRef.value.validate()

    // 这里应该是调用API的代码
    // axios.post(`/api/bookings/${selectedBooking.value.id}/cancel`, {
    //   reason: cancelForm.reason
    // })

    // 模拟API调用
    loading.value = true
    setTimeout(() => {
      const index = bookings.value.findIndex((b) => b.id === selectedBooking.value.id)
      if (index !== -1) {
        bookings.value[index].status = 'cancelled'
        bookings.value[index].cancelTime = new Date().toLocaleString()
        bookings.value[index].cancelReason = cancelForm.reason

        // 更新选中的预约信息
        selectedBooking.value = { ...bookings.value[index] }
      }

      loading.value = false
      cancelDialogVisible.value = false
      ElMessage.success('预约已取消')
    }, 500)
  } catch (error) {
    console.error('表单验证失败', error)
  }
}

// 导出数据
const exportData = () => {
  ElMessage.success('数据导出功能将在后续版本中实现')
}

onMounted(() => {
  fetchBookings()
})
</script>

<style scoped>
.booking-list-container {
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
  width: 200px;
}

.status-filter {
  width: 150px;
}

.date-picker {
  width: 300px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.user-info {
  display: flex;
  gap: 10px;
  align-items: center;
}

.detail-dialog :deep(.el-dialog__body) {
  padding: 20px;
}

.booking-remarks {
  min-height: 60px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.empty-text {
  font-style: italic;
  color: #999;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
