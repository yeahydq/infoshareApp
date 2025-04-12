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
            :src="isValidUrl(professional.avatar) ? professional.avatar : defaultAvatar"
            mode="aspectFill"
            @tap="professional.avatar ? previewImage(professional.avatar) : null"
            @error="handleImageError('avatar')"
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
          <view class="certificate-item" v-if="isValidUrl(professional.idCardFront)">
            <image
              class="certificate-image"
              :src="professional.idCardFront"
              mode="aspectFit"
              @tap="previewImage(professional.idCardFront)"
              @error="handleImageError('idCardFront')"
            ></image>
            <text class="certificate-label">身份证正面</text>
          </view>
          <view class="certificate-item" v-if="isValidUrl(professional.idCardBack)">
            <image
              class="certificate-image"
              :src="professional.idCardBack"
              mode="aspectFit"
              @tap="previewImage(professional.idCardBack)"
              @error="handleImageError('idCardBack')"
            ></image>
            <text class="certificate-label">身份证反面</text>
          </view>
          <view
            class="empty-certificate"
            v-if="!isValidUrl(professional.idCardFront) && !isValidUrl(professional.idCardBack)"
          >
            <text>暂无身份证信息</text>
          </view>
        </view>
      </view>

      <!-- 资质证书 -->
      <view class="card">
        <view class="card-title">资质证书</view>
        <view class="certificate-container">
          <view class="certificate-item" v-if="isValidUrl(professional.qualification)">
            <image
              class="certificate-image"
              :src="professional.qualification"
              mode="aspectFit"
              @tap="previewImage(professional.qualification)"
              @error="handleImageError('qualification')"
            ></image>
            <text class="certificate-label">资质证书</text>
          </view>
          <view class="empty-certificate" v-if="!isValidUrl(professional.qualification)">
            <text>暂无资质证书</text>
          </view>
        </view>
      </view>

      <!-- 教育证书 -->
      <view class="card">
        <view class="card-title">教育背景</view>
        <view class="certificate-container">
          <view class="certificate-item" v-if="isValidUrl(professional.education)">
            <image
              class="certificate-image"
              :src="professional.education"
              mode="aspectFit"
              @tap="previewImage(professional.education)"
              @error="handleImageError('education')"
            ></image>
            <text class="certificate-label">教育证书</text>
          </view>
          <view class="empty-certificate" v-if="!isValidUrl(professional.education)">
            <text>暂无教育证书</text>
          </view>
        </view>
      </view>

      <!-- 专业证书 -->
      <view class="card">
        <view class="card-title">专业证书</view>
        <view class="certificate-container">
          <view class="certificate-item" v-if="isValidUrl(professional.professional)">
            <image
              class="certificate-image"
              :src="professional.professional"
              mode="aspectFit"
              @tap="previewImage(professional.professional)"
              @error="handleImageError('professional')"
            ></image>
            <text class="certificate-label">专业证书</text>
          </view>
          <view class="empty-certificate" v-if="!isValidUrl(professional.professional)">
            <text>暂无专业证书</text>
          </view>
        </view>
      </view>

      <!-- 荣誉证书 -->
      <view class="card">
        <view class="card-title">荣誉奖项</view>
        <view class="certificate-container">
          <view class="certificate-item" v-if="isValidUrl(professional.honor)">
            <image
              class="certificate-image"
              :src="professional.honor"
              mode="aspectFit"
              @tap="previewImage(professional.honor)"
              @error="handleImageError('honor')"
            ></image>
            <text class="certificate-label">荣誉证书</text>
          </view>
          <view class="empty-certificate" v-if="!isValidUrl(professional.honor)">
            <text>暂无荣誉证书</text>
          </view>
        </view>
      </view>

      <!-- 预约按钮 -->
      <view class="booking-container">
        <button class="booking-button" :disabled="!canBooking" @tap="goToBookingPage">
          {{ canBooking ? '立即预约' : '暂不可预约' }}
        </button>
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

