import 'tailwindcss/tailwind.css'
// You can also handle this via your index.html or a CSS import
// Import Google Font - Noto Sans SC
import '@fortawesome/fontawesome-free/css/all.min.css'
// Import FontAwesome if not already included

import { createSSRApp } from 'vue'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  return {
    app,
  }
}
