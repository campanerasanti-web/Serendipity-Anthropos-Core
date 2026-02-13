import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

const instance = axios.create({ baseURL })

// Interceptor for token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Error handler
const handleError = (err) => {
  console.error('API error:', err?.response?.data || err.message)
  throw err
}

// Public API
const apiClient = {
  get: (url, config) => instance.get(url, config).then(r => r.data).catch(handleError),
  post: (url, data, config) => instance.post(url, data, config).then(r => r.data).catch(handleError),
  patch: (url, data, config) => instance.patch(url, data, config).then(r => r.data).catch(handleError),
  put: (url, data, config) => instance.put(url, data, config).then(r => r.data).catch(handleError),
  delete: (url, config) => instance.delete(url, config).then(r => r.data).catch(handleError),
}

export default apiClient
