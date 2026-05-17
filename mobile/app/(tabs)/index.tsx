import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview'
import * as Location from 'expo-location'
import { useRouter } from 'expo-router'
import { Colors2 as Colors } from '../../constants/colors'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'

export default function MapScreen() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [location, setLocation] = useState<any>(null)
  const [garages, setGarages] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const filters = [
    { key: 'all', label: 'Tous' },
    { key: 'revision', label: 'Révision' },
    { key: 'electrique', label: 'Électrique' },
    { key: 'urgence', label: 'Urgence 24h' },
    { key: 'pneu', label: 'Pneus' },
  ]

  useEffect(() => {
    getLocation()
  }, [])

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      setLoading(false)
      return
    }
    const loc = await Location.getCurrentPositionAsync({})
    setLocation(loc.coords)
    fetchGarages(loc.coords.latitude, loc.coords.longitude)
  }

  const fetchGarages = async (lat: number, lng: number) => {
    try {
      const res = await api.get(`/Garages/nearby?lat=${lat}&lng=${lng}&radius=10`)
      setGarages(res.data)
    } catch (e) {
      setGarages([
        { id: '1', name: 'Garage Auto Performance', city: 'Paris', isAvailable: true, latitude: 48.858, longitude: 2.347, averageRating: 4.8, distanceKm: 0.6, specialties: ['Révision', 'Freinage'] },
        { id: '2', name: 'Atelier Voltauto', city: 'Paris', isAvailable: true, latitude: 48.864, longitude: 2.358, averageRating: 4.7, distanceKm: 1.1, specialties: ['Électrique', 'Hybride'] },
        { id: '3', name: 'Urgence Dépannage', city: 'Paris', isAvailable: false, latitude: 48.870, longitude: 2.332, averageRating: 4.5, distanceKm: 1.8, specialties: ['Urgence 24h'] },
      ])
    } finally {
      setLoading(false)
    }
  }

