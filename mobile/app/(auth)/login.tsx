import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuthStore } from '../../store/authStore'
import { Colors2 as Colors } from '../../constants/colors'

export default function Login() {
  const router = useRouter()
  const { login, isLoading } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert('Erreur', 'Remplis tous les champs'); return }
    const success = await login(email, password)
    if (success) { router.replace('/(tabs)') }
    else { Alert.alert('Erreur', 'Email ou mot de passe incorrect') }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>🔧 Méca<Text style={{ color: Colors.primary }}>Pro</Text></Text>
          <Text style={styles.subtitle}>Trouvez un mécanicien de confiance</Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="ton@email.com" placeholderTextColor={Colors.textSecondary} keyboardType="email-address" autoCapitalize="none" />
          <Text style={styles.label}>Mot de passe</Text>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="••••••••" placeholderTextColor={Colors.textSecondary} secureTextEntry />
          <TouchableOpacity style={[styles.btn, isLoading && { opacity: 0.6 }]} onPress={handleLogin} disabled={isLoading}>
            <Text style={styles.btnText}>{isLoading ? 'Connexion...' : 'Se connecter'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.link}>Pas encore de compte ? <Text style={{ color: Colors.primary }}>S'inscrire</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: Colors.background, padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 32, fontWeight: '500', color: Colors.text, marginBottom: 8 },
  subtitle: { fontSize: 14, color: Colors.textSecondary },
  form: { gap: 12 },
  label: { fontSize: 13, color: Colors.textSecondary, marginBottom: 4 },
  input: { backgroundColor: Colors.card, borderRadius: 12, padding: 14, color: Colors.text, fontSize: 14, borderWidth: 0.5, borderColor: Colors.border, marginBottom: 8 },
  btn: { backgroundColor: Colors.primary, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  btnText: { color: Colors.white, fontSize: 15, fontWeight: '500' },
  link: { textAlign: 'center', color: Colors.textSecondary, marginTop: 16, fontSize: 13 }
})
