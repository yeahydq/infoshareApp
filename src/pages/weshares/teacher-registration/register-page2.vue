<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '专业人员注册' },
}
</route>

<template>
  <PageLayout
    title="专业人员注册 (2/4)"
    subtitle="您的专业能力和服务信息"
    :steps="steps"
    :showBack="true"
    @next="handleNext"
    @back="handleBack"
  >
    <view class="form">
      <!-- 专业信息分区 -->
      <view class="form-section">
        <view class="section-title">专业能力与经验</view>
      </view>

      <!-- 工作经验 -->
      <view class="form-item">
        <text class="label">
          工作经验
          <text class="required">*</text>
        </text>
        <input
          v-model="formData.experience"
          type="number"
          placeholder="请输入工作年限"
          class="input"
        />
        <text class="unit">年</text>
      </view>

      <!-- 专业描述 -->
      <view class="form-item">
        <text class="label">
          专业特长
          <text class="required">*</text>
        </text>
        <textarea
          v-model="formData.serviceDescription"
          placeholder="请详细描述您的专业特长、取得的成就和擅长领域"
          class="textarea"
        />
      </view>

      <!-- 技能标签 -->
      <view class="form-item">
        <text class="label">
          技能标签
          <text class="required">*</text>
          <text class="hint">(请选择3-5个最能体现您专业能力的标签)</text>
        </text>

        <view class="tags-container">
          <view
            v-for="(category, categoryIndex) in availableTags"
            :key="categoryIndex"
            class="category"
          >
            <view class="category-title">{{ category.category }}</view>
            <view class="tags-list">
              <view
                v-for="(tag, tagIndex) in category.tags"
                :key="`${categoryIndex}-${tagIndex}`"
                :class="['tag', formData.skillTags.includes(tag) ? 'active' : '']"
                @tap="toggleTag(tag)"
              >
                {{ tag }}
              </view>
            </view>
          </view>
        </view>

        <view class="selected-count">已选择 {{ formData.skillTags.length }} 个标签</view>
      </view>

      <!-- 服务信息分区 -->
      <view class="form-section">
        <view class="section-title">服务信息</view>
      </view>

      <!-- 服务区域 -->
      <view class="form-item">
        <text class="label">
          服务区域
          <text class="required">*</text>
        </text>
        <picker mode="region" @change="handleRegionChange" class="picker">
          <view class="picker-text">
            {{ formData.serviceArea || '请选择服务区域' }}
          </view>
        </picker>
      </view>

      <!-- 服务价格 -->
      <view class="form-item">
        <text class="label">
          服务价格
          <text class="required">*</text>
        </text>
        <view class="price-input">
          <input
            v-model="formData.servicePrice"
            type="number"
            placeholder="请输入服务价格"
            class="input"
          />
          <text class="unit">元/小时</text>
        </view>
      </view>
    </view>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import FileUploader from '@/components/FileUploader/FileUploader.vue'
import PageLayout from '@/components/PageLayout/PageLayout.vue'

interface Step {
  number: number
  status: '' | 'completed' | 'active'
}

const steps = ref<Step[]>([
  { number: 1, status: 'completed' },
  { number: 2, status: 'active' },
  { number: 3, status: '' },
  { number: 4, status: '' },
])

interface FormData {
  skillTags: string[]
  serviceArea: string
  servicePrice: string
  serviceDescription: string
  experience: string
  description: string
  qualification?: string
}

// 表单数据
const formData = ref<FormData>({
  skillTags: [],
  serviceArea: '',
  servicePrice: '',
  serviceDescription: '',
  experience: '',
  description: '',
})

// 表单是否已提交（用于显示验证错误）
const formSubmitted = ref(false)

// 根据专业类型显示不同的技能标签
const availableTags = ref<{ category: string; tags: string[] }[]>([])

// 选择资质证书
const chooseQualification = async () => {
  try {
    const res = await uni.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
    })
    formData.value.qualification = res.tempFilePaths[0]
  } catch (error) {
    console.error('选择图片失败:', error)
  }
}

// 处理地区选择
const handleRegionChange = (e: any) => {
  formData.value.serviceArea = e.detail.value
}

// 技能标签数据
// const skillTags = [
//   {
//     title: '专业技能',
//     tags: ['专业技能1', '专业技能2', '专业技能3'],
//   },
//   {
//     title: '服务类型',
//     tags: ['服务类型1', '服务类型2', '服务类型3'],
//   },
// ]

