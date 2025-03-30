<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '专业人员注册' },
}
</route>

<template>
  <PageLayout
    title="专业人员注册 (2/4)"
    subtitle="完善您的服务信息，让客户更了解您"
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
        <textarea
          v-model="formData.experience"
          placeholder="请描述您的从业经验、专业特长和优势"
          class="textarea"
          :maxlength="500"
        />
      </view>

      <!-- 专业描述 -->
      <view class="form-item">
        <text class="label">
          专业特长
          <text class="required">*</text>
        </text>
        <textarea
          v-model="formData.serviceDescription"
          placeholder="请详细描述您的服务内容和特点，让客户更了解您"
          class="textarea"
          :maxlength="500"
        />
      </view>

      <!-- 技能标签 -->
      <view class="form-item">
        <text class="label">
          技能标签
          <text class="required">*</text>
          <text class="hint">(选择1-5个标签，让客户更了解您的特点)</text>
        </text>
        <view
          class="tag-category"
          v-for="(category, index) in filteredSkillTagCategories"
          :key="index"
        >
          <view class="category-title">{{ category.name }}</view>
          <view class="tags-container">
            <view
              v-for="(tag, tagIndex) in category.tags"
              :key="tagIndex"
              :class="['tag', formData.skillTags.includes(tag) ? 'active' : '']"
              @tap="toggleSkillTag(tag)"
            >
              {{ tag }}
            </view>
          </view>
        </view>
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
          <text class="hint">(选择您可服务的区域)</text>
        </text>
        <view class="area-selector">
          <picker
            mode="selector"
            :range="customAreaData.map((city) => city.name)"
            @change="
              (e) =>
                handleAreaChange({
                  detail: {
                    value: {
                      city: customAreaData[e.detail.value].name,
                      district: '',
                      street: '',
                    },
                  },
                })
            "
          >
            <view class="picker-view">
              <text>{{ formData.selectedCity || '请选择城市' }}</text>
              <text class="arrow-down">▼</text>
            </view>
          </picker>
          <picker
            v-if="formData.selectedCity"
            mode="selector"
            :range="selectedCityDistricts.map((district) => district.name)"
            @change="
              (e) =>
                handleAreaChange({
                  detail: {
                    value: {
                      city: formData.selectedCity,
                      district: selectedCityDistricts[e.detail.value].name,
                      street: '',
                    },
                  },
                })
            "
          >
            <view class="picker-view">
              <text>{{ formData.selectedDistrict || '请选择区域' }}</text>
              <text class="arrow-down">▼</text>
            </view>
          </picker>
          <picker
            v-if="formData.selectedDistrict"
            mode="selector"
            :range="['全区', ...selectedDistrictStreets]"
            @change="
              (e) =>
                handleAreaChange({
                  detail: {
                    value: {
                      city: formData.selectedCity,
                      district: formData.selectedDistrict,
                      street:
                        e.detail.value === 0 ? '' : selectedDistrictStreets[e.detail.value - 1],
                    },
                  },
                })
            "
          >
            <view class="picker-view">
              <text>{{ formData.selectedStreet || '全区' }}</text>
              <text class="arrow-down">▼</text>
            </view>
          </picker>
        </view>
      </view>
    </view>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRegisterStore } from '@/store/registerStore'
import FileUploader from '@/components/FileUploader/FileUploader.vue'
import PageLayout from '@/components/PageLayout/PageLayout.vue'

interface Step {
  number: number
  status: '' | 'active' | 'completed'
}

interface FormData {
  skillTags: string[]
  serviceArea: string
  serviceDescription: string
  experience: string
  description: string
  selectedCity: string
  selectedDistrict: string
  selectedStreet: string
}

const registerStore = useRegisterStore()

// 步骤配置
const steps = ref<Step[]>([
  { number: 1, status: 'completed' },
  { number: 2, status: 'active' },
  { number: 3, status: '' },
  { number: 4, status: '' },
])

const formData = reactive<FormData>({
  skillTags: [],
  serviceArea: '',
  serviceDescription: '',
  experience: '',
  description: '',
  selectedCity: '',
  selectedDistrict: '',
  selectedStreet: '',
})

