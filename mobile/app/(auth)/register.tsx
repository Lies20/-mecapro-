import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuthStore } from '../../store/authStore'
import { Colors2 as Colors } from '../../constants/colors'

export default function Register() {
  const router = useRouter()
  const { register, isLoading } = useAuthStore()
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    password: '', vehicleType: 'Voiture', vehicleModel: ''
  })

  const handleRegister = async () => {
    if (!form.firstName || !form.email || !form.password) {
      Alert.alert('Erreur', 'Remplis tous les champs obligatoires')
      return
    }
    const success = await register(form)
    if (success) {
      Alert.alert('Compte créé !', 'Vérifie ta boîte mail.', [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }])
    } else {
      Alert.alert('Erreur', 'Email déjà utilisé')
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Créer un compte</Text>
        {[
          { key: 'firstName', label: 'Prénom *', placeholder: 'Jean' },
          { key: 'lastName', label: 'Nom', placeholder: 'Dupont' },
          { key: 'email', label: 'Email *', placeholder: 'jean@email.com' },
          { key: 'password', label: 'Mot de passe *', placeholder: '••••••••', secure: true },
          { key: 'vehicleModel', label: 'Modèle de véhicule', placeholder: 'Renault Clio' },
        ].map((field) => (
          <View key={field.key}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              style={styles.input}
              value={(form as any)[field.key]}
              onChangeText={(v) => setForm({ ...form, [field.key]: v })}
              placeholder={field.placeholder}
              placeholderTextColor={Colors.textSecondary}
              secureTextEntry={field.secure}
              autoCapitalize="none"
            />
          </View>
        ))}
        <View style={styles.chips}>
          {['Voiture', 'Moto', 'Utilitaire'].map((type) => (
            <TouchableOpacity key={type} style={[styles.chip, form.vehicleType === type && styles.chipActive]} onPress={() => setForm({ ...form, vehicleType: type })}>
              <Text style={[styles.chipText, form.vehicleType === type && { color: Colors.white }]}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={[styles.btn, isLoading && { opacity: 0.6 }]} onPress={handleRegister} disabled={isLoading}>
          <Text style={styles.btnText}>{isLoading ? 'Création...' : 'Créer mon compte'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>Déjà un compte ? <Text style={{ color: Colors.primary }}>Se connecter</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: Colors.background, padding: 24 },
  title: { fontSize: 22, fontWeight: '500', color: Colors.text, marginBottom: 24, marginTop: 40 },
  label: { fontSize: 13, color: Colors.textSecondary, marginBottom: 4 },
  input: { backgroundColor: Colors.card, borderRadius: 12, padding: 14, color: Colors.text, fontSize: 14, borderWidth: 0.5, borderColor: Colors.border, marginBottom: 12 },
  chips: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 0.5, borderColor: Colors.border, backgroundColor: Colors.card },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.textSecondary },
  btn: { backgroundColor: Colors.primary, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  btnText: { color: Colors.white, fontSize: 15, fontWeight: '500' },
  link: { textAlign: 'center', color: Colors.textSecondary, marginTop: 16, fontSize: 13 }
})
