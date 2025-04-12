<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '专业人士详情' },
}
</route>

<template>
  <view class="container">
    <!-- 页面头部 -->
    <navigation-bar title="专业人士详情" :back="true" @back="goBack" />

    <!-- 加载中 -->
    <view class="loading-container" v-if="loading">
      <view class="loading-spinner"></view>
      <text>正在加载...</text>
    </view>

    <!-- 错误信息 -->
    <view class="error-container" v-else-if="error">
      <view class="error-icon">❗</view>
      <text class="error-text">{{ error }}</text>
      <view class="error-actions">
        <button class="retry-button" @tap="retryFetch">重试</button>
        <button class="back-button" @tap="goBack">返回列表</button>
      </view>
    </view>

    <!-- 专业人士详情内容 -->
    <view class="professional-detail" v-else-if="professional">
      <!-- 基本信息卡片 -->
      <view class="card basic-info">
        <view class="avatar-container">
          <image
            class="avatar"
            :src="professional.avatar || 'https://randomuser.me/api/portraits/men/85.jpg'"
            mode="aspectFill"
            @tap="previewImage(professional.avatar)"
          ></image>
        </view>
        <view class="info-container">
          <view class="name-gender">
            <text class="name">{{ professional.name || '未知姓名' }}</text>
            <text class="gender" v-if="professional.gender">
              {{ professional.gender === 1 ? '男' : '女' }}
            </text>
          </view>
          <view class="info-item">
            <text class="info-label">电话：</text>
            <text class="info-value phone" @tap="makePhoneCall">
              {{ professional.phone || '暂无' }}
            </text>
          </view>
          <view class="info-item">
            <text class="info-label">邮箱：</text>
            <text class="info-value">{{ professional.email || '暂无' }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">服务区域：</text>
            <text class="info-value">{{ serviceAreaText || '暂无' }}</text>
          </view>
          <view class="info-item status">
            <text class="info-label">状态：</text>
            <text class="info-value status-value" :class="{ active: professional.status === 1 }">
              {{ professional.status === 1 ? '可接受预约' : '暂不接受预约' }}
            </text>
          </view>
        </view>
      </view>

      <!-- 身份证信息 -->
      <view class="card">
        <view class="card-title">身份证信息</view>
        <view class="certificate-container">
          <view class="certificate-item" v-if="professional.idCardFront">
            <image
              class="certificate-image"
              :src="professional.idCardFront"
              mode="aspectFit"
              @tap="previewImage(professional.idCardFront)"
            ></image>
            <text class="certificate-label">身份证正面</text>
          </view>
          <view class="certificate-item" v-if="professional.idCardBack">
            <image
              class="certificate-image"
              :src="professional.idCardBack"
              mode="aspectFit"
              @tap="previewImage(professional.idCardBack)"
            ></image>
            <text class="certificate-label">身份证反面</text>
          </view>
          <view
            class="empty-certificate"
            v-if="!professional.idCardFront && !professional.idCardBack"
          >
            <text>暂无身份证信息</text>
          </view>
        </view>
      </view>

      <!-- 资质证书 -->
      <view class="card">
        <view class="card-title">资质证书</view>
        <view class="certificate-container">
          <view class="certificate-item" v-if="professional.qualification">
            <image
              class="certificate-image"
              :src="professional.qualification"
              mode="aspectFit"
              @tap="previewImage(professional.qualification)"
            ></image>
            <text class="certificate-label">资质证书</text>
          </view>
          <view class="empty-certificate" v-if="!professional.qualification">
            <text>暂无资质证书</text>
          </view>
        </view>
      </view>

      <!-- 教育证书 -->
      <view class="card">
        <view class="card-title">教育背景</view>
        <view class="certificate-container">
          <view class="certificate-item" v-if="professional.education">
            <image
              class="certificate-image"
              :src="professional.education"
              mode="aspectFit"
              @tap="previewImage(professional.education)"
            ></image>
            <text class="certificate-label">教育证书</text>
          </view>
          <view class="empty-certificate" v-if="!professional.education">
            <text>暂无教育证书</text>
          </view>
        </view>
      </view>

      <!-- 专业证书 -->
      <view class="card">
        <view class="card-title">专业证书</view>
        <view class="certificate-container">
          <view class="certificate-item" v-if="professional.professional">
            <image
              class="certificate-image"
              :src="professional.professional"
              mode="aspectFit"
              @tap="previewImage(professional.professional)"
            ></image>
            <text class="certificate-label">专业证书</text>
          </view>
          <view class="empty-certificate" v-if="!professional.professional">
            <text>暂无专业证书</text>
          </view>
        </view>
      </view>

      <!-- 荣誉证书 -->
      <view class="card">
        <view class="card-title">荣誉奖项</view>
        <view class="certificate-container">
          <view class="certificate-item" v-if="professional.honor">
            <image
              class="certificate-image"
              :src="professional.honor"
              mode="aspectFit"
              @tap="previewImage(professional.honor)"
            ></image>
            <text class="certificate-label">荣誉证书</text>
          </view>
          <view class="empty-certificate" v-if="!professional.honor">
            <text>暂无荣誉证书</text>
          </view>
        </view>
      </view>

      <!-- 预约按钮 -->
      <view class="booking-container">
        <button
          class="booking-button"
          :disabled="professional.status !== 1"
          @tap="openBookingConfirm"
        >
          {{ professional.status === 1 ? '立即预约' : '暂不可预约' }}
        </button>
      </view>
    </view>

    <!-- 预约确认弹窗 -->
    <view class="popup-mask" v-if="showBookingConfirm" @tap="closeBookingConfirm"></view>
    <view class="popup-content" v-if="showBookingConfirm">
      <view class="popup-title">预约确认</view>
      <view class="popup-body">
        <text>您确定要预约 {{ professional?.name || '该专业人士' }} 吗？</text>
      </view>
      <view class="popup-footer">
        <button class="cancel-button" @tap="closeBookingConfirm">取消</button>
        <button class="confirm-button" @tap="confirmBooking">确定</button>
      </view>
    </view>
  </view>
</template>

<script>
import { onLoad, onShow, onUnload } from '@dcloudio/uni-app'
import { ref, reactive, onMounted, computed } from 'vue'
import NavigationBar from '@/components/navigation-bar/navigation-bar.vue'
import { cities } from '@/config/areaData'
import { getProfessionalDetail } from '@/service/professional'
import { processCloudUrls } from '@/utils/cloudStorage'

export default {
  components: {
    NavigationBar,
  },
  setup() {
    // 状态管理
    const loading = ref(true)
    const error = ref('')
    const professional = reactive({
      id: '',
      name: '',
      avatar: '',
      gender: '',
      phone: '',
      email: '',
      status: 0,
      serviceArea: {},
      introduction: '',
      idCardFront: '',
      idCardBack: '',
      education: '',
      professional: '',
      qualification: '',
      honor: '',
      subjects: [],
    })

    // 计算属性
    const serviceAreaText = computed(() => {
      if (!professional.serviceArea) return '暂无'

      const { city, district, street } = professional.serviceArea
      const areas = []

      if (city) areas.push(city)
      if (district) areas.push(district)
      if (street) areas.push(street)

      return areas.length > 0 ? areas.join(' - ') : '暂无'
    })

    // 预约相关
    const showBookingConfirm = ref(false)

    // 导航操作
    const goBack = () => {
      uni.navigateBack()
    }

    // 获取专业人士ID
    const getProfessionalId = () => {
      // 首先尝试从页面选项中获取
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      let id = currentPage.$page?.options?.id

      // 如果选项中没有，尝试从页面参数中获取
      if (!id && currentPage.options) {
        id = currentPage.options.id
      }

      // 尝试从页面实例中获取
      if (!id && currentPage.$vm && currentPage.$vm.$options.propsData) {
        id = currentPage.$vm.$options.propsData.id
      }

      // 打印调试信息
      console.log(
        '获取专业人士ID:',
        id,
        '当前页面选项:',
        currentPage.$page?.options,
        '当前页面:',
        currentPage,
      )

      return id
    }

    // 加载专业人士详情
    const fetchProfessionalDetail = async () => {
      const id = getProfessionalId()
      if (!id) {
        error.value = '未提供专业人士ID，请返回列表页重新选择'
        loading.value = false
        return
      }

      loading.value = true
      error.value = ''

      try {
        const result = await getProfessionalDetail(id)

        if (result && result.success) {
          const data = result.data

          // 如果返回的数据为空
          if (!data || Object.keys(data).length === 0) {
            throw new Error('未找到专业人士信息，该专业人士可能已被删除')
          }

          // 更新专业人士信息
          Object.keys(professional).forEach((key) => {
            if (data[key] !== undefined) {
              professional[key] = data[key]
            }
          })

          // 处理云存储URL
          await processCloudStorageUrls()
        } else {
          throw new Error(result?.message || '获取专业人士信息失败')
        }

        loading.value = false
      } catch (err) {
        console.error('获取专业人士详情失败:', err)
        error.value = err.message || '获取专业人士信息失败'
        loading.value = false
      }
    }

    // 处理云存储URL
    const processCloudStorageUrls = async () => {
      if (!professional) return

      // 收集所有需要处理的云存储URL
      const urls = []
      const fields = [
        'avatar',
        'idCardFront',
        'idCardBack',
        'qualification',
        'education',
        'professional',
        'honor',
      ]

      // 收集所有字段的云存储URL
      fields.forEach((field) => {
        if (professional[field] && professional[field].startsWith('cloud://')) {
          urls.push(professional[field])
        }
      })

      if (urls.length === 0) return

      try {
        console.log('开始处理云存储URL:', urls)
        // 处理云存储URL为临时URL
        const result = await processCloudUrls(urls)

        if (result && result.success) {
          // 将处理结果保存到映射对象中
          const urlMap = result.data.urlMapping || {}
          console.log('获取到的临时URL映射:', urlMap)

          // 更新专业人士数据中的云存储URL为临时URL
          fields.forEach((field) => {
            if (professional[field] && professional[field].startsWith('cloud://')) {
              const tempUrl = urlMap[professional[field]]
              if (tempUrl) {
                professional[field] = tempUrl
              } else {
                // 如果获取不到临时URL，使用模拟URL
                professional[field] = getMockImageUrl(field)
              }
            }
          })
        } else {
          console.error('[处理云存储URL] 失败:', result?.message)
          // 使用模拟URL替代
          useMockImages()
        }
      } catch (error) {
        console.error('[处理云存储URL] 错误:', error)
        // 使用模拟URL替代
        useMockImages()
      }
    }

    // 获取模拟图片URL
    const getMockImageUrl = (field) => {
      const mockImages = {
        avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
        idCardFront: 'https://randomuser.me/api/portraits/men/86.jpg',
        idCardBack: 'https://randomuser.me/api/portraits/men/87.jpg',
        education: 'https://randomuser.me/api/portraits/men/88.jpg',
        professional: 'https://randomuser.me/api/portraits/men/89.jpg',
        qualification: 'https://randomuser.me/api/portraits/men/90.jpg',
        honor: 'https://randomuser.me/api/portraits/men/91.jpg',
      }

      return mockImages[field] || 'https://randomuser.me/api/portraits/men/92.jpg'
    }

    // 使用模拟图片替代所有云存储URL
    const useMockImages = () => {
      const fields = [
        'avatar',
        'idCardFront',
        'idCardBack',
        'qualification',
        'education',
        'professional',
        'honor',
      ]

      fields.forEach((field) => {
        if (professional[field] && professional[field].startsWith('cloud://')) {
          professional[field] = getMockImageUrl(field)
        }
      })
    }

    // 重试加载
    const retryFetch = () => {
      fetchProfessionalDetail()
    }

    // 拨打电话
    const makePhoneCall = () => {
      if (!professional.phone) return

      uni.makePhoneCall({
        phoneNumber: professional.phone,
        fail: (err) => {
          console.error('拨打电话失败:', err)
        },
      })
    }

    // 预览图片
    const previewImage = (url) => {
      if (!url) return
      uni.previewImage({
        urls: [url],
        current: url,
      })
    }

    // 打开预约确认弹窗
    const openBookingConfirm = () => {
      if (professional.status !== 1) return
      showBookingConfirm.value = true
    }

    // 关闭预约弹窗
    const closeBookingConfirm = () => {
      showBookingConfirm.value = false
    }

    // 确认预约
    const confirmBooking = () => {
      uni.showToast({
        title: '预约功能即将上线',
        icon: 'none',
      })
      closeBookingConfirm()
    }

    // 生命周期钩子
    onMounted(() => {
      fetchProfessionalDetail()
    })

    return {
      loading,
      error,
      professional,
      serviceAreaText,
      showBookingConfirm,
      goBack,
      retryFetch,
      makePhoneCall,
      previewImage,
      openBookingConfirm,
      closeBookingConfirm,
      confirmBooking,
    }
  },
}
</script>

<style lang="scss">
.container {
  padding-bottom: 120rpx;
}

// 加载状态
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 500rpx;

  .loading-spinner {
    width: 80rpx;
    height: 80rpx;
    margin-bottom: 30rpx;
    border: 6rpx solid rgba(0, 0, 0, 0.1);
    border-top-color: #2979ff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
}

// 错误状态
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 500rpx;
  padding: 0 40rpx;

  .error-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120rpx;
    height: 120rpx;
    margin-bottom: 30rpx;
    font-size: 60rpx;
    color: white;
    background-color: #f56c6c;
    border-radius: 50%;
  }

  .error-text {
    margin-bottom: 40rpx;
    font-size: 32rpx;
    color: #333;
    text-align: center;
  }

  .error-actions {
    display: flex;
    justify-content: space-between;
    width: 100%;

    .retry-button,
    .back-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48%;
      height: 80rpx;
      margin-bottom: 20rpx;
      font-size: 32rpx;
      border-radius: 40rpx;
    }

    .retry-button {
      color: #fff;
      background-color: #2979ff;
    }

    .back-button {
      color: #333;
      background-color: #f2f2f2;
    }
  }
}

