<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '专业人员注册' },
}
</route>

<template>
  <PageLayout
    title="专业人员注册 (1/4)"
    subtitle="完善您的基本信息，成为认证专业人员"
    :steps="steps"
    :showBack="false"
    @next="handleNext"
  >
    <view class="intro-section">
      <view class="intro-title">为什么要注册成为专业人员？</view>
      <view class="intro-content">
        <view class="intro-item">✓ 获得更多接单机会</view>
        <view class="intro-item">✓ 建立个人品牌和信誉</view>
        <view class="intro-item">✓ 享受平台推广资源</view>
      </view>
    </view>

    <view class="form">
      <!-- 姓名 -->
      <view class="form-item">
        <text class="label">
          姓名
          <text class="required">*</text>
        </text>
        <input
          v-model="formData.name"
          type="text"
          placeholder="请输入真实姓名"
          class="input"
          @input="updateFormField"
        />
      </view>

      <!-- 性别 -->
      <view class="form-item">
        <text class="label">
          性别
          <text class="required">*</text>
        </text>
        <radio-group @change="handleGenderChange" class="radio-group">
          <label class="radio-label">
            <radio value="male" :checked="formData.gender === 'male'" />
            <text>男</text>
          </label>
          <label class="radio-label">
            <radio value="female" :checked="formData.gender === 'female'" />
            <text>女</text>
          </label>
        </radio-group>
      </view>

      <!-- 手机号 -->
      <view class="form-item">
        <text class="label">
          手机号
          <text class="required">*</text>
        </text>
        <input
          v-model="formData.phone"
          type="number"
          placeholder="请输入手机号"
          class="input"
          :maxlength="11"
          @input="updateFormField"
        />
      </view>

      <!-- 身份证号 -->
      <view class="form-item">
        <text class="label">
          身份证号
          <text class="hint">(选填，有助于提高审核通过率)</text>
        </text>
        <input
          v-model="formData.idCard"
          type="idcard"
          placeholder="请输入身份证号（选填）"
          class="input"
          :maxlength="18"
          @input="updateFormField"
        />
      </view>

      <!-- 邮箱 -->
      <view class="form-item">
        <text class="label">邮箱</text>
        <input
          v-model="formData.email"
          type="text"
          placeholder="请输入邮箱（选填）"
          class="input"
          @input="updateFormField"
        />
      </view>

      <!-- 专业类型 -->
      <view class="form-item">
        <text class="label">
          专业类型
          <text class="required">*</text>
          <text class="hint">(可多选，至少选择一项)</text>
        </text>

        <!-- 搜索框 -->
        <view class="search-box">
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索专业类型"
            class="input search-input"
            @input="filterProfessionalTypes"
          />
          <text v-if="searchKeyword" class="clear-btn" @tap="clearSearch">×</text>
        </view>

        <!-- 已选专业 -->
        <view v-if="formData.professionalTypes.length > 0" class="selected-types">
          <view class="selected-title">已选专业</view>
          <view class="selected-list">
            <view
              v-for="(type, index) in formData.professionalTypes"
              :key="`selected-${index}`"
              class="selected-item"
            >
              <text class="type-text">{{ type }}</text>
              <text class="remove-btn" @tap="removeProfessionalType(type)">×</text>
            </view>
          </view>
        </view>

        <!-- 最近选择 -->
        <view v-if="!searchKeyword && recentTypes.length > 0" class="recent-types">
          <view class="recent-title">最近选择</view>
          <view class="recent-list">
            <view
              v-for="(type, index) in recentTypes"
              :key="`recent-${index}`"
              :class="['recent-item', formData.professionalTypes.includes(type) ? 'active' : '']"
              @tap="toggleProfessionalType(type)"
            >
              {{ type }}
            </view>
          </view>
        </view>

        <!-- 专业分类 -->
        <view
          class="category-item"
          v-for="(category, catIndex) in filteredCategories"
          :key="`cat-${catIndex}`"
        >
          <view class="category-title" @tap="toggleCategoryCollapse(category.name)">
            {{ category.name }}
            <text class="collapse-icon">{{ isCategoryCollapsed(category.name) ? '▶' : '▼' }}</text>
          </view>
          <view
            class="type-list"
            :class="{ collapsed: isCategoryCollapsed(category.name) }"
            v-show="!isCategoryCollapsed(category.name) || searchKeyword"
          >
            <view
              v-for="(type, typeIndex) in category.types"
              :key="`type-${catIndex}-${typeIndex}`"
              :class="['type-item', formData.professionalTypes.includes(type) ? 'active' : '']"
              @tap="toggleProfessionalType(type)"
            >
              {{ type }}
            </view>

            <!-- 在教育分类中添加辅导范围选择 -->
            <view
              v-if="category.name === '教育' && hasSelectedEducation"
              class="education-ranges-container"
            >
              <text class="range-label">
                辅导范围
                <text class="required">*</text>
              </text>
              <view class="education-ranges">
                <view
                  v-for="(range, index) in educationRanges"
                  :key="index"
                  :class="[
                    'range-item',
                    formData.educationRanges.includes(range.value) ? 'active' : '',
                  ]"
                  @tap="toggleEducationRange(range.value)"
                >
                  {{ range.label }}
                </view>
              </view>
            </view>
          </view>
        </view>

        <view v-if="searchKeyword && filteredTypes.length === 0" class="no-results">
          没有找到相关专业类型
        </view>
      </view>

      <!-- 自定义专业类型 -->
      <view class="form-item" v-if="hasSelectedOther">
        <text class="label">
          自定义专业类型
          <text class="hint">(请输入您的专业类型)</text>
        </text>
        <view class="custom-type-input">
          <input
            v-model="customTypeInput"
            type="text"
            placeholder="请输入自定义专业类型（不超过5个字）"
            class="input"
            :maxlength="5"
          />
          <button class="add-btn" @tap="addCustomType">添加</button>
        </view>
      </view>

      <!-- 技能价格设置 -->
      <view class="form-item" v-if="formData.professionalTypes.length > 0">
        <text class="label">
          服务价格设置
          <text class="required">*</text>
          <text class="hint">(为每个专业设置合适的价格和计费方式)</text>
        </text>

        <!-- 价格表格布局 -->
        <view class="price-table">
          <!-- 表头 -->
          <view class="price-table-header">
            <view class="col-skill">专业类型</view>
            <view class="col-billing">计费方式</view>
            <view class="col-price">价格</view>
          </view>

          <!-- 表格内容 -->
          <view
            class="price-table-row"
            v-for="(type, index) in formData.professionalTypes"
            :key="index"
          >
            <!-- 专业名称 -->
            <view class="col-skill">{{ type }}</view>

            <!-- 计费方式下拉选择 -->
            <view class="col-billing">
              <picker
                @change="(e) => changeBillingType(type, e)"
                :value="getBillingTypeIndex(type)"
                :range="billingOptions"
                range-key="label"
              >
                <view class="picker-view">
                  <text>{{ getBillingTypeLabel(type) }}</text>
                  <text class="arrow-down">▼</text>
                </view>
              </picker>
            </view>

            <!-- 价格输入 -->
            <view class="col-price">
              <block v-if="skillBillingTypes[type] !== 'negotiable'">
                <input
                  type="digit"
                  :value="skillPrices[type] === '面议' ? '' : skillPrices[type]"
                  @input="(e) => updatePrice(type, e)"
                  class="price-input"
                  placeholder="输入"
                />
                <text class="unit-text">元{{ getBillingUnit(skillBillingTypes[type]) }}</text>
              </block>
              <text v-else class="negotiable-text">面议</text>
            </view>
          </view>
        </view>

        <view class="pricing-tips">
          <text class="tip-text">提示：选择"私聊"则无需设置具体价格，系统将显示为"面议"</text>
        </view>
      </view>
    </view>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { useUserStore } from '@/store'
