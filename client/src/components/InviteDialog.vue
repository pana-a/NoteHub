<template>
  <div class="backdrop" @click.self="cancel">
    <div class="dialog">
      <h3 class="title">{{ title }}</h3>
      <p v-if="message" class="message">{{ message }}</p>

      <div class="field">
        <label class="label">{{ label }}</label>
        <input
          class="input"
          type="email"
          :placeholder="placeholder"
          v-model.trim="email"
          @keydown.enter.prevent="confirm"
        />
        <p v-if="localError" class="field-error">{{ localError }}</p>
      </div>

      <div class="actions">
        <button class="btn secondary" type="button" @click="cancel" :disabled="loading">
          Cancel
        </button>
        <button class="btn" type="button" @click="confirm" :disabled="loading">
          {{ loading ? loadingText : confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  title: { type: String, default: 'Invite' },
  message: { type: String, default: '' },
  label: { type: String, default: 'Email' },
  placeholder: { type: String, default: 'nume.prenume@ase.ro' },
  confirmText: { type: String, default: 'Send invite' },
  loadingText: { type: String, default: 'Sending...' },
  loading: { type: Boolean, default: false },
  initialEmail: { type: String, default: '' },
  error: { type: String, default: '' }
})

const emit = defineEmits(['confirm', 'cancel'])

const email = ref(props.initialEmail || '')
const localError = ref('')

watch(
  () => props.initialEmail,
  (v) => {
    email.value = v || ''
  }
)

watch(
  () => props.error,
  (v) => {
    localError.value = v || ''
  }
)

function isValidEmail(v) {
  return /^\S+@\S+\.\S+$/.test(String(v || '').trim())
}

function confirm() {
  const value = String(email.value || '').trim()

  if (!value) {
    localError.value = 'Email is required'
    return
  }
  if (!isValidEmail(value)) {
    localError.value = 'Please enter a valid email'
    return
  }

  if (!value.toLowerCase().endsWith('@ase.ro')) {
    localError.value = 'Use an institutional email (@ase.ro)'
    return
  }

  localError.value = ''
  emit('confirm', value)
}

function cancel() {
  emit('cancel')
}
</script>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: grid;
  place-items: center;
  z-index: 1000;
}

.dialog {
  width: 100%;
  max-width: 420px;
  background: var(--color-card);
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

.title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 800;
}

.message {
  margin: 0 0 14px 0;
  font-size: 14px;
  color: var(--color-text-muted);
}

.field {
  margin-top: 8px;
}

.label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 6px;
}

.input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  font-size: 14px;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary-light);
}

.field-error {
  margin-top: 6px;
  font-size: 13px;
  color: #b91c1c;
}

.actions {
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  background: var(--color-primary);
  color: white;
}

.btn.secondary {
  background: white;
  border: 1px solid var(--color-border);
  color: #111827;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
