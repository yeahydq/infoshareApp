<template>
  <div class="user-list-container">
    <div class="header-actions">
      <div class="search-container">
        <el-input
          v-model="searchQuery"
          placeholder="搜索用户"
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
      </div>
      <el-button type="primary" @click="exportData">导出数据</el-button>
    </div>

    <el-table 
      v-loading="loading" 
      :data="users" 
      style="width: 100%"
      border
    >
      <el-table-column label="头像" width="80">
        <template #default="scope">
          <el-avatar :size="40" :src="scope.row.avatar || DEFAULT_AVATAR" />
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" width="150" />
      <el-table-column prop="gender" label="性别" width="80">
        <template #default="scope">
          {{ scope.row.gender === 'male' ? '男' : scope.row.gender === 'female' ? '女' : '未知' }}
        </template>
      </el-table-column>
      <el-table-column prop="registerTime" label="注册时间" width="180" sortable />
      <el-table-column prop="lastLoginTime" label="最近登录" width="180" sortable />
      <el-table-column prop="bookingCount" label="预约次数" width="100" sortable />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag 
            :type="scope.row.status === 'active' ? 'success' : 'danger'" 
            effect="plain"
          >
            {{ scope.row.status === 'active' ? '正常' : '已禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="scope">
          <el-button link type="primary" @click="viewDetails(scope.row)">查看详情</el-button>
          <el-button 
            link 
            :type="scope.row.status === 'active' ? 'danger' : 'success'" 
            @click="toggleUserStatus(scope.row)"
          >
            {{ scope.row.status === 'active' ? '禁用' : '启用' }}
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

    <!-- 用户详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="用户详情"
      width="750px"
      class="detail-dialog"
    >
      <template v-if="selectedUser">
        <div class="profile-header">
          <el-avatar :size="80" :src="selectedUser.avatar || DEFAULT_AVATAR" />
          <div class="profile-info">
            <h2>{{ selectedUser.nickname }}</h2>
            <p>注册时间: {{ selectedUser.registerTime }}</p>
          </div>
          <div class="profile-status">
            <el-tag :type="selectedUser.status === 'active' ? 'success' : 'danger'">
              {{ selectedUser.status === 'active' ? '正常' : '已禁用' }}
            </el-tag>
          </div>
        </div>
        
        <el-divider />
        
        <el-descriptions title="基本信息" :column="2" border>
          <el-descriptions-item label="用户ID">{{ selectedUser.userId }}</el-descriptions-item>
          <el-descriptions-item label="性别">
            {{ selectedUser.gender === 'male' ? '男' : selectedUser.gender === 'female' ? '女' : '未知' }}
          </el-descriptions-item>
          <el-descriptions-item label="地区">{{ selectedUser.region || '未设置' }}</el-descriptions-item>
          <el-descriptions-item label="城市">{{ selectedUser.city || '未设置' }}</el-descriptions-item>
          <el-descriptions-item label="最近登录">{{ selectedUser.lastLoginTime }}</el-descriptions-item>
          <el-descriptions-item label="预约次数">{{ selectedUser.bookingCount || 0 }}次</el-descriptions-item>
        </el-descriptions>
        
        <el-tabs v-model="activeTab" class="detail-tabs">
          <el-tab-pane label="预约记录" name="bookings">
            <el-table :data="userBookings" style="width: 100%" border v-loading="bookingsLoading">
              <el-table-column prop="id" label="预约ID" width="120" />
              <el-table-column prop="professionalName" label="专业人士" width="120" />
              <el-table-column prop="serviceType" label="服务类型" width="120" />
              <el-table-column prop="bookingTime" label="预约时间" width="180" />
              <el-table-column prop="status" label="状态" width="100">
                <template #default="scope">
                  <el-tag :type="getBookingStatusType(scope.row.status)">
                    {{ getBookingStatusText(scope.row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="amount" label="金额" width="100">
                <template #default="scope">
                  ¥{{ scope.row.amount.toFixed(2) }}
                </template>
              </el-table-column>
              <el-table-column prop="createdAt" label="创建时间" width="180" />
            </el-table>
            <div v-if="userBookings.length === 0 && !bookingsLoading" class="empty-data">
              <el-empty description="暂无预约记录" />
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="操作记录" name="logs">
            <el-table :data="userLogs" style="width: 100%" border v-loading="logsLoading">
              <el-table-column prop="time" label="时间" width="180" />
              <el-table-column prop="action" label="操作" width="120" />
              <el-table-column prop="details" label="详情" min-width="180" />
              <el-table-column prop="ip" label="IP地址" width="140" />
            </el-table>
            <div v-if="userLogs.length === 0 && !logsLoading" class="empty-data">
              <el-empty description="暂无操作记录" />
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import { DEFAULT_AVATAR } from '@/assets/index';

const loading = ref(true);
const users = ref([]);
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);
const searchQuery = ref('');
const detailDialogVisible = ref(false);
const selectedUser = ref(null);
const activeTab = ref('bookings');
const userBookings = ref([]);
const userLogs = ref([]);
const bookingsLoading = ref(false);
const logsLoading = ref(false);

// 获取用户列表
const fetchUsers = async () => {
  loading.value = true;
  try {
    // 模拟API调用
    setTimeout(() => {
      // 这里应该是实际调用API的代码
      // axios.get('/api/users', {
      //   params: {
      //     page: currentPage.value,
      //     pageSize: pageSize.value,
      //     query: searchQuery.value
      //   }
      // })
      
      // 模拟数据
      const mockData = [
        {
          userId: 'user_001',
          openid: 'openid_001',
          nickname: '张三',
          avatar: 'https://placeholder.pics/svg/100/DEDEDE/555555/User1',
          gender: 'male',
          region: '广东省',
          city: '深圳市',
          registerTime: '2023-01-15 09:32:15',
          lastLoginTime: '2023-09-01 16:45:22',
          bookingCount: 12,
          status: 'active'
        },
        {
          userId: 'user_002',
          openid: 'openid_002',
          nickname: '李四',
          avatar: 'https://placeholder.pics/svg/100/DEDEDE/555555/User2',
          gender: 'female',
          region: '北京市',
          city: '北京市',
          registerTime: '2023-02-20 14:21:33',
          lastLoginTime: '2023-08-29 10:12:05',
          bookingCount: 5,
          status: 'active'
        },
        {
          userId: 'user_003',
          openid: 'openid_003',
          nickname: '王五',
          avatar: 'https://placeholder.pics/svg/100/DEDEDE/555555/User3',
          gender: 'male',
          region: '上海市',
          city: '上海市',
          registerTime: '2023-03-10 11:05:47',
          lastLoginTime: '2023-08-30 20:18:36',
          bookingCount: 8,
          status: 'disabled'
        },
        {
          userId: 'user_004',
          openid: 'openid_004',
          nickname: '赵六',
          avatar: 'https://placeholder.pics/svg/100/DEDEDE/555555/User4',
          gender: 'female',
          region: '浙江省',
          city: '杭州市',
          registerTime: '2023-04-05 16:40:12',
          lastLoginTime: '2023-09-02 08:55:19',
          bookingCount: 3,
          status: 'active'
        },
        {
          userId: 'user_005',
          openid: 'openid_005',
          nickname: '钱七',
          avatar: 'https://placeholder.pics/svg/100/DEDEDE/555555/User5',
          gender: 'male',
          region: '四川省',
          city: '成都市',
          registerTime: '2023-05-18 09:15:33',
          lastLoginTime: '2023-09-01 13:22:47',
          bookingCount: 0,
          status: 'active'
        }
      ];
      
      users.value = mockData;
      total.value = mockData.length;
      loading.value = false;
    }, 1000);
  } catch (error) {
    console.error('获取用户列表失败', error);
    loading.value = false;
    ElMessage.error('获取数据失败，请重试');
  }
};

// 获取用户预约记录
const fetchUserBookings = async (userId) => {
  bookingsLoading.value = true;
  try {
    // 模拟API调用
    setTimeout(() => {
      // 这里应该是实际调用API的代码
      // axios.get(`/api/users/${userId}/bookings`)
      
      // 模拟数据
      if (userId === 'user_001') {
        userBookings.value = [
          {
            id: 'booking_001',
            professionalName: '张医生',
            serviceType: '心理咨询',
            bookingTime: '2023-08-15 15:00:00',
            status: 'completed',
            amount: 200.00,
            createdAt: '2023-08-10 09:22:15'
          },
          {
            id: 'booking_002',
            professionalName: '李律师',
            serviceType: '法律咨询',
            bookingTime: '2023-08-20 10:30:00',
            status: 'completed',
            amount: 300.00,
            createdAt: '2023-08-15 16:40:33'
          },
          {
            id: 'booking_003',
            professionalName: '王老师',
            serviceType: '教育辅导',
            bookingTime: '2023-09-05 14:00:00',
            status: 'upcoming',
            amount: 150.00,
            createdAt: '2023-08-25 11:15:47'
          }
        ];
      } else if (userId === 'user_002') {
        userBookings.value = [
          {
            id: 'booking_004',
            professionalName: '张医生',
            serviceType: '心理咨询',
            bookingTime: '2023-08-18 16:30:00',
            status: 'completed',
            amount: 200.00,
            createdAt: '2023-08-12 10:05:22'
          },
          {
            id: 'booking_005',
            professionalName: '赵工程师',
            serviceType: '技术咨询',
            bookingTime: '2023-09-10 11:00:00',
            status: 'cancelled',
            amount: 250.00,
            createdAt: '2023-08-28 14:33:19'
          }
        ];
      } else {
        userBookings.value = [];
      }
      
      bookingsLoading.value = false;
    }, 800);
  } catch (error) {
    console.error('获取用户预约记录失败', error);
    bookingsLoading.value = false;
    ElMessage.error('获取预约记录失败');
  }
};

// 获取用户操作日志
const fetchUserLogs = async (userId) => {
  logsLoading.value = true;
  try {
    // 模拟API调用
    setTimeout(() => {
      // 这里应该是实际调用API的代码
      // axios.get(`/api/users/${userId}/logs`)
      
      // 模拟数据
      if (userId === 'user_001') {
        userLogs.value = [
          {
            time: '2023-09-01 16:45:22',
            action: '登录',
            details: '小程序登录',
            ip: '192.168.1.100'
          },
          {
            time: '2023-08-30 14:22:10',
            action: '预约',
            details: '预约了王老师的教育辅导服务',
            ip: '192.168.1.100'
          },
          {
            time: '2023-08-28 10:15:45',
            action: '支付',
            details: '支付了200元预约费用',
            ip: '192.168.1.100'
          },
          {
            time: '2023-08-25 09:30:12',
            action: '登录',
            details: '小程序登录',
            ip: '192.168.1.101'
          }
        ];
      } else if (userId === 'user_002') {
        userLogs.value = [
          {
            time: '2023-08-29 10:12:05',
            action: '登录',
            details: '小程序登录',
            ip: '192.168.2.100'
          },
          {
            time: '2023-08-28 14:33:19',
            action: '预约',
            details: '预约了赵工程师的技术咨询服务',
            ip: '192.168.2.100'
          },
          {
            time: '2023-08-28 15:45:22',
            action: '取消',
            details: '取消了预约',
            ip: '192.168.2.100'
          }
        ];
      } else {
        userLogs.value = [];
      }
      
      logsLoading.value = false;
    }, 800);
  } catch (error) {
    console.error('获取用户操作日志失败', error);
    logsLoading.value = false;
    ElMessage.error('获取操作日志失败');
  }
};

// 获取预约状态标签类型
const getBookingStatusType = (status) => {
  const statusMap = {
    upcoming: 'primary',
    completed: 'success',
    cancelled: 'info',
    refunded: 'warning'
  };
  return statusMap[status] || 'info';
};

// 获取预约状态文本
const getBookingStatusText = (status) => {
  const statusMap = {
    upcoming: '即将到来',
    completed: '已完成',
    cancelled: '已取消',
    refunded: '已退款'
  };
  return statusMap[status] || '未知';
};

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1;
  fetchUsers();
};

// 分页大小变更
const handleSizeChange = (size) => {
  pageSize.value = size;
  fetchUsers();
};

// 分页页码变更
const handleCurrentChange = (page) => {
  currentPage.value = page;
  fetchUsers();
};

// 查看详情
const viewDetails = (user) => {
  selectedUser.value = user;
  detailDialogVisible.value = true;
  activeTab.value = 'bookings';
  
  // 获取用户预约记录和操作日志
  fetchUserBookings(user.userId);
  fetchUserLogs(user.userId);
};

// 切换用户状态
const toggleUserStatus = (user) => {
  const action = user.status === 'active' ? '禁用' : '启用';
  
  ElMessageBox.confirm(
    `确定要${action}用户 ${user.nickname} 吗？`,
    '操作确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      // 这里应该是调用API的代码
      // axios.post(`/api/users/${user.userId}/${user.status === 'active' ? 'disable' : 'enable'}`)
      
      // 模拟API调用
      loading.value = true;
      setTimeout(() => {
        const index = users.value.findIndex(u => u.userId === user.userId);
        if (index !== -1) {
          const newStatus = user.status === 'active' ? 'disabled' : 'active';
          users.value[index].status = newStatus;
          
          if (detailDialogVisible.value && selectedUser.value.userId === user.userId) {
            selectedUser.value.status = newStatus;
          }
        }
        loading.value = false;
        ElMessage.success(`已${action}该用户`);
      }, 500);
    })
    .catch(() => {});
};

// 导出数据
const exportData = () => {
  ElMessage.success('数据导出功能将在后续版本中实现');
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.user-list-container {
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

.detail-tabs {
  margin-top: 20px;
}

.empty-data {
  padding: 30px 0;
}
</style> 