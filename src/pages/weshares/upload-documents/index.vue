<route lang="json5" type="page">
{
  style: { navigationBarTitleText: '专业人士注册' },
}
</route>

<template>
  <view class="container">
    <view class="form-container">
      <view class="form-group">
        <view class="form-title">
          <text class="required">*</text>
          <text>个人展示</text>
        </view>
        <view class="textarea-container" :class="{ 'error-input': v$.personalIntro.$error }">
          <textarea
            class="form-textarea"
            placeholder="请输入个人介绍、教学特色等信息"
            v-model="form.personalIntro"
          ></textarea>
        </view>
        <text v-if="v$.personalIntro.$error" class="error-text">
          {{ v$.personalIntro.$errors[0].$message }}
        </text>
      </view>

      <view class="form-group">
        <view class="form-title">
          <text class="required">*</text>
          <text>身份证</text>
          <view
            class="backup-btn"
            @click="backupUpload('idCardFront', false)"
            v-if="!form.idCardFront"
          >
            备用上传
          </view>
        </view>
        <view class="document-upload">
          <view
            class="id-front"
            :class="{ 'error-input': v$.idCardFront.$error }"
            @click="chooseIdCardFront"
          >
            <image
              v-if="form.idCardFront"
              class="id-front-img"
              :src="form.idCardFront"
              mode="aspectFit"
              @click.stop="previewImage(form.idCardFront)"
            />
            <text v-if="!form.idCardFront">点击上传正面</text>
            <view v-if="form.idCardFront" class="delete-icon" @click.stop="removeIdCardFront">
              ×
            </view>
          </view>
          <view
            class="id-back"
            :class="{ 'error-input': v$.idCardBack.$error }"
            @click="chooseIdCardBack"
          >
            <image
              v-if="form.idCardBack"
              class="id-back-img"
              :src="form.idCardBack"
              mode="aspectFit"
              @click.stop="previewImage(form.idCardBack)"
            />
            <text v-if="!form.idCardBack">点击上传反面</text>
            <view v-if="form.idCardBack" class="delete-icon" @click.stop="removeIdCardBack">×</view>
          </view>
        </view>
        <view class="backup-actions" v-if="!form.idCardBack">
          <view class="backup-btn" @click="backupUpload('idCardBack', false)">备用上传</view>
        </view>
        <text v-if="v$.idCardFront.$error || v$.idCardBack.$error" class="error-text">
          请上传身份证正反面照片
        </text>
      </view>

      <view class="form-group">
        <view class="form-title">
          <text>学历证书</text>
          <text class="action-text">选填</text>
          <view class="backup-btn" @click="backupUpload('educationCert')">备用上传</view>
        </view>
        <view class="document-upload">
          <view class="upload-box" @click="chooseEducationCert">
            <text v-if="form.educationCerts.length > 0" class="cert-count">
              已上传{{ form.educationCerts.length }}张
            </text>
            <text v-else class="upload-icon">+</text>
          </view>
          <scroll-view v-if="form.educationCerts.length > 0" class="cert-scroll-view" scroll-x>
            <view class="cert-list">
              <view v-for="(cert, index) in form.educationCerts" :key="index" class="cert-item">
                <image
                  class="cert-img"
                  :src="cert"
                  mode="aspectFill"
                  @click="previewCertImages('educationCerts', index)"
                />
                <view class="delete-icon" @click.stop="removeCert('educationCerts', index)">×</view>
              </view>
            </view>
          </scroll-view>
        </view>
        <view class="upload-tip">
          <text>图片最多上传9张</text>
        </view>
      </view>

      <view class="form-group">
        <view class="form-title">
          <text>职业证书</text>
          <text class="action-text">选填</text>
          <view class="backup-btn" @click="backupUpload('professionalCert')">备用上传</view>
        </view>
        <view class="document-upload">
          <view class="upload-box" @click="chooseProfessionalCert">
            <text v-if="form.professionalCerts.length > 0" class="cert-count">
              已上传{{ form.professionalCerts.length }}张
            </text>
            <text v-else class="upload-icon">+</text>
          </view>
          <scroll-view v-if="form.professionalCerts.length > 0" class="cert-scroll-view" scroll-x>
            <view class="cert-list">
              <view v-for="(cert, index) in form.professionalCerts" :key="index" class="cert-item">
                <image
                  class="cert-img"
                  :src="cert"
                  mode="aspectFill"
                  @click="previewCertImages('professionalCerts', index)"
                />
                <view class="delete-icon" @click.stop="removeCert('professionalCerts', index)">
                  ×
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
        <view class="upload-tip">
          <text>图片最多上传9张</text>
        </view>
      </view>

      <view class="form-group">
        <view class="form-title">
          <text>荣誉证书</text>
          <text class="action-text">选填</text>
          <view class="backup-btn" @click="backupUpload('honorCert')">备用上传</view>
        </view>
        <view class="document-upload">
          <view class="upload-box" @click="chooseHonorCert">
            <text v-if="form.honorCerts.length > 0" class="cert-count">
              已上传{{ form.honorCerts.length }}张
            </text>
            <text v-else class="upload-icon">+</text>
          </view>
          <scroll-view v-if="form.honorCerts.length > 0" class="cert-scroll-view" scroll-x>
            <view class="cert-list">
              <view v-for="(cert, index) in form.honorCerts" :key="index" class="cert-item">
                <image
                  class="cert-img"
                  :src="cert"
                  mode="aspectFill"
                  @click="previewCertImages('honorCerts', index)"
                />
                <view class="delete-icon" @click.stop="removeCert('honorCerts', index)">×</view>
              </view>
            </view>
          </scroll-view>
        </view>
        <view class="upload-tip">
          <text>图片最多上传9张</text>
        </view>
      </view>
    </view>

    <view class="button-group">
      <view class="prev-button" @click="goBack">
        <text>上一步</text>
      </view>
      <view class="next-button" @click="submitForm">
        <text>{{ submitting ? '提交中...' : '下一步' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, minLength } from '@vuelidate/validators'
import PageHeader from '../../../components/PageHeader/PageHeader.vue'
import useUpload from '../../../hooks/useUpload'

// 表单数据
const form = reactive({
  personalIntro: '',
  idCardFront: '',
  idCardBack: '',
  educationCerts: [],
  professionalCerts: [],
  honorCerts: [],
})

// 表单验证规则
const rules = computed(() => {
  return {
    personalIntro: {
      required: helpers.withMessage('请输入个人介绍', required),
      minLength: helpers.withMessage('个人介绍至少10个字符', minLength(10)),
    },
    idCardFront: { required: helpers.withMessage('请上传身份证正面照片', required) },
    idCardBack: { required: helpers.withMessage('请上传身份证反面照片', required) },
  }
})

// 初始化Vuelidate
const v$ = useVuelidate(rules, form)

// 是否正在提交
const submitting = ref(false)

// 选择身份证正面照片
function chooseIdCardFront() {
  const { run, loading, error, data } = useUpload({ type: 'idCardFront' })

  // 先显示loading
  uni.showLoading({
    title: '上传中...',
  })

  // 执行上传
  run()

  // 创建一次性监听器，避免重复监听
  const unwatch = uni.$watch(
    () => loading.value,
    (newValue) => {
      if (!newValue) {
        // 隐藏loading
        uni.hideLoading()

        // 处理上传结果
        if (error.value) {
          uni.showToast({
            title: '上传失败，请重试',
            icon: 'none',
          })
        } else if (data.value) {
          try {
            // 尝试解析响应数据
            console.log('上传响应:', data.value)
            let result
            if (typeof data.value === 'string') {
              result = JSON.parse(data.value)
            } else {
              result = data.value
            }

            // 获取URL（根据实际API响应结构调整）
            const url = result.url || (result.data && result.data.url)

            if (url) {
              form.idCardFront = url
              uni.showToast({
                title: '上传成功',
                icon: 'success',
              })
            } else {
              throw new Error('未找到图片URL')
            }
          } catch (e) {
            console.error('解析上传响应出错:', e, data.value)
            uni.showToast({
              title: '上传失败，请重试',
              icon: 'none',
            })
          }
        }

        // 取消监听避免内存泄漏
        unwatch()
      }
    },
    { immediate: true },
  )
}

// 选择身份证反面照片
function chooseIdCardBack() {
  const { run, loading, error, data } = useUpload({ type: 'idCardBack' })

  // 先显示loading
  uni.showLoading({
    title: '上传中...',
  })

  // 执行上传
  run()

  // 创建一次性监听器，避免重复监听
  const unwatch = uni.$watch(
    () => loading.value,
    (newValue) => {
      if (!newValue) {
        // 隐藏loading
        uni.hideLoading()

        // 处理上传结果
        if (error.value) {
          uni.showToast({
            title: '上传失败，请重试',
            icon: 'none',
          })
        } else if (data.value) {
          try {
            // 尝试解析响应数据
            console.log('上传响应:', data.value)
            let result
            if (typeof data.value === 'string') {
              result = JSON.parse(data.value)
            } else {
              result = data.value
            }

            // 获取URL（根据实际API响应结构调整）
            const url = result.url || (result.data && result.data.url)

            if (url) {
              form.idCardBack = url
              uni.showToast({
                title: '上传成功',
                icon: 'success',
              })
            } else {
              throw new Error('未找到图片URL')
            }
          } catch (e) {
            console.error('解析上传响应出错:', e, data.value)
            uni.showToast({
              title: '上传失败，请重试',
              icon: 'none',
            })
          }
        }

        // 取消监听避免内存泄漏
        unwatch()
      }
    },
    { immediate: true },
  )
}

// 选择学历证书
function chooseEducationCert() {
  if (form.educationCerts.length >= 9) {
    uni.showToast({
      title: '最多上传9张图片',
      icon: 'none',
    })
    return
  }

  const { run, loading, error, data } = useUpload({ type: 'educationCert' })

  // 先显示loading
  uni.showLoading({
    title: '上传中...',
  })

  // 执行上传
  run()

  // 创建一次性监听器，避免重复监听
  const unwatch = uni.$watch(
    () => loading.value,
    (newValue) => {
      if (!newValue) {
        // 隐藏loading
        uni.hideLoading()

        // 处理上传结果
        if (error.value) {
          uni.showToast({
            title: '上传失败，请重试',
            icon: 'none',
          })
        } else if (data.value) {
          try {
            // 尝试解析响应数据
            console.log('上传响应:', data.value)
            let result
            if (typeof data.value === 'string') {
              result = JSON.parse(data.value)
            } else {
              result = data.value
            }

            // 获取URL（根据实际API响应结构调整）
            const url = result.url || (result.data && result.data.url)

            if (url) {
              form.educationCerts.push(url)
              uni.showToast({
                title: '上传成功',
                icon: 'success',
              })
            } else {
              throw new Error('未找到图片URL')
            }
          } catch (e) {
            console.error('解析上传响应出错:', e, data.value)
            uni.showToast({
              title: '上传失败，请重试',
              icon: 'none',
            })
          }
        }

        // 取消监听避免内存泄漏
        unwatch()
      }
    },
    { immediate: true },
  )
}

// 选择职业证书
function chooseProfessionalCert() {
  if (form.professionalCerts.length >= 9) {
    uni.showToast({
      title: '最多上传9张图片',
      icon: 'none',
    })
    return
  }

  const { run, loading, error, data } = useUpload({ type: 'professionalCert' })

  // 先显示loading
  uni.showLoading({
    title: '上传中...',
  })

  // 执行上传
  run()

  // 创建一次性监听器，避免重复监听
  const unwatch = uni.$watch(
    () => loading.value,
    (newValue) => {
      if (!newValue) {
        // 隐藏loading
        uni.hideLoading()

        // 处理上传结果
        if (error.value) {
          uni.showToast({
            title: '上传失败，请重试',
            icon: 'none',
          })
        } else if (data.value) {
          try {
            // 尝试解析响应数据
            console.log('上传响应:', data.value)
            let result
            if (typeof data.value === 'string') {
              result = JSON.parse(data.value)
            } else {
              result = data.value
            }

            // 获取URL（根据实际API响应结构调整）
            const url = result.url || (result.data && result.data.url)

            if (url) {
              form.professionalCerts.push(url)
              uni.showToast({
                title: '上传成功',
                icon: 'success',
              })
            } else {
              throw new Error('未找到图片URL')
            }
          } catch (e) {
            console.error('解析上传响应出错:', e, data.value)
            uni.showToast({
              title: '上传失败，请重试',
              icon: 'none',
            })
          }
        }

        // 取消监听避免内存泄漏
        unwatch()
      }
    },
    { immediate: true },
  )
}

// 选择荣誉证书
function chooseHonorCert() {
  if (form.honorCerts.length >= 9) {
    uni.showToast({
      title: '最多上传9张图片',
      icon: 'none',
    })
    return
  }

  const { run, loading, error, data } = useUpload({ type: 'honorCert' })

  // 先显示loading
  uni.showLoading({
    title: '上传中...',
  })

  // 执行上传
  run()

  // 创建一次性监听器，避免重复监听
  const unwatch = uni.$watch(
    () => loading.value,
    (newValue) => {
      if (!newValue) {
        // 隐藏loading
        uni.hideLoading()

        // 处理上传结果
        if (error.value) {
          uni.showToast({
            title: '上传失败，请重试',
            icon: 'none',
          })
        } else if (data.value) {
          try {
            // 尝试解析响应数据
            console.log('上传响应:', data.value)
            let result
            if (typeof data.value === 'string') {
              result = JSON.parse(data.value)
            } else {
              result = data.value
            }

            // 获取URL（根据实际API响应结构调整）
            const url = result.url || (result.data && result.data.url)

            if (url) {
              form.honorCerts.push(url)
              uni.showToast({
                title: '上传成功',
                icon: 'success',
              })
            } else {
              throw new Error('未找到图片URL')
            }
          } catch (e) {
            console.error('解析上传响应出错:', e, data.value)
            uni.showToast({
              title: '上传失败，请重试',
              icon: 'none',
            })
          }
        }

        // 取消监听避免内存泄漏
        unwatch()
      }
    },
    { immediate: true },
  )
}

// 返回上一步
function goBack() {
  console.log('返回上一步')
  // 返回到基本信息页面
  uni.navigateBack()
}

// 提交表单
async function submitForm() {
  const isFormValid = await v$.value.$validate()

  if (!isFormValid) {
    uni.showToast({
      title: '请正确填写所有必填项',
      icon: 'none',
    })
    return
  }

  submitting.value = true

  try {
    // 获取用户ID，实际项目中可能从状态管理中获取
    const userId = uni.getStorageSync('userId') || 'defaultUserId'

    // 构建提交数据
    const submitData = {
      userId,
      personalIntro: form.personalIntro,
      documents: {
        idCardFront: form.idCardFront,
        idCardBack: form.idCardBack,
        educationCerts: form.educationCerts,
        professionalCerts: form.professionalCerts,
        honorCerts: form.honorCerts,
      },
    }

    // 在实际应用中应该调用API提交数据
    // 这里模拟API调用
    // const response = await uni.$api.teacher.uploadDocuments(submitData)

    // 模拟API成功响应
    console.log('提交的数据:', submitData)

    // 存储到本地以便于测试
    uni.setStorageSync('teacherRegistrationDocuments', JSON.stringify(form))

    // 显示成功提示
    uni.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 2000,
    })

    // 延迟跳转，让用户看到成功提示
    setTimeout(() => {
      // 跳转到下一步
      uni.navigateTo({
        url: '/pages/weshares/registration-complete/index',
      })
    }, 1500)
  } catch (error) {
    console.error('提交失败:', error)
    uni.showToast({
      title: '提交失败，请重试',
      icon: 'none',
    })
  } finally {
    submitting.value = false
  }
}