import { useRegisterStore } from '@/store/registerStore'
import PageLayout from '@/components/PageLayout/PageLayout.vue'
import { login } from '@/service/auth'

const userStore = useUserStore()
const registerStore = useRegisterStore()

// 检查用户是否已登录
onMounted(() => {
  if (!userStore.userInfo?.openid) {
    uni.showModal({
      title: '提示',
      content: '请先登录后再进行专业人员注册',
      showCancel: false,
      success: () => {
        login().catch((err) => {
          console.error('登录失败:', err)
          uni.showToast({
            title: '登录失败，请重试',
            icon: 'none',
            duration: 2000,
          })
          // 返回上一页
          uni.navigateBack()
        })
      },
    })
  }
})

interface Step {
  number: number
  status: '' | 'active' | 'completed'
}

// 步骤配置
const steps = ref<Step[]>([
  { number: 1, status: 'active' },
  { number: 2, status: '' },
  { number: 3, status: '' },
  { number: 4, status: '' },
])

// 专业类型选项
const professionalTypes = ['语文辅导', '数学辅导', '英语辅导', '物理辅导', '其他']

// 删除旧的教育阶段选择，改为辅导范围
const educationRanges = [
  { label: '小学', value: '小学' },
  { label: '初中', value: '初中' },
  { label: '高中', value: '高中' },
]

