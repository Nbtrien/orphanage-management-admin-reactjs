import axios from 'axios'
import apiConfig from './apiConfig'

const axiosClient = axios.create({
  baseURL: apiConfig.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.defaults.timeout = 2000

axiosClient.interceptors.request.use(
  async (config) => {
    // Do something before request is sent
    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  },
)

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data
    }

    return response
  },
  (error) => {
    if (error.response.status === 401) {
      window.location.href = './login'
    } else if (error.response && error.response.data) {
      return Promise.reject(error.response.data)
    }
    return Promise.reject(error.response)
  },
)

export default axiosClient
