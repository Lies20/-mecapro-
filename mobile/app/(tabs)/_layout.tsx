import { Tabs } from 'expo-router'
import { Colors2 as Colors } from '../../constants/colors'
import { Text } from 'react-native'

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarStyle: {
        backgroundColor: Colors.background,
        borderTopColor: Colors.border,
        borderTopWidth: 0.5,
        height: 60,
        paddingBottom: 8,
      },
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.textSecondary,
      headerShown: false,
    }}>
      <Tabs.Screen name="index" options={{ title: 'Carte', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🗺️</Text> }} />
      <Tabs.Screen name="search" options={{ title: 'Recherche', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🔍</Text> }} />
      <Tabs.Screen name="appointments" options={{ title: 'RDV', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📅</Text> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>👤</Text> }} />
      <Tabs.Screen name="two" options={{ href: null }} />
      <Tabs.Screen name="community" options={{ title: 'Communauté', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>👥</Text> }} />
      
    </Tabs>
  )
}