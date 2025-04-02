<template>
  <PageLayout
    title="专业人员注册 (4/4)"
    subtitle="预览并确认您的注册信息"
    :steps="steps"
    :showBack="true"
    @back="handleBack"
    @next="handleSubmit"
    :hideNextBtn="isApplicationPending"
    :backBtnText="isApplicationPending ? '修改资料' : '上一步'"
  >
    <!-- 添加备用修改按钮，确保用户可以点击 -->
    <view v-if="isApplicationPending" class="edit-button-floating" @tap="handleBackFromFloating">
      <text>点击修改资料</text>
    </view>

    <view class="preview-container">
      <!-- 审核状态显示 -->
      <view v-if="isApplicationPending" class="status-banner">
        <view class="status-icon">⏳</view>
        <view class="status-info">
          <view class="status-title">您的申请正在审核中</view>
          <view class="status-desc">我们的工作人员正在审核您的资料，请耐心等待</view>
          <!-- 添加内联修改按钮 -->
          <view class="modify-link" @tap="handleBackFromInline">点击此处修改资料</view>
        </view>
      </view>

      <!-- 信息预览区域 -->
      <view class="preview-section">
        <view class="section-header">
          <view class="section-title">基本信息</view>
        </view>
        <view class="info-group">
          <view class="info-item" v-if="step1Data.name">
            <text class="label">姓名</text>
            <text class="value">{{ step1Data.name }}</text>
          </view>
          <view class="info-item" v-if="step1Data.gender">
            <text class="label">性别</text>
            <text class="value">{{ step1Data.gender === 'male' ? '男' : '女' }}</text>
          </view>
          <view class="info-item" v-if="step1Data.phone">
            <text class="label">联系电话</text>
            <text class="value">{{ step1Data.phone }}</text>
          </view>
          <view class="info-item" v-if="step1Data.email">
            <text class="label">邮箱</text>
            <text class="value">{{ step1Data.email }}</text>
          </view>
          <view class="info-item" v-if="step1Data.idCard">
            <text class="label">身份证号</text>
            <text class="value">{{ step1Data.idCard }}</text>
          </view>
          <view
            class="info-item"
            v-if="step1Data.professionalTypes && step1Data.professionalTypes.length > 0"
          >
            <text class="label">专业类型</text>
            <text class="value">{{ step1Data.professionalTypes.join(', ') }}</text>
          </view>
          <view
            class="info-item"
            v-if="step1Data.educationRanges && step1Data.educationRanges.length > 0"
          >
            <text class="label">辅导范围</text>
            <text class="value">{{ step1Data.educationRanges.join(', ') }}</text>
          </view>
        </view>
      </view>

      <view class="preview-section">
        <view class="section-title">专业能力与服务信息</view>
        <view class="info-group">
          <view class="info-item" v-if="step2Data.experience">
            <text class="label">工作经验</text>
            <text class="value">{{ step2Data.experience }}</text>
          </view>
          <view class="info-item" v-if="step2Data.serviceDescription">
            <text class="label">专业特长</text>
            <text class="value">{{ step2Data.serviceDescription }}</text>
          </view>
          <view class="info-item" v-if="step2Data.skillTags && step2Data.skillTags.length > 0">
            <text class="label">技能标签</text>
            <view class="tags-preview">
              <view class="tag" v-for="(tag, index) in step2Data.skillTags" :key="index">
                {{ tag }}
              </view>
            </view>
          </view>
          <view class="info-item" v-if="step2Data.serviceArea">
            <text class="label">服务区域</text>
            <text class="value">{{ step2Data.serviceArea }}</text>
          </view>
        </view>
      </view>

      <!-- 服务价格信息 -->
      <view
        class="preview-section"
        v-if="
          step1Data.professionalTypes &&
          step1Data.professionalTypes.length > 0 &&
          step1Data.skillPrices &&
          step1Data.skillBillingTypes
        "
      >
        <view class="section-header">
          <view class="section-title">服务价格设置</view>
        </view>
        <view class="info-group">
          <view
            class="info-item price-item"
            v-for="(type, index) in step1Data.professionalTypes"
            :key="index"
          >
            <text class="label">{{ type }}</text>
            <text class="value" v-if="step1Data.skillBillingTypes[type] === 'negotiable'">
              面议
            </text>
            <text class="value" v-else-if="step1Data.skillPrices[type]">
              {{ step1Data.skillPrices[type] }} 元{{
                getBillingUnitLabel(step1Data.skillBillingTypes[type])
              }}
            </text>
          </view>
        </view>
      </view>

      <view class="preview-section">
        <view class="section-header">
          <view class="section-title">证件资料</view>
        </view>
        <view class="upload-status">
          <view class="status-item" v-if="step3Data.education">
            <text class="label">学历证书</text>
            <text class="status" :class="getFileStatusClass(step3Data.education.split(',')[0])">
              {{ getFileStatusText(step3Data.education.split(',')[0]) }}
            </text>
            <view class="image-preview-container" v-if="step3Data.education">
              <scroll-view scroll-x>
                <view class="image-preview-list">
                  <view
                    class="preview-item"
                    v-for="(path, index) in getImageList(step3Data.education)"
                    :key="index"
                    @click="previewImage(getImageList(step3Data.education), index)"
                  >
                    <image class="preview-image" :src="getImageSrc(path)" mode="aspectFill"></image>
                  </view>
                </view>
              </scroll-view>
            </view>
          </view>
          <view class="status-item" v-if="step3Data.professional">
            <text class="label">专业证书</text>
            <text class="status" :class="getFileStatusClass(step3Data.professional.split(',')[0])">
              {{ getFileStatusText(step3Data.professional.split(',')[0]) }}
            </text>
            <view class="image-preview-container" v-if="step3Data.professional">
              <scroll-view scroll-x>
                <view class="image-preview-list">
                  <view
                    class="preview-item"
                    v-for="(path, index) in getImageList(step3Data.professional)"
                    :key="index"
                    @click="previewImage(getImageList(step3Data.professional), index)"
                  >
                    <image class="preview-image" :src="getImageSrc(path)" mode="aspectFill"></image>
                  </view>
                </view>
              </scroll-view>
            </view>
          </view>
          <view class="status-item" v-if="step3Data.qualification">
            <text class="label">专业资格证书</text>
            <text class="status" :class="getFileStatusClass(step3Data.qualification)">
              {{ getFileStatusText(step3Data.qualification) }}
            </text>
            <view class="image-preview-container" v-if="step3Data.qualification">
              <view class="preview-item" @click="previewImage([step3Data.qualification])">
                <image
                  class="preview-image"
                  :src="getImageSrc(step3Data.qualification)"
                  mode="aspectFill"
                ></image>
              </view>
            </view>
          </view>
          <view class="status-item" v-if="step3Data.idCardFront && step3Data.idCardBack">
            <text class="label">身份证照片</text>
            <text class="status" :class="getFileStatusClass(step3Data.idCardFront)">
              {{ getFileStatusText(step3Data.idCardFront) }}
            </text>
            <view class="id-card-container">
              <view class="id-card-preview">
                <view class="preview-item" @click="previewImage([step3Data.idCardFront])">
                  <text class="preview-label">正面</text>
                  <image
                    class="preview-image"
                    :src="getImageSrc(step3Data.idCardFront)"
                    mode="aspectFill"
                  ></image>
                </view>
                <view class="preview-item" @click="previewImage([step3Data.idCardBack])">
                  <text class="preview-label">反面</text>
                  <image
                    class="preview-image"
                    :src="getImageSrc(step3Data.idCardBack)"
                    mode="aspectFill"
                  ></image>
                </view>
              </view>
            </view>
          </view>
          <view class="status-item" v-if="step3Data.honor">
            <text class="label">荣誉证书</text>
            <text class="status" :class="getFileStatusClass(step3Data.honor.split(',')[0])">
              {{ getFileStatusText(step3Data.honor.split(',')[0]) }}
            </text>
            <view class="image-preview-container" v-if="step3Data.honor">
              <scroll-view scroll-x>
                <view class="image-preview-list">
                  <view
                    class="preview-item"
                    v-for="(path, index) in getImageList(step3Data.honor)"
                    :key="index"
                    @click="previewImage(getImageList(step3Data.honor), index)"
                  >
                    <image class="preview-image" :src="getImageSrc(path)" mode="aspectFill"></image>
                  </view>
                </view>
              </scroll-view>
            </view>
          </view>
        </view>
      </view>

      <!-- 服务协议 -->
      <view class="agreement-section" v-if="!isApplicationPending">
        <view class="agreement-title">服务协议</view>
        <scroll-view scroll-y class="agreement-content">
          <text class="agreement-text">
            1. 本平台仅作为信息发布平台，不对服务提供者的资质、能力、服务质量等做任何保证。 2.
            服务提供者应遵守相关法律法规，确保提供的服务合法合规。 3.
            服务提供者应保护用户隐私，不得泄露用户个人信息。 4.
            平台有权对违规账号进行处理，包括但不限于警告、限制、封禁等。 5.
            服务提供者应按时完成服务，保证服务质量。 6. 平台保留对服务协议进行修改的权利。
          </text>
        </scroll-view>
        <view class="agreement-checkbox">
          <checkbox-group @change="handleAgreementChange">
            <checkbox value="agree" :checked="formData.agreement" />
            <text class="checkbox-label">我已阅读并同意《服务协议》</text>
          </checkbox-group>
        </view>
      </view>

      <!-- 审核中提示（替代协议部分） -->
      <view class="agreement-section" v-if="isApplicationPending">
        <view class="agreement-title">审核进度</view>
        <view class="review-progress">
          <view class="progress-step active">
            <view class="step-dot"></view>
            <view class="step-info">
              <view class="step-title">提交申请</view>
              <view class="step-time">已完成</view>
            </view>
          </view>
          <view class="progress-step active">
            <view class="step-dot"></view>
            <view class="step-info">
              <view class="step-title">资料审核中</view>
              <view class="step-time">处理中</view>
            </view>
          </view>
          <view class="progress-step">
            <view class="step-dot"></view>
            <view class="step-info">
              <view class="step-title">审核完成</view>
              <view class="step-time">待完成</view>
            </view>
          </view>
        </view>
        <view class="review-tips">
          <text>我们会在1-3个工作日内完成审核，请耐心等待</text>
          <text>审核结果将通过短信通知您，请保持手机畅通</text>
        </view>
      </view>

      <!-- 提交说明 -->
      <view class="submit-notice" v-if="!isApplicationPending">
        <text class="notice-text">
          提交后，我们将在1-3个工作日内完成审核，审核结果将通过短信通知您。
        </text>
      </view>
    </view>

    <!-- 修改确认弹窗 -->
    <view class="modify-confirm-overlay" v-if="showModifyConfirm">
      <view class="modify-confirm-dialog">
        <view class="modify-confirm-title">确认修改申请</view>
        <view class="modify-confirm-content">
          <text>您已完成信息修改，确认提交这些变更吗？</text>
          <text class="warning-text">注意：修改后的信息需要重新审核，请耐心等待审核结果。</text>
        </view>
        <view class="modify-confirm-buttons">
          <button class="cancel-btn" @click="cancelModify">取消</button>
          <button class="confirm-btn" @click="confirmModify">确认修改</button>
        </view>
      </view>
    </view>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed, nextTick } from 'vue'
