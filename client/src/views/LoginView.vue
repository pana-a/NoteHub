<template>
  <header class="app-header">
    <div class="app-header-inner">NotesHUB</div>
  </header>

  <main class="page">
    <div class="auth-card">
      <h1>Login</h1>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input
            type="email"
            v-model.trim="email"
            placeholder="nume.prenume@ase.ro"
            :class="{ 'input-error': touched.email && emailError }"
            @blur="touched.email = true"
          />
          <p v-if="touched.email && emailError" class="field-error">
            {{ emailError }}
          </p>
        </div>

        <div class="form-group">
          <label>Password</label>
          <input
            type="password"
            v-model="password"
            :class="{ 'input-error': touched.password && passwordError }"
            @blur="touched.password = true"
          />
          <p v-if="touched.password && passwordError" class="field-error">
            {{ passwordError }}
          </p>
        </div>

        <!-- BACKEND ERROR -->
        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <p class="auth-footer">
        Nu ai cont?
        <RouterLink to="/register">Register</RouterLink>
      </p>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

const touched = reactive({
  email: false,
  password: false
})

const emailError = computed(() => {
  if (!email.value) return 'Email is required'
  const validEmail = /^\S+@\S+\.\S+$/.test(email.value)
  if (!validEmail) return 'Please enter a valid email'
  if (!email.value.toLowerCase().endsWith('@ase.ro'))
    return 'Use your institutional email (@ase.ro)'
  return ''
})

const passwordError = computed(() => {
  if (!password.value) return 'Password is required'
  return ''
})

const formValid = computed(() => {
  return !emailError.value && !passwordError.value
})

async function handleLogin() {
  errorMsg.value = ''

  touched.email = true
  touched.password = true

  if (!formValid.value) return

  loading.value = true
  try {
    await authStore.login(email.value, password.value)
    router.push('/notes')
  } catch (err) {
    errorMsg.value = 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* layout */
.app-header {
  width: 100%;
  height: 56px;
  background: var(--color-primary);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.app-header-inner {
  max-width: 1200px;
  height: 100%;
  margin: 0;
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
  place-items: center;
  background: var(--color-bg);
  padding: 24px;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 22px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
}

.auth-card h1 {
  margin-bottom: 18px;
  font-size: 24px;
}

/* form */
.form-group {
  margin-bottom: 14px;
}

label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
}

input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: var(--color-primary-light);
}

/* errors */
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

/* button */
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

.auth-footer {
  margin-top: 14px;
  font-size: 14px;
}

.auth-footer a {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
}

.auth-footer a:hover {
  background: white
}
</style>
