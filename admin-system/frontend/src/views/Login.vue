<template>
  <div class="login-container">
    <div class="login-form-container">
      <div class="login-header">
        <h1>信息分享APP</h1>
        <h2>后台管理系统</h2>
      </div>

      <el-form ref="loginFormRef" :model="loginForm" :rules="rules" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="用户名" prefix-icon="User" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" class="login-button" @click="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, FormInstance } from 'element-plus'
import { login } from '../api/auth'

const router = useRouter()
const route = useRoute()

const loginForm = reactive({
  username: '',
  password: '',
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 5, message: '密码长度不能少于5位', trigger: 'blur' },
  ],
}

const loading = ref(false)
const loginFormRef = ref<FormInstance>()

const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    await loginFormRef.value.validate()

    loading.value = true
    console.log('正在尝试登录，用户名:', loginForm.username, '密码:', loginForm.password)
    const response = await login(loginForm.username, loginForm.password)
    console.log('登录响应:', response)

    if (response.code === 200) {
      console.log('登录成功，准备跳转...')
      // 重定向到来源页面或首页
      const redirect = route.query.redirect as string
      console.log('重定向地址:', redirect || '/')
      try {
        await router.push(redirect || '/')
        console.log('路由跳转成功')
        ElMessage.success('登录成功')
      } catch (routerError) {
        console.error('路由跳转失败:', routerError)
        ElMessage.error('页面跳转失败，请刷新重试')
      }
    } else {
      ElMessage.error(response.message || '登录失败：用户名或密码错误')
    }
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error('登录失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.login-form-container {
  width: 400px;
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-header {
  margin-bottom: 30px;
  text-align: center;
}

.login-header h1 {
  margin-bottom: 10px;
  font-size: 24px;
  color: #409eff;
}

.login-header h2 {
  font-size: 18px;
  font-weight: normal;
  color: #606266;
}

.login-form {
  margin-top: 30px;
}

.login-button {
  width: 100%;
}
</style>
