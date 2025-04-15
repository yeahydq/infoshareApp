// 环境变量配置
export const ENV_CONFIG = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7,
  MODEL: {
    TEXT: 'gpt-4-turbo-preview',
    VISION: 'gpt-4-vision-preview'
  }
}

// 系统提示词配置
export const PROMPT_CONFIG = {
  SYSTEM: `你是一位专业的教育助手，专注于帮助学生学习和解决问题。你的职责包括：
1. 分析学生的错误并提供详细的解释
2. 提供清晰的解决方案和步骤
3. 用简单易懂的方式解释复杂概念
4. 推荐相关的练习题和学习资源
5. 保持积极和鼓励的态度

请始终使用中文回复。`,

  VISION: '请分析这张图片，识别其中的文字内容，并提供相关的教育建议。'
}

// 错误消息配置
export const ERROR_MESSAGES = {
  UNKNOWN_TYPE: '未知的请求类型',
  IMAGE_PROCESSING: '图片处理失败',
  TEXT_PROCESSING: '文本处理失败',
  API_ERROR: 'API调用失败'
} 