import { useRegisterStore } from '@/store/registerStore'
import PageLayout from '@/components/PageLayout/PageLayout.vue'
import { useUserStore } from '@/store'
import { login } from '@/service/auth/index'

interface Step {
  number: number
  status: '' | 'active' | 'completed'
}

interface Step1Data {
  name?: string
  gender?: string
  phone?: string
  email?: string
  idCard?: string
  professionalTypes?: string[]
  customType?: string
  educationRanges?: string[]
  servicePrice?: string
  billingType?: string
  skillPrices?: Record<string, string>
  skillBillingTypes?: Record<string, string>
}

interface Step2Data {
  skillTags?: string[]
  serviceArea?: string
  servicePrice?: string
  serviceDescription?: string
  experience?: string
  description?: string
}

interface Step3Data {
  idCardFront?: string
  idCardBack?: string
  qualification?: string
  education?: string
  professional?: string
  honor?: string
}

// 步骤配置
const steps = ref<Step[]>([
  { number: 1, status: 'completed' },
  { number: 2, status: 'completed' },
  { number: 3, status: 'completed' },
  { number: 4, status: 'active' },
])

const registerStore = useRegisterStore()
const userStore = useUserStore()

// 存储前三页的数据
const step1Data = ref<Step1Data>({})
const step2Data = ref<Step2Data>({})
const step3Data = ref<Step3Data>({})

// 定义表单数据类型
interface FormData {
  name: string
  gender: string
  phone: string
  email: string
  idCard: string
  professionalTypes: string[]
  educationRanges: string[]
  skillPrices: Record<string, number>
  skillBillingTypes: Record<string, string>
  skillTags: string[]
  serviceArea: string
  serviceDescription: string
  experience: string
  selectedCity: string
  selectedDistrict: string
  selectedStreet: string
  idCardFront: string
  idCardBack: string
  qualification: string
  education: string
  professional: string
  honor: string
  agreement: boolean
}