// 专业人士详情
.professional-detail {
  padding: 20rpx 30rpx;
}

// 卡片样式
.card {
  margin-bottom: 30rpx;
  overflow: hidden;
  background-color: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

  .card-header {
    padding: 24rpx 30rpx;
    border-bottom: 1rpx solid #f0f0f0;

    .card-title {
      font-size: 32rpx;
      font-weight: 500;
      color: #333;
    }
  }

  .card-content {
    padding: 30rpx;
  }
}

// 基本信息
.basic-info {
  display: flex;
  align-items: center;

  .avatar-container {
    margin-right: 30rpx;

    .avatar {
      width: 160rpx;
      height: 160rpx;
      background-color: #f0f0f0;
      border-radius: 80rpx;
    }
  }

  .info-container {
    flex: 1;

    .name-gender {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;

      .name {
        margin-right: 20rpx;
        font-size: 36rpx;
        font-weight: bold;
        color: #333;
      }

      .gender {
        padding: 6rpx 16rpx;
        font-size: 24rpx;
        color: #fff;
        background-color: #f56c6c;
        border-radius: 20rpx;
      }
    }

    .info-item {
      display: flex;
      margin-bottom: 16rpx;
      font-size: 28rpx;

      .info-label {
        width: 160rpx;
        color: #606266;
      }

      .info-value {
        flex: 1;
        color: #333;
      }
    }
  }
}

