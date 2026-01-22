<template>
  <div class="backdrop" @click.self="cancel">
    <div class="dialog">
      <h3 class="title">{{ title }}</h3>
      <p class="message">{{ message }}</p>

      <div class="actions">
        <button class="btn secondary" @click="cancel">
          Cancel
        </button>
        <button class="btn danger" @click="confirm">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Are you sure?'
  },
  message: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  }
})

const emit = defineEmits(['confirm', 'cancel'])

function confirm() {
  emit('confirm')
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
  max-width: 360px;
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
  margin: 0;
  font-size: 14px;
  color: var(--color-text-muted);
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
}

.btn.secondary {
  background: white;
  border: 1px solid var(--color-border);
}

.btn.danger {
  background: #ef4444;
  color: white;
}
</style>
