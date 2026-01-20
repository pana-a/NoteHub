import { ref } from 'vue'
import { defineStore } from 'pinia'
import { API_BASE_URL } from '@/utils/constants'
import { useAuthStore } from './auth'
import router from '@/router' 

export const useNotesStore = defineStore('notes', () => {
  const notes = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  function handleAuthError(status) {
    if (status === 401 || status === 403) {
      const authStore = useAuthStore()
      authStore.logout()
      router.push('/login')
      return true
    }
    return false
  }

  async function fetchNotes() {
    const authStore = useAuthStore()
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_BASE_URL}/notes`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })

      if (handleAuthError(response.status)) return

      const data = await response.json().catch(() => [])
      if (!response.ok) throw new Error(data?.error || 'Failed to fetch notes.')

      notes.value = data
    } catch (e) {
      error.value = e.message
      notes.value = []
    } finally {
      isLoading.value = false
    }
  }

  async function fetchNote(id) {
    const authStore = useAuthStore()
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })

      if (handleAuthError(response.status)) return null

      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.error || 'Failed to fetch note.')

      return data
    } catch (e) {
      error.value = e.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function createNote(note) {
    const authStore = useAuthStore()
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authStore.token}`
        },
        body: JSON.stringify(note)
      })

      if (handleAuthError(response.status)) return null

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        const msg =
          (Array.isArray(data?.error) && data.error[0]?.msg) ||
          data?.error ||
          'Failed to create note.'
        throw new Error(msg)
      }

      await fetchNotes()
      return data
    } catch (e) {
      error.value = e.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function updateNote(id, note) {
    const authStore = useAuthStore()
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authStore.token}`
        },
        body: JSON.stringify(note)
      })

      if (handleAuthError(response.status)) return null

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        const msg =
          (Array.isArray(data?.error) && data.error[0]?.msg) ||
          data?.error ||
          'Failed to update note.'
        throw new Error(msg)
      }

      await fetchNotes()
      return data
    } catch (e) {
      error.value = e.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function deleteNote(id) {
    const authStore = useAuthStore()
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authStore.token}` }
      })

      if (handleAuthError(response.status)) return false

      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.error || 'Failed to delete note.')

      await fetchNotes()
      return true
    } catch (e) {
      error.value = e.message
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    notes,
    isLoading,
    error,
    fetchNotes,
    fetchNote,
    createNote,
    updateNote,
    deleteNote
  }
})
