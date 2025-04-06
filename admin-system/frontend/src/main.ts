import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import './styles/index.css'
import router from './router'
import App from './App.vue'
import { setupAuth, getToken, removeToken } from './utils/auth'
import axios from 'axios'
import { ElMessage } from 'element-plus'

// Axios全局配置
axios.defaults.baseURL = '/api'

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 处理401错误（未授权，通常是token失效）
    if (error.response && error.response.status === 401) {
      ElMessage.error('登录状态已过期，请重新登录')
      removeToken()
      router.push('/login')
    } else if (error.response) {
      // 处理其他错误
      ElMessage.error(error.response.data.message || '请求出错')
    } else {
      ElMessage.error('网络连接失败，请检查网络')
    }
    return Promise.reject(error)
  },
)

// 创建应用实例
const app = createApp(App)

// 注册所有Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 使用插件
app.use(createPinia())
app.use(router)
app.use(ElementPlus, {
  locale: zhCn,
  size: 'default',
})

// 设置认证
setupAuth(router)

// 挂载应用
app.mount('#app')