// 备用上传方法，直接使用uni.chooseImage和uni.uploadFile，不依赖钩子
function backupUpload(certType, isArray = true) {
  const config = {
    idCardFront: { title: '身份证正面' },
    idCardBack: { title: '身份证反面' },
    educationCert: { title: '学历证书' },
    professionalCert: { title: '职业证书' },
    honorCert: { title: '荣誉证书' },
  }

  console.log(`使用备用方式上传${config[certType].title}`)

  // 进行图片选择
  uni.chooseImage({
    count: 1,
    success: function (res) {
      const tempFilePath = res.tempFilePaths[0]
      console.log('选择图片成功:', tempFilePath)

      uni.showLoading({
        title: '上传中...',
      })

      // 直接上传文件
      uni.uploadFile({
        url: import.meta.env.VITE_UPLOAD_BASEURL || 'https://ukw0y1.laf.run/upload',
        filePath: tempFilePath,
        name: 'file',
        formData: {
          type: certType,
        },
        success: function (uploadRes) {
          console.log('上传成功，响应:', uploadRes)
          try {
            // 解析响应
            let result
            if (typeof uploadRes.data === 'string') {
              result = JSON.parse(uploadRes.data)
            } else {
              result = uploadRes.data
            }

            // 提取URL
            const url = result.url || (result.data && result.data.url)

            if (url) {
              // 更新表单数据
              if (isArray) {
                form[certType].push(url)
              } else {
                form[certType] = url
              }

              uni.showToast({
                title: '上传成功',
                icon: 'success',
              })
            } else {
              throw new Error('未找到图片URL')
            }
          } catch (e) {
            console.error('处理上传响应出错:', e)
            uni.showToast({
              title: '上传失败，请重试',
              icon: 'none',
            })
          }
        },
        fail: function (err) {
          console.error('上传失败:', err)
          uni.showToast({
            title: '上传失败，请重试',
            icon: 'none',
          })
        },
        complete: function () {
          uni.hideLoading()
        },
      })
    },
    fail: function (err) {
      console.error('选择图片失败:', err)
      uni.showToast({
        title: '选择图片失败',
        icon: 'none',
      })
    },
  })
}

