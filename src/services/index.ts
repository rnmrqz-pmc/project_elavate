import { App } from 'vue'
import { authService } from './authService'

// ---- Combined API ----
const api = {
  ...authService,
}

// ---- Vue Plugin ----
export default {
  install: (app: App) => {
    app.config.globalProperties.$api = api
  }
}

export type ApiType = typeof api
