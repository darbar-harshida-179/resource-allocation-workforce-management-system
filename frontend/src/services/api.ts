import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('resource-allocation-auth-token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh-token')
    ) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem('resource-allocation-refresh-token')
        if (!refreshToken) throw new Error('No refresh token')

        const { data } = await axios.post(`${baseURL}/auth/refresh-token`, { refreshToken })
        const newAccessToken = data.accessToken
        localStorage.setItem('resource-allocation-auth-token', newAccessToken)
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch {
        localStorage.removeItem('resource-allocation-auth-token')
        localStorage.removeItem('resource-allocation-refresh-token')
        localStorage.removeItem('resource-allocation-auth-user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
