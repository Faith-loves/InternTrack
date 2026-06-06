import axios from 'axios'
import { clearSession, getStoredRefreshToken, getStoredToken, saveSession } from '../utils/authStorage'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getStoredToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest?._retry) {
      const refreshToken = getStoredRefreshToken()

      if (refreshToken) {
        originalRequest._retry = true

        try {
          const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken })
          saveSession(data.token, data.user, data.refreshToken)
          originalRequest.headers.Authorization = `Bearer ${data.token}`
          return api(originalRequest)
        } catch {
          clearSession()
        }
      } else {
        clearSession()
      }
    } else if (error.response?.status === 401) {
      clearSession()
    }

    return Promise.reject(error)
  },
)

export function getApiErrorMessage(error, fallback = 'Something went wrong') {
  return error.response?.data?.message || fallback
}

export default api
