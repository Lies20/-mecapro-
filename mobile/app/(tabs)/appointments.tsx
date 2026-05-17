import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native'
import { Colors2 as Colors } from '../../constants/colors'
import api from '../../services/api'

export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/Appointments/my')
      setAppointments(res.data)
    } catch {
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  const upcoming = appointments.filter(a => a.status !== 'cancelled' && new Date(a.appointmentDate) > new Date())
  const past = appointments.filter(a => a.status === 'cancelled' || new Date(a.appointmentDate) <= new Date())

  const statusColor = (status: string) => {
    if (status === 'confirmed') return '#4cd964'
    if (status === 'cancelled') return '#E04444'
    return '#E8A020'
  }

  const statusLabel = (status: string) => {
    if (status === 'confirmed') return 'Confirmé'
    if (status === 'cancelled') return 'Annulé'
    return 'En attente'
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes rendez-vous</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      ) : appointments.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyText}>Aucun rendez-vous</Text>
          <Text style={styles.emptySubText}>Trouvez un mécanicien sur la carte !</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
          {upcoming.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>À venir</Text>
              {upcoming.map(a => (
                <View key={a.id} style={[styles.card, styles.cardUpcoming]}>
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.cardGarage}>{a.garageName}</Text>
                      <Text style={styles.cardAddress}>{a.garageAddress}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: `${statusColor(a.status)}20` }]}>
                      <Text style={[styles.badgeText, { color: statusColor(a.status) }]}>{statusLabel(a.status)}</Text>
                    </View>
                  </View>
                  <View style={styles.divider} />
                  <Text style={styles.cardDate}>📅 {formatDate(a.appointmentDate)}</Text>
                  {a.specialtyName && <Text style={styles.cardSpec}>🔧 {a.specialtyName}</Text>}
                  {a.description && <Text style={styles.cardDesc}>{a.description}</Text>}
                  <View style={styles.cardBtns}>
                    <TouchableOpacity style={styles.btnCall}>
                      <Text style={styles.btnCallText}>📞 Appeler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnCancel}>
                      <Text style={styles.btnCancelText}>Annuler</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </>
          )}

          {past.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Historique</Text>
              {past.map(a => (
                <View key={a.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.cardGarage}>{a.garageName}</Text>
                      <Text style={styles.cardDate}>{formatDate(a.appointmentDate)}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: `${statusColor(a.status)}20` }]}>
                      <Text style={[styles.badgeText, { color: statusColor(a.status) }]}>{statusLabel(a.status)}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12 },
  title: { fontSize: 22, fontWeight: '500', color: Colors.text },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  emptyIcon: { fontSize: 48, marginBottom: 8 },
  emptyText: { fontSize: 16, fontWeight: '500', color: Colors.text },
  emptySubText: { fontSize: 13, color: Colors.textSecondary },
  sectionTitle: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  card: { backgroundColor: Colors.card, borderRadius: 14, padding: 14, borderWidth: 0.5, borderColor: Colors.border },
  cardUpcoming: { borderColor: Colors.primary, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  cardGarage: { fontSize: 15, fontWeight: '500', color: Colors.text, marginBottom: 2 },
  cardAddress: { fontSize: 12, color: Colors.textSecondary },
  cardDate: { fontSize: 12, color: Colors.textSecondary, marginBottom: 4 },
  cardSpec: { fontSize: 12, color: Colors.text, marginBottom: 4 },
  cardDesc: { fontSize: 12, color: Colors.textSecondary, fontStyle: 'italic' },
  divider: { height: 0.5, backgroundColor: Colors.border, marginVertical: 10 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '500' },
  cardBtns: { flexDirection: 'row', gap: 8, marginTop: 10 },
  btnCall: { flex: 1, backgroundColor: Colors.background, borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 0.5, borderColor: Colors.border },
  btnCallText: { color: Colors.text, fontSize: 13 },
  btnCancel: { flex: 1, backgroundColor: 'rgba(224,68,68,0.1)', borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 0.5, borderColor: '#E04444' },
  btnCancelText: { color: '#E04444', fontSize: 13 },
})