import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8083',
})

axiosInstance.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem('user')

    if (storedUser) {
      const user = JSON.parse(storedUser)

      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default axiosInstance
