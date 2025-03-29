<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '专业人员注册' },
}
</route>

<template>
  <view class="register-container">
    <view class="header">
      <text class="title">专业人员注册</text>
      <text class="subtitle">请填写专业信息，带 * 为必填项</text>
    </view>

    <view class="form">
      <!-- 专业资质 -->
      <view class="form-item">
        <text class="label">
          专业资质
          <text class="required">*</text>
        </text>
        <view class="upload-group">
          <view class="upload-item" @tap="chooseQualification">
            <image
              v-if="formData.qualification"
              :src="formData.qualification"
              mode="aspectFill"
              class="upload-image"
            />
            <view v-else class="upload-placeholder">
              <text class="iconfont icon-camera"></text>
              <text class="upload-text">上传资质证书</text>
            </view>
          </view>
        </view>
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

      <!-- 服务区域 -->
      <view class="form-item">
        <text class="label">
          服务区域
          <text class="required">*</text>
        </text>
        <picker mode="region" @change="handleRegionChange" class="picker">
          <view class="picker-text">
            {{ formData.region.join(' ') || '请选择服务区域' }}
          </view>
        </picker>
      </view>

      <!-- 服务时间 -->
      <view class="form-item">
        <text class="label">
          服务时间
          <text class="required">*</text>
        </text>
        <view class="time-picker">
          <picker mode="time" @change="handleStartTimeChange" class="time-picker-item">
            <view class="picker-text">
              {{ formData.startTime || '开始时间' }}
            </view>
          </picker>
          <text class="time-separator">至</text>
          <picker mode="time" @change="handleEndTimeChange" class="time-picker-item">
            <view class="picker-text">
              {{ formData.endTime || '结束时间' }}
            </view>
          </picker>
        </view>
      </view>

      <!-- 服务价格 -->
      <view class="form-item">
        <text class="label">
          服务价格
          <text class="required">*</text>
        </text>
        <view class="price-input">
          <input
            v-model="formData.price"
            type="number"
            placeholder="请输入服务价格"
            class="input"
          />
          <text class="unit">元/小时</text>
        </view>
      </view>

      <!-- 专业描述 -->
      <view class="form-item">
        <text class="label">
          专业描述
          <text class="required">*</text>
        </text>
        <textarea
          v-model="formData.description"
          placeholder="请描述您的专业特长和服务范围"
          class="textarea"
        />
      </view>

      <!-- 技能标签 -->
      <view class="form-item">
        <text class="label">技能标签</text>
        <view class="tags-container">
          <view
            v-for="(tag, index) in availableTags"
            :key="index"
            :class="['tag', formData.tags.includes(tag) ? 'active' : '']"
            @tap="toggleTag(tag)"
          >
            {{ tag }}
          </view>
        </view>
      </view>
    </view>

    <!-- 下一步按钮 -->
    <view class="footer">
      <button class="next-btn" @tap="handleNext">下一步</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

const formData = reactive({
  qualification: '',
  experience: '',
  region: [] as string[],
  startTime: '',
  endTime: '',
  price: '',
  description: '',
  tags: [] as string[],
})

// 根据专业类型显示不同的技能标签
const availableTags = ref<string[]>([])

// 选择资质证书
const chooseQualification = async () => {
  try {
    const res = await uni.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
    })
    formData.qualification = res.tempFilePaths[0]
  } catch (error) {
    console.error('选择图片失败:', error)
  }
}

// 处理地区选择
const handleRegionChange = (e: any) => {
  formData.region = e.detail.value
}

// 处理开始时间选择
const handleStartTimeChange = (e: any) => {
  formData.startTime = e.detail.value
}

// 处理结束时间选择
const handleEndTimeChange = (e: any) => {
  formData.endTime = e.detail.value
}

// 切换标签选择状态
const toggleTag = (tag: string) => {
  const index = formData.tags.indexOf(tag)
  if (index === -1) {
    formData.tags.push(tag)
  } else {
    formData.tags.splice(index, 1)
  }
}

// 表单验证
const validateForm = () => {
  if (!formData.qualification) {
    uni.showToast({
      title: '请上传专业资质证书',
      icon: 'none',
    })
    return false
  }
  if (!formData.experience) {
    uni.showToast({
      title: '请输入工作经验',
      icon: 'none',
    })
    return false
  }
  if (formData.region.length === 0) {
    uni.showToast({
      title: '请选择服务区域',
      icon: 'none',
    })
    return false
  }
  if (!formData.startTime || !formData.endTime) {
    uni.showToast({
      title: '请选择服务时间',
      icon: 'none',
    })
    return false
  }
  if (!formData.price) {
    uni.showToast({
      title: '请输入服务价格',
      icon: 'none',
    })
    return false
  }
  if (!formData.description) {
    uni.showToast({
      title: '请填写专业描述',
      icon: 'none',
    })
    return false
  }
  return true
}

