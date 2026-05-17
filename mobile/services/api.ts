import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const API_URL = 'https://swimming-der-curve-interval.trycloudflare.com/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 
    'Content-Type': 'application/json',
    'x-github-token': 'true'
  },
})

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api