// 添加缺失的变量定义
const formSubmitted = ref(false)
const availableTags = ref<Array<{ category: string; tags: string[] }>>([])

// 地区选择器的值
const areaValue = ref<string[]>([])

// 技能标签分类
const skillTagCategories = [
  {
    name: '教学特色',
    tags: [
      '重点提高',
      '查漏补缺',
      '考前辅导',
      '学习规划',
      '思维训练',
      '难题突破',
      '兴趣培养',
      '一对一辅导',
      '小班教学',
      '在线辅导',
    ],
  },
  {
    name: '教师特点',
    tags: [
      '耐心细致',
      '经验丰富',
      '因材施教',
      '善于沟通',
      '认真负责',
      '专业认证',
      '教学经验丰富',
      '解题思路清晰',
    ],
  },
  {
    name: '维修技能',
    tags: [
      '故障排查',
      '上门维修',
      '快速响应',
      '技术精湛',
      '设备安装',
      '保养维护',
      '24小时服务',
      '价格透明',
    ],
  },
  {
    name: '服务特点',
    tags: [
      '专业可靠',
      '准时守约',
      '服务周到',
      '保修服务',
      '经验丰富',
      '工具齐全',
      '售后保障',
      '安全规范',
    ],
  },
]

// 根据专业类型过滤技能标签
const filteredSkillTagCategories = computed(() => {
  // 获取第一步的专业类型数据
  const step1Data = registerStore.step1Data
  if (!step1Data || !step1Data.professionalTypes) {
    return []
  }

  // 根据专业类型过滤标签
  return skillTagCategories
    .map((category) => ({
      name: category.name,
      tags: category.tags.filter((tag) => {
        // 根据专业类型过滤标签
        const professionalTypes = step1Data.professionalTypes
        const educationRanges = step1Data.educationRanges || []

        // 辅导类标签
        if (
          professionalTypes.includes('语文辅导') ||
          professionalTypes.includes('数学辅导') ||
          professionalTypes.includes('英语辅导') ||
          professionalTypes.includes('物理辅导')
        ) {
          // 根据辅导范围过滤标签
          if (educationRanges.includes('小学')) {
            return (
              tag.includes('耐心') ||
              tag.includes('认真') ||
              tag.includes('兴趣') ||
              tag.includes('基础') ||
              tag.includes('培养')
            )
          } else if (educationRanges.includes('初中')) {
            return (
              tag.includes('耐心') ||
              tag.includes('认真') ||
              tag.includes('基础') ||
              tag.includes('提高') ||
              tag.includes('巩固')
            )
          } else if (educationRanges.includes('高中')) {
            return (
              tag.includes('经验') ||
              tag.includes('专业') ||
              tag.includes('提高') ||
              tag.includes('冲刺') ||
              tag.includes('突破')
            )
          }

          // 根据辅导科目过滤
          if (professionalTypes.includes('语文辅导')) {
            return (
              tag.includes('写作') ||
              tag.includes('阅读') ||
              tag.includes('表达') ||
              tag.includes('作文') ||
              tag.includes('文言文')
            )
          } else if (professionalTypes.includes('数学辅导')) {
            return (
              tag.includes('思维') ||
              tag.includes('解题') ||
              tag.includes('逻辑') ||
              tag.includes('计算') ||
              tag.includes('公式')
            )
          } else if (professionalTypes.includes('英语辅导')) {
            return (
              tag.includes('口语') ||
              tag.includes('听力') ||
              tag.includes('语法') ||
              tag.includes('阅读') ||
              tag.includes('写作')
            )
          } else if (professionalTypes.includes('物理辅导')) {
            return (
              tag.includes('实验') ||
              tag.includes('原理') ||
              tag.includes('应用') ||
              tag.includes('公式') ||
              tag.includes('计算')
            )
          }

          // 默认辅导类标签
          return (
            tag.includes('耐心') ||
            tag.includes('认真') ||
            tag.includes('沟通') ||
            tag.includes('经验')
          )
        } else if (
          professionalTypes.includes('水管') ||
          professionalTypes.includes('电路') ||
          professionalTypes.includes('空调') ||
          professionalTypes.includes('保洁')
        ) {
          // 维修服务类标签
          return (
            tag.includes('技术') ||
            tag.includes('专业') ||
            tag.includes('经验') ||
            tag.includes('服务') ||
            tag.includes('维修') ||
            tag.includes('安装') ||
            tag.includes('保养') ||
            tag.includes('及时') ||
            tag.includes('响应')
          )
        }

        // 默认显示所有标签
        return true
      }),
    }))
    .filter((category) => category.tags.length > 0)
})

