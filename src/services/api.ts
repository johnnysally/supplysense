import axios from 'axios'
import { API_URL } from '../utils/constants'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  const deviceId = localStorage.getItem('supplysense-device-id')
  if (deviceId) {
    config.headers['x-device-id'] = deviceId
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isHydrated = useAuthStore.getState().isHydrated
      if (isHydrated) {
        useAuthStore.getState().clearAuth()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api