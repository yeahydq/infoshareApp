import axios from 'axios'

// 专业人士列表接口参数
export interface ProfessionalListParams {
  page?: number
  pageSize?: number
  query?: string
  status?: string
  serviceType?: string
}

// 获取专业人士列表
export const getProfessionalList = async (params: ProfessionalListParams = {}) => {
  try {
    const response = await axios.get('/api/professionals', { params })
    return response.data
  } catch (error) {
    console.error('获取专业人士列表失败:', error)
    throw error
  }
}

// 获取专业人士详情
export const getProfessionalDetail = async (id: string) => {
  try {
    const response = await axios.get(`/api/professionals/${id}`)
    return response.data
  } catch (error) {
    console.error('获取专业人士详情失败:', error)
    throw error
  }
}

// 审核专业人士
export const reviewProfessional = async (id: string, status: string, remark?: string) => {
  try {
    const response = await axios.post(`/api/professionals/${id}/review`, {
      status,
      remark,
    })
    return response.data
  } catch (error) {
    console.error('审核专业人士失败:', error)
    throw error
  }
}

// 获取服务类型列表
export const getServiceTypes = async () => {
  try {
    const response = await axios.get('/api/professionals/serviceTypes')
    return response.data
  } catch (error) {
    console.error('获取服务类型列表失败:', error)
    throw error
  }
}

// 获取云存储文件的预签名URL
export const getCloudFileSignedUrl = async (url: string) => {
  try {
    const response = await axios.post('/api/cloud/getSignedUrl', { url })
    return response.data
  } catch (error) {
    console.error('获取预签名URL失败:', error)
    throw error
  }
}
