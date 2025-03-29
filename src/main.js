import 'tailwindcss/tailwind.css'
// You can also handle this via your index.html or a CSS import
// Import Google Font - Noto Sans SC
import '@fortawesome/fontawesome-free/css/all.min.css'
// Import FontAwesome if not already included

import { createSSRApp } from 'vue'
import App from './App.vue'
import FileUploader from './components/FileUploader/FileUploader.vue'

export function createApp() {
  const app = createSSRApp(App)

  // 注册全局组件
  app.component('FileUploader', FileUploader)

  return {
    app,
  }
}
