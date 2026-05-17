import { useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { Colors2 as Colors } from '../../constants/colors'
import api from '../../services/api'

export default function SearchScreen() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [garages, setGarages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')

  const filters = [
    { key: 'all', label: 'Tous' },
    { key: 'revision', label: 'Révision' },
    { key: 'electrique', label: 'Électrique' },
    { key: 'urgence', label: 'Urgence 24h' },
    { key: 'pneu', label: 'Pneus' },
    { key: 'carrosserie', label: 'Carrosserie' },
  ]

  const search = async () => {
    setLoading(true)
    setSearched(true)
    try {
      const res = await api.get('/Garages')
      setGarages(res.data)
    } catch {
      setGarages([])
    } finally {
      setLoading(false)
    }
  }

  const filtered = garages.filter(g => {
    const matchQuery = query === '' || g.name.toLowerCase().includes(query.toLowerCase()) || g.city.toLowerCase().includes(query.toLowerCase())
    return matchQuery
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recherche</Text>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Garage, spécialité, ville..."
            placeholderTextColor={Colors.textSecondary}
            onSubmitEditing={search}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); setGarages([]); setSearched(false) }}>
              <Text style={{ color: Colors.textSecondary }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        {filters.map(f => (
          <TouchableOpacity key={f.key} style={[styles.chip, activeFilter === f.key && styles.chipActive]} onPress={() => { setActiveFilter(f.key); search() }}>
            <Text style={[styles.chipText, activeFilter === f.key && { color: '#fff' }]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.results} contentContainerStyle={{ padding: 16, gap: 12 }}>
        {loading && (
          <View style={{ alignItems: 'center', paddingTop: 40 }}>
            <ActivityIndicator color={Colors.primary} />
          </View>
        )}

        {!loading && !searched && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>Recherche un garage ou une spécialité</Text>
          </View>
        )}

        {!loading && searched && filtered.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>😕</Text>
            <Text style={styles.emptyText}>Aucun garage trouvé</Text>
          </View>
        )}

        {!loading && filtered.map(g => (
          <TouchableOpacity key={g.id} style={styles.card} onPress={() => router.push(`/garage/${g.id}` as any)}>
            <View style={styles.cardLeft}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{g.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardName}>{g.name}</Text>
                <Text style={styles.cardCity}>{g.city} · {g.address}</Text>
                <View style={styles.cardMeta}>
                  <Text style={styles.cardStar}>⭐ {g.averageRating || 0}</Text>
                  <Text style={styles.cardReviews}>{g.reviewCount || 0} avis</Text>
                  {g.hourlyRate && <Text style={styles.cardPrice}>{g.hourlyRate}€/h</Text>}
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 4, marginTop: 6 }}>
                  {g.specialties?.map((s: string) => (
                    <View key={s} style={styles.tag}>
                      <Text style={styles.tagText}>{s}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
            <View style={[styles.badge, g.isAvailable ? styles.badgeOpen : styles.badgeBusy]}>
              <Text style={[styles.badgeText, { color: g.isAvailable ? '#4cd964' : '#E8A020' }]}>
                {g.isAvailable ? 'Dispo' : 'Occupé'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12 },
  title: { fontSize: 22, fontWeight: '500', color: Colors.text, marginBottom: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.card, borderRadius: 12, padding: 12, borderWidth: 0.5, borderColor: Colors.border },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, color: Colors.text, fontSize: 14 },
  filters: { maxHeight: 48 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: Colors.card, borderWidth: 0.5, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 12, color: Colors.textSecondary },
  results: { flex: 1 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
  card: { backgroundColor: Colors.card, borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', borderWidth: 0.5, borderColor: Colors.border },
  cardLeft: { flexDirection: 'row', gap: 10, flex: 1 },
  avatar: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: Colors.border },
  avatarText: { fontSize: 18, fontWeight: '500', color: Colors.primary },
  cardName: { fontSize: 14, fontWeight: '500', color: Colors.text, marginBottom: 2 },
  cardCity: { fontSize: 12, color: Colors.textSecondary, marginBottom: 4 },
  cardMeta: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  cardStar: { fontSize: 12, color: Colors.text },
  cardReviews: { fontSize: 11, color: Colors.textSecondary },
  cardPrice: { fontSize: 12, fontWeight: '500', color: Colors.primary },
  tag: { backgroundColor: Colors.background, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 0.5, borderColor: Colors.border },
  tagText: { fontSize: 10, color: Colors.textSecondary },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, marginLeft: 8 },
  badgeOpen: { backgroundColor: 'rgba(76,217,100,0.1)' },
  badgeBusy: { backgroundColor: 'rgba(232,160,32,0.1)' },
  badgeText: { fontSize: 10, fontWeight: '500' },
})