// 证书容器
.certificate-container {
  .certificate-row {
    display: flex;
    flex-wrap: wrap;
    margin: -10rpx;

    .certificate-item {
      width: calc(50% - 20rpx);
      margin: 10rpx;

      .certificate-label {
        display: block;
        margin-bottom: 10rpx;
        font-size: 28rpx;
        color: #606266;
      }

      .certificate-image {
        width: 100%;
        height: 240rpx;
        background-color: #f5f5f5;
        border-radius: 8rpx;
      }
    }
  }
}

// 预约按钮
.booking-container {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 20rpx 30rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

  .booking-button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90rpx;
    font-size: 32rpx;
    color: #fff;
    background-color: #2979ff;
    border-radius: 45rpx;

    &:disabled {
      background-color: #cccccc;
      opacity: 0.7;
    }
  }
}

// 弹窗样式
.popup-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 998;
  background-color: rgba(0, 0, 0, 0.5);
}

.popup-content {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 999;
  width: 80%;
  overflow: hidden;
  background-color: #fff;
  border-radius: 12rpx;
  transform: translate(-50%, -50%);

  .popup-title {
    padding: 30rpx 0;
    font-size: 32rpx;
    font-weight: 500;
    text-align: center;
    border-bottom: 1rpx solid #f0f0f0;
  }

  .popup-body {
    padding: 40rpx 30rpx;

    .popup-text {
      font-size: 30rpx;
      color: #333;
      text-align: center;
    }
  }

  .popup-footer {
    display: flex;
    border-top: 1rpx solid #f0f0f0;

    .popup-button {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      height: 90rpx;
      font-size: 32rpx;

      &.cancel {
        color: #606266;
        border-right: 1rpx solid #f0f0f0;
      }

      &.confirm {
        color: #2979ff;
      }
    }
  }
}

.cancel-button,
.confirm-button {
  flex: 1;
  height: 90rpx;
  padding: 0;
  margin: 0;
  font-size: 32rpx;
  line-height: 90rpx;
  background-color: transparent;

  &::after {
    border: none;
  }
}

.cancel-button {
  color: #606266;
  border-right: 1rpx solid #f0f0f0;
}

.confirm-button {
  color: #2979ff;
}
</style>