// 切换标签选择状态
const toggleTag = (tag: string) => {
  const index = formData.value.skillTags.indexOf(tag)
  if (index === -1) {
    if (formData.value.skillTags.length < 5) {
      formData.value.skillTags.push(tag)
    } else {
      uni.showToast({
        title: '最多选择5个标签',
        icon: 'none',
      })
    }
  } else {
    formData.value.skillTags.splice(index, 1)
  }
}

// 返回上一步
const handleBack = () => {
  // 保存当前数据到本地存储
  saveToStorage()
  // 触发back事件
  emit('back', 2)
}

// 保存表单数据到本地存储
const saveToStorage = () => {
  const data = {
    skillTags: formData.value.skillTags,
    serviceArea: formData.value.serviceArea,
    servicePrice: formData.value.servicePrice,
    serviceDescription: formData.value.serviceDescription,
    experience: formData.value.experience,
    description: formData.value.description,
  }
  uni.setStorageSync('professionalRegisterStep2', data)
}

// 表单验证
const validateForm = () => {
  if (!formData.value.skillTags || formData.value.skillTags.length < 3) {
    uni.showToast({
      title: '请选择3-5个技能标签',
      icon: 'none',
    })
    return false
  }

  if (!formData.value.serviceArea) {
    uni.showToast({
      title: '请选择服务区域',
      icon: 'none',
    })
    return false
  }

  if (!formData.value.servicePrice) {
    uni.showToast({
      title: '请输入服务价格',
      icon: 'none',
    })
    return false
  }

  if (!formData.value.serviceDescription) {
    uni.showToast({
      title: '请填写服务描述',
      icon: 'none',
    })
    return false
  }

  return true
}

// 处理下一步
const handleNext = () => {
  formSubmitted.value = true
  if (validateForm()) {
    // 保存表单数据到本地存储
    saveToStorage()
    // 触发next事件
    emit('next', 2)
  }
}

// 定义emit
const emit = defineEmits(['next', 'back'])

// 页面加载时获取专业类型并设置对应的技能标签
onMounted(() => {
  console.log('Register page 2 mounted')

  // 检查是否有缓存数据
  const cachedData = uni.getStorageSync('professionalRegisterStep2')
  if (cachedData) {
    // 如果存在缓存数据，填充表单
    Object.assign(formData.value, cachedData)
  }

  const step1Data = uni.getStorageSync('professionalRegisterStep1')
  console.log('Step 1 data:', step1Data)

  // 如果没有第一步数据，返回上一页
  if (!step1Data) {
    console.error('No step 1 data found')
    uni.showToast({
      title: '请先完成基本信息',
      icon: 'none',
    })
    setTimeout(() => {
      emit('back', 2)
    }, 1500)
    return
  }

  console.log('Setting available tags for type:', step1Data.professionalType)

  if (step1Data && step1Data.professionalType) {
    // 根据专业类型设置不同的技能标签
    switch (step1Data.professionalType) {
      case '一对一家教':
      case '小学课程辅导':
      case '中学课程辅导':
      case '高考辅导':
      case '语言辅导员':
        availableTags.value = [
          {
            category: '辅导年级',
            tags: ['幼儿', '小学低年级', '小学高年级', '初中', '高中', '大学生', '成人'],
          },
          {
            category: '辅导科目',
            tags: [
              '语文',
              '数学',
              '英语',
              '物理',
              '化学',
              '生物',
              '历史',
              '地理',
              '政治',
              '综合科学',
            ],
          },
          {
            category: '服务特色',
            tags: [
              '重点提高',
              '查漏补缺',
              '考前辅导',
              '学习规划',
              '思维训练',
              '难题突破',
              '兴趣培养',
            ],
          },
        ]
        break
      case '钢琴老师':
      case '小提琴老师':
      case '声乐教师':
      case '美术辅导':
      case '书法老师':
      case '舞蹈辅导':
        availableTags.value = [
          {
            category: '教学对象',
            tags: ['幼儿启蒙', '儿童', '青少年', '成人', '专业考级'],
          },
          {
            category: '教学内容',
            tags: ['基础入门', '技巧提升', '考级辅导', '比赛准备', '兴趣培养', '专业训练'],
          },
          {
            category: '教学风格',
            tags: ['耐心细致', '循序渐进', '趣味教学', '严格专业', '个性化辅导', '启发式教学'],
          },
        ]
        break
      case '水电工':
      case '电工':
      case '管道工':
        availableTags.value = [
          {
            category: '服务类型',
            tags: ['日常维修', '紧急维修', '定期保养', '故障检测', '设备安装', '线路改造'],
          },
          {
            category: '专业领域',
            tags: ['电路维修', '水管维修', '下水道疏通', '设备安装', '故障排查', '安全检测'],
          },
          {
            category: '服务特色',
            tags: ['快速响应', '专业可靠', '价格合理', '保修服务', '24小时服务', '经验丰富'],
          },
        ]
        break
      case '木工':
      case '泥瓦工':
      case '油漆工':
        availableTags.value = [
          {
            category: '服务类型',
            tags: ['装修施工', '家具制作', '维修翻新', '定制安装', '局部改造', '整体装修'],
          },
          {
            category: '专业领域',
            tags: ['木工制作', '墙面施工', '地面施工', '家具安装', '门窗安装', '橱柜安装'],
          },
          {
            category: '服务特色',
            tags: ['工艺精湛', '质量保证', '按时完工', '价格合理', '售后保障', '经验丰富'],
          },
        ]
        break
      case '空调维修工':
        availableTags.value = [
          {
            category: '服务类型',
            tags: ['空调安装', '空调维修', '空调清洗', '空调加氟', '空调移机', '故障检测'],
          },
          {
            category: '专业领域',
            tags: ['家用空调', '商用空调', '中央空调', '新风系统', '制冷设备', '制热设备'],
          },
          {
            category: '服务特色',
            tags: ['快速响应', '专业维修', '价格透明', '保修服务', '定期保养', '经验丰富'],
          },
        ]
        break
      case '家政服务':
      case '保姆':
      case '月嫂':
      case '育儿嫂':
        availableTags.value = [
          {
            category: '服务类型',
            tags: ['日常保洁', '育儿服务', '月嫂服务', '老人护理', '病患护理', '家庭管家'],
          },
          {
            category: '专业领域',
            tags: ['家务整理', '烹饪服务', '育儿护理', '老人照料', '病患照料', '家庭管理'],
          },
          {
            category: '服务特色',
            tags: ['经验丰富', '耐心细致', '专业可靠', '责任心强', '沟通良好', '服务周到'],
          },
        ]
        break
      default:
        availableTags.value = [
          {
            category: '专业技能',
            tags: ['专业认证', '经验丰富', '技能过硬', '服务周到', '价格合理'],
          },
          {
            category: '服务特色',
            tags: ['及时响应', '信誉保证', '售后保障', '24小时服务', '上门服务'],
          },
        ]
    }
  }
})