// 移除身份证正面照片
function removeIdCardFront() {
  uni.showModal({
    title: '提示',
    content: '确定要删除此照片吗？',
    success: (res) => {
      if (res.confirm) {
        form.idCardFront = ''
        uni.showToast({
          title: '已删除',
          icon: 'success',
        })
      }
    },
  })
}

// 移除身份证反面照片
function removeIdCardBack() {
  uni.showModal({
    title: '提示',
    content: '确定要删除此照片吗？',
    success: (res) => {
      if (res.confirm) {
        form.idCardBack = ''
        uni.showToast({
          title: '已删除',
          icon: 'success',
        })
      }
    },
  })
}

// 移除证书照片
function removeCert(certType, index) {
  uni.showModal({
    title: '提示',
    content: '确定要删除此照片吗？',
    success: (res) => {
      if (res.confirm) {
        form[certType].splice(index, 1)
        uni.showToast({
          title: '已删除',
          icon: 'success',
        })
      }
    },
  })
}

// 预览单张图片
function previewImage(url) {
  uni.previewImage({
    urls: [url],
    current: url,
  })
}

// 预览证书图片集合
function previewCertImages(certType, index) {
  uni.previewImage({
    urls: form[certType],
    current: form[certType][index],
  })
}
</script>

<style>
.document-upload {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.id-front,
.id-back {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 150px;
  overflow: hidden;
  background-color: #f9f9f9;
  border: 1px dashed #ccc;
  border-radius: 8px;
}

.id-front-img,
.id-back-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-box {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background-color: #f9f9f9;
  border: 1px dashed #ccc;
  border-radius: 8px;
}

.upload-icon {
  font-size: 30px;
  color: #ccc;
}

.cert-count {
  font-size: 14px;
  color: #666;
}

.cert-scroll-view {
  flex: 1;
  width: 100%;
  white-space: nowrap;
}

.cert-list {
  display: flex;
  padding: 10px 0;
}

.cert-item {
  position: relative;
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  margin-right: 10px;
  overflow: hidden;
  border-radius: 8px;
}

.cert-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete-icon {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 0 0 0 8px;
}

.upload-tip {
  margin-top: 5px;
  font-size: 12px;
  color: #999;
}

.error-input {
  border-color: #ff6b6b;
}

.error-text {
  margin-top: 5px;
  font-size: 12px;
  color: #ff6b6b;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 30px;
}

.prev-button,
.next-button {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 44px;
  font-size: 16px;
  border-radius: 8px;
}

.prev-button {
  color: #666;
  background-color: #f5f5f5;
}

.next-button {
  color: #fff;
  background-color: #5bbdca;
}

.form-textarea {
  box-sizing: border-box;
  width: 100%;
  height: 120px;
  padding: 10px;
  font-size: 14px;
  line-height: 1.6;
  border: 1px solid #eee;
  border-radius: 8px;
}

.textarea-container {
  margin-top: 10px;
}

.form-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
}

.required {
  margin-right: 5px;
  color: #ff6b6b;
}

.action-text {
  margin-left: auto;
  font-size: 12px;
  font-weight: normal;
  color: #999;
}

.form-group {
  margin-bottom: 20px;
}

.container {
  padding: 20px;
}

.backup-btn {
  padding: 2px 8px;
  margin-left: auto;
  font-size: 12px;
  color: #409eff;
  cursor: pointer;
  background-color: #ecf5ff;
  border: 1px solid #d9ecff;
  border-radius: 4px;
}

.backup-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}
</style>
