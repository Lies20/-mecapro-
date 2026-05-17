import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, RefreshControl } from 'react-native'
import { Colors2 as Colors } from '../../constants/colors'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'

export default function CommunityScreen() {
  const { user } = useAuthStore()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [comment, setComment] = useState<{ [key: string]: string }>({})
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({})
  const [comments, setComments] = useState<{ [key: string]: any[] }>({})

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await api.get('/Posts')
      setPosts(res.data)
    } catch {
      setPosts([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const toggleLike = async (postId: string) => {
    try {
      await api.post(`/Posts/${postId}/like`)
      setPosts(prev => prev.map(p => p.id === postId ? {
        ...p,
        isLikedByMe: !p.isLikedByMe,
        likesCount: p.isLikedByMe ? p.likesCount - 1 : p.likesCount + 1
      } : p))
    } catch {}
  }

  const fetchComments = async (postId: string) => {
    try {
      const res = await api.get(`/Posts/${postId}/comments`)
      setComments(prev => ({ ...prev, [postId]: res.data }))
    } catch {}
  }

  const toggleComments = async (postId: string) => {
    const showing = !showComments[postId]
    setShowComments(prev => ({ ...prev, [postId]: showing }))
    if (showing) fetchComments(postId)
  }

  const addComment = async (postId: string) => {
    if (!comment[postId]?.trim()) return
    try {
      await api.post(`/Posts/${postId}/comments`, { content: comment[postId] })
      setComment(prev => ({ ...prev, [postId]: '' }))
      fetchComments(postId)
    } catch {
      Alert.alert('Erreur', 'Impossible d\'ajouter le commentaire')
    }
  }

  const reportPost = async (postId: string) => {
    Alert.alert('Signaler', 'Pourquoi signalez-vous ce post ?', [
      { text: 'Contenu inapproprié', onPress: () => sendReport(postId, 'Contenu inapproprié') },
      { text: 'Fausse information', onPress: () => sendReport(postId, 'Fausse information') },
      { text: 'Annuler', style: 'cancel' }
    ])
  }

  const sendReport = async (postId: string, reason: string) => {
    try {
      await api.post('/Reports', { postId, reason })
      Alert.alert('✅', 'Signalement envoyé')
    } catch {}
  }

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator color={Colors.primary} size="large" />
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Communauté</Text>
        <Text style={styles.subtitle}>Les avis de la communauté</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchPosts() }} tintColor={Colors.primary} />}
      >
        {posts.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📸</Text>
            <Text style={styles.emptyText}>Aucun post pour l'instant</Text>
            <Text style={styles.emptySubText}>Soyez le premier à partager !</Text>
          </View>
        ) : (
          posts.map(post => (
            <View key={post.id} style={styles.postCard}>
              {/* Header post */}
              <View style={styles.postHeader}>
                <View style={styles.postAvatar}>
                  <Text style={styles.postAvatarText}>{post.userFirstName?.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.postUser}>{post.userFirstName}</Text>
                  <Text style={styles.postGarage}>🔧 {post.garageName}</Text>
                </View>
                <TouchableOpacity onPress={() => reportPost(post.id)}>
                  <Text style={styles.reportBtn}>⚠️</Text>
                </TouchableOpacity>
              </View>

              {/* Media placeholder */}
              <View style={styles.mediaPlaceholder}>
                <Text style={styles.mediaIcon}>{post.mediaType === 'video' ? '🎥' : '📸'}</Text>
                <Text style={styles.mediaText}>{post.mediaType === 'video' ? 'Vidéo' : 'Photo'}</Text>
              </View>

              {/* Caption */}
              {post.caption && <Text style={styles.caption}>{post.caption}</Text>}

              {/* Actions */}
              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => toggleLike(post.id)}>
                  <Text style={styles.actionIcon}>{post.isLikedByMe ? '❤️' : '🤍'}</Text>
                  <Text style={styles.actionCount}>{post.likesCount}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => toggleComments(post.id)}>
                  <Text style={styles.actionIcon}>💬</Text>
                  <Text style={styles.actionCount}>{post.commentsCount}</Text>
                </TouchableOpacity>
                <Text style={styles.postDate}>
                  {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                </Text>
              </View>

              {/* Commentaires */}
              {showComments[post.id] && (
                <View style={styles.commentsSection}>
                  {comments[post.id]?.map(c => (
                    <View key={c.id} style={styles.commentRow}>
                      <Text style={styles.commentUser}>{c.userFirstName}</Text>
                      <Text style={styles.commentText}>{c.content}</Text>
                    </View>
                  ))}
                  <View style={styles.commentInput}>
                    <TextInput
                      style={styles.commentField}
                      value={comment[post.id] || ''}
                      onChangeText={(v) => setComment(prev => ({ ...prev, [post.id]: v }))}
                      placeholder="Ajouter un commentaire..."
                      placeholderTextColor={Colors.textSecondary}
                    />
                    <TouchableOpacity onPress={() => addComment(post.id)}>
                      <Text style={styles.sendBtn}>➤</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  header: { paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12, borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  title: { fontSize: 22, fontWeight: '500', color: Colors.text },
  subtitle: { fontSize: 13, color: Colors.textSecondary },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, fontWeight: '500', color: Colors.text, marginBottom: 4 },
  emptySubText: { fontSize: 13, color: Colors.textSecondary },
  postCard: { borderBottomWidth: 0.5, borderBottomColor: Colors.border, paddingBottom: 12, marginBottom: 4 },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  postAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  postAvatarText: { color: '#fff', fontWeight: '500', fontSize: 16 },
  postUser: { fontSize: 14, fontWeight: '500', color: Colors.text },
  postGarage: { fontSize: 12, color: Colors.textSecondary },
  reportBtn: { fontSize: 16 },
  mediaPlaceholder: { backgroundColor: Colors.card, height: 200, justifyContent: 'center', alignItems: 'center', gap: 8 },
  mediaIcon: { fontSize: 40 },
  mediaText: { fontSize: 13, color: Colors.textSecondary },
  caption: { fontSize: 13, color: Colors.text, paddingHorizontal: 12, paddingTop: 8 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 12, paddingTop: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionIcon: { fontSize: 20 },
  actionCount: { fontSize: 13, color: Colors.text },
  postDate: { marginLeft: 'auto', fontSize: 11, color: Colors.textSecondary },
  commentsSection: { paddingHorizontal: 12, paddingTop: 8 },
  commentRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  commentUser: { fontSize: 12, fontWeight: '500', color: Colors.primary },
  commentText: { fontSize: 12, color: Colors.text, flex: 1 },
  commentInput: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.card, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginTop: 8 },
  commentField: { flex: 1, fontSize: 12, color: Colors.text },
  sendBtn: { fontSize: 16, color: Colors.primary },
})