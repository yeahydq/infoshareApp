// TODO: 别忘加更改环境变量的 VITE_UPLOAD_BASEURL 地址。
import { getEnvBaseUploadUrl } from '@/utils'

const VITE_UPLOAD_BASEURL = `${getEnvBaseUploadUrl()}`
console.log('上传服务器地址:', VITE_UPLOAD_BASEURL)

/**
 * useUpload 是一个定制化的请求钩子，用于处理上传图片。
 * @param formData 额外传递给后台的数据，如{name: '菲鸽'}。
 * @returns 返回一个对象{loading, error, data, run}，包含请求的加载状态、错误信息、响应数据和手动触发请求的函数。
 */
export default function useUpload<T = string>(formData: Record<string, any> = {}) {
  const loading = ref(false)
  const error = ref(false)
  const data = ref<T>()

  const run = () => {
    console.log('开始选择图片上传, 附加数据:', formData)
    loading.value = true // 设置loading为true，确保状态正确

    // #ifdef MP-WEIXIN
    // 微信小程序从基础库 2.21.0 开始， wx.chooseImage 停止维护，请使用 uni.chooseMedia 代替。
    // 微信小程序在2023年10月17日之后，使用本API需要配置隐私协议
    uni.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: (res) => {
        console.log('选择图片成功:', res)
        const tempFilePath = res.tempFiles[0].tempFilePath
        uploadFile<T>({ tempFilePath, formData, data, error, loading })
      },
      fail: (err) => {
        console.error('uni.chooseMedia 选择图片失败:', err)
        error.value = true
        loading.value = false // 确保loading状态被重置
      },
    })
    // #endif
    // #ifndef MP-WEIXIN
    uni.chooseImage({
      count: 1,
      success: (res) => {
        console.log('选择图片成功:', res)
        const tempFilePath = res.tempFilePaths[0]
        uploadFile<T>({ tempFilePath, formData, data, error, loading })
      },
      fail: (err) => {
        console.error('uni.chooseImage 选择图片失败:', err)
        error.value = true
        loading.value = false // 确保loading状态被重置
      },
    })
    // #endif
  }

  return { loading, error, data, run }
}

function uploadFile<T>({ tempFilePath, formData, data, error, loading }) {
  console.log('开始上传文件:', tempFilePath)
  console.log('上传附加数据:', formData)

  uni.uploadFile({
    url: VITE_UPLOAD_BASEURL,
    filePath: tempFilePath,
    name: 'file',
    formData,
    success: (uploadFileRes) => {
      console.log('上传成功, 响应:', uploadFileRes)
      try {
        data.value = uploadFileRes.data as T
      } catch (e) {
        console.error('处理上传响应出错:', e)
        error.value = true
      }
    },
    fail: (err) => {
      console.error('文件上传失败:', err)
      error.value = true
    },
    complete: () => {
      console.log('上传完成，重置loading状态')
      loading.value = false // 确保loading状态被重置
    },
  })
}
