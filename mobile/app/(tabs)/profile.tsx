import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { Colors2 as Colors } from '../../constants/colors'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'

export default function ProfileScreen() {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    vehicleType: '',
    vehicleModel: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await api.get('/Users/me')
      setProfile(res.data)
      setForm({
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        phone: res.data.phone || '',
        vehicleType: res.data.vehicleType || '',
        vehicleModel: res.data.vehicleModel || '',
      })
    } catch {
      Alert.alert('Erreur', 'Impossible de charger le profil')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/Users/me', form)
      setProfile({ ...profile, ...form })
      setEditing(false)
      Alert.alert('✅', 'Profil mis à jour !')
    } catch {
      Alert.alert('Erreur', 'Impossible de sauvegarder')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    Alert.alert('Déconnexion', 'Tu veux vraiment te déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Oui', onPress: async () => {
        await logout()
        router.replace('/(auth)/login')
      }}
    ])
  }

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator color={Colors.primary} />
    </View>
  )

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{profile?.firstName?.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{profile?.firstName} {profile?.lastName}</Text>
        <Text style={styles.email}>{profile?.email}</Text>
        {user?.role === 'admin' && (
          <View style={styles.adminBadge}>
            <Text style={styles.adminText}>👑 Admin</Text>
          </View>
        )}
      </View>

      {/* Infos personnelles */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          <TouchableOpacity onPress={() => setEditing(!editing)}>
            <Text style={styles.editBtn}>{editing ? 'Annuler' : '✏️ Modifier'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          {[
            { label: 'Prénom', key: 'firstName', placeholder: 'Jean' },
            { label: 'Nom', key: 'lastName', placeholder: 'Dupont' },
            { label: 'Téléphone', key: 'phone', placeholder: '+33 6 12 34 56 78' },
          ].map((field, i) => (
            <View key={field.key} style={[styles.fieldRow, i > 0 && styles.fieldBorder]}>
              <Text style={styles.fieldLabel}>{field.label}</Text>
              {editing ? (
                <TextInput
                  style={styles.fieldInput}
                  value={(form as any)[field.key]}
                  onChangeText={(v) => setForm({ ...form, [field.key]: v })}
                  placeholder={field.placeholder}
                  placeholderTextColor={Colors.textSecondary}
                />
              ) : (
                <Text style={styles.fieldValue}>{(profile as any)?.[field.key] || '—'}</Text>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Véhicule */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mon véhicule</Text>
        <View style={styles.card}>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Type</Text>
            {editing ? (
              <View style={styles.chips}>
                {['Voiture', 'Moto', 'Utilitaire'].map(t => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.chip, form.vehicleType === t && styles.chipActive]}
                    onPress={() => setForm({ ...form, vehicleType: t })}
                  >
                    <Text style={[styles.chipText, form.vehicleType === t && { color: '#fff' }]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={styles.fieldValue}>{profile?.vehicleType || '—'}</Text>
            )}
          </View>
          <View style={[styles.fieldRow, styles.fieldBorder]}>
            <Text style={styles.fieldLabel}>Modèle</Text>
            {editing ? (
              <TextInput
                style={styles.fieldInput}
                value={form.vehicleModel}
                onChangeText={(v) => setForm({ ...form, vehicleModel: v })}
                placeholder="Renault Clio"
                placeholderTextColor={Colors.textSecondary}
              />
            ) : (
              <Text style={styles.fieldValue}>{profile?.vehicleModel || '—'}</Text>
            )}
          </View>
        </View>

        {editing && (
          <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>💾 Sauvegarder</Text>}
          </TouchableOpacity>
        )}
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/create-garage' as any)}>
            <Text style={styles.actionIcon}>🔧</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>Inscrire mon garage</Text>
              <Text style={styles.actionSub}>Référencer votre établissement</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.fieldBorder}>
            <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/(tabs)/appointments' as any)}>
              <Text style={styles.actionIcon}>📅</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.actionTitle}>Mes rendez-vous</Text>
                <Text style={styles.actionSub}>Voir l'historique</Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Déconnexion */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 24, paddingHorizontal: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, fontWeight: '500', color: '#fff' },
  name: { fontSize: 20, fontWeight: '500', color: Colors.text, marginBottom: 4 },
  email: { fontSize: 13, color: Colors.textSecondary, marginBottom: 8 },
  adminBadge: { backgroundColor: 'rgba(232,160,32,0.15)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  adminText: { fontSize: 12, color: Colors.primary, fontWeight: '500' },
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '500', color: Colors.text },
  editBtn: { fontSize: 13, color: Colors.primary },
  card: { backgroundColor: Colors.card, borderRadius: 14, overflow: 'hidden', borderWidth: 0.5, borderColor: Colors.border },
  fieldRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  fieldBorder: { borderTopWidth: 0.5, borderTopColor: Colors.border },
  fieldLabel: { fontSize: 13, color: Colors.textSecondary, width: 80 },
  fieldValue: { fontSize: 13, color: Colors.text, flex: 1, textAlign: 'right' },
  fieldInput: { fontSize: 13, color: Colors.text, flex: 1, textAlign: 'right' },
  chips: { flexDirection: 'row', gap: 6 },
  chip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, backgroundColor: Colors.background, borderWidth: 0.5, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 11, color: Colors.textSecondary },
  saveBtn: { backgroundColor: Colors.primary, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#fff', fontWeight: '500' },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  actionIcon: { fontSize: 20 },
  actionTitle: { fontSize: 13, fontWeight: '500', color: Colors.text },
  actionSub: { fontSize: 11, color: Colors.textSecondary },
  actionArrow: { fontSize: 20, color: Colors.textSecondary },
  logoutBtn: { backgroundColor: 'rgba(224,68,68,0.1)', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 0.5, borderColor: '#E04444' },
  logoutText: { color: '#E04444', fontWeight: '500' },
})