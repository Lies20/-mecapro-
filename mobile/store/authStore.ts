import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../services/api'

interface AuthState {
  token: string | null
  user: { firstName: string; email: string; role: string } | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (data: any) => Promise<boolean>
  logout: () => Promise<void>
  loadToken: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: false,

  loadToken: async () => {
    const token = await AsyncStorage.getItem('token')
    const userStr = await AsyncStorage.getItem('user')
    if (token && userStr) {
      set({ token, user: JSON.parse(userStr) })
    }
  },

  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const res = await api.post('/Auth/login', { email, password })
      const { token, refreshToken, firstName, role } = res.data
      await AsyncStorage.setItem('token', token)
      await AsyncStorage.setItem('refreshToken', refreshToken)
      await AsyncStorage.setItem('user', JSON.stringify({ firstName, email, role }))
      set({ token, user: { firstName, email, role }, isLoading: false })
      return true
    } catch {
      set({ isLoading: false })
      return false
    }
  },

  register: async (data) => {
    set({ isLoading: true })
    try {
      await api.post('/Auth/register', data)
      set({ isLoading: false })
      return true
    } catch {
      set({ isLoading: false })
      return false
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('token')
    await AsyncStorage.removeItem('refreshToken')
    await AsyncStorage.removeItem('user')
    set({ token: null, user: null })
  },
}))