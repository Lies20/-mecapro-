import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Colors2 as Colors } from '../../constants/colors'
import api from '../../services/api'

export default function GarageScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const [garage, setGarage] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGarage()
    fetchReviews()
  }, [])

  const fetchGarage = async () => {
    try {
      const res = await api.get(`/Garages/${id}`)
      setGarage(res.data)
    } catch {
      Alert.alert('Erreur', 'Garage introuvable')
      router.back()
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/Reviews/garage/${id}`)
      setReviews(res.data)
    } catch {}
  }

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator color={Colors.primary} size="large" />
    </View>
  )

  if (!garage) return null

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.hero}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <View style={styles.heroLogo}>
            <Text style={styles.heroLogoText}>{garage.name.charAt(0)}</Text>
          </View>
          <Text style={styles.heroName}>{garage.name}</Text>
          <Text style={styles.heroCity}>{garage.city} · {garage.address}</Text>
          <View style={styles.heroMeta}>
            <Text style={styles.heroStar}>⭐ {garage.averageRating || 0}</Text>
            <Text style={styles.heroDot}>·</Text>
            <Text style={styles.heroReviews}>{garage.reviewCount || 0} avis</Text>
            <Text style={styles.heroDot}>·</Text>
            <Text style={styles.heroPrice}>{garage.hourlyRate}€/h</Text>
          </View>
          <View style={[styles.availBadge, garage.isAvailable ? styles.availOpen : styles.availBusy]}>
            <View style={[styles.availDot, { backgroundColor: garage.isAvailable ? '#4cd964' : '#E8A020' }]} />
            <Text style={[styles.availText, { color: garage.isAvailable ? '#4cd964' : '#E8A020' }]}>
              {garage.isAvailable ? 'Disponible maintenant' : 'Occupé'}
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          {/* Spécialités */}
          {garage.specialties?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Spécialités</Text>
              <View style={styles.tags}>
                {garage.specialties.map((s: string) => (
                  <View key={s} style={styles.tag}>
                    <Text style={styles.tagText}>🔧 {s}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Infos contact */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations</Text>
            <View style={styles.infoCard}>
              {garage.phone && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>📞</Text>
                  <Text style={styles.infoText}>{garage.phone}</Text>
                </View>
              )}
              {garage.email && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>✉️</Text>
                  <Text style={styles.infoText}>{garage.email}</Text>
                </View>
              )}
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>📍</Text>
                <Text style={styles.infoText}>{garage.address}, {garage.city}</Text>
              </View>
              {garage.distanceKm && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>🚗</Text>
                  <Text style={styles.infoText}>{garage.distanceKm} km de vous</Text>
                </View>
              )}
            </View>
          </View>

          {/* Avis */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Avis clients ({reviews.length})</Text>
            {reviews.length === 0 ? (
              <Text style={styles.noReviews}>Aucun avis pour l'instant</Text>
            ) : (
              reviews.map(r => (
                <View key={r.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewAvatar}>
                      <Text style={styles.reviewAvatarText}>{r.userFirstName?.charAt(0)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reviewName}>{r.userFirstName}</Text>
                      <Text style={styles.reviewStars}>{'⭐'.repeat(r.rating)}</Text>
                    </View>
                    <Text style={styles.reviewDate}>
                      {new Date(r.createdAt).toLocaleDateString('fr-FR')}
                    </Text>
                  </View>
                  {r.comment && <Text style={styles.reviewComment}>{r.comment}</Text>}
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Boutons bas */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnCall}>
          <Text style={styles.btnCallText}>📞 Appeler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnReserve} onPress={() => router.push(`/reservation/${id}` as any)}>
          <Text style={styles.btnReserveText}>📅 Réserver</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  hero: { backgroundColor: Colors.card, padding: 20, paddingTop: 56, alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  backBtn: { position: 'absolute', top: 56, left: 16, width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  backText: { color: Colors.text, fontSize: 20 },
  heroLogo: { width: 72, height: 72, borderRadius: 20, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: Colors.border, marginBottom: 12 },
  heroLogoText: { fontSize: 28, fontWeight: '500', color: Colors.primary },
  heroName: { fontSize: 20, fontWeight: '500', color: Colors.text, marginBottom: 4, textAlign: 'center' },
  heroCity: { fontSize: 13, color: Colors.textSecondary, marginBottom: 10, textAlign: 'center' },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  heroStar: { fontSize: 14, color: Colors.text, fontWeight: '500' },
  heroDot: { color: Colors.textSecondary },
  heroReviews: { fontSize: 13, color: Colors.textSecondary },
  heroPrice: { fontSize: 14, fontWeight: '500', color: Colors.primary },
  availBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  availOpen: { backgroundColor: 'rgba(76,217,100,0.1)' },
  availBusy: { backgroundColor: 'rgba(232,160,32,0.1)' },
  availDot: { width: 7, height: 7, borderRadius: 4 },
  availText: { fontSize: 13, fontWeight: '500' },
  body: { padding: 16 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '500', color: Colors.text, marginBottom: 10 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: Colors.card, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 0.5, borderColor: Colors.border },
  tagText: { fontSize: 12, color: Colors.text },
  infoCard: { backgroundColor: Colors.card, borderRadius: 14, overflow: 'hidden', borderWidth: 0.5, borderColor: Colors.border },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  infoIcon: { fontSize: 16, width: 24 },
  infoText: { fontSize: 13, color: Colors.text, flex: 1 },
  noReviews: { fontSize: 13, color: Colors.textSecondary, fontStyle: 'italic' },
  reviewCard: { backgroundColor: Colors.card, borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 0.5, borderColor: Colors.border },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  reviewAvatarText: { color: '#fff', fontWeight: '500', fontSize: 14 },
  reviewName: { fontSize: 13, fontWeight: '500', color: Colors.text },
  reviewStars: { fontSize: 11 },
  reviewDate: { fontSize: 11, color: Colors.textSecondary },
  reviewComment: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  footer: { flexDirection: 'row', gap: 10, padding: 16, backgroundColor: Colors.background, borderTopWidth: 0.5, borderTopColor: Colors.border },
  btnCall: { flex: 1, backgroundColor: Colors.card, borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 0.5, borderColor: Colors.border },
  btnCallText: { color: Colors.text, fontWeight: '500' },
  btnReserve: { flex: 1.5, backgroundColor: Colors.primary, borderRadius: 12, padding: 14, alignItems: 'center' },
  btnReserveText: { color: '#fff', fontWeight: '500' },
})