// 从本地存储加载数据
const loadFromStorage = () => {
  try {
    const data = uni.getStorageSync('professionalRegisterStep2')
    if (data) {
      formData.value = {
        skillTags: data.skillTags || [],
        serviceArea: data.serviceArea || '',
        servicePrice: data.servicePrice || '',
        serviceDescription: data.serviceDescription || '',
        experience: data.experience || '',
        description: data.description || '',
      }
    }
  } catch (error) {
    console.error('加载第二步数据失败:', error)
  }
}
</script>

<style lang="scss" scoped>
// 基础样式
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.category-title {
  padding-left: 10rpx;
  margin-bottom: 16rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  border-left: 4rpx solid #07c160;
}

.tag {
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

.selected-count {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #999;
}

.form {
  .form-item {
    margin-bottom: 30rpx;

    .tag-category {
      .tags-container {
        // 继承基础样式
      }

      .category-title {
        // 继承基础样式
      }

      .tags-container {
        .tag {
          // 继承基础样式
        }
      }
    }

    .selected-count {
      // 继承基础样式
    }

    .label {
      display: block;
      margin-bottom: 16rpx;
      font-size: 28rpx;
      color: #333;

      .required {
        margin-left: 4rpx;
        color: #ff4d4f;
      }

      .hint {
        margin-left: 10rpx;
        font-size: 24rpx;
        font-weight: normal;
        color: #999;
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

    .unit {
      margin-left: 10rpx;
      font-size: 28rpx;
      color: #999;
    }

    .picker {
      display: flex;
      align-items: center;
      width: 100%;
      height: 80rpx;
      padding: 0 20rpx;
      background-color: #f8f8f8;
      border-radius: 8rpx;

      .picker-text {
        font-size: 28rpx;
        color: #333;
      }
    }

    .price-input {
      display: flex;
      align-items: center;
    }

    .textarea {
      width: 100%;
      height: 200rpx;
      padding: 20rpx;
      font-size: 28rpx;
      background-color: #f8f8f8;
      border-radius: 8rpx;
    }
  }
}

.form-section {
  padding-bottom: 10rpx;
  margin: 20rpx 0;
  border-bottom: 1px solid #f0f0f0;

  .section-title {
    margin-bottom: 10rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
  }
}
</style>