// 安全调用方法，屏蔽Worker中不支持的API调用错误
const safeCall = (fn, ...args) => {
  try {
    return fn(...args)
  } catch (error) {
    // 忽略特定错误
    if (
      error &&
      error.message &&
      (error.message.includes('reportRealtimeAction:fail not support') ||
        error.message.includes('not support'))
    ) {
      console.warn('忽略Worker中不支持的API调用:', error.message)
      return null
    }
    // 其他错误正常抛出
    throw error
  }
}

export default {
  components: {
    NavigationBar,
  },
  setup() {
    // 状态管理
    const loading = ref(true)
    const error = ref('')
    // 添加可预约状态标识
    const hasAvailableSlots = ref(false)
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

    // 默认头像
    const defaultAvatar = 'https://randomuser.me/api/portraits/men/85.jpg'

    // 验证URL是否有效
    const isValidUrl = (url) => {
      if (!url) return false
      if (typeof url !== 'string') return false

      // 验证URL格式
      return /^(https?:\/\/|cloud:\/\/)/.test(url)
    }

    // 处理图片加载错误
    const handleImageError = (field) => {
      console.error(`图片加载失败 [${field}]:`, professional[field])
      professional[field] = getMockImageUrl(field)
    }

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

    // 计算是否可预约
    const canBooking = computed(() => {
      // 只检查专业人士状态，不检查时间段
      return professional.status === 'approved'
    })

    // 导航操作
    const goBack = () => {
      uni.navigateBack()
    }

    // 获取专业人士 _openid
    const getProfessionalOpenId = () => {
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
        '获取专业人士 _openid:',
        id,
        '当前页面选项:',
        currentPage.$page?.options,
        '当前页面:',
        currentPage,
      )

      return id
    }

    // 检查专业人士是否有可用时间段
    const checkAvailableTimeSlots = async (_openid) => {
      try {
        // 确保ID不为空
        if (!_openid) {
          console.error('专业人士ID为空')
          hasAvailableSlots.value = false
          return
        }

        console.log('检查专业人士是否有可用时间段:', _openid)
        // 打印完整请求参数
        console.log('TimeSchedule云函数调用参数:', { type: 'getProfessionalSlots', _openid })

        // 使用safeCall包装云函数调用
        const callResult = await safeCall(async () => {
          return await uni.cloud.callFunction({
            name: 'TimeSchedule',
            data: {
              type: 'getProfessionalSlots',
              _openid,
            },
          })
        })

        // 如果调用失败，设置默认结果
        const { result } = callResult || { result: { code: -1, message: 'API调用失败' } }

        if (result.code === 0 && Array.isArray(result.data)) {
          // 如果有可用日期，表示可以预约
          hasAvailableSlots.value = result.data.length > 0
          console.log(
            '专业人士是否有可用时间段:',
            hasAvailableSlots.value,
            '可用日期数量:',
            result.data.length,
          )
        } else {
          hasAvailableSlots.value = false
          console.log('获取可用时间段失败或没有可用时间段')
        }
      } catch (error) {
        // console.error('检查可用时间段出错:', error)
        // hasAvailableSlots.value = false
      }
    }

    // 加载专业人士详情
    const fetchProfessionalDetail = async () => {
      const _openid = getProfessionalOpenId()
      if (!_openid) {
        error.value = '未提供专业人士_openid, 请返回列表页重新选择'
        loading.value = false
        return
      }

      loading.value = true
      error.value = ''

      try {
        // 安全调用API
        const detailResult = await safeCall(async () => {
          return await getProfessionalDetail(_openid)
        })

        // 设置默认结果
        const result = detailResult || { success: false, message: 'API调用失败' }

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

          // 确保ID字段正确设置
          if (!professional._openid && _openid) {
            professional._openid = _openid
            console.log('设置专业人士ID:', _openid)
          }

          // 打印专业人士状态信息，用于调试预约按钮问题
          console.log('专业人士详情数据:', professional)
          console.log('专业人士_openid:', professional._openid || _openid)
          console.log('专业人士状态:', professional.status, '类型:', typeof professional.status)

          // 检查是否有可用时间段
          if (professional.status === 'approved') {
            // 使用获取到的id作为备选
            await checkAvailableTimeSlots(professional._openid || _openid)
          } else {
            console.log('专业人士状态不为1，不检查可用时间段')
            hasAvailableSlots.value = false
          }

          console.log('最终可预约状态:', canBooking.value)

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
        if (
          professional[field] &&
          typeof professional[field] === 'string' &&
          professional[field].startsWith('cloud://')
        ) {
          urls.push(professional[field])
        } else if (professional[field] && typeof professional[field] !== 'string') {
          console.error(`非法图片URL格式 [${field}]:`, professional[field])
          professional[field] = getMockImageUrl(field)
        }
      })

      if (urls.length === 0) return

      try {
        console.log('开始处理云存储URL:', urls)
        // 处理云存储URL为临时URL
        const processResult = await safeCall(async () => {
          return await processCloudUrls(urls)
        })

        // 设置默认结果
        const result = processResult || { success: false, message: 'API调用失败' }

        if (result.success) {
          // 将处理结果保存到映射对象中
          const urlMap = result.data.urlMapping || {}
          console.log('获取到的临时URL映射:', urlMap)

          // 更新专业人士数据中的云存储URL为临时URL
          fields.forEach((field) => {
            if (
              professional[field] &&
              typeof professional[field] === 'string' &&
              professional[field].startsWith('cloud://')
            ) {
              const tempUrl = urlMap[professional[field]]
              if (tempUrl) {
                // 确保URL格式正确
                professional[field] = tempUrl.trim()
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

      // 检查URL格式，避免错误的路径
      if (!/^(https?:\/\/|cloud:\/\/)/.test(url)) {
        console.error('图片URL格式不正确:', url)
        uni.showToast({
          title: '无法预览图片',
          icon: 'none',
        })
        return
      }

      // 安全处理URL，确保正确编码
      try {
        const safeUrl = encodeURI(decodeURI(url))

        // 使用safeCall包装API调用
        safeCall(() => {
          uni.previewImage({
            urls: [safeUrl],
            current: safeUrl,
            fail: (err) => {
              console.error('预览图片失败:', err, '图片URL:', url)
              uni.showToast({
                title: '预览图片失败',
                icon: 'none',
              })
            },
          })
        })
      } catch (error) {
        console.error('处理图片URL出错:', error, '原始URL:', url)
        uni.showToast({
          title: '图片URL格式错误',
          icon: 'none',
        })
      }
    }

    // 跳转到预约页面
    const goToBookingPage = () => {
      console.log('尝试跳转到预约页面')
      console.log('当前专业人士状态:', professional.status, '类型:', typeof professional.status)
      console.log('是否有可用时间段:', hasAvailableSlots.value)
      console.log('预约按钮是否禁用:', !canBooking.value)

      if (!canBooking.value) {
        if (professional.status !== 1) {
          console.log('该专业人士不可预约，状态值不为1')
          uni.showToast({
            title: '该专业人士暂不接受预约',
            icon: 'none',
          })
        } else if (!hasAvailableSlots.value) {
          console.log('该专业人士没有可用时间段')
          uni.showToast({
            title: '该专业人士近期没有可预约时间段',
            icon: 'none',
          })
        }
        return
      }

      // 获取专业人士ID
      const professionalId = professional._openid || getProfessionalOpenId()
      if (!professionalId) {
        console.error('无法获取专业人士ID')
        uni.showToast({
          title: '跳转失败，无法获取专业人士信息',
          icon: 'none',
        })
        return
      }

      // 获取当前日期作为预约起始日期
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      const dateStr = `${year}-${month}-${day}`

      console.log('跳转至预约页面，专业人士ID:', professionalId)

      // 跳转到预约页面
      uni.navigateTo({
        url: `/pages/weshares/booking/index?id=${professionalId}&date=${dateStr}`,
        fail: (err) => {
          console.error('跳转到预约页面失败:', err)
          uni.showToast({
            title: '跳转失败，请重试',
            icon: 'none',
          })
        },
      })
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
      canBooking,
      defaultAvatar,
      isValidUrl,
      handleImageError,
      goBack,
      retryFetch,
      makePhoneCall,
      previewImage,
      goToBookingPage,
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
</style>
