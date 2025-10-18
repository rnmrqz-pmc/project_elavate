import { App } from 'vue'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { encodeBase64, decodeBase64 } from '@/utils/base64'
import { decrypt, encrypt } from '@/utils/encryptDecrypt'
import { paramsGenerator } from '@/utils/paramsgenerator'


// ---- Environment Variables ----
const API_KEY = import.meta.env.VITE_API_KEY as string
const BASE_API_LINK = import.meta.env.VITE_BASE_API as string

const base64Key = encodeBase64(API_KEY)


// ---- Axios Clients ----
const apiClient = axios.create({
  baseURL: `${BASE_API_LINK}/api`, 
  headers: {
    'Content-Type': 'application/json',
  }
})
// File upload client (uses multipart/form-data)
const fileClient = axios.create({
  baseURL: `${BASE_API_LINK}/api`, 
  headers: {
    'Content-Type': 'multipart/form-data',
  }
})

// Attach auth token to every request (if available)
apiClient.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {  
      // config.headers['X-API-KEY'] = token
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle API response errors globally
apiClient.interceptors.response.use(
  (response) => {
    return Promise.resolve(response)
  },
  async (error) => {
    if (error.response) {
      const { status } = error.response
      if (status === 401 || status === 400) {
        localStorage.removeItem('user')
        localStorage.removeItem('details')
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth')

        alert('Your session has been expired. Please login again.')
        window.location.href = '/'
      }
      return Promise.reject(error)
    }
  }
)

// Attach token for file uploads as well
fileClient.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {  
      config.headers['X-API-KEY'] = token
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)



// ---- API Methods ----
const api = {
  // ---- Authentication ----
    async getStaging(payload: any): Promise<AxiosResponse<any>> {
        return apiClient.get<any>(`/auth/staging?${paramsGenerator(payload)}`)
    },


}


// ---- Vue Plugin ----
export default {
  install: (app: App) => {
    app.config.globalProperties.$api = api
  }
}

export type ApiType = typeof api
