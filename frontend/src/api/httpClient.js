import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const http = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

const refreshHttp = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

let getAccessToken = () => null
let refreshSession = async () => false
let refreshPromise = null

export function setAuthSessionHandlers(handlers) {
  getAccessToken = handlers.getAccessToken
  refreshSession = handlers.refreshSession
}

http.interceptors.request.use((config) => {
  const accessToken = getAccessToken()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const isAuthRefreshRequest = originalRequest?.url?.includes('/api/v1/auth/refresh-token')

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry ||
      isAuthRefreshRequest
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      refreshPromise ||= refreshSession().finally(() => {
        refreshPromise = null
      })
      const refreshed = await refreshPromise
      if (!refreshed) {
        return Promise.reject(error)
      }
      return http(originalRequest)
    } catch {
      return Promise.reject(error)
    }
  },
)

export { refreshHttp }
