<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <div class="logo">
          <img src="/logo.svg" alt="Logo" width="40" height="40" />
          <h1>信息分享管理系统</h1>
        </div>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        size="large"
      >
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="用户名" prefix-icon="User" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="密码"
            prefix-icon="Lock"
            type="password"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login-button" :loading="loading" @click="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="login-footer">
      <p>© {{ new Date().getFullYear() }} 信息分享管理系统</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { setToken, setUserInfo } from '../utils/auth'

// 路由信息
const router = useRouter()
const route = useRoute()

// 表单引用
const loginFormRef = ref(null)

// 加载状态
const loading = ref(false)

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: '',
})

// 登录表单验证规则
const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6个字符', trigger: 'blur' },
  ],
}

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    // 表单验证
    await loginFormRef.value.validate()

    // 设置加载状态
    loading.value = true

    // 模拟API调用
    setTimeout(() => {
      // 判断用户名和密码
      if (loginForm.username === 'admin' && loginForm.password === '123456') {
        // 登录成功，设置token和用户信息
        const token = 'admin-token-example'
        const userInfo = {
          id: '1',
          username: 'admin',
          name: '系统管理员',
          avatar: '',
          role: 'admin',
          permissions: ['admin'],
        }

        setToken(token)
        setUserInfo(userInfo)

        ElMessage.success('登录成功')

        // 重定向到首页或指定页面
        const redirectPath = (route.query.redirect as string) || '/'
        router.push(redirectPath)
      } else {
        ElMessage.error('用户名或密码错误')
      }

      loading.value = false
    }, 1000)
  } catch (error) {
    console.error('登录表单验证失败', error)
    loading.value = false
  }
}

// 设置初始用户名（开发环境自动填写）
onMounted(() => {
  // 开发模式下自动填写用户名和密码
  const isDev = process.env.NODE_ENV === 'development'
  if (isDev) {
    loginForm.username = 'admin'
    loginForm.password = '123456'
  }
})
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-box {
  width: 400px;
  padding: 30px;
  margin-bottom: 50px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.login-header {
  margin-bottom: 40px;
  text-align: center;
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo h1 {
  margin-top: 15px;
  font-size: 24px;
  font-weight: 500;
  color: #333;
}

.login-form {
  margin-bottom: 20px;
}

.login-button {
  width: 100%;
  height: 40px;
}

.login-footer {
  font-size: 14px;
  color: #666;
}

@media (max-width: 480px) {
  .login-box {
    width: 90%;
    padding: 20px;
  }
}
</style>
