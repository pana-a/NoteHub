<template>
  <AppHeader />
  <main class="page">
    <section class="content">
      <div class="content-header">
        <div>
          <h1>All notes</h1>
        </div>

        <RouterLink class="btn" to="/notes/new">+ New note</RouterLink>
      </div>

      <p v-if="notesStore.error" class="error">{{ notesStore.error }}</p>

      <div v-if="notesStore.isLoading" class="state">Loading notes...</div>

      <div v-else-if="notesStore.notes.length === 0" class="empty">
        <h2>No notes yet</h2>
        <p>Create your first note to see it here.</p>
      </div>

      <div v-else class="grid">
        <article
          v-for="note in notesStore.notes"
          :key="note.id"
          class="note-card"
          role="button"
          tabindex="0"
          @click="goToNote(note.id)"
          @keydown.enter="goToNote(note.id)"
        >
          <div class="card-top">
            <h3 class="title">{{ note.title }}</h3>

            <div class="menu-wrap" @click.stop>
              <button class="menu-btn" type="button" @click.stop="toggleMenu(note.id)">
                ⋯
              </button>

              <div v-if="openMenuId === note.id" class="menu">
                <button class="menu-item" type="button" @click="viewNote(note.id)">
                  View
                </button>
                <button class="menu-item" type="button" @click="editNote(note.id)">
                  Edit
                </button>
                <button class="menu-item danger" type="button" @click="deleteNote(note.id)">
                  Delete
                </button>
              </div>
            </div>
          </div>

          <p class="preview">{{ preview(note.content) }}</p>

          <div v-if="Array.isArray(note.tags) && note.tags.length" class="tags">
            <span v-for="t in note.tags" :key="t" class="tag">#{{ t }}</span>
          </div>
        </article>
      </div>
    </section>
  </main>
  <ConfirmDialog
    v-if="showDeleteDialog"
    title="Delete note?"
    message="This action cannot be undone."
    confirmText="Delete"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useNotesStore } from '@/stores/notes'
import AppHeader from '@/components/AppHeader.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const router = useRouter()
const notesStore = useNotesStore()

const openMenuId = ref(null)

const showDeleteDialog = ref(false)
const noteIdToDelete = ref(null)

onMounted(async () => {
  await notesStore.fetchNotes()
  window.addEventListener('click', closeMenu)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', closeMenu)
})

function closeMenu() {
  openMenuId.value = null
}

function toggleMenu(id) {
  openMenuId.value = openMenuId.value === id ? null : id
}

function goToNote(id) {
  router.push(`/notes/${id}`)
}

function viewNote(id) {
  closeMenu()
  router.push(`/notes/${id}`)
}

function editNote(id) {
  closeMenu()
  router.push({ path: `/notes/${id}`, query: { mode: 'edit' } })
}

function deleteNote(id) {
  closeMenu()
  noteIdToDelete.value = id
  showDeleteDialog.value = true
}

async function confirmDelete() {
  if (!noteIdToDelete.value) return

  await notesStore.deleteNote(noteIdToDelete.value)

  showDeleteDialog.value = false
  noteIdToDelete.value = null
}

function cancelDelete() {
  showDeleteDialog.value = false
  noteIdToDelete.value = null
}

function preview(text) {
  if (!text) return ''
  const trimmed = String(text).trim()
  if (trimmed.length <= 140) return trimmed
  return trimmed.slice(0, 140) + '...'
}
</script>

<style scoped>
.page {
  min-height: calc(100vh - 56px);
  background: var(--color-bg);
  padding: 24px;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}

.content-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

h1 {
  margin: 0;
  font-size: 26px;
}

.subtitle {
  margin: 6px 0 0 0;
  color: var(--color-text-muted);
  font-size: 14px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  border-radius: 10px;
  background: var(--color-primary);
  color: white;
  text-decoration: none;
  font-weight: 700;
  border: none;
  cursor: pointer;
}

.btn:hover {
  opacity: 0.95;
}

.error {
  margin-top: 10px;
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

.empty h2 {
  margin: 0 0 6px 0;
}

.empty p {
  margin: 0;
  color: var(--color-text-muted);
}

.grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

@media (max-width: 980px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.note-card {
  position: relative;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  outline: none;
}

.note-card:hover {
  border-color: rgba(0, 0, 0, 0.12);
}

.note-card:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);
}

.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.title {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  line-height: 1.2;
}

.preview {
  margin: 10px 0 0 0;
  color: var(--color-text-muted);
  font-size: 14px;
  line-height: 1.35;
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

.menu-wrap {
  position: relative;
}

.menu-btn {
  width: 34px;
  height: 30px;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  background: white;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
}

.menu {
  position: absolute;
  top: 36px;
  right: 0;
  width: 160px;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  padding: 6px;
  z-index: 10;
}

.menu-item {
  width: 100%;
  text-align: left;
  padding: 10px 10px;
  border-radius: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 600;
}

.menu-item:hover {
  background: rgba(0, 0, 0, 0.06);
}

.menu-item.danger {
  color: #b91c1c;
}
</style>
