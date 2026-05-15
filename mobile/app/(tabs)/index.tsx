import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Colors2 as Colors } from '../../constants/colors'
import { useAuthStore } from '../../store/authStore'

export default function MapScreen() {
  const { user } = useAuthStore()

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Bonjour {user?.firstName} 👋</Text>
        <Text style={styles.title}>Trouvez un mécanicien</Text>
      </View>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>🗺️</Text>
        <Text style={styles.mapSubText}>Carte interactive</Text>
        <Text style={styles.mapSubText}>bientôt disponible</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 20, paddingTop: 60 },
  greeting: { fontSize: 13, color: Colors.textSecondary, marginBottom: 4 },
  title: { fontSize: 22, fontWeight: '500', color: Colors.text },
  mapPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mapText: { fontSize: 60, marginBottom: 12 },
  mapSubText: { fontSize: 14, color: Colors.textSecondary },
})