// 在 script setup 部分添加以下代码
const customAreaData = [
  {
    name: '广州市',
    districts: [
      {
        name: '天河区',
        streets: [
          '天河街道',
          '冼村街道',
          '猎德街道',
          '员村街道',
          '石牌街道',
          '天河南街道',
          '林和街道',
          '沙河街道',
          '五山街道',
          '棠下街道',
        ],
      },
      {
        name: '海珠区',
        streets: [
          '江南街道',
          '海幢街道',
          '南华街道',
          '龙凤街道',
          '沙园街道',
          '瑞宝街道',
          '昌岗街道',
          '素社街道',
          '滨江街道',
          '江南中街道',
        ],
      },
      {
        name: '越秀区',
        streets: [
          '北京街道',
          '人民街道',
          '光塔街道',
          '六榕街道',
          '流花街道',
          '东风街道',
          '洪桥街道',
          '广卫街道',
          '大东街道',
          '农林街道',
        ],
      },
    ],
  },
  {
    name: '深圳市',
    districts: [
      {
        name: '福田区',
        streets: [
          '福田街道',
          '华强北街道',
          '南园街道',
          '沙头街道',
          '梅林街道',
          '莲花街道',
          '香蜜湖街道',
          '福保街道',
          '华富街道',
          '园岭街道',
        ],
      },
      {
        name: '南山区',
        streets: [
          '南头街道',
          '南山街道',
          '沙河街道',
          '蛇口街道',
          '招商街道',
          '粤海街道',
          '桃源街道',
          '西丽街道',
          '前海街道',
          '后海街道',
        ],
      },
      {
        name: '罗湖区',
        streets: [
          '桂园街道',
          '黄贝街道',
          '东门街道',
          '翠竹街道',
          '南湖街道',
          '笋岗街道',
          '东湖街道',
          '莲塘街道',
          '东晓街道',
          '清水河街道',
        ],
      },
    ],
  },
  {
    name: '佛山市',
    districts: [
      {
        name: '禅城区',
        streets: ['祖庙街道', '石湾街道', '张槎街道', '南庄街道', '石湾镇街道'],
      },
      {
        name: '南海区',
        streets: ['桂城街道', '大沥街道', '里水街道', '狮山街道', '丹灶街道'],
      },
      {
        name: '顺德区',
        streets: ['大良街道', '容桂街道', '伦教街道', '勒流街道', '陈村街道'],
      },
    ],
  },
]

// 添加计算属性
const selectedCityDistricts = computed(() => {
  return customAreaData.find((city) => city.name === formData.selectedCity)?.districts || []
})

const selectedDistrictStreets = computed(() => {
  return (
    selectedCityDistricts.value.find((district) => district.name === formData.selectedDistrict)
      ?.streets || []
  )
})

// 修改地区选择处理函数
const handleAreaChange = (e: any) => {
  const { city, district, street } = e.detail.value
  formData.selectedCity = city
  formData.selectedDistrict = district
  formData.selectedStreet = street || ''
  // 如果有选择街道，则显示街道，否则显示全区
  formData.serviceArea = street ? `${city} ${district} ${street}` : `${city} ${district}`
}

// 切换标签选择状态
const toggleSkillTag = (tag: string) => {
  const index = formData.skillTags.indexOf(tag)
  if (index === -1) {
    if (formData.skillTags.length >= 5) {
      uni.showToast({
        title: '最多选择5个标签',
        icon: 'none',
      })
      return
    }
    formData.skillTags.push(tag)
  } else {
    formData.skillTags.splice(index, 1)
  }
}

