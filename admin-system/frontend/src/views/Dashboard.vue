<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>专业人士总数</span>
            </div>
          </template>
          <div class="card-content">
            <span class="count-number">{{ dashboardData.professionalCount }}</span>
            <el-progress
              :percentage="dashboardData.professionalApprovalRate"
              :format="(percentage) => `${percentage}%`"
            ></el-progress>
            <div class="count-desc">已审核率</div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>用户总数</span>
            </div>
          </template>
          <div class="card-content">
            <span class="count-number">{{ dashboardData.userCount }}</span>
            <el-divider></el-divider>
            <div class="count-desc">活跃用户: {{ dashboardData.activeUserCount }}</div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>预约总数</span>
            </div>
          </template>
          <div class="card-content">
            <span class="count-number">{{ dashboardData.bookingCount }}</span>
            <el-divider></el-divider>
            <div class="count-desc">本周预约: {{ dashboardData.weeklyBookings }}</div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>待处理审核</span>
            </div>
          </template>
          <div class="card-content">
            <span class="count-number">{{ dashboardData.pendingReviewCount }}</span>
            <el-divider></el-divider>
            <div class="count-desc">
              <router-link to="/professionals?status=pending">立即处理</router-link>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>预约趋势</span>
            </div>
          </template>
          <div class="chart-placeholder">
            <el-empty description="图表加载中" v-if="loading"></el-empty>
            <div v-else class="chart-container">
              <p>最近7天预约数据</p>
              <div class="chart-bars">
                <div
                  v-for="(item, index) in dashboardData.bookingTrend"
                  :key="index"
                  class="chart-bar"
                  :style="{ height: `${item.count * 5}px` }"
                >
                  <span class="bar-label">{{ item.count }}</span>
                </div>
              </div>
              <div class="chart-labels">
                <span
                  v-for="(item, index) in dashboardData.bookingTrend"
                  :key="index"
                  class="date-label"
                >
                  {{ formatDate(item.date) }}
                </span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>最新审核</span>
            </div>
          </template>
          <div class="list-content">
            <el-table
              v-if="!loading && dashboardData.recentReviews.length > 0"
              :data="dashboardData.recentReviews"
              style="width: 100%"
              :show-header="false"
            >
              <el-table-column width="50">
                <template #default="scope">
                  <el-avatar :size="40" shape="circle" fit="cover" :src="scope.row.avatarUrl">
                    {{ scope.row.name.substring(0, 1) }}
                  </el-avatar>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="姓名">
                <template #default="scope">
                  <div class="review-info">
                    <div class="review-name">{{ scope.row.name }}</div>
                    <div class="review-time">{{ formatTime(scope.row.createTime) }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column width="100" align="right">
                <template #default="scope">
                  <router-link :to="`/professionals/review/${scope.row.id || scope.row._id}`">
                    <el-button size="small">查看</el-button>
                  </router-link>
                </template>
              </el-table-column>
            </el-table>
            <el-empty description="暂无数据" v-else></el-empty>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

interface DashboardData {
  professionalCount: number
  professionalApprovalRate: number
  userCount: number
  activeUserCount: number
  bookingCount: number
  weeklyBookings: number
  pendingReviewCount: number
  bookingTrend: Array<{ date: string; count: number }>
  recentReviews: Array<{ _id: string; name: string; avatarUrl: string; createTime: string }>
  totalRevenue?: number
  serviceTypeStats?: Array<{ type: string; count: number; percentage: number }>
  topProfessionals?: Array<{
    id: string
    name: string
    avatar: string
    profession: string
    serviceCount: number
    rating: number
  }>
}

const loading = ref(true)
const dashboardData = ref<DashboardData>({
  professionalCount: 0,
  professionalApprovalRate: 0,
  userCount: 0,
  activeUserCount: 0,
  bookingCount: 0,
  weeklyBookings: 0,
  pendingReviewCount: 0,
  bookingTrend: [],
  recentReviews: [],
})

// 获取仪表盘数据
const fetchDashboardData = async () => {
  loading.value = true
  try {
    console.log('开始获取仪表盘数据...')
    // 调用后端API获取数据
    const response = await axios.get('/api/dashboard')
    console.log('仪表盘API响应:', response.data)

    if (response.data && response.data.data) {
      // 将数据格式转换为符合前端需要的格式
      const data = response.data.data
      console.log('仪表盘原始数据:', data)

      // 检查recentProfessionals是否存在
      console.log('最新专业人士数据:', data.recentProfessionals)

      // 确保recentProfessionals每一项都有_id字段
      const recentPros = (data.recentProfessionals || []).map((pro) => {
        console.log('处理专业人士数据:', pro)
        return {
          _id: pro.id || pro._id,
          id: pro.id || pro._id,
          name: pro.name || '未命名专业人士',
          avatarUrl: pro.avatar || pro.avatarUrl || '',
          createTime: pro.createTime || new Date().toISOString(),
        }
      })

      console.log('处理后的最新专业人士数据:', recentPros)

      dashboardData.value = {
        professionalCount: data.stats?.professionals?.total || 0,
        professionalApprovalRate:
          data.stats?.professionals?.total > 0
            ? Math.round(
                (data.stats?.professionals?.approved / data.stats?.professionals?.total) * 100,
              )
            : 0,
        userCount: data.stats?.users?.total || 0,
        activeUserCount: data.stats?.users?.active || 0,
        bookingCount: data.stats?.bookings?.total || 0,
        weeklyBookings: data.stats?.bookings?.thisWeek || 0,
        pendingReviewCount: data.stats?.professionals?.pending || 0,
        bookingTrend:
          data.revenueData?.map((item) => ({
            date: item.date,
            count: Math.floor(item.value / 1000),
          })) || [],
        recentReviews: recentPros,
      }

      console.log('处理后的仪表盘数据:', dashboardData.value)
    } else {
      console.error('仪表盘数据格式不正确:', response.data)
      ElMessage.warning('获取到的数据格式不正确')
    }

    loading.value = false
  } catch (error) {
    console.error('获取仪表盘数据失败:', error)
    loading.value = false
    ElMessage.error('获取数据失败，请重试')

    // 清空数据
    dashboardData.value = {
      professionalCount: 0,
      professionalApprovalRate: 0,
      userCount: 0,
      activeUserCount: 0,
      bookingCount: 0,
      weeklyBookings: 0,
      pendingReviewCount: 0,
      bookingTrend: [],
      recentReviews: [],
    }
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

// 格式化时间
const formatTime = (timeString: string) => {
  const date = new Date(timeString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  // 小于24小时显示"x小时前"
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000))
    if (hours === 0) {
      const minutes = Math.floor(diff / (60 * 1000))
      return `${minutes}分钟前`
    }
    return `${hours}小时前`
  }

  // 否则显示日期
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.el-row {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
}

.count-number {
  margin-bottom: 10px;
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.count-desc {
  font-size: 14px;
  color: #606266;
}

.chart-row {
  margin-top: 30px;
}

.chart-card {
  height: 360px;
}

.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.chart-container {
  width: 100%;
  height: 100%;
  padding: 20px;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 200px;
  padding: 20px 0;
}

.chart-bar {
  position: relative;
  width: 25px;
  min-height: 5px;
  background-color: #409eff;
  border-radius: 4px 4px 0 0;
  transition: height 0.5s ease;
}

.bar-label {
  position: absolute;
  top: -20px;
  left: 50%;
  font-size: 12px;
  transform: translateX(-50%);
}

.chart-labels {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.date-label {
  font-size: 12px;
  color: #606266;
}

.list-content {
  height: 300px;
  overflow-y: auto;
}

.review-info {
  display: flex;
  flex-direction: column;
}

.review-name {
  font-size: 14px;
  font-weight: bold;
}

.review-time {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
}
</style>
