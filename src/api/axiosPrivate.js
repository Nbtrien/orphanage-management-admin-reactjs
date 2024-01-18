import useAuth from '../hooks/useAuth'
import apiConfig from './apiConfig'
import axios from 'axios'

const AxiosPrivate = () => {
  const instance = axios.create({
    baseURL: apiConfig.baseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
  })
  instance.defaults.timeout = 30000

  const { auth, setAuth } = useAuth()

  instance.interceptors.request.use(
    async (config) => {
      if (!config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${auth.accessToken}`
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  instance.interceptors.response.use(
    (response) => {
      if (response && response.data) {
        return response.data
      }

      return response
    },
    (error) => {
      if (!error?.response) {
        // window.location.href = '../500'
      } else if (error.response.status === 401) {
        localStorage.removeItem('user_id')
        localStorage.removeItem('access_token')
        localStorage.removeItem('roles')
        setAuth({})
        window.location.href = './login'
      } else if (error.response && error.response.data) {
        return Promise.reject(error.response.data)
      }
      return Promise.reject(error.response)
    },
  )

  return instance
}

export default AxiosPrivate