// 从全局状态加载数据
const loadFromStore = () => {
  try {
    const storeData = registerStore.step2Data
    if (storeData) {
      formData.skillTags = storeData.skillTags || []
      formData.serviceArea = storeData.serviceArea || ''
      formData.serviceDescription = storeData.serviceDescription || ''
      formData.experience = storeData.experience || ''
      formData.description = storeData.description || ''
      formData.selectedCity = storeData.selectedCity || ''
      formData.selectedDistrict = storeData.selectedDistrict || ''
      formData.selectedStreet = storeData.selectedStreet || ''
    }
  } catch (error) {
    console.error('加载第二步数据失败:', error)
  }
}

// 处理下一步
const handleNext = () => {
  formSubmitted.value = true
  if (validateForm()) {
    // 保存表单数据到全局状态
    registerStore.updateStep2({
      skillTags: formData.skillTags,
      serviceArea: formData.serviceArea,
      serviceDescription: formData.serviceDescription,
      experience: formData.experience,
      description: formData.description,
      selectedCity: formData.selectedCity,
      selectedDistrict: formData.selectedDistrict,
      selectedStreet: formData.selectedStreet,
    })
    // 同时保存到本地存储（作为备份）
    registerStore.saveToStorage()
    // 触发next事件
    emit('next', 2)
  }
}

// 处理返回
const handleBack = () => {
  // 保存当前数据到全局状态
  registerStore.updateStep2({
    skillTags: formData.skillTags,
    serviceArea: formData.serviceArea,
    serviceDescription: formData.serviceDescription,
    experience: formData.experience,
    description: formData.description,
    selectedCity: formData.selectedCity,
    selectedDistrict: formData.selectedDistrict,
    selectedStreet: formData.selectedStreet,
  })
  // 同时保存到本地存储（作为备份）
  registerStore.saveToStorage()
  // 触发back事件
  emit('back', 2)
}

// 定义emit
const emit = defineEmits(['next', 'back'])

