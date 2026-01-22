import { ref } from 'vue'
import { defineStore } from 'pinia'
import { API_BASE_URL } from '@/utils/constants'
import { useAuthStore } from './auth'
import router from '@/router'

export const useInvitationsStore = defineStore('invitations', () => {
  const invitations = ref([])
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

  async function fetchInvitations() {
    const authStore = useAuthStore()
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_BASE_URL}/invitations`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })

      if (handleAuthError(response.status)) return

      const data = await response.json().catch(() => [])
      if (!response.ok) throw new Error(data?.error || 'Failed to fetch invitations.')

      invitations.value = Array.isArray(data) ? data : []
    } catch (e) {
      error.value = e.message
      invitations.value = []
    } finally {
      isLoading.value = false
    }
  }

  async function sendInvitation(noteId, email) {
    const authStore = useAuthStore()
    error.value = null

    try {
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}/invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authStore.token}`
        },
        body: JSON.stringify({ toEmail: email })
      })

      if (handleAuthError(response.status)) return false

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        const msg =
          (Array.isArray(data?.error) && data.error[0]?.msg) ||
          data?.error ||
          'Failed to send invitation.'
        throw new Error(msg)
      }

      return true
    } catch (e) {
      error.value = e.message
      return false
    }
  }

  async function acceptInvitation(id) {
    const authStore = useAuthStore()
    error.value = null

    try {
      const response = await fetch(`${API_BASE_URL}/invitations/${id}/accept`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })

      if (handleAuthError(response.status)) return false

      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.error || 'Failed to accept invitation.')

      invitations.value = invitations.value.filter((x) => x.id !== id)
      return true
    } catch (e) {
      error.value = e.message
      return false
    }
  }

  async function declineInvitation(id) {
    const authStore = useAuthStore()
    error.value = null

    try {
      const response = await fetch(`${API_BASE_URL}/invitations/${id}/decline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })

      if (handleAuthError(response.status)) return false

      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.error || 'Failed to decline invitation.')

      invitations.value = invitations.value.filter((x) => x.id !== id)
      return true
    } catch (e) {
      error.value = e.message
      return false
    }
  }

  return {
    invitations,
    isLoading,
    error,
    fetchInvitations,
    sendInvitation, 
    acceptInvitation,
    declineInvitation
  }
})
