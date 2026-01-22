<template>
<AppHeader />
  <main class="page">
    <div class="card">
      <div class="card-header">
        <h1>New note</h1>
        <RouterLink class="link" to="/notes">Back</RouterLink>
      </div>

      <form @submit.prevent="handleCreate">
        <div class="form-group">
          <label>Title*</label>
          <input
            type="text"
            v-model.trim="title"
            placeholder="Title"
            :class="{ 'input-error': touched.title && titleError }"
            @blur="touched.title = true"
          />
          <p v-if="touched.title && titleError" class="field-error">
            {{ titleError }}
          </p>
        </div>

        <div class="form-group">
          <label>Content*</label>
          <textarea
            v-model="content"
            placeholder="Write your note..."
            rows="8"
            :class="{ 'input-error': touched.content && contentError }"
            @blur="touched.content = true"
          />
          <p v-if="touched.content && contentError" class="field-error">
            {{ contentError }}
          </p>
        </div>

        <div class="form-group">
          <label>Tags (comma separated)</label>
          <input
            type="text"
            v-model="tagsInput"
            placeholder="e.g. tic, seminar, ase"
          />
        </div>

        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

        <button type="submit" :disabled="loading || !formValid">
          {{ loading ? 'Creating...' : 'Create note' }}
        </button>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useNotesStore } from '@/stores/notes'
import AppHeader from '@/components/AppHeader.vue'

const router = useRouter()
const notesStore = useNotesStore()

const title = ref('')
const content = ref('')
const tagsInput = ref('')

const errorMsg = ref('')
const loading = ref(false)

const touched = reactive({
  title: false,
  content: false
})

const titleError = computed(() => {
  if (!title.value) return 'Title is required'
  if (title.value.length > 120) return 'Title must be max 120 characters'
  return ''
})

const contentError = computed(() => {
  if (!content.value) return 'Content is required'
  if (content.value.length > 5000) return 'Content must be max 5000 characters'
  return ''
})

const formValid = computed(() => {
  return !titleError.value && !contentError.value
})

function parseTags(input) {
  if (!input) return []
  return input
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)
    .slice(0, 20)
}

async function handleCreate() {
  errorMsg.value = ''
  touched.title = true
  touched.content = true

  if (!formValid.value) return

  loading.value = true
  try {
    const payload = {
      title: title.value,
      content: content.value,
      tags: parseTags(tagsInput.value)
    }

    const result = await notesStore.createNote(payload)

    if (!result) {
      throw new Error(notesStore.error || 'Failed to create note')
    }

    router.push('/notes')
  } catch (err) {
    errorMsg.value = err?.message || 'Failed to create note'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
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
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 18px;
}

.card h1 {
  margin: 0;
  font-size: 24px;
}

.link {
  color: var(--color-primary);
  font-weight: 700;
  text-decoration: none;
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

button {
  width: 100%;
  margin-top: 12px;
  padding: 10px;
  border: none;
  border-radius: 10px;
  background: var(--color-primary);
  color: white;
  font-weight: 700;
  cursor: pointer;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
