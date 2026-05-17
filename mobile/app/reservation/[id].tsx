import { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Colors2 as Colors } from '../../constants/colors'
import api from '../../services/api'

export default function ReservationScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [selectedDate, setSelectedDate] = useState(0)
  const [selectedHour, setSelectedHour] = useState('')
  const [description, setDescription] = useState('')

  const specialties = ['Révision', 'Freinage', 'Diagnostic', 'Électronique', 'Pneus', 'Autre']

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i + 1)
    return d
  })

  const hours = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { weekday: 'short' })
  }

  const getDayNum = (date: Date) => {
    return date.getDate().toString()
  }

  const handleReserve = async () => {
    if (!selectedSpecialty) { Alert.alert('Erreur', 'Choisis une prestation'); return }
    if (!selectedHour) { Alert.alert('Erreur', 'Choisis un créneau'); return }

    setLoading(true)
    try {
      const date = dates[selectedDate]
      const [h, m] = selectedHour.split(':')
      date.setHours(parseInt(h), parseInt(m), 0, 0)

      await api.post('/Appointments', {
        garageId: id,
        appointmentDate: date.toISOString(),
        description: description || selectedSpecialty,
      })

      Alert.alert(
        '✅ RDV confirmé !',
        `Votre rendez-vous est enregistré pour le ${date.toLocaleDateString('fr-FR')} à ${selectedHour}`,
        [{ text: 'OK', onPress: () => router.push('/(tabs)/appointments' as any) }]
      )
    } catch {
      Alert.alert('Erreur', 'Impossible de créer le rendez-vous')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Réserver un RDV</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 20 }}>
        {/* Prestation */}
        <View>
          <Text style={styles.sectionTitle}>Type de prestation</Text>
          <View style={styles.grid}>
            {specialties.map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.specialtyChip, selectedSpecialty === s && styles.specialtyChipActive]}
                onPress={() => setSelectedSpecialty(s)}
              >
                <Text style={[styles.specialtyText, selectedSpecialty === s && { color: '#fff' }]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date */}
        <View>
          <Text style={styles.sectionTitle}>Choisir une date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {dates.map((d, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.dateCard, selectedDate === i && styles.dateCardActive]}
                onPress={() => setSelectedDate(i)}
              >
                <Text style={[styles.dateDay, selectedDate === i && { color: '#fff' }]}>{getDayName(d)}</Text>
                <Text style={[styles.dateNum, selectedDate === i && { color: '#fff' }]}>{getDayNum(d)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Créneau */}
        <View>
          <Text style={styles.sectionTitle}>Créneau disponible</Text>
          <View style={styles.grid}>
            {hours.map(h => (
              <TouchableOpacity
                key={h}
                style={[styles.hourChip, selectedHour === h && styles.hourChipActive]}
                onPress={() => setSelectedHour(h)}
              >
                <Text style={[styles.hourText, selectedHour === h && { color: '#fff' }]}>{h}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View>
          <Text style={styles.sectionTitle}>Description (optionnel)</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="Décrivez votre problème..."
            placeholderTextColor={Colors.textSecondary}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Résumé */}
        {selectedSpecialty && selectedHour && (
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Récapitulatif</Text>
            <Text style={styles.summaryText}>📅 {dates[selectedDate].toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à {selectedHour}</Text>
            <Text style={styles.summaryText}>🔧 {selectedSpecialty}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.btnConfirm, loading && { opacity: 0.6 }]}
          onPress={handleReserve}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnConfirmText}>✅ Confirmer le RDV</Text>}
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  specialtyChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.card, borderWidth: 0.5, borderColor: Colors.border },
  specialtyChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  specialtyText: { fontSize: 13, color: Colors.textSecondary },
  dateCard: { width: 52, height: 64, borderRadius: 12, backgroundColor: Colors.card, justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: Colors.border },
  dateCardActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dateDay: { fontSize: 11, color: Colors.textSecondary, marginBottom: 4 },
  dateNum: { fontSize: 18, fontWeight: '500', color: Colors.text },
  hourChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, backgroundColor: Colors.card, borderWidth: 0.5, borderColor: Colors.border },
  hourChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  hourText: { fontSize: 13, color: Colors.textSecondary },
  textArea: { backgroundColor: Colors.card, borderRadius: 12, padding: 12, color: Colors.text, fontSize: 14, borderWidth: 0.5, borderColor: Colors.border, minHeight: 80, textAlignVertical: 'top' },
  summary: { backgroundColor: Colors.card, borderRadius: 12, padding: 14, borderWidth: 0.5, borderColor: Colors.primary },
  summaryTitle: { fontSize: 13, fontWeight: '500', color: Colors.text, marginBottom: 8 },
  summaryText: { fontSize: 13, color: Colors.textSecondary, marginBottom: 4 },
  btnConfirm: { backgroundColor: Colors.primary, borderRadius: 14, padding: 16, alignItems: 'center' },
  btnConfirmText: { color: '#fff', fontSize: 15, fontWeight: '500' },
})