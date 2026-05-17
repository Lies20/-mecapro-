import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useAuthStore } from '../store/authStore'

export default function RootLayout() {
  const { loadToken } = useAuthStore()

  useEffect(() => {
    loadToken()
  }, [])

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{
        headerStyle: { backgroundColor: '#111111' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: '500' },
        contentStyle: { backgroundColor: '#111111' },
      }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} /> 
        <Stack.Screen name="garage/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="reservation/[id]" options={{ headerShown: false }} />

      </Stack>
    </>
  )
}