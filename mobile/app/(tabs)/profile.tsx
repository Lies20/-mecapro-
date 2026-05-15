import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { Colors2 as Colors } from '../../constants/colors'
import { useAuthStore } from '../../store/authStore'

export default function ProfileScreen() {
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = async () => {
    Alert.alert('Déconnexion', 'Tu veux vraiment te déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Oui', onPress: async () => {
        await logout()
        router.replace('/(auth)/login')
      }}
    ])
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user?.firstName?.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={styles.name}>{user?.firstName}</Text>
      <Text style={styles.email}>{user?.email}</Text>
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', paddingTop: 60 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, fontWeight: '500', color: Colors.white },
  name: { fontSize: 20, fontWeight: '500', color: Colors.text, marginBottom: 4 },
  email: { fontSize: 14, color: Colors.textSecondary, marginBottom: 40 },
  logoutBtn: { backgroundColor: 'rgba(224,68,68,0.1)', borderRadius: 12, padding: 16, paddingHorizontal: 40, borderWidth: 0.5, borderColor: '#E04444' },
  logoutText: { color: '#E04444', fontWeight: '500' }
})