<template>
  <AppHeader />
  <main class="page">
    <section class="content">
      <div class="content-header">
        <h1>Invitations</h1>
        <p class="subtitle">Notes shared with you (pending).</p>
      </div>

      <p v-if="invitationsStore.error" class="error">
        {{ invitationsStore.error }}
      </p>

      <div v-if="invitationsStore.isLoading" class="state">
        Loading invitations...
      </div>

      <div v-else-if="invitationsStore.invitations.length === 0" class="empty">
        <h2>No invitations</h2>
        <p>You don’t have any pending invitations.</p>
      </div>

      <div v-else class="list">
        <article
          v-for="inv in invitationsStore.invitations"
          :key="inv.id"
          class="invite-card"
        >
          <div class="top">
            <div class="title-wrap">
              <h3 class="title">
                {{ inv.note?.title || 'Note not available' }}
              </h3>
              <span class="badge">Pending</span>
            </div>

            <p class="from">
              From: <strong>{{ inv.fromEmail }}</strong>
            </p>
          </div>

          <p class="preview" v-if="inv.note?.preview">
            {{ inv.note.preview }}
          </p>
          <p class="preview muted" v-else>
            No preview available.
          </p>

          <div v-if="inv.note?.tags?.length" class="tags">
            <span v-for="t in inv.note.tags" :key="t" class="tag">#{{ t }}</span>
          </div>

          <div class="actions">
            <button
              class="btn"
              type="button"
              :disabled="busyId === inv.id"
              @click="accept(inv.id)"
            >
              {{ busyId === inv.id && busyAction === 'accept' ? 'Accepting...' : 'Accept' }}
            </button>

            <button
              class="btn secondary"
              type="button"
              :disabled="busyId === inv.id"
              @click="decline(inv.id)"
            >
              {{ busyId === inv.id && busyAction === 'decline' ? 'Declining...' : 'Decline' }}
            </button>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import { useInvitationsStore } from '@/stores/invitations'
import { useNotesStore } from '@/stores/notes'

const invitationsStore = useInvitationsStore()
const notesStore = useNotesStore()

const busyId = ref(null)
const busyAction = ref(null)

onMounted(async () => {
  await invitationsStore.fetchInvitations()
})

async function accept(id) {
  busyId.value = id
  busyAction.value = 'accept'
  try {
    const ok = await invitationsStore.acceptInvitation(id)
    if (ok) {
      await notesStore.fetchNotes()
    }
  } finally {
    busyId.value = null
    busyAction.value = null
  }
}

async function decline(id) {
  busyId.value = id
  busyAction.value = 'decline'
  try {
    await invitationsStore.declineInvitation(id)
  } finally {
    busyId.value = null
    busyAction.value = null
  }
}
</script>

<style scoped>
.page {
  min-height: calc(100vh - 56px);
  background: var(--color-bg);
  padding: 24px;
}

.content {
  max-width: 900px;
  margin: 0 auto;
}

.content-header h1 {
  margin: 0;
  font-size: 26px;
}

.subtitle {
  margin: 6px 0 0 0;
  color: var(--color-text-muted);
  font-size: 14px;
}

.error {
  margin-top: 12px;
  padding: 10px;
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #b91c1c;
}

.state {
  margin-top: 14px;
  color: var(--color-text-muted);
}

.empty {
  margin-top: 18px;
  padding: 18px;
  border: 1px solid var(--color-border);
  background: var(--color-card);
  border-radius: 12px;
}

.list {
  margin-top: 16px;
  display: grid;
  gap: 12px;
}

.invite-card {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
}

.top {
  display: grid;
  gap: 6px;
}

.title-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.title {
  margin: 0;
  font-size: 16px;
  font-weight: 900;
}

.badge {
  font-size: 11px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.15);
  color: #2563eb;
}

.from {
  margin: 0;
  font-size: 13px;
  color: var(--color-text-muted);
}

.preview {
  margin: 10px 0 0 0;
  font-size: 14px;
  line-height: 1.35;
  color: var(--color-text-muted);
}

.preview.muted {
  opacity: 0.9;
}

.tags {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: rgba(0, 0, 0, 0.03);
}

.actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  background: var(--color-primary);
  color: white;
  font-weight: 800;
  cursor: pointer;
}

.btn.secondary {
  background: white;
  color: #111827;
  border: 1px solid var(--color-border);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
