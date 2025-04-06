<template>
  <div class="settings-container">
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>系统设置</span>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="个人信息" name="profile">
          <div class="profile-container">
            <div class="avatar-container">
              <el-avatar :size="100" icon="User" />
              <el-button class="update-btn" size="small">更换头像</el-button>
            </div>

            <el-form
              :model="profileForm"
              :rules="profileRules"
              ref="profileFormRef"
              label-width="100px"
              class="profile-form"
            >
              <el-form-item label="用户名" prop="username">
                <el-input v-model="profileForm.username" disabled />
              </el-form-item>
              <el-form-item label="姓名" prop="name">
                <el-input v-model="profileForm.name" />
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="profileForm.email" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateProfile" :loading="loading">
                  保存修改
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <el-tab-pane label="修改密码" name="password">
          <el-form
            :model="passwordForm"
            :rules="passwordRules"
            ref="passwordFormRef"
            label-width="100px"
            class="password-form"
          >
            <el-form-item label="旧密码" prop="oldPassword">
              <el-input
                v-model="passwordForm.oldPassword"
                type="password"
                show-password
                placeholder="请输入旧密码"
              />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input
                v-model="passwordForm.newPassword"
                type="password"
                show-password
                placeholder="请输入新密码"
              />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="passwordForm.confirmPassword"
                type="password"
                show-password
                placeholder="请再次输入新密码"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updatePassword" :loading="loading">
                修改密码
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="管理员账号" name="admin">
          <div class="admin-container">
            <el-button type="primary" @click="addAdminDialog = true">添加管理员</el-button>

            <el-table :data="adminList" style="width: 100%; margin-top: 20px" border>
              <el-table-column prop="username" label="用户名" width="180" />
              <el-table-column prop="name" label="姓名" width="180" />
              <el-table-column prop="email" label="邮箱" />
              <el-table-column prop="role" label="角色">
                <template #default="scope">
                  <el-tag>{{ scope.row.role === 'admin' ? '管理员' : '普通用户' }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="150">
                <template #default="scope">
                  <el-button link type="primary" size="small" @click="resetPassword(scope.row)">
                    重置密码
                  </el-button>
                  <el-button link type="danger" size="small" @click="deleteAdmin(scope.row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加管理员对话框 -->
    <el-dialog v-model="addAdminDialog" title="添加管理员" width="500px">
      <el-form :model="adminForm" :rules="adminRules" ref="adminFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="adminForm.username" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="adminForm.name" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="adminForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="adminForm.email" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addAdminDialog = false">取消</el-button>
          <el-button type="primary" @click="addAdmin" :loading="loading">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 当前标签页
const activeTab = ref('profile')

// 加载状态
const loading = ref(false)

// 表单引用
const profileFormRef = ref(null)
const passwordFormRef = ref(null)
const adminFormRef = ref(null)

// 个人信息表单
const profileForm = reactive({
  username: '',
  name: '',
  email: '',
})

// 个人信息表单校验规则
const profileRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
}

// 密码表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 密码表单校验规则
const passwordRules = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

// 添加管理员对话框
const addAdminDialog = ref(false)

// 管理员表单
const adminForm = reactive({
  username: '',
  name: '',
  password: '',
  email: '',
})

// 管理员表单校验规则
const adminRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
}

// 管理员列表
const adminList = ref([
  {
    id: '1',
    username: 'admin',
    name: '系统管理员',
    email: 'admin@example.com',
    role: 'admin',
  },
])

// 获取用户信息
const fetchUserInfo = () => {
  // 模拟从本地存储或API获取用户信息
  try {
    // 实际项目中这里应该调用API获取最新的用户信息
    const adminInfo = JSON.parse(localStorage.getItem('admin_info') || '{}')
    profileForm.username = adminInfo.username || 'admin'
    profileForm.name = adminInfo.name || '系统管理员'
    profileForm.email = adminInfo.email || ''
  } catch (e) {
    console.error('获取用户信息出错', e)
  }
}

// 获取管理员列表
const fetchAdminList = () => {
  // 实际项目中这里应该调用API获取管理员列表
  // 这里使用模拟数据
}

// 更新个人信息
const updateProfile = async () => {
  if (!profileFormRef.value) return

  try {
    await profileFormRef.value.validate()
    loading.value = true

    // 模拟API调用
    setTimeout(() => {
      ElMessage.success('个人信息更新成功')
      loading.value = false

      // 更新本地存储的信息
      try {
        const adminInfo = JSON.parse(localStorage.getItem('admin_info') || '{}')
        adminInfo.name = profileForm.name
        adminInfo.email = profileForm.email
        localStorage.setItem('admin_info', JSON.stringify(adminInfo))
      } catch (e) {
        console.error('更新本地存储用户信息出错', e)
      }
    }, 1000)
  } catch (error) {
    console.error('表单验证失败', error)
    loading.value = false
  }
}

// 更新密码
const updatePassword = async () => {
  if (!passwordFormRef.value) return

  try {
    await passwordFormRef.value.validate()
    loading.value = true

    // 模拟API调用
    setTimeout(() => {
      ElMessage.success('密码修改成功')
      loading.value = false

      // 清空表单
      passwordForm.oldPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
    }, 1000)
  } catch (error) {
    console.error('表单验证失败', error)
    loading.value = false
  }
}

// 添加管理员
const addAdmin = async () => {
  if (!adminFormRef.value) return

  try {
    await adminFormRef.value.validate()
    loading.value = true

    // 模拟API调用
    setTimeout(() => {
      // 添加到列表
      adminList.value.push({
        id: Date.now().toString(),
        username: adminForm.username,
        name: adminForm.name,
        email: adminForm.email,
        role: 'admin',
      })

      ElMessage.success('管理员添加成功')
      loading.value = false
      addAdminDialog.value = false

      // 清空表单
      adminForm.username = ''
      adminForm.name = ''
      adminForm.password = ''
      adminForm.email = ''
    }, 1000)
  } catch (error) {
    console.error('表单验证失败', error)
    loading.value = false
  }
}

// 重置管理员密码
const resetPassword = (row) => {
  ElMessageBox.confirm(`确定要重置管理员 ${row.name} 的密码吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 模拟API调用
      setTimeout(() => {
        ElMessage.success('密码重置成功')
      }, 500)
    })
    .catch(() => {})
}

// 删除管理员
const deleteAdmin = (row) => {
  ElMessageBox.confirm(`确定要删除管理员 ${row.name} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 模拟API调用
      setTimeout(() => {
        adminList.value = adminList.value.filter((item) => item.id !== row.id)
        ElMessage.success('管理员删除成功')
      }, 500)
    })
    .catch(() => {})
}

onMounted(() => {
  fetchUserInfo()
  fetchAdminList()
})
</script>

<style scoped>
.settings-container {
  padding: 20px;
}

.settings-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.profile-container {
  display: flex;
  padding: 20px 0;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 40px;
}

.update-btn {
  margin-top: 10px;
}

.profile-form,
.password-form {
  flex: 1;
  max-width: 500px;
}

.admin-container {
  padding: 20px 0;
}
</style>
