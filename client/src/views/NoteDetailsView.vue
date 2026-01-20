<template>
  <header class="app-header">
    <div class="app-header-inner">NotesHUB</div>
  </header>

  <main class="page">
    <div class="card">
      <div class="card-header">
        <RouterLink class="link" to="/notes">Back</RouterLink>

        <div class="actions">
          <button v-if="!isEditMode" class="btn secondary" type="button" @click="enterEdit">
            Edit
          </button>
          <button class="btn danger" type="button" @click="handleDelete">
            Delete
          </button>
        </div>
      </div>

      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

      <div v-if="loading" class="state">Loading note...</div>

      <template v-else>
        <div v-if="!isEditMode">
          <h1 class="title">{{ note?.title || 'Untitled' }}</h1>

          <div v-if="noteTags.length" class="tags">
            <span v-for="t in noteTags" :key="t" class="tag">#{{ t }}</span>
          </div>

          <div class="content">
            <p class="content-text" v-if="note?.content">{{ note.content }}</p>
            <p class="muted" v-else>No content.</p>
          </div>
        </div>

        <form v-else @submit.prevent="handleSave">
          <h1 class="title">Edit note</h1>

          <div class="form-group">
            <label>Title</label>
            <input
              type="text"
              v-model.trim="form.title"
              :class="{ 'input-error': touched.title && titleError }"
              @blur="touched.title = true"
            />
            <p v-if="touched.title && titleError" class="field-error">
              {{ titleError }}
            </p>
          </div>

          <div class="form-group">
            <label>Content</label>
            <textarea
              v-model="form.content"
              rows="10"
              :class="{ 'input-error': touched.content && contentError }"
              @blur="touched.content = true"
            />
            <p v-if="touched.content && contentError" class="field-error">
              {{ contentError }}
            </p>
          </div>

          <div class="form-group">
            <label>Tags (comma separated)</label>
            <input type="text" v-model="form.tagsInput" placeholder="e.g. tic, seminar" />
            <p class="hint">Optional. Use commas to separate tags.</p>
          </div>

          <div class="edit-actions">
            <button class="btn" type="submit" :disabled="saving || !formValid">
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
            <button class="btn secondary" type="button" :disabled="saving" @click="cancelEdit">
              Cancel
            </button>
          </div>
        </form>
      </template>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useNotesStore } from '@/stores/notes'

const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()

const note = ref(null)

const loading = ref(false)
const saving = ref(false)
const errorMsg = ref('')

const isEditMode = computed(() => route.query.mode === 'edit')

const form = reactive({
  title: '',
  content: '',
  tagsInput: ''
})

const touched = reactive({
  title: false,
  content: false
})

const titleError = computed(() => {
  if (!form.title) return 'Title is required'
  if (form.title.length > 120) return 'Title must be max 120 characters'
  return ''
})

const contentError = computed(() => {
  if (!form.content) return 'Content is required'
  if (form.content.length > 5000) return 'Content must be max 5000 characters'
  return ''
})

const formValid = computed(() => !titleError.value && !contentError.value)

const noteTags = computed(() => {
  if (!note.value?.tags || !Array.isArray(note.value.tags)) return []
  return note.value.tags
})

function parseTags(input) {
  if (!input) return []
  return input
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)
    .slice(0, 20)
}

function tagsToInput(tags) {
  if (!Array.isArray(tags) || tags.length === 0) return ''
  return tags.join(', ')
}

async function loadNote() {
  errorMsg.value = ''
  loading.value = true
  try {
    const id = route.params.id
    const data = await notesStore.fetchNote(id)

    if (!data) {
      throw new Error(notesStore.error || 'Note not found')
    }

    note.value = data

    form.title = data.title || ''
    form.content = data.content || ''
    form.tagsInput = tagsToInput(data.tags)
  } catch (err) {
    errorMsg.value = err?.message || 'Failed to load note'
  } finally {
    loading.value = false
  }
}

function enterEdit() {
  router.replace({ query: { ...route.query, mode: 'edit' } })
}

function cancelEdit() {
  form.title = note.value?.title || ''
  form.content = note.value?.content || ''
  form.tagsInput = tagsToInput(note.value?.tags)

  touched.title = false
  touched.content = false

  const q = { ...route.query }
  delete q.mode
  router.replace({ query: q })
}

async function handleSave() {
  errorMsg.value = ''
  touched.title = true
  touched.content = true

  if (!formValid.value) return

  saving.value = true
  try {
    const id = route.params.id
    const payload = {
      title: form.title,
      content: form.content,
      tags: parseTags(form.tagsInput)
    }

    const updated = await notesStore.updateNote(id, payload)
    if (!updated) {
      throw new Error(notesStore.error || 'Failed to update note')
    }

    note.value = updated
    cancelEdit()
  } catch (err) {
    errorMsg.value = err?.message || 'Failed to save note'
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  errorMsg.value = ''
  const ok = confirm('Delete this note? This action cannot be undone.')
  if (!ok) return

  try {
    const id = route.params.id
    const success = await notesStore.deleteNote(id)
    if (!success) {
      throw new Error(notesStore.error || 'Failed to delete note')
    }

    router.push('/notes')
  } catch (err) {
    errorMsg.value = err?.message || 'Failed to delete note'
  }
}

onMounted(loadNote)
</script>

<style scoped>
.app-header {
  width: 100%;
  height: 56px;
  background: var(--color-primary);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.app-header-inner {
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  color: white;
  font-weight: 800;
  font-size: 18px;
}

.page {
  min-height: calc(100vh - 56px);
  display: grid;
  place-items: start center;
  background: var(--color-bg);
  padding: 24px;
}

.card {
  width: 100%;
  max-width: 720px;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 22px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 14px;
}

.link {
  color: var(--color-primary);
  font-weight: 700;
  text-decoration: none;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  background: var(--color-primary);
  color: white;
  font-weight: 700;
  cursor: pointer;
}

.btn.secondary {
  background: white;
  color: #111827;
  border: 1px solid var(--color-border);
}

.btn.danger {
  background: #b91c1c;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.title {
  margin: 6px 0 0 0;
  font-size: 24px;
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

.content {
  margin-top: 14px;
}

.content-text {
  white-space: pre-wrap;
  line-height: 1.45;
  margin: 0;
}

.muted {
  color: var(--color-text-muted);
  margin: 0;
}

.form-group {
  margin-bottom: 14px;
}

label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
}

input,
textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
}

textarea {
  resize: vertical;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--color-primary-light);
}

.hint {
  margin-top: 6px;
  font-size: 12px;
  color: var(--color-text-muted);
}

.field-error {
  margin-top: 6px;
  font-size: 13px;
  color: #b91c1c;
}

.input-error {
  border-color: rgba(239, 68, 68, 0.6);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
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

.edit-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
</style>
