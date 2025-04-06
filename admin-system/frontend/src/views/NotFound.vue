<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <img src="/logo.svg" alt="Logo" class="logo" />
      <h1>404</h1>
      <p>抱歉，您访问的页面不存在</p>
      <el-button type="primary" @click="goBack">返回首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.push('/dashboard')
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f7f7f7;
}

.not-found-content {
  padding: 40px;
  text-align: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.logo {
  width: 60px;
  height: 60px;
  margin-bottom: 20px;
}

h1 {
  margin: 0;
  font-size: 72px;
  color: #409eff;
}

p {
  margin: 20px 0 30px;
  font-size: 16px;
  color: #606266;
}
</style>