// 页面加载时获取专业类型并设置对应的技能标签
onMounted(() => {
  console.log('Register page 2 mounted')

  // 从全局状态加载数据
  loadFromStore()

  // 检查是否有第一步数据
  const step1Data = registerStore.step1Data
  console.log('Step 1 data:', step1Data)

  // 如果没有第一步数据，返回上一页
  if (!step1Data || !step1Data.professionalTypes || step1Data.professionalTypes.length === 0) {
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

  console.log('Setting available tags for type:', step1Data.professionalTypes)

  // 根据专业类型设置不同的标签
  if (step1Data && step1Data.professionalTypes) {
    if (
      step1Data.professionalTypes.includes('语文辅导') ||
      step1Data.professionalTypes.includes('数学辅导') ||
      step1Data.professionalTypes.includes('英语辅导') ||
      step1Data.professionalTypes.includes('物理辅导')
    ) {
      // 设置辅导类标签
      const educationRanges = step1Data.educationRanges || []
      const professionalTypes = step1Data.professionalTypes || []

      // 根据辅导类型和范围设置标签
      if (professionalTypes.includes('语文辅导')) {
        availableTags.value = [
          {
            category: '语文教学',
            tags: ['写作指导', '阅读理解', '文学鉴赏', '语法讲解', '作文批改', '文言文解析'],
          },
          {
            category: '教学特色',
            tags: ['趣味教学', '系统讲解', '重点突破', '查漏补缺', '考试技巧', '应试指导'],
          },
        ]
      } else if (professionalTypes.includes('数学辅导')) {
        availableTags.value = [
          {
            category: '数学教学',
            tags: ['思维训练', '解题技巧', '公式推导', '几何证明', '应用题解析', '计算方法'],
          },
          {
            category: '教学特色',
            tags: ['逻辑思维', '系统讲解', '重点突破', '查漏补缺', '考试技巧', '应试指导'],
          },
        ]
      } else if (professionalTypes.includes('英语辅导')) {
        availableTags.value = [
          {
            category: '英语教学',
            tags: ['口语训练', '听力练习', '阅读理解', '语法讲解', '写作指导', '词汇积累'],
          },
          {
            category: '教学特色',
            tags: ['趣味教学', '系统讲解', '重点突破', '查漏补缺', '考试技巧', '应试指导'],
          },
        ]
      } else if (professionalTypes.includes('物理辅导')) {
        availableTags.value = [
          {
            category: '物理教学',
            tags: ['概念讲解', '公式推导', '实验分析', '题型解析', '应用题解答', '图形分析'],
          },
          {
            category: '教学特色',
            tags: ['实验演示', '系统讲解', '重点突破', '查漏补缺', '考试技巧', '应试指导'],
          },
        ]
      }

      // 根据教育阶段添加标签
      if (educationRanges.includes('小学')) {
        availableTags.value.push({
          category: '小学教育特点',
          tags: ['兴趣培养', '基础打牢', '趣味教学', '习惯养成', '亲切耐心', '方法指导'],
        })
      }

      if (educationRanges.includes('初中')) {
        availableTags.value.push({
          category: '初中教育特点',
          tags: ['基础巩固', '重点突破', '考点梳理', '错题分析', '综合能力', '应试技巧'],
        })
      }

      if (educationRanges.includes('高中')) {
        availableTags.value.push({
          category: '高中教育特点',
          tags: ['系统复习', '难点攻克', '解题技巧', '高考指导', '知识拓展', '综合提升'],
        })
      }
    } else if (
      step1Data.professionalTypes.includes('水管') ||
      step1Data.professionalTypes.includes('电路') ||
      step1Data.professionalTypes.includes('空调') ||
      step1Data.professionalTypes.includes('保洁')
    ) {
      // 设置维修服务标签
      const professionalTypes = step1Data.professionalTypes || []

      if (professionalTypes.includes('水管')) {
        availableTags.value = [
          {
            category: '水管维修技能',
            tags: ['水管安装', '水管更换', '漏水维修', '阀门更换', '水管疏通', '下水道疏通'],
          },
          {
            category: '服务特点',
            tags: ['专业可靠', '价格透明', '准时守约', '保修服务', '工具齐全', '清洁施工'],
          },
        ]
      } else if (professionalTypes.includes('电路')) {
        availableTags.value = [
          {
            category: '电路维修技能',
            tags: ['电路检测', '线路维修', '开关安装', '插座安装', '照明安装', '电路改造'],
          },
          {
            category: '服务特点',
            tags: ['安全规范', '专业技术', '经验丰富', '保修服务', '快速响应', '设备齐全'],
          },
        ]
      } else if (professionalTypes.includes('空调')) {
        availableTags.value = [
          {
            category: '空调维修技能',
            tags: ['空调安装', '空调清洗', '故障排查', '加氟服务', '空调维修', '空调保养'],
          },
          {
            category: '服务特点',
            tags: ['专业认证', '经验丰富', '上门服务', '保修服务', '24小时服务', '快速响应'],
          },
        ]
      } else if (professionalTypes.includes('保洁')) {
        availableTags.value = [
          {
            category: '保洁技能',
            tags: ['日常保洁', '深度清洁', '开荒保洁', '家居清洁', '办公清洁', '玻璃清洁'],
          },
          {
            category: '服务特点',
            tags: ['认真负责', '经验丰富', '自带工具', '服务专业', '价格合理', '保质保量'],
          },
        ]
      }
    } else {
      // 其他类型的标签
      availableTags.value = [
        {
          category: '其他服务特点',
          tags: ['专业可靠', '经验丰富', '认真负责', '耐心细致', '服务周到', '价格合理'],
        },
      ]
    }
  }
})

// 表单验证
const validateForm = () => {
  if (!formData.skillTags || formData.skillTags.length < 1) {
    uni.showToast({
      title: '请至少选择1个技能标签',
      icon: 'none',
    })
    return false
  }

  if (!formData.serviceArea) {
    uni.showToast({
      title: '请选择服务区域',
      icon: 'none',
    })
    return false
  }

  if (!formData.serviceDescription) {
    uni.showToast({
      title: '请填写服务描述',
      icon: 'none',
    })
    return false
  }

  return true
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

.area-selector {
  display: flex;
  gap: 10rpx;

  .picker-view {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    height: 80rpx;
    padding: 0 16rpx;
    background-color: #f8f8f8;
    border-radius: 8rpx;

    text {
      font-size: 26rpx;
      color: #333;

      &.arrow-down {
        color: #999;
      }
    }
  }
}
</style>
