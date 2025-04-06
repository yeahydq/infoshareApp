import axios from 'axios'

// 登录接口
export const login = async (username: string, password: string) => {
  try {
    console.log('发送登录请求:', { username, password })
    const response = await axios.post('/api/auth/login', {
      username,
      password,
    })

    console.log('登录响应:', response.data)

    // 如果登录成功，保存token到localStorage
    if (response.data.code === 200 && response.data.data) {
      const { token, admin } = response.data.data
      if (token) {
        localStorage.setItem('admin_token', token)
      }
      if (admin) {
        localStorage.setItem('admin_user_info', JSON.stringify(admin))
      }
    }

    return response.data
  } catch (error: any) {
    console.error('登录请求失败:', error)

    // 检查是否有响应数据
    if (error.response && error.response.data) {
      console.log('服务器返回的错误:', error.response.data)
      return error.response.data
    }

    // 如果没有响应数据，返回一个标准格式的错误
    return {
      code: 500,
      message: '登录失败: ' + (error.message || '未知错误'),
    }
  }
}

// 退出登录
export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  // 重定向到登录页
  window.location.href = '/login'
}

// 获取当前用户信息
export const getCurrentUser = async () => {
  try {
    const response = await axios.get('/api/auth/current')
    return response.data
  } catch (error) {
    console.error('获取当前用户信息失败:', error)
    throw error
  }
}

// 修改密码
export const changePassword = async (oldPassword: string, newPassword: string) => {
  try {
    const response = await axios.post('/api/auth/password', {
      oldPassword,
      newPassword,
    })
    return response.data
  } catch (error) {
    console.error('修改密码失败:', error)
    throw error
  }
}

// 更新个人信息
export const updateProfile = async (profile: {
  name?: string
  email?: string
  avatar?: string
}) => {
  try {
    const response = await axios.post('/api/auth/profile', profile)

    // 更新本地存储的用户信息
    if (response.data.code === 200 && response.data.data) {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
      localStorage.setItem(
        'userInfo',
        JSON.stringify({
          ...userInfo,
          ...profile,
        }),
      )
    }

    return response.data
  } catch (error) {
    console.error('更新个人信息失败:', error)
    throw error
  }
}
