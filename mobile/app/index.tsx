import { useEffect } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuthStore } from '../store/authStore'
import { Colors2 as Colors } from '../constants/colors'
export default function Index() {
  const router = useRouter()
  const { token, loadToken } = useAuthStore()

  useEffect(() => {
    const init = async () => {
      await loadToken()
      if (token) {
        router.replace('/(tabs)')
      } else {
        router.replace('/(auth)/login')
      }
    }
    init()
  }, [])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  )
}