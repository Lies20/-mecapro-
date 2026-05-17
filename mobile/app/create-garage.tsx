import { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { Colors2 as Colors } from '../constants/colors'
import api from '../services/api'

export default function CreateGarageScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    email: '',
    hourlyRate: '',
  })
  const [selectedSpecialties, setSelectedSpecialties] = useState<number[]>([])

  const specialties = [
    { id: 1, name: 'Révision' },
    { id: 2, name: 'Freinage' },
    { id: 3, name: 'Électronique' },
    { id: 4, name: 'Pneumatiques' },
    { id: 5, name: 'Carrosserie' },
    { id: 6, name: 'Climatisation' },
    { id: 7, name: 'Électrique' },
    { id: 8, name: 'Urgence 24h' },
    { id: 9, name: 'Vidange' },
  ]

  const toggleSpecialty = (id: number) => {
    setSelectedSpecialties(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

 const handleSubmit = async () => {
    if (!form.name || !form.address || !form.city) {
      Alert.alert('Erreur', 'Remplis les champs obligatoires (nom, adresse, ville)')
      return
    }

    setLoading(true)
    try {
      // Géocodage automatique via Nominatim
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(form.address + ' ' + form.city)}&format=json&limit=1`,
        { headers: { 'User-Agent': 'MecaProApp/1.0' } }
      )
      const geoData = await geoRes.json()

      let latitude = 48.858
      let longitude = 2.347

      if (geoData.length > 0) {
        latitude = parseFloat(geoData[0].lat)
        longitude = parseFloat(geoData[0].lon)
      }

      await api.post('/Garages', {
        name: form.name,
        description: form.description,
        address: form.address,
        city: form.city,
        postalCode: form.postalCode,
        phone: form.phone,
        email: form.email,
        hourlyRate: form.hourlyRate ? parseFloat(form.hourlyRate) : null,
        latitude,
        longitude,
        specialtyIds: selectedSpecialties,
      })

      Alert.alert(
        '✅ Garage créé !',
        'Votre garage a été ajouté à MécaPro. Il sera visible sur la carte.',
        [{ text: 'OK', onPress: () => router.back() }]
      )
    } catch {
      Alert.alert('Erreur', 'Impossible de créer le garage')
    } finally {
      setLoading(false)
    }
   const geoRes = await fetch(
  `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(form.address + ' ' + form.postalCode + ' ' + form.city + ' France')}&format=json&limit=1`,
  { headers: { 'User-Agent': 'MecaProApp/1.0' } }
    )
     const geoData = await geoRes.json()
      console.log('Nominatim result:', JSON.stringify(geoData))
      console.log('Query:', form.address + ' ' + form.city)
    }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Inscrire mon garage</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 20, paddingBottom: 40 }}>

        {/* Infos principales */}
        <View>
          <Text style={styles.sectionTitle}>Informations principales</Text>
          <View style={styles.card}>
            {[
              { key: 'name', label: 'Nom du garage *', placeholder: 'Garage Auto Performance' },
              { key: 'description', label: 'Description', placeholder: 'Spécialiste en...' },
              { key: 'phone', label: 'Téléphone', placeholder: '+33 6 12 34 56 78' },
              { key: 'email', label: 'Email', placeholder: 'contact@mongarage.fr' },
              { key: 'hourlyRate', label: 'Tarif horaire (€)', placeholder: '50' },
            ].map((field, i) => (
              <View key={field.key} style={[styles.fieldRow, i > 0 && styles.fieldBorder]}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={(form as any)[field.key]}
                  onChangeText={(v) => setForm({ ...form, [field.key]: v })}
                  placeholder={field.placeholder}
                  placeholderTextColor={Colors.textSecondary}
                  keyboardType={field.key === 'hourlyRate' ? 'numeric' : 'default'}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Adresse */}
        <View>
          <Text style={styles.sectionTitle}>Adresse</Text>
          <View style={styles.card}>
            {[
              { key: 'address', label: 'Adresse *', placeholder: '12 rue de la Paix' },
              { key: 'city', label: 'Ville *', placeholder: 'Paris' },
              { key: 'postalCode', label: 'Code postal', placeholder: '75001' },
            ].map((field, i) => (
              <View key={field.key} style={[styles.fieldRow, i > 0 && styles.fieldBorder]}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={(form as any)[field.key]}
                  onChangeText={(v) => setForm({ ...form, [field.key]: v })}
                  placeholder={field.placeholder}
                  placeholderTextColor={Colors.textSecondary}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Spécialités */}
        <View>
          <Text style={styles.sectionTitle}>Spécialités</Text>
          <View style={styles.specialtiesGrid}>
            {specialties.map(s => (
              <TouchableOpacity
                key={s.id}
                style={[styles.specialtyChip, selectedSpecialties.includes(s.id) && styles.specialtyChipActive]}
                onPress={() => toggleSpecialty(s.id)}
              >
                <Text style={[styles.specialtyText, selectedSpecialties.includes(s.id) && { color: '#fff' }]}>
                  {s.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info géolocalisation */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>📍 La position exacte sera calculée automatiquement à partir de votre adresse.</Text>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>🔧 Inscrire mon garage</Text>}
        </TouchableOpacity>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 56, paddingBottom: 16, borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.card, justifyContent: 'center', alignItems: 'center' },
  backText: { color: Colors.text, fontSize: 20 },
  title: { fontSize: 18, fontWeight: '500', color: Colors.text },
  sectionTitle: { fontSize: 14, fontWeight: '500', color: Colors.text, marginBottom: 10 },
  card: { backgroundColor: Colors.card, borderRadius: 14, overflow: 'hidden', borderWidth: 0.5, borderColor: Colors.border },
  fieldRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  fieldBorder: { borderTopWidth: 0.5, borderTopColor: Colors.border },
  fieldLabel: { fontSize: 12, color: Colors.textSecondary, width: 100, flexShrink: 0 },
  fieldInput: { fontSize: 13, color: Colors.text, flex: 1, textAlign: 'right' },
  specialtiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  specialtyChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.card, borderWidth: 0.5, borderColor: Colors.border },
  specialtyChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  specialtyText: { fontSize: 13, color: Colors.textSecondary },
  infoBox: { backgroundColor: 'rgba(232,160,32,0.1)', borderRadius: 12, padding: 12, borderWidth: 0.5, borderColor: 'rgba(232,160,32,0.3)' },
  infoText: { fontSize: 12, color: Colors.primary, lineHeight: 18 },
  submitBtn: { backgroundColor: Colors.primary, borderRadius: 14, padding: 16, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontSize: 15, fontWeight: '500' },
})