// 修改表单数据结构
interface FormData {
  name: string
  gender: string
  phone: string
  idCard: string
  email: string
  professionalTypes: string[]
  customType: string
  educationRanges: string[] // 改为辅导范围
  servicePrice: string
  billingType: string
}

const formData = reactive<FormData>({
  name: '',
  gender: '',
  phone: '',
  idCard: '',
  email: '',
  professionalTypes: [],
  customType: '',
  educationRanges: [],
  servicePrice: '',
  billingType: '',
})

// 专业类型搜索与分类
const searchKeyword = ref('')
const recentTypes = ref<string[]>([])
const allCategories = [
  {
    name: '教育',
    types: ['语文辅导', '数学辅导', '英语辅导', '物理辅导'],
  },
  {
    name: '维修服务',
    types: ['水管', '电路', '空调', '保洁'],
  },
  {
    name: '其他',
    types: ['其他'],
  },
]
const filteredCategories = ref(allCategories)
const filteredTypes = ref<string[]>([])

// 专业类型折叠状态管理
const collapsedCategories = reactive({})

// 切换分类的折叠状态
const toggleCategoryCollapse = (categoryName) => {
  collapsedCategories[categoryName] = !collapsedCategories[categoryName]
}

// 检查分类是否折叠
const isCategoryCollapsed = (categoryName) => {
  // 搜索模式下不折叠
  if (searchKeyword.value) return false

  // 首次加载时默认折叠
  if (collapsedCategories[categoryName] === undefined) {
    collapsedCategories[categoryName] = true
  }

  return collapsedCategories[categoryName]
}

// 专业类型相关数据 - 移到FormData外面单独定义
const skillPrices = reactive<{ [key: string]: string }>({})
const skillBillingTypes = reactive<{ [key: string]: string }>({})
const customTypeInput = ref('')

// 计费方式选项
const billingOptions = [
  { label: '按小时', value: 'hourly' },
  { label: '私聊', value: 'negotiable' },
  { label: '按次', value: 'per_time' },
  { label: '按项目', value: 'per_project' },
  { label: '按天', value: 'daily' },
]

// 获取计费单位显示文本
const getBillingUnit = (billingType: string) => {
  switch (billingType) {
    case 'hourly':
      return '/小时'
    case 'per_time':
      return '/次'
    case 'per_project':
      return '/项目'
    case 'daily':
      return '/天'
    default:
      return ''
  }
}

// 获取计费方式的标签
const getBillingTypeLabel = (type: string) => {
  const billing = skillBillingTypes[type] || 'hourly'
  const option = billingOptions.find((opt) => opt.value === billing)
  return option ? option.label : '按小时'
}

// 获取计费方式在选项中的索引
const getBillingTypeIndex = (type: string) => {
  const billing = skillBillingTypes[type] || 'hourly'
  return billingOptions.findIndex((opt) => opt.value === billing)
}

// 更改计费方式
const changeBillingType = (type: string, e: any) => {
  const index = e.detail.value
  const billingType = billingOptions[index].value
  console.log(`更改${type}计费方式为:`, billingType)

  // 保存之前的计费方式
  const oldBillingType = skillBillingTypes[type]

  // 更新计费方式
  skillBillingTypes[type] = billingType

  // 如果选择私聊，设置价格为"面议"
  if (billingType === 'negotiable') {
    skillPrices[type] = '面议'
    console.log(`设置${type}价格为面议`, skillPrices[type])
  } else if (oldBillingType === 'negotiable' || skillPrices[type] === '面议') {
    // 如果从私聊切换到其他方式，或者价格是"面议"，清空价格
    console.log(`从面议切换到${billingType}，清空价格`)
    skillPrices[type] = ''

    // 强制更新UI
    nextTick(() => {
      console.log(`${type}当前价格:`, skillPrices[type])
    })
  }

  // 使用通用的更新函数同步到全局状态
  updateFormField()
}

