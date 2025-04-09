<template>
  <div class="layout-container">
    <el-container class="app-container">
      <el-aside width="220px" class="aside">
        <div class="logo-container">
          <img src="/logo.svg" class="logo" alt="Logo" />
          <h1 class="title">管理系统</h1>
        </div>
        <el-menu :default-active="activeMenu" class="menu" router :collapse="isCollapse">
          <el-menu-item index="/dashboard">
            <el-icon><Menu /></el-icon>
            <span>仪表盘</span>
          </el-menu-item>
          <el-menu-item index="/professionals">
            <el-icon><User /></el-icon>
            <span>专业人士管理</span>
          </el-menu-item>
          <el-menu-item index="/users">
            <el-icon><Avatar /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/bookings">
            <el-icon><Calendar /></el-icon>
            <span>预约管理</span>
          </el-menu-item>
          <el-menu-item index="/settings">
            <el-icon><Setting /></el-icon>
            <span>系统设置</span>
          </el-menu-item>
          <el-menu-item index="/cloud-test">
            <el-icon><Upload /></el-icon>
            <span>云存储测试</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container class="main-container">
        <el-header class="header">
          <div class="header-left">
            <el-icon class="fold-icon" @click="toggleCollapse">
              <component :is="isCollapse ? 'Expand' : 'Fold'" />
            </el-icon>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
                {{ item }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <el-dropdown>
              <span class="user-info">
                <el-avatar icon="User" size="small" />
                <span class="username">管理员</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="goToSettings">个人设置</el-dropdown-item>
                  <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        <el-main>
          <router-view v-slot="{ Component }">
            <transition name="fade-transform" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'

// 侧边栏折叠状态
const isCollapse = ref(false)
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 当前路由
const route = useRoute()
const router = useRouter()

// 当前活动菜单
const activeMenu = computed(() => {
  const { path } = route
  return path
})

// 面包屑
const breadcrumbs = computed(() => {
  const { meta } = route
  const items: string[] = []

  if (meta && meta.title) {
    items.push(meta.title as string)
  }

  return items
})

// 前往设置页面
const goToSettings = () => {
  router.push('/settings')
}

// 退出登录
const logout = () => {
  ElMessageBox.confirm('确定要退出登录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 清除登录信息
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_info')

      // 跳转到登录页
      router.push('/login')
    })
    .catch(() => {
      // 取消退出
    })
}
</script>

<style scoped>
.layout-container {
  width: 100%;
  height: 100vh;
}

.app-container {
  height: 100%;
}

.aside {
  overflow-x: hidden;
  color: white;
  background-color: #001529;
  transition: width 0.3s;
}

.logo-container {
  display: flex;
  align-items: center;
  height: 60px;
  padding: 10px;
  background-color: #001529;
}

.logo {
  height: 40px;
  margin-right: 10px;
}

.title {
  margin: 0;
  font-size: 18px;
  color: white;
  white-space: nowrap;
}

.menu {
  background-color: #001529;
  border-right: none;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
}

.header-left {
  display: flex;
  align-items: center;
}

.fold-icon {
  margin-right: 20px;
  font-size: 20px;
  cursor: pointer;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin-left: 10px;
}

.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