const getMapHtml = () => {
    const lat = location?.latitude || 48.858
    const lng = location?.longitude || 2.347
    const markersJs = garages.map(g => `
      L.marker([${g.latitude}, ${g.longitude}], {
        icon: L.divIcon({
          className: '',
          html: '<div style="width:36px;height:36px;border-radius:50%;background:${g.isAvailable ? '#1e1e22' : '#2a2a2e'};border:2.5px solid ${g.isAvailable ? '#E8A020' : '#555'};display:flex;align-items:center;justify-content:center;font-size:16px;cursor:pointer">🔧</div>',
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        })
      }).addTo(map).bindPopup('<b>${g.name}</b><br>${g.city}').on('click', function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({id: '${g.id}'}));
      });
    `).join('\n')
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        * { margin: 0; padding: 0; }
        #map { width: 100vw; height: 100vh; }
        .leaflet-tile-pane { filter: brightness(0.5) saturate(0.4); }
        .leaflet-control-attribution { display: none !important; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const map = L.map('map', { zoomControl: false }).setView([${lat}, ${lng}], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        
        L.circle([${lat}, ${lng}], {
          radius: 500,
          color: '#E8A020',
          fillColor: '#E8A020',
          fillOpacity: 0.08,
          weight: 1.5
        }).addTo(map);
        
        L.marker([${lat}, ${lng}], {
          icon: L.divIcon({
            className: '',
            html: '<div style="width:16px;height:16px;background:#E8A020;border-radius:50%;border:3px solid #fff"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          })
        }).addTo(map);
        ${markersJs}
      </script>
    </body>
    </html>
    `
  }

  const handleMapMessage = (event: any) => {
    const data = JSON.parse(event.nativeEvent.data)
    const garage = garages.find(g => g.id === data.id)
    if (garage) setSelected(garage)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour {user?.firstName} 👋</Text>
          <Text style={styles.title}>Trouvez un mécanicien</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        {filters.map(f => (
          <TouchableOpacity key={f.key} style={[styles.chip, filter === f.key && styles.chipActive]} onPress={() => setFilter(f.key)}>
            <Text style={[styles.chipText, filter === f.key && { color: '#fff' }]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Recherche des mécaniciens...</Text>
        </View>
      ) : (
        <WebView
          style={styles.map}
          source={{ html: getMapHtml() }}
          onMessage={handleMapMessage}
          javaScriptEnabled
          domStorageEnabled
          setSupportMultipleWindows={false}
          onShouldStartLoadWithRequest={(request: any) => {
            return request.url === 'about:blank' || request.url.startsWith('data:')
          }}
          />
      )}

      {selected && (
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetTop}>
            <View style={styles.sheetLogo}>
              <Text style={styles.sheetLogoText}>{selected.name.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sheetName}>{selected.name}</Text>
              <Text style={styles.sheetCity}>{selected.city}</Text>
            </View>
            <TouchableOpacity onPress={() => setSelected(null)}>
              <Text style={{ color: Colors.textSecondary, fontSize: 20 }}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sheetMeta}>
            <Text style={styles.sheetStar}>⭐ {selected.averageRating}</Text>
            <Text style={styles.sheetDist}>📍 {selected.distanceKm} km</Text>
            <View style={[styles.badge, selected.isAvailable ? styles.badgeOpen : styles.badgeBusy]}>
              <Text style={[styles.badgeText, { color: selected.isAvailable ? '#4cd964' : '#E8A020' }]}>
                {selected.isAvailable ? 'Disponible' : 'Occupé'}
              </Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }} contentContainerStyle={{ gap: 6 }}>
            {selected.specialties?.map((s: string) => (
              <View key={s} style={styles.tag}><Text style={styles.tagText}>{s}</Text></View>
            ))}
          </ScrollView>
          <View style={styles.sheetBtns}>
            <TouchableOpacity style={styles.btnDark}>
              <Text style={styles.btnDarkText}>📞 Appeler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOrange} onPress={() => router.push(`/garage/${selected.id}` as any)}>
              <Text style={styles.btnOrangeText}>📅 Réserver</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 56, paddingBottom: 8, backgroundColor: Colors.background },
  greeting: { fontSize: 13, color: Colors.textSecondary },
  title: { fontSize: 20, fontWeight: '500', color: Colors.text },
  filters: { maxHeight: 48, backgroundColor: Colors.background },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: Colors.card, borderWidth: 0.5, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 12, color: Colors.textSecondary },
  map: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: Colors.textSecondary, marginTop: 12 },
  sheet: { backgroundColor: '#161618', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, borderTopWidth: 0.5, borderColor: Colors.border },
  sheetHandle: { width: 36, height: 4, backgroundColor: '#333', borderRadius: 2, alignSelf: 'center', marginBottom: 12 },
  sheetTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  sheetLogo: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.card, justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: Colors.border },
  sheetLogoText: { fontSize: 18, fontWeight: '500', color: Colors.primary },
  sheetName: { fontSize: 15, fontWeight: '500', color: Colors.text },
  sheetCity: { fontSize: 12, color: Colors.textSecondary },
  sheetMeta: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  sheetStar: { fontSize: 13, color: Colors.text },
  sheetDist: { fontSize: 13, color: Colors.textSecondary },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  badgeOpen: { backgroundColor: 'rgba(76,217,100,0.1)' },
  badgeBusy: { backgroundColor: 'rgba(232,160,32,0.1)' },
  badgeText: { fontSize: 11, fontWeight: '500' },
  tag: { backgroundColor: Colors.card, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 0.5, borderColor: Colors.border },
  tagText: { fontSize: 11, color: Colors.text },
  sheetBtns: { flexDirection: 'row', gap: 10 },
  btnDark: { flex: 1, backgroundColor: Colors.card, borderRadius: 12, padding: 13, alignItems: 'center', borderWidth: 0.5, borderColor: Colors.border },
  btnDarkText: { color: Colors.text, fontWeight: '500' },
  btnOrange: { flex: 1.5, backgroundColor: Colors.primary, borderRadius: 12, padding: 13, alignItems: 'center' },
  btnOrangeText: { color: '#fff', fontWeight: '500' },
})