// 筛选专业类型
const filterProfessionalTypes = () => {
  if (!searchKeyword.value) {
    filteredCategories.value = allCategories
    filteredTypes.value = []
    return
  }

  filteredTypes.value = []
  const keyword = searchKeyword.value.toLowerCase()

  // 过滤分类和类型
  filteredCategories.value = allCategories
    .map((category) => {
      const matchedTypes = category.types.filter((type) => type.toLowerCase().includes(keyword))
      if (matchedTypes.length > 0) {
        filteredTypes.value.push(...matchedTypes)
        return {
          name: category.name,
          types: matchedTypes,
        }
      }
      return null
    })
    .filter(Boolean) as { name: string; types: string[] }[]
}

// 清除搜索
const clearSearch = () => {
  searchKeyword.value = ''
  filterProfessionalTypes()
}

// 添加/移除专业类型（多选）
const toggleProfessionalType = (type: string) => {
  const index = formData.professionalTypes.indexOf(type)
  if (index === -1) {
    // 添加专业类型
    formData.professionalTypes.push(type)
    // 如果没有设置价格，初始化为空字符串
    if (!skillPrices[type]) {
      skillPrices[type] = ''
    }
    // 如果没有设置计费方式，默认为按小时
    if (!skillBillingTypes[type]) {
      skillBillingTypes[type] = 'hourly'
    }
  } else {
    // 移除专业类型
    formData.professionalTypes.splice(index, 1)
  }

  // 更新最近选择
  updateRecentTypes(type)

  // 使用通用的更新函数同步到全局状态
  updateFormField()
}

// 移除专业类型
const removeProfessionalType = (type: string) => {
  const index = formData.professionalTypes.indexOf(type)
  if (index !== -1) {
    formData.professionalTypes.splice(index, 1)

    // 使用通用的更新函数同步到全局状态
    updateFormField()
  }
}

// 添加自定义专业类型
const addCustomType = () => {
  if (!customTypeInput.value) {
    uni.showToast({
      title: '请输入自定义专业类型',
      icon: 'none',
    })
    return
  }

  if (formData.professionalTypes.includes(customTypeInput.value)) {
    uni.showToast({
      title: '该专业类型已添加',
      icon: 'none',
    })
    return
  }

  formData.professionalTypes.push(customTypeInput.value)
  updateRecentTypes(customTypeInput.value)
  skillPrices[customTypeInput.value] = ''
  skillBillingTypes[customTypeInput.value] = 'hourly'
  customTypeInput.value = ''

  // 使用通用的更新函数同步到全局状态
  updateFormField()
}

// 更新最近选择列表
const updateRecentTypes = (type: string) => {
  // 更新最近选择
  const index = recentTypes.value.indexOf(type)
  if (index !== -1) {
    recentTypes.value.splice(index, 1)
  }
  recentTypes.value.unshift(type)
  if (recentTypes.value.length > 5) {
    recentTypes.value.pop()
  }

  // 保存到本地存储
  try {
    uni.setStorageSync('recentProfessionalTypes', recentTypes.value)
  } catch (e) {
    console.error('Failed to save recent types', e)
  }
}

// 处理性别选择
const handleGenderChange = (e: any) => {
  formData.gender = e.detail.value

  // 使用通用的更新函数同步到全局状态
  updateFormField()
}

// 判断是否为辅导类
const isEducationType = computed(() => {
  return formData.professionalTypes.some((type) =>
    ['语文辅导', '数学辅导', '英语辅导', '物理辅导'].includes(type),
  )
})

// 判断是否为维修服务类
const isRepairType = computed(() => {
  return formData.professionalTypes.some((type) => ['水管', '电路', '空调', '保洁'].includes(type))
})

// 切换辅导范围
const toggleEducationRange = (range: string) => {
  const index = formData.educationRanges.indexOf(range)
  if (index === -1) {
    formData.educationRanges.push(range)
  } else {
    formData.educationRanges.splice(index, 1)
  }

  // 使用通用的更新函数同步到全局状态
  updateFormField()
}