// 定义表单数据
const formData = ref<FormData>({
  name: '',
  gender: '',
  phone: '',
  email: '',
  idCard: '',
  professionalTypes: [],
  educationRanges: [],
  skillPrices: {},
  skillBillingTypes: {},
  skillTags: [],
  serviceArea: '',
  serviceDescription: '',
  experience: '',
  selectedCity: '',
  selectedDistrict: '',
  selectedStreet: '',
  idCardFront: '',
  idCardBack: '',
  qualification: '',
  education: '',
  professional: '',
  honor: '',
  agreement: false,
})

const isApplicationPending = computed(() => false)

// 新增的状态和属性
const showModifyConfirm = ref(false)
const isModifyMode = computed(() => registerStore.isModifyMode)

// 定义是否可以提交的标志
const canSubmit = ref(false)

// 修改handleBack函数
const handleBack = () => {
  console.log('触发上一步操作')
  // 保存当前数据到全局状态
  registerStore.updateStep4({
    agreement: formData.value.agreement,
  })
  // 同时保存到本地存储（作为备份）
  registerStore.saveToStorage()
  // 触发back事件
  emit('back', 4)
}

// 取消修改
const cancelModify = () => {
  showModifyConfirm.value = false
}

// 确认修改
const confirmModify = async () => {
  showModifyConfirm.value = false

  try {
    // 显示加载提示
    uni.showLoading({
      title: '提交修改中...',
    })

    // 从全局状态获取数据
    const step1Data = registerStore.step1Data
    const step2Data = registerStore.step2Data
    const step3Data = registerStore.step3Data

    if (!step1Data || !step2Data || !step3Data) {
      throw new Error('请先完成前三步信息填写')
    }

    // 复制一份数据用于处理
    const formDataToSubmit = {
      ...step1Data,
      ...step2Data,
      ...step3Data,
    }

    // 处理文件上传 - 先上传所有文件到云存储
    const uploadPromises = []
    const fileFields = [
      'idCardFront',
      'idCardBack',
      'qualification',
      'education',
      'professional',
      'honor',
    ]

    console.log('准备上传文件...')
    console.log('需要检查的文件字段:', fileFields)
    console.log('表单数据:', formDataToSubmit)

    // 保存上传前的路径，用于日志记录
    const originalPaths = {}

    // 处理所有文件上传
    for (const field of fileFields) {
      if (!formDataToSubmit[field]) {
        console.log(`${field}: 无文件路径`)
        continue
      }

      originalPaths[field] = formDataToSubmit[field]
      console.log(`检查${field}文件路径:`, formDataToSubmit[field])

      // 处理单个文件
      if (field === 'idCardFront' || field === 'idCardBack' || field === 'qualification') {
        if (!isLocalPath(formDataToSubmit[field])) {
          console.log(`${field}: 不是本地路径，跳过上传`)
          continue
        }

        console.log(`${field}: 是本地路径，需要上传`)
        uploadPromises.push(
          uploadFile(formDataToSubmit[field], field).then((fileID) => {
            formDataToSubmit[field] = fileID
            console.log(`${field}上传成功: ${fileID}`)
          }),
        )
      }
      // 处理多个文件（逗号分隔的情况）
      else if (formDataToSubmit[field].includes(',')) {
        const paths = formDataToSubmit[field].split(',')
        const uploadedPaths: string[] = []
        let hasLocalFiles = false

        console.log(`${field}: 包含多个文件路径:`, paths)

        for (let i = 0; i < paths.length; i++) {
          const path = paths[i].trim()
          if (!path) {
            uploadedPaths[i] = ''
            continue
          }

          console.log(`${field}[${i}]: 检查路径 ${path}`)
          if (isLocalPath(path)) {
            console.log(`${field}[${i}]: 是本地路径，需要上传`)
            hasLocalFiles = true
            uploadPromises.push(
              uploadFile(path, `${field}_${i}`).then((fileID) => {
                uploadedPaths[i] = fileID as string
                console.log(`${field}_${i}上传成功: ${fileID}`)
              }),
            )
          } else {
            console.log(`${field}[${i}]: 不是本地路径，跳过上传`)
            uploadedPaths[i] = path // 保留原路径
          }
        }

        // 如果存在本地文件，等待上传完成后更新路径
        if (hasLocalFiles) {
          // 修正这里的逻辑，不要重复添加Promise
          const fieldPromise = Promise.all(uploadPromises).then(() => {
            const filePaths = uploadedPaths.filter(Boolean).join(',')
            formDataToSubmit[field] = filePaths
            console.log(`${field}更新为: ${filePaths}`)
          })

          // 确保fieldPromise也被添加到uploadPromises中
          if (!uploadPromises.includes(fieldPromise)) {
            uploadPromises.push(fieldPromise)
          }
        }
      } else {
        // 处理单个文件但不是idCardFront/idCardBack/qualification的情况
        if (isLocalPath(formDataToSubmit[field])) {
          console.log(`${field}: 是本地路径，需要上传`)
          uploadPromises.push(
            uploadFile(formDataToSubmit[field], field).then((fileID) => {
              formDataToSubmit[field] = fileID
              console.log(`${field}上传成功: ${fileID}`)
            }),
          )
        } else {
          console.log(`${field}: 不是本地路径，跳过上传`)
        }
      }
    }

    // 检查isLocalPath函数是否正常工作
    console.log('isLocalPath函数测试:')
    console.log('wxfile://temp: ', isLocalPath('wxfile://temp'))
    console.log('http://tmp: ', isLocalPath('http://tmp'))
    console.log('file_123: ', isLocalPath('file_123'))
    console.log('cloud://: ', isLocalPath('cloud://xxx'))

    // 等待所有文件上传完成
    if (uploadPromises.length > 0) {
      console.log(`开始上传${uploadPromises.length}个文件...`)
      await Promise.all(uploadPromises)
      console.log('所有文件上传完成!')

      // 记录上传前后的路径变化
      console.log('文件路径变化:', {
        original: originalPaths,
        uploaded: {
          idCardFront: formDataToSubmit.idCardFront,
          idCardBack: formDataToSubmit.idCardBack,
          qualification: formDataToSubmit.qualification,
          education: formDataToSubmit.education,
          professional: formDataToSubmit.professional,
          honor: formDataToSubmit.honor,
        },
      })
    } else {
      console.log('没有需要上传的文件，原因可能是:')
      console.log('1. 文件路径已经是云存储路径')
      console.log('2. 没有设置文件路径')
      console.log('3. isLocalPath函数未能正确识别本地路径')
    }

    // 调用云函数提交数据（这时formDataToSubmit中的文件路径已经是云存储fileID）
    const { result } = await uni.cloud.callFunction({
      name: 'profRegister',
      data: {
        action: 'submit',
        ...formDataToSubmit,
      },
    })

    // 隐藏加载提示
    uni.hideLoading()

    if (result.success) {
      // 更新本地用户状态
      const currentUserInfo = userStore.userInfo || {}
      userStore.setUserInfo({
        ...currentUserInfo,
        professionalStatus: 'pending',
        professionalId: result.professionalId,
        updateTime: new Date().getTime(),
      })

      // 打印用户状态更新后的信息
      console.log('用户状态已更新:', {
        professionalStatus: 'pending',
        professionalId: result.professionalId,
        updateTime: new Date().getTime(),
      })

      // 更新全局状态
      registerStore.updateStep4({
        status: 'pending',
      })

      // 清空其他注册数据，但保留提交状态
      // 注意：不要完全清空，否则预览页将无法显示

      // 显示成功提示
      uni.showToast({
        title: '提交成功',
        icon: 'success',
      })

      // 延迟跳转到第五页，使用navigateTo
      setTimeout(() => {
        uni.navigateTo({
          url: '/pages/weshares/index/index',
        })
      }, 1500)
    } else {
      throw new Error(result.message || '提交失败')
    }
  } catch (error: any) {
    // 隐藏加载提示
    uni.hideLoading()

    // 显示错误提示
    uni.showToast({
      title: error.message || '提交失败，请重试',
      icon: 'none',
    })
  }
}

