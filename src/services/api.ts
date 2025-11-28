import axios from 'axios'

// ---- Environment Variables ----
const BASE_API_LINK = import.meta.env.VITE_BASE_API as string

// ---- Axios Clients ----
export const apiClient = axios.create({
  baseURL: `${BASE_API_LINK}/api`,
  headers: {
    'Content-Type': 'application/json',
  }
})

// File upload client (uses multipart/form-data)
export const fileClient = axios.create({
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