// 修改表单验证
const validateForm = () => {
  if (!formData.name) {
    uni.showToast({
      title: '请输入姓名',
      icon: 'none',
    })
    return false
  }

  if (!formData.gender) {
    uni.showToast({
      title: '请选择性别',
      icon: 'none',
    })
    return false
  }

  if (!formData.phone) {
    uni.showToast({
      title: '请输入手机号',
      icon: 'none',
    })
    return false
  }

  if (!formData.professionalTypes.length) {
    uni.showToast({
      title: '请选择专业类型',
      icon: 'none',
    })
    return false
  }

  if (isEducationType.value) {
    if (!formData.educationRanges.length) {
      uni.showToast({
        title: '请选择辅导范围',
        icon: 'none',
      })
      return false
    }
  }

  // 检查每个专业类型是否设置了价格和计费方式
  for (const type of formData.professionalTypes) {
    if (!skillBillingTypes[type]) {
      uni.showToast({
        title: `请选择"${type}"的计费方式`,
        icon: 'none',
      })
      return false
    }

    // 修复验证逻辑：只有当计费方式不是"私聊"且价格为空时才提示
    if (
      skillBillingTypes[type] !== 'negotiable' &&
      (!skillPrices[type] || skillPrices[type] === '')
    ) {
      uni.showToast({
        title: `请设置"${type}"的服务价格`,
        icon: 'none',
      })
      return false
    }
  }

  return true
}

// 处理下一步
const handleNext = () => {
  if (validateForm()) {
    // 保存表单数据到全局状态
    registerStore.updateStep1({
      ...formData,
      skillPrices,
      skillBillingTypes,
    })
    // 同时保存到本地存储（作为备份）
    registerStore.saveToStorage()
    // 触发next事件
    emit('next', 1)
  }
}

// 定义emit
const emit = defineEmits(['next', 'back'])

// 页面加载时初始化
onMounted(() => {
  console.log('Register page 1 mounted')

  // 加载最近选择的专业类型
  try {
    const savedRecentTypes = uni.getStorageSync('recentProfessionalTypes')
    if (savedRecentTypes && Array.isArray(savedRecentTypes)) {
      recentTypes.value = savedRecentTypes
    }
  } catch (e) {
    console.error('Failed to load recent types', e)
  }

  // 从全局状态加载数据
  const storeData = registerStore.step1Data
  if (storeData) {
    // 恢复表单数据
    formData.name = storeData.name || ''
    formData.gender = storeData.gender || ''
    formData.phone = storeData.phone || ''
    formData.idCard = storeData.idCard || ''
    formData.email = storeData.email || ''
    formData.professionalTypes = storeData.professionalTypes || []
    formData.customType = storeData.customType || ''
    formData.educationRanges = storeData.educationRanges || []
    formData.servicePrice = storeData.servicePrice || ''
    formData.billingType = storeData.billingType || ''

    // 恢复价格和计费方式
    if (storeData.skillPrices) {
      Object.assign(skillPrices, storeData.skillPrices)
    }

    if (storeData.skillBillingTypes) {
      Object.assign(skillBillingTypes, storeData.skillBillingTypes)
    }
  }

  // 确保价格表显示正确
  console.log('当前设置的价格:', skillPrices)
  console.log('当前设置的计费方式:', skillBillingTypes)
})

// 检查是否选择了"其他"类型
const hasSelectedOther = computed(() => {
  return formData.professionalTypes.includes('其他')
})

// 判断是否选择了教育类型
const hasSelectedEducation = computed(() => {
  return formData.professionalTypes.some((type) =>
    ['语文辅导', '数学辅导', '英语辅导', '物理辅导'].includes(type),
  )
})

// 添加通用的表单更新函数
const updateFormField = () => {
  // 同步更新到全局状态
  registerStore.updateStep1({
    ...formData,
    skillPrices,
    skillBillingTypes,
  })
  // 保存到本地存储
  registerStore.saveToStorage()
}

// 添加更新价格的函数
const updatePrice = (type: string, e: any) => {
  const value = e.detail.value
  console.log(`更新${type}价格为:`, value)
  skillPrices[type] = value

  // 使用通用的更新函数同步到全局状态
  updateFormField()
}
</script>

<style lang="scss" scoped>
// 移除所有独立的基础选择器，统一在表单组件内部定义样式
.form {
  .form-item {
    margin-bottom: 30rpx;

    .label {
      display: block;
      margin-bottom: 16rpx;
      font-size: 28rpx;
      color: #333;

      // 将所有相关样式统一在这里定义
      .hint {
        margin-left: 4rpx;
        color: #999;
      }

      .required {
        margin-left: 4rpx;
        color: #ff4d4f;
      }
    }

    // 如果表单项下方需要提示文本，使用不同的类名避免冲突
    .form-hint {
      margin-top: 10rpx;
      font-size: 24rpx;
      color: #999;
    }

    .radio-group {
      display: flex;
      gap: 40rpx;

      .radio-label {
        display: flex;
        align-items: center;
        font-size: 28rpx;
        color: #333;
      }
    }
  }
}

