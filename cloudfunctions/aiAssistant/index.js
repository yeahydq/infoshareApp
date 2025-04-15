// 云函数入口文件
import cloud from 'wx-server-sdk'
import { Configuration, OpenAIApi } from 'openai'
import { ENV_CONFIG, PROMPT_CONFIG, ERROR_MESSAGES } from './config.js'

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 初始化OpenAI配置
const configuration = new Configuration({
  apiKey: ENV_CONFIG.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

// 主函数
export async function main(event, _context) {
  try {
    const { type, content, base64Image } = event

    // 根据类型处理不同的请求
    if (type === 'image') {
      return await handleImageRecognition(base64Image)
    } else if (type === 'text') {
      return await handleTextConversation(content)
    } else {
      throw new Error(ERROR_MESSAGES.UNKNOWN_TYPE)
    }
  } catch (error) {
    console.error('处理请求时出错：', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// 处理图片识别
async function handleImageRecognition(base64Image) {
  try {
    // 调用OpenAI Vision模型
    const response = await openai.createChatCompletion({
      model: ENV_CONFIG.MODEL.VISION,
      messages: [
        {
          role: 'system',
          content: PROMPT_CONFIG.SYSTEM
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            },
            {
              type: 'text',
              text: PROMPT_CONFIG.VISION
            }
          ]
        }
      ],
      max_tokens: ENV_CONFIG.MAX_TOKENS
    })

    return {
      success: true,
      aiResponse: response.data.choices[0].message.content,
      recognizedText: '图片分析完成'
    }
  } catch (error) {
    console.error(ERROR_MESSAGES.IMAGE_PROCESSING + '：', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// 处理文本对话
async function handleTextConversation(content) {
  try {
    const response = await openai.createChatCompletion({
      model: ENV_CONFIG.MODEL.TEXT,
      messages: [
        {
          role: 'system',
          content: PROMPT_CONFIG.SYSTEM
        },
        {
          role: 'user',
          content: content
        }
      ],
      temperature: ENV_CONFIG.TEMPERATURE,
      max_tokens: ENV_CONFIG.MAX_TOKENS
    })

    return {
      success: true,
      aiResponse: response.data.choices[0].message.content
    }
  } catch (error) {
    console.error(ERROR_MESSAGES.TEXT_PROCESSING + '：', error)
    return {
      success: false,
      error: error.message
    }
  }
} 