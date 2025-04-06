// Element Plus类型声明
declare module 'element-plus' {
  import { Component } from 'vue'

  // 表单相关类型
  export interface FormInstance {
    validate: () => Promise<boolean>
    validateField: (fields: string | string[]) => Promise<boolean>
    resetFields: () => void
    scrollToField: (field: string) => void
    clearValidate: (fields?: string | string[]) => void
  }

  // 消息相关类型
  export const ElMessage: {
    success: (message: string) => void
    warning: (message: string) => void
    info: (message: string) => void
    error: (message: string) => void
  }

  // 组件相关类型
  const _default: Component
  export default _default
}

// Element Plus图标类型声明
declare module '@element-plus/icons-vue' {
  import { Component } from 'vue'
  const components: Record<string, Component>
  export = components
}