.input {
  width: 100%;
  height: 80rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  background-color: #f8f8f8;
  border-radius: 8rpx;
}

.search-box {
  position: relative;

  .clear-btn {
    position: absolute;
    top: 50%;
    right: 20rpx;
    font-size: 28rpx;
    color: #999;
    cursor: pointer;
    transform: translateY(-50%);
  }
}

.recent-types {
  margin-bottom: 30rpx;

  .recent-title {
    padding-left: 10rpx;
    margin-bottom: 16rpx;
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
    border-left: 4rpx solid #07c160;
  }

  .recent-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;

    .recent-item {
      padding: 12rpx 24rpx;
      font-size: 26rpx;
      color: #666;
      background-color: #f8f8f8;
      border: 2rpx solid #e0e0e0;
      border-radius: 30rpx;
      transition: all 0.3s ease;

      &:active {
        background-color: rgba(7, 193, 96, 0.1);
        transform: scale(0.95);
      }
    }
  }
}

.no-results {
  margin-top: 20rpx;
  color: #999;
  text-align: center;
}

.intro-section {
  padding: 20rpx;
  margin-bottom: 30rpx;
  background-color: #f8f8f8;
  border-radius: 12rpx;

  .intro-title {
    margin-bottom: 16rpx;
    font-size: 30rpx;
    font-weight: 500;
    color: #333;
  }

  .intro-content {
    .intro-item {
      margin-bottom: 10rpx;
      font-size: 26rpx;
      line-height: 1.5;
      color: #666;
    }
  }
}

.category-item {
  margin-bottom: 30rpx;

  .category-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15rpx 10rpx;
    padding-left: 10rpx;
    margin-bottom: 16rpx;
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
    cursor: pointer;
    background-color: #f8f8f8;
    border-left: 4rpx solid #07c160;
    border-radius: 8rpx;

    .collapse-icon {
      font-size: 24rpx;
      color: #666;
      transition: transform 0.3s ease;
    }

    &:active {
      background-color: #f0f0f0;
    }
  }

  .type-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    max-height: 1000rpx;
    padding: 10rpx 0;
    margin-bottom: 20rpx;
    overflow: hidden;
    transition: all 0.3s ease;

    &.collapsed {
      max-height: 0;
      padding: 0;
      margin: 0;
    }

    .type-item {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12rpx 24rpx;
      overflow: hidden;
      font-size: 26rpx;
      color: #666;
      background-color: #f8f8f8;
      border: 2rpx solid #e0e0e0;
      border-radius: 30rpx;
      transition: all 0.3s ease;

      &::before {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        content: '';
        background: linear-gradient(45deg, rgba(7, 193, 96, 0.1), rgba(7, 193, 96, 0.05));
        border-radius: 30rpx;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:active {
        transform: scale(0.95);
      }

      &.active {
        color: #fff;
        background-color: #07c160;
        border-color: #07c160;

        &::before {
          opacity: 1;
        }

        &::after {
          margin-left: 8rpx;
          font-size: 24rpx;
          content: '✓';
        }
      }
    }
  }
}

.selected-types {
  margin-bottom: 30rpx;

  .selected-title {
    padding-left: 10rpx;
    margin-bottom: 16rpx;
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
    border-left: 4rpx solid #07c160;
  }

  .selected-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;

    .selected-item {
      display: flex;
      align-items: center;
      padding: 10rpx 20rpx;
      font-size: 26rpx;
      color: #fff;
      background-color: #07c160;
      border-radius: 30rpx;

      .type-text {
        margin-right: 10rpx;
      }

      .remove-btn {
        width: 36rpx;
        height: 36rpx;
        font-size: 24rpx;
        line-height: 34rpx;
        text-align: center;
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
      }
    }
  }
}

.custom-type-input {
  display: flex;
  gap: 20rpx;

  .input {
    flex: 1;
  }

  .add-btn {
    width: 120rpx;
    height: 80rpx;
    padding: 0;
    font-size: 28rpx;
    line-height: 80rpx;
    color: #fff;
    text-align: center;
    background-color: #07c160;
    border-radius: 8rpx;
  }
}