// 检查是否是本地路径
const isLocalPath = (path) => {
  if (!path) return false
  return (
    path.startsWith('wxfile://') ||
    path.includes('tmp') ||
    path.startsWith('http://tmp') ||
    path.startsWith('file_') ||
    path.startsWith('https://tmp')
  )
}

// 上传文件到云存储
const uploadFile = (filePath: string, fileType: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const openid = userStore.userInfo?.openid
    if (!openid) {
      reject(new Error('用户未登录，无法上传文件'))
      return
    }

    // 获取本地文件实际路径
    let actualPath = filePath

    // 处理缓存的文件路径
    if (filePath.includes('file_')) {
      try {
        const cachedFiles = uni.getStorageSync('cachedFiles') || {}
        if (cachedFiles[filePath]) {
          actualPath = cachedFiles[filePath].tempFilePath
          console.log(`从缓存获取实际路径: ${filePath} -> ${actualPath}`)
        }
      } catch (error) {
        console.error('获取缓存文件失败:', error)
      }
    }

    // 检查文件是否存在
    try {
      const fs = uni.getFileSystemManager()
      fs.accessSync(actualPath)
      console.log(`文件存在: ${actualPath}`)
    } catch (error) {
      console.error(`文件不存在: ${actualPath}`, error)
      reject(new Error('文件不存在或无法访问'))
      return
    }

    // 生成文件名和路径
    const timestamp = Date.now()
    const fileExtension = actualPath.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${fileType}_${timestamp}.${fileExtension}`
    const cloudPath = `professional/${openid}/${fileName}`

    console.log(`准备上传文件: ${actualPath} -> ${cloudPath}`)

    // 添加重试机制
    const maxRetries = 3
    let retryCount = 0

    const uploadWithRetry = () => {
      wx.cloud.uploadFile({
        cloudPath,
        filePath: actualPath,
        success: (res) => {
          const fileID = res.fileID
          if (!fileID) {
            console.error('上传成功但未获取到fileID')
            if (retryCount < maxRetries) {
              retryCount++
              console.log(`重试上传 (${retryCount}/${maxRetries})...`)
              setTimeout(uploadWithRetry, 1000 * retryCount)
            } else {
              reject(new Error('上传失败：未获取到文件ID'))
            }
            return
          }

          console.log('上传成功:', fileID)

          // 保存到本地缓存映射中
          try {
            const cloudFileMappings = uni.getStorageSync('cloudFileMappings') || {}
            cloudFileMappings[fileID] = {
              localId: filePath.includes('file_') ? filePath : null,
              tempFilePath: actualPath,
              uploadTime: Date.now(),
              fileType,
              fileName,
            }
            uni.setStorageSync('cloudFileMappings', cloudFileMappings)
            console.log(`文件映射已缓存: ${fileID}`)
          } catch (error) {
            console.error('缓存文件映射失败:', error)
          }

          resolve(fileID)
        },
        fail: (err) => {
          console.error('上传失败:', err)
          if (retryCount < maxRetries) {
            retryCount++
            console.log(`重试上传 (${retryCount}/${maxRetries})...`)
            setTimeout(uploadWithRetry, 1000 * retryCount)
          } else {
            reject(new Error(`上传失败: ${err.errMsg || '未知错误'}`))
          }
        },
      })
    }

    // 开始上传
    uploadWithRetry()
  })
}

// 定义emit
const emit = defineEmits(['back', 'editFromReview'])

// 页面加载时恢复数据
onMounted(async () => {
  console.log('register-page4 onMounted')
  console.log('当前用户状态:', userStore.userInfo)
  console.log('当前store状态:', registerStore.$state)

  // 从store中恢复数据
  const storeStep1Data = registerStore.step1Data
  const storeStep2Data = registerStore.step2Data
  const storeStep3Data = registerStore.step3Data
  const storeStep4Data = registerStore.step4Data

  console.log('从store恢复的数据:', {
    storeStep1Data,
    storeStep2Data,
    storeStep3Data,
    storeStep4Data,
  })

  // 直接赋值给ref对象
  step1Data.value = { ...storeStep1Data }
  step2Data.value = { ...storeStep2Data }
  step3Data.value = { ...storeStep3Data }

  // 打印赋值后的本地数据
  console.log('本地ref数据:', {
    step1Data: step1Data.value,
    step2Data: step2Data.value,
    step3Data: step3Data.value,
  })

  if (storeStep4Data) {
    formData.value.agreement = storeStep4Data.agreement
  }

  // 如果是审核中状态，从云端获取最新数据
  if (userStore.userInfo?.professionalStatus === 'pending') {
    try {
      console.log('获取云端最新数据')
      const { result } = await uni.cloud.callFunction({
        name: 'profRegister',
        data: {
          action: 'getApplication',
        },
      })

      if (result.success && result.application) {
        console.log('获取到云端数据:', result.application)

        // 更新store中的数据
        registerStore.updateStep1(result.application)
        registerStore.updateStep2(result.application)
        registerStore.updateStep3(result.application)
        registerStore.updateStep4(result.application)

        // 保存到本地
        registerStore.saveToStorage()

        // 更新本地数据
        // 使用直接赋值而不是Object.assign
        step1Data.value = { ...result.application }
        step2Data.value = { ...result.application }
        step3Data.value = { ...result.application }

        console.log('更新后的本地数据:', {
          step1DataAfterUpdate: step1Data.value,
          step2DataAfterUpdate: step2Data.value,
          step3DataAfterUpdate: step3Data.value,
        })

        // 强制更新图片显示
        nextTick(() => {
          // 更新图片预览
          if (result.application.idCardFront) {
            step3Data.value.idCardFront = result.application.idCardFront
          }
          if (result.application.idCardBack) {
            step3Data.value.idCardBack = result.application.idCardBack
          }
          if (result.application.qualification) {
            step3Data.value.qualification = result.application.qualification
          }
          if (result.application.education) {
            step3Data.value.education = result.application.education
          }
          if (result.application.professional) {
            step3Data.value.professional = result.application.professional
          }
          if (result.application.honor) {
            step3Data.value.honor = result.application.honor
          }
        })
      } else {
        console.error('获取云端数据失败:', result)
        uni.showToast({
          title: '获取申请数据失败',
          icon: 'none',
        })
      }
    } catch (error) {
      console.error('获取云端数据出错:', error)
      uni.showToast({
        title: '获取申请数据失败',
        icon: 'none',
      })
    }
  }

  // 如果是修改模式，显示确认对话框
  if (registerStore.isModifyMode) {
    console.log('显示修改确认对话框')
    showModifyConfirm.value = true
  }

  // 延迟检查数据是否正确加载
  setTimeout(() => {
    checkDataLoaded()
  }, 500)
})

// 获取计费单位显示文本
const getBillingUnitLabel = (billingType: string) => {
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

// 获取图片列表
const getImageList = (path: string | undefined): string[] => {
  if (!path) return []
  return path.split(',').filter(Boolean)
}

// 获取图片源 - 优化以支持本地缓存和云存储
const getImageSrc = (path: string): string => {
  if (!path) return ''

  // 如果是云存储路径
  if (path.startsWith('cloud://')) {
    try {
      // 1. 检查是否有本地缓存
      const cloudFileMappings = uni.getStorageSync('cloudFileMappings') || {}
      if (cloudFileMappings[path] && cloudFileMappings[path].tempFilePath) {
        // 检查临时文件是否仍然存在
        try {
          const fs = uni.getFileSystemManager()
          fs.accessSync(cloudFileMappings[path].tempFilePath)
          console.log(`从本地缓存加载云文件: ${path}`)
          return cloudFileMappings[path].tempFilePath
        } catch (e) {
          console.log(`本地缓存文件不存在，需要重新下载: ${path}`)
          // 文件不存在，需要重新下载
        }
      }

      // 2. 没有本地缓存，从临时映射获取（可能是本次会话中刚下载的）
      const tempFileMappings = uni.getStorageSync('tempFileMappings') || {}
      if (tempFileMappings[path]) {
        console.log(`从临时映射获取云文件: ${path}`)
        return tempFileMappings[path]
      }

      // 3. 本地没有，触发异步下载（不阻塞UI）
      setTimeout(() => {
        downloadCloudFile(path)
      }, 100)

      // 4. 返回云文件ID作为临时路径（小程序会尝试直接加载）
      return path
    } catch (err) {
      console.error('获取云存储图片缓存失败:', err)
      return path
    }
  }

  // 尝试从映射中获取真实路径
  try {
    const mappings = uni.getStorageSync('filePathMappings') || {}
    if (mappings[path]) {
      console.log('预览页从映射获取文件路径:', path, '->', mappings[path])
      return mappings[path]
    }
  } catch (err) {
    console.error('预览页从映射获取文件路径失败:', err)
  }

  // 尝试从缓存中获取
  if (path.includes('file_')) {
    try {
      const cachedFiles = uni.getStorageSync('cachedFiles') || {}
      if (cachedFiles[path]) {
        return cachedFiles[path].tempFilePath
      }
    } catch (error) {
      console.error('获取缓存文件失败:', error)
    }
  }

  return path
}

// 下载云存储文件到本地
const downloadCloudFile = (fileID: string) => {
  // 检查是否正在下载
  const downloading = uni.getStorageSync('downloadingFiles') || {}
  if (downloading[fileID]) {
    console.log(`文件正在下载中，跳过: ${fileID}`)
    return
  }

  // 标记为正在下载
  downloading[fileID] = true
  uni.setStorageSync('downloadingFiles', downloading)

  console.log(`开始下载云文件: ${fileID}`)
  wx.cloud.downloadFile({
    fileID,
    success: (res) => {
      console.log(`云文件下载成功: ${fileID} -> ${res.tempFilePath}`)

      // 保存到临时映射中，用于当前会话
      try {
        const tempFileMappings = uni.getStorageSync('tempFileMappings') || {}
        tempFileMappings[fileID] = res.tempFilePath
        uni.setStorageSync('tempFileMappings', tempFileMappings)

        // 同时更新长期缓存映射
        const cloudFileMappings = uni.getStorageSync('cloudFileMappings') || {}
        cloudFileMappings[fileID] = {
          ...cloudFileMappings[fileID],
          tempFilePath: res.tempFilePath,
          lastDownloaded: Date.now(),
        }
        uni.setStorageSync('cloudFileMappings', cloudFileMappings)

        console.log(`云文件缓存映射已更新: ${fileID}`)
      } catch (error) {
        console.error('保存云文件映射失败:', error)
      }

      // 移除下载标记
      const downloading = uni.getStorageSync('downloadingFiles') || {}
      delete downloading[fileID]
      uni.setStorageSync('downloadingFiles', downloading)

      // 触发视图刷新（注意：这里可能需要使用其他机制根据您的UI框架）
      // 由于Vue的响应式，如果图片已经在模板中渲染，可以不需要额外操作
    },
    fail: (err) => {
      console.error(`云文件下载失败: ${fileID}`, err)

      // 移除下载标记
      const downloading = uni.getStorageSync('downloadingFiles') || {}
      delete downloading[fileID]
      uni.setStorageSync('downloadingFiles', downloading)
    },
  })
}

// 检查文件是否仅本地缓存（未上传到服务器）
const isLocalCachedOnly = (path: string): boolean => {
  // 如果路径包含file_前缀，表示这是一个本地缓存文件标识符
  if (!path || !path.includes('file_')) {
    return false
  }

  // 判断是本地缓存文件
  return true
}

// 获取证件状态文本
const getFileStatusText = (path: string): string => {
  if (!path) return ''

  if (isLocalCachedOnly(path)) {
    return '已缓存本地'
  } else {
    return '已上传'
  }
}

// 获取证件状态样式类
const getFileStatusClass = (path: string): string => {
  if (!path) return ''

  if (isLocalCachedOnly(path)) {
    return 'cached'
  } else {
    return 'uploaded'
  }
}

// 预览图片
const previewImage = (imageList: string[], index = 0) => {
  if (!imageList || imageList.length === 0) {
    uni.showToast({
      title: '没有可预览的图片',
      icon: 'none',
    })
    return
  }

  // 处理图片路径
  const urls = imageList.map((path) => getImageSrc(path)).filter(Boolean)

  if (urls.length === 0) {
    uni.showToast({
      title: '图片加载失败',
      icon: 'none',
    })
    return
  }

  uni.previewImage({
    urls,
    current: urls[index] || urls[0],
    fail: (err) => {
      console.error('预览图片失败:', err)
      uni.showToast({
        title: '预览图片失败',
        icon: 'none',
      })
    },
  })
}

// 修改浮动按钮处理函数
const handleBackFromFloating = () => {
  console.log('从浮动按钮触发修改资料，直接跳转到第3页')
  // 显示提示消息以确认点击生效
  uni.showToast({
    title: '正在进入修改模式...',
    icon: 'none',
    duration: 1500,
  })

  registerStore.setModifyMode(true) // 设置为修改模式

  // 保存当前数据
  registerStore.updateStep4({
    agreement: formData.value.agreement,
  })
  registerStore.saveToStorage()

  // 发送特殊事件，表示从审核状态页面进入修改模式
  emit('editFromReview', 4)
}

// 修改内联链接处理函数
const handleBackFromInline = () => {
  console.log('从内联链接触发修改资料，直接跳转到第3页')
  // 显示提示消息以确认点击生效
  uni.showToast({
    title: '正在进入修改模式...',
    icon: 'none',
    duration: 1500,
  })

  registerStore.setModifyMode(true) // 设置为修改模式

  // 保存当前数据
  registerStore.updateStep4({
    agreement: formData.value.agreement,
  })
  registerStore.saveToStorage()

  // 发送特殊事件，表示从审核状态页面进入修改模式
  emit('editFromReview', 4)
}

// 检查数据是否正确加载
const checkDataLoaded = () => {
  console.log('检查数据加载状态:')
  console.log('step1Data:', step1Data.value)
  console.log('step2Data:', step2Data.value)
  console.log('step3Data:', step3Data.value)

  // 检查是否有数据
  const hasStep1Data = step1Data.value.name || step1Data.value.phone || step1Data.value.email
  const hasStep2Data =
    step2Data.value.experience ||
    step2Data.value.serviceDescription ||
    (step2Data.value.skillTags && step2Data.value.skillTags.length > 0)
  const hasStep3Data =
    step3Data.value.idCardFront || step3Data.value.education || step3Data.value.qualification

  console.log('数据加载状态:', {
    hasStep1Data,
    hasStep2Data,
    hasStep3Data,
  })

  // 如果数据未加载，尝试从store重新获取
  if (!hasStep1Data || !hasStep2Data || !hasStep3Data) {
    console.log('数据未完全加载，重新从store获取')

    // 重新从store获取数据
    const storeStep1Data = registerStore.step1Data
    const storeStep2Data = registerStore.step2Data
    const storeStep3Data = registerStore.step3Data

    console.log('store中的数据:', {
      storeStep1Data,
      storeStep2Data,
      storeStep3Data,
    })

    // 直接赋值给ref对象
    step1Data.value = { ...storeStep1Data }
    step2Data.value = { ...storeStep2Data }
    step3Data.value = { ...storeStep3Data }
  }
}

// 处理服务协议勾选
const handleAgreementChange = (e: any) => {
  formData.value.agreement = e.detail.value.length > 0
}

// 表单验证
const validateForm = () => {
  if (!formData.value.agreement) {
    uni.showToast({
      title: '请阅读并同意服务协议',
      icon: 'none',
    })
    return false
  }
  return true
}

// 处理提交
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  try {
    // 显示加载提示
    uni.showLoading({
      title: '提交中...',
    })

    // 从全局状态获取数据
    const step1Data = registerStore.step1Data
    const step2Data = registerStore.step2Data
    const step3Data = registerStore.step3Data

    if (!step1Data || !step2Data || !step3Data) {
      throw new Error('请先完成前三步信息填写')
    }

    // 复制一份数据用于处理
    const formDataToSubmit = {
      ...step1Data,
      ...step2Data,
      ...step3Data,
      agreement: formData.value.agreement,
    }

    // 处理文件上传 - 先上传所有文件到云存储
    const uploadPromises = []
    const fileFields = [
      'idCardFront',
      'idCardBack',
      'qualification',
      'education',
      'professional',
      'honor',
    ]

    console.log('准备上传文件...')
    console.log('需要检查的文件字段:', fileFields)
    console.log('表单数据:', formDataToSubmit)

    // 保存上传前的路径，用于日志记录
    const originalPaths = {}

    // 处理所有文件上传
    for (const field of fileFields) {
      if (!formDataToSubmit[field]) {
        console.log(`${field}: 无文件路径`)
        continue
      }

      originalPaths[field] = formDataToSubmit[field]
      console.log(`检查${field}文件路径:`, formDataToSubmit[field])

      // 处理单个文件
      if (field === 'idCardFront' || field === 'idCardBack' || field === 'qualification') {
        if (!isLocalPath(formDataToSubmit[field])) {
          console.log(`${field}: 不是本地路径，跳过上传`)
          continue
        }

        console.log(`${field}: 是本地路径，需要上传`)
        uploadPromises.push(
          uploadFile(formDataToSubmit[field], field).then((fileID) => {
            formDataToSubmit[field] = fileID
            console.log(`${field}上传成功: ${fileID}`)
          }),
        )
      }
      // 处理多个文件（逗号分隔的情况）
      else if (formDataToSubmit[field].includes(',')) {
        const paths = formDataToSubmit[field].split(',')
        const uploadedPaths: string[] = []
        let hasLocalFiles = false

        console.log(`${field}: 包含多个文件路径:`, paths)

        for (let i = 0; i < paths.length; i++) {
          const path = paths[i].trim()
          if (!path) {
            uploadedPaths[i] = ''
            continue
          }

          console.log(`${field}[${i}]: 检查路径 ${path}`)
          if (isLocalPath(path)) {
            console.log(`${field}[${i}]: 是本地路径，需要上传`)
            hasLocalFiles = true
            uploadPromises.push(
              uploadFile(path, `${field}_${i}`).then((fileID) => {
                uploadedPaths[i] = fileID as string
                console.log(`${field}_${i}上传成功: ${fileID}`)
              }),
            )
          } else {
            console.log(`${field}[${i}]: 不是本地路径，跳过上传`)
            uploadedPaths[i] = path // 保留原路径
          }
        }

        // 如果存在本地文件，等待上传完成后更新路径
        if (hasLocalFiles) {
          // 修正这里的逻辑，不要重复添加Promise
          const fieldPromise = Promise.all(uploadPromises).then(() => {
            const filePaths = uploadedPaths.filter(Boolean).join(',')
            formDataToSubmit[field] = filePaths
            console.log(`${field}更新为: ${filePaths}`)
          })

          // 确保fieldPromise也被添加到uploadPromises中
          if (!uploadPromises.includes(fieldPromise)) {
            uploadPromises.push(fieldPromise)
          }
        }
      } else {
        // 处理单个文件但不是idCardFront/idCardBack/qualification的情况
        if (isLocalPath(formDataToSubmit[field])) {
          console.log(`${field}: 是本地路径，需要上传`)
          uploadPromises.push(
            uploadFile(formDataToSubmit[field], field).then((fileID) => {
              formDataToSubmit[field] = fileID
              console.log(`${field}上传成功: ${fileID}`)
            }),
          )
        } else {
          console.log(`${field}: 不是本地路径，跳过上传`)
        }
      }
    }

    // 检查isLocalPath函数是否正常工作
    console.log('isLocalPath函数测试:')
    console.log('wxfile://temp: ', isLocalPath('wxfile://temp'))
    console.log('http://tmp: ', isLocalPath('http://tmp'))
    console.log('file_123: ', isLocalPath('file_123'))
    console.log('cloud://: ', isLocalPath('cloud://xxx'))

    // 等待所有文件上传完成
    if (uploadPromises.length > 0) {
      console.log(`开始上传${uploadPromises.length}个文件...`)
      await Promise.all(uploadPromises)
      console.log('所有文件上传完成!')

      // 记录上传前后的路径变化
      console.log('文件路径变化:', {
        original: originalPaths,
        uploaded: {
          idCardFront: formDataToSubmit.idCardFront,
          idCardBack: formDataToSubmit.idCardBack,
          qualification: formDataToSubmit.qualification,
          education: formDataToSubmit.education,
          professional: formDataToSubmit.professional,
          honor: formDataToSubmit.honor,
        },
      })
    } else {
      console.log('没有需要上传的文件，原因可能是:')
      console.log('1. 文件路径已经是云存储路径')
      console.log('2. 没有设置文件路径')
      console.log('3. isLocalPath函数未能正确识别本地路径')
    }

    // 调用云函数提交数据（这时formDataToSubmit中的文件路径已经是云存储fileID）
    const { result } = await uni.cloud.callFunction({
      name: 'profRegister',
      data: {
        action: 'submit',
        ...formDataToSubmit,
      },
    })

    // 隐藏加载提示
    uni.hideLoading()

    if (result.success) {
      // 更新本地用户状态
      const currentUserInfo = userStore.userInfo || {}
      userStore.setUserInfo({
        ...currentUserInfo,
        professionalStatus: 'pending',
        professionalId: result.professionalId,
        updateTime: new Date().getTime(),
      })

      // 打印用户状态更新后的信息
      console.log('用户状态已更新:', {
        professionalStatus: 'pending',
        professionalId: result.professionalId,
        updateTime: new Date().getTime(),
      })

      // 更新全局状态
      registerStore.updateStep4({
        status: 'pending',
      })

      // 清空其他注册数据，但保留提交状态
      // 注意：不要完全清空，否则预览页将无法显示

      // 显示成功提示
      uni.showToast({
        title: '提交成功',
        icon: 'success',
      })

      // 延迟跳转到第五页，使用navigateTo
      setTimeout(() => {
        uni.navigateTo({
          url: '/pages/weshares/index/index',
        })
      }, 1500)
    } else {
      throw new Error(result.message || '提交失败')
    }
  } catch (error: any) {
    // 隐藏加载提示
    uni.hideLoading()

    // 显示错误提示
    uni.showToast({
      title: error.message || '提交失败，请重试',
      icon: 'none',
    })
  }
}
</script>

<style lang="scss" scoped>
// 基础样式
.label {
  margin-bottom: 8rpx;
  font-size: 28rpx;
  color: #666;
}

.preview-container {
  .preview-section {
    margin-bottom: 30rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10rpx;
      margin-bottom: 20rpx;
      background-color: #fff;
      border-radius: 12rpx;

      .section-title {
        font-size: 32rpx;
        font-weight: 500;
        color: #333;
      }
    }

    .info-group {
      padding: 20rpx;
      background-color: #fff;
      border-radius: 12rpx;

      .info-item {
        margin-bottom: 20rpx;

        &:last-child {
          margin-bottom: 0;
        }

        .label {
          // 继承基础样式
        }

        .value {
          font-size: 30rpx;
          line-height: 1.5;
          color: #333;
        }
      }
    }
  }

  .upload-status {
    padding: 20rpx;
    margin-bottom: 30rpx;
    background-color: #fff;
    border-radius: 12rpx;

    .status-item {
      margin-bottom: 20rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        // 继承基础样式
      }

      .status {
        font-size: 30rpx;
        line-height: 1.5;
        color: #333;

        &.uploaded {
          color: #07c160;
        }

        &.cached {
          color: #ff9900;
        }
      }
    }
  }

  .agreement-section {
    padding: 20rpx;
    margin-bottom: 30rpx;
    background-color: #fff;
    border-radius: 12rpx;

    .agreement-title {
      margin-bottom: 20rpx;
      font-size: 28rpx;
      font-weight: 500;
      color: #333;
    }

    .agreement-content {
      height: 300rpx;
      padding: 20rpx;
      margin-bottom: 20rpx;
      background-color: #f8f8f8;
      border-radius: 8rpx;

      .agreement-text {
        font-size: 24rpx;
        line-height: 1.6;
        color: #666;
      }
    }

    .agreement-checkbox {
      display: flex;
      align-items: center;
      justify-content: center;

      .checkbox-label {
        margin-left: 10rpx;
        font-size: 24rpx;
        color: #666;
      }
    }
  }

  .submit-notice {
    padding: 20rpx;
    margin-bottom: 30rpx;
    background-color: #fff;
    border-radius: 12rpx;

    .notice-text {
      font-size: 28rpx;
      color: #666;
    }
  }
}

.tags-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 8rpx;

  .tag {
    position: relative;
    display: flex;
    align-items: center;
    padding: 12rpx 24rpx;
    overflow: hidden;
    font-size: 26rpx;
    color: #fff;
    background-color: #07c160;
    border: 2rpx solid #07c160;
    border-radius: 30rpx;

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      content: '';
      background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
      border-radius: 30rpx;
    }

    &::after {
      margin-left: 8rpx;
      font-size: 24rpx;
      content: '✓';
    }
  }
}

.image-preview-container {
  padding: 16rpx;
  margin-top: 16rpx;
  background-color: #f8f8f8;
  border-radius: 8rpx;

  .image-preview-list {
    display: flex;
    flex-wrap: nowrap;
  }

  .preview-item {
    position: relative;
    width: 160rpx;
    height: 160rpx;
    margin-right: 16rpx;
    overflow: hidden;
    border-radius: 8rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

    &:last-child {
      margin-right: 0;
    }

    .preview-label {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      padding: 4rpx 8rpx;
      font-size: 20rpx;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 0 0 8rpx 0;
    }

    .preview-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.id-card-container {
  padding: 16rpx;
  margin-top: 16rpx;
  background-color: #f8f8f8;
  border-radius: 8rpx;

  .id-card-preview {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .preview-item {
      position: relative;
      width: 48%;
      height: 180rpx;
      overflow: hidden;
      border-radius: 8rpx;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

      .preview-label {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        padding: 4rpx 8rpx;
        font-size: 20rpx;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 0 0 8rpx 0;
      }

      .preview-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}

// 添加审核状态条样式
.status-banner {
  display: flex;
  align-items: center;
  padding: 30rpx;
  margin-bottom: 30rpx;
  background: linear-gradient(45deg, #fdf0cc, #f7e8b0);
  border-radius: 12rpx;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);

  .status-icon {
    margin-right: 20rpx;
    font-size: 64rpx;
    color: #f1c40f;
  }

  .status-info {
    flex: 1;

    .status-title {
      margin-bottom: 6rpx;
      font-size: 32rpx;
      font-weight: 600;
      color: #7d6608;
    }

    .status-desc {
      margin-bottom: 10rpx;
      font-size: 24rpx;
      color: #8c7811;
    }

    .modify-link {
      display: inline-block;
      padding: 8rpx 20rpx;
      margin-top: 10rpx;
      font-size: 24rpx;
      color: #fff;
      background-color: #f1c40f;
      border-radius: 30rpx;
      box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
    }
  }
}

// 审核进度样式
.review-progress {
  display: flex;
  flex-direction: column;
  padding: 20rpx 10rpx;

  .progress-step {
    position: relative;
    display: flex;
    align-items: flex-start;
    padding-left: 20rpx;
    margin-bottom: 40rpx;

    &:last-child {
      margin-bottom: 0;
    }

    &:not(:last-child):before {
      position: absolute;
      top: 24rpx;
      left: 12rpx;
      z-index: 0;
      width: 2rpx;
      height: calc(100% + 16rpx);
      content: '';
      background-color: #e0e0e0;
    }

    .step-dot {
      position: relative;
      z-index: 1;
      width: 24rpx;
      height: 24rpx;
      margin-right: 20rpx;
      background-color: #fff;
      border: 2rpx solid #ccc;
      border-radius: 50%;
    }

    &.active {
      .step-dot {
        background-color: #07c160;
        border-color: #07c160;
      }

      .step-title {
        font-weight: 500;
        color: #07c160;
      }

      &:not(:last-child):before {
        background-color: #07c160;
      }
    }

    .step-info {
      flex: 1;

      .step-title {
        margin-bottom: 4rpx;
        font-size: 28rpx;
        color: #333;
      }

      .step-time {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

.review-tips {
  padding: 20rpx;
  margin-top: 30rpx;
  background-color: #f8f8f8;
  border-radius: 8rpx;

  text {
    display: block;
    font-size: 24rpx;
    line-height: 1.6;
    color: #666;
  }
}

// 修改确认弹窗样式
.modify-confirm-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10100;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.65);
}

.modify-confirm-dialog {
  position: relative;
  z-index: 10500;
  width: 80%;
  max-width: 600rpx;
  padding: 40rpx;
  background-color: #fff;
  border: 3rpx solid #07c160;
  border-radius: 16rpx;
  box-shadow: 0 12rpx 36rpx rgba(0, 0, 0, 0.25);
}

.modify-confirm-title {
  padding-bottom: 15rpx;
  margin-bottom: 30rpx;
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  text-align: center;
  border-bottom: 1rpx solid #eee;
}

.modify-confirm-content {
  margin-bottom: 40rpx;
  font-size: 28rpx;
  font-weight: 500;
  line-height: 1.6;
  color: #666;
  text-align: center;

  text {
    display: block;
    margin-bottom: 10rpx;
  }

  .warning-text {
    margin-top: 16rpx;
    font-size: 26rpx;
    font-weight: bold;
    color: #ff6b00;
  }
}

.modify-confirm-buttons {
  display: flex;
  justify-content: space-between;

  button {
    flex: 1;
    padding: 16rpx 0;
    margin: 0 10rpx;
    font-size: 28rpx;
    border-radius: 8rpx;
  }

  .cancel-btn {
    color: #666;
    background-color: #f2f2f2;
    border: 1rpx solid #ddd;
  }

  .confirm-btn {
    font-weight: bold;
    color: #fff;
    background-color: #07c160;
    border: 1rpx solid #07c160;
  }
}

// 确保底部按钮上面没有覆盖物
.page-container {
  padding-bottom: 150rpx;
}

// 添加备用修改按钮，确保用户可以点击
.edit-button-floating {
  position: fixed;
  top: 180rpx;
  right: 20rpx;
  z-index: 10002;
  padding: 15rpx 25rpx;
  font-size: 28rpx;
  font-weight: bold;
  color: #fff;
  background-color: #07c160;
  border-radius: 50rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.25);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.25);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.3);
    transform: scale(1.05);
  }
  100% {
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.25);
    transform: scale(1);
  }
}
</style>