// 处理下一步
const handleNext = () => {
  if (validateForm()) {
    // 保存表单数据到本地存储
    uni.setStorageSync('professionalRegisterStep2', formData)
    // 跳转到下一步
    uni.navigateTo({
      url: '/pages/weshares/teacher-registration/register-page3',
    })
  }
}

// 页面加载时获取专业类型并设置对应的技能标签
onMounted(() => {
  const step1Data = uni.getStorageSync('professionalRegisterStep1')
  if (step1Data && step1Data.professionalType) {
    // 根据专业类型设置不同的技能标签
    switch (step1Data.professionalType) {
      case '教师':
        availableTags.value = [
          '小学教育',
          '初中教育',
          '高中教育',
          '大学教育',
          '在线教育',
          '一对一辅导',
          '小班教学',
          '大班教学',
        ]
        break
      case '水电维修工':
        availableTags.value = [
          '水管维修',
          '电路维修',
          '下水道疏通',
          '水龙头安装',
          '电路安装',
          '漏水检测',
          '电路检测',
        ]
        break
      case '木工':
        availableTags.value = [
          '家具制作',
          '门窗安装',
          '地板安装',
          '橱柜安装',
          '木制品维修',
          '木工雕刻',
        ]
        break
      case '油漆工':
        availableTags.value = ['墙面油漆', '家具油漆', '外墙油漆', '防水处理', '墙面翻新', '艺术漆']
        break
      case '泥瓦工':
        availableTags.value = [
          '墙面抹灰',
          '瓷砖铺贴',
          '地砖铺贴',
          '防水施工',
          '墙面翻新',
          '地面找平',
        ]
        break
      case '空调维修工':
        availableTags.value = [
          '空调安装',
          '空调维修',
          '空调清洗',
          '空调加氟',
          '空调移机',
          '故障检测',
        ]
        break
      case '管道工':
        availableTags.value = [
          '水管安装',
          '下水道疏通',
          '管道维修',
          '管道清洗',
          '管道检测',
          '管道改造',
        ]
        break
      case '电工':
        availableTags.value = [
          '电路安装',
          '电路维修',
          '电路检测',
          '照明安装',
          '电器维修',
          '电路改造',
        ]
        break
      default:
        availableTags.value = [
          '专业技能',
          '专业认证',
          '经验丰富',
          '服务周到',
          '价格合理',
          '及时响应',
        ]
    }
  }
})
</script>

<style lang="scss" scoped>
.register-container {
  min-height: 100vh;
  padding: 20rpx;
  padding-bottom: 120rpx;
  background-color: #f5f5f5;
}

.header {
  padding: 30rpx 0;
  text-align: center;

  .title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }

  .subtitle {
    margin-top: 10rpx;
    font-size: 24rpx;
    color: #999;
  }
}

.form {
  padding: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;

  .form-item {
    margin-bottom: 30rpx;

    .label {
      display: block;
      margin-bottom: 16rpx;
      font-size: 28rpx;
      color: #333;

      .required {
        margin-left: 4rpx;
        color: #ff4d4f;
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

    .time-picker {
      display: flex;
      gap: 20rpx;
      align-items: center;

      .time-picker-item {
        display: flex;
        flex: 1;
        align-items: center;
        height: 80rpx;
        padding: 0 20rpx;
        background-color: #f8f8f8;
        border-radius: 8rpx;

        .picker-text {
          font-size: 28rpx;
          color: #333;
        }
      }

      .time-separator {
        font-size: 28rpx;
        color: #999;
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

    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 20rpx;

      .tag {
        padding: 10rpx 30rpx;
        font-size: 24rpx;
        color: #666;
        background-color: #f8f8f8;
        border-radius: 30rpx;

        &.active {
          color: #fff;
          background-color: #007aff;
        }
      }
    }
  }
}

.upload-group {
  .upload-item {
    width: 100%;
    height: 300rpx;
    overflow: hidden;
    background-color: #f8f8f8;
    border-radius: 8rpx;

    .upload-image {
      width: 100%;
      height: 100%;
    }

    .upload-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;

      .iconfont {
        margin-bottom: 10rpx;
        font-size: 48rpx;
        color: #999;
      }

      .upload-text {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

.footer {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 20rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

  .next-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80rpx;
    font-size: 32rpx;
    color: #fff;
    background-color: #007aff;
    border-radius: 40rpx;
  }
}
</style>