.skill-price-item {
  padding: 20rpx;
  margin-bottom: 30rpx;
  background-color: #f8f8f8;
  border-radius: 8rpx;

  .skill-name {
    display: block;
    margin-bottom: 16rpx;
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
  }

  .billing-type-selector {
    margin-bottom: 16rpx;

    .label-small {
      margin-right: 10rpx;
      font-size: 28rpx;
      font-weight: 500;
      color: #333;
    }

    .billing-options {
      display: flex;
      gap: 20rpx;

      .billing-option {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12rpx 24rpx;
        overflow: hidden;
        font-size: 26rpx;
        color: #666;
        background-color: #f8f8f8;
        border: 2rpx solid #e0e0e0;
        border-radius: 30rpx;
        transition: all 0.3s ease;

        &::before {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          content: '';
          background: linear-gradient(45deg, rgba(7, 193, 96, 0.1), rgba(7, 193, 96, 0.05));
          border-radius: 30rpx;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        &:active {
          transform: scale(0.95);
        }

        &.active {
          color: #fff;
          background-color: #07c160;
          border-color: #07c160;

          &::before {
            opacity: 1;
          }

          &::after {
            margin-left: 8rpx;
            font-size: 24rpx;
            content: '✓';
          }
        }
      }
    }
  }

  .price-input-wrapper {
    display: flex;
    align-items: center;

    .price-input {
      flex: 1;
      height: 80rpx;
      padding: 0 20rpx;
      font-size: 28rpx;
      background-color: #fff;
      border-radius: 8rpx;
    }

    .unit {
      margin-left: 20rpx;
      font-size: 28rpx;
      color: #999;
    }
  }

  .negotiable-tip {
    margin-top: 16rpx;
    font-size: 26rpx;
    color: #999;
  }
}

// 价格表格样式
.price-table {
  width: 100%;
  margin-bottom: 20rpx;
  overflow: hidden;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);

  .price-table-header {
    display: flex;
    padding: 20rpx;
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
    background-color: #f0f8f1;
    border-bottom: 2rpx solid #e6e6e6;
  }

  .price-table-row {
    display: flex;
    align-items: center;
    padding: 20rpx;
    background-color: #fff;
    border-bottom: 2rpx solid #f5f5f5;

    &:nth-child(even) {
      background-color: #fafafa;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  .col-skill {
    flex: 3;
    padding-right: 10rpx;
    overflow: hidden;
    font-weight: 500;
    color: #333;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .col-billing {
    flex: 3;
    padding: 0 10rpx;

    .picker-view {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14rpx 20rpx;
      color: #333;
      background-color: #f8f8f8;
      border-radius: 8rpx;

      .arrow-down {
        margin-left: 10rpx;
        font-size: 20rpx;
        color: #999;
      }
    }
  }

  .col-price {
    display: flex;
    flex: 3;
    align-items: center;
    padding-left: 10rpx;

    .price-input {
      flex: 1;
      height: 70rpx;
      padding: 0 20rpx;
      font-size: 28rpx;
      background-color: #f8f8f8;
      border-radius: 8rpx;
    }

    .unit-text {
      margin-left: 10rpx;
      font-size: 26rpx;
      color: #999;
      white-space: nowrap;
    }

    .negotiable-text {
      width: 100%;
      padding: 14rpx 20rpx;
      font-size: 28rpx;
      color: #999;
      text-align: center;
      background-color: #f8f8f8;
      border-radius: 8rpx;
    }
  }
}

.pricing-tips {
  padding: 16rpx;
  margin-top: 20rpx;
  background-color: #f8f8f8;
  border-left: 4rpx solid #07c160;
  border-radius: 8rpx;

  .tip-text {
    font-size: 24rpx;
    color: #666;
  }
}

.education-ranges {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-top: 20rpx;
}

.range-item {
  padding: 16rpx 32rpx;
  font-size: 28rpx;
  color: #666;
  background-color: #f8f8f8;
  border: 2rpx solid #e0e0e0;
  border-radius: 30rpx;
  transition: all 0.3s ease;

  &.active {
    color: #fff;
    background-color: #07c160;
    border-color: #07c160;
  }
}

.education-ranges-container {
  width: 100%;
  padding-top: 20rpx;
  margin-top: 20rpx;
  border-top: 1px dashed #e0e0e0;
}

.range-label {
  display: block;
  margin-bottom: 16rpx;
}
</style>
