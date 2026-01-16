<template>
  <header class="app-header">
    <div class="app-header-inner">
      NotesHUB
    </div>
  </header>

  <main class="page">
    <div class="auth-card">
      <h1>Register</h1>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>Email</label>
          <input
            type="email"
            v-model="email"
            required
            placeholder="nume.prenume@ase.ro"
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input
            type="password"
            v-model="password"
            required
            minlength="6"
          />
        </div>

        <div class="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            v-model="confirmPassword"
            required
          />
        </div>

        <button type="submit">
          Create account
        </button>
      </form>

      <p class="auth-footer">
        Ai deja cont?
        <RouterLink to="/login">Login</RouterLink>
      </p>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')

function handleRegister() {
  if (password.value !== confirmPassword.value) {
    alert('Parolele nu coincid')
    return
  }

  console.log('Register:', email.value, password.value)
}
</script>

<style scoped>
.app-header {
  width: 100%;
  height: 56px;
  background: #4F46E5;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.app-header-inner {
  max-width: 1200px;
  height: 100%;
  padding: 0 24px;

  margin-left: 0;
  margin-right: auto;

  display: flex;
  align-items: center;

  color: #fff;
  font-weight: 800;
  font-size: 18px;
  letter-spacing: 0.5px;
}

.page {
  min-height: calc(100vh - 56px);
  display: grid;
  place-items: center;
  background: #F6F7FB;
  padding: 24px;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 22px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
}

.auth-card h1 {
  margin: 0 0 18px;
  font-size: 24px;
  color: #1F2937;
}

.form-group {
  margin-bottom: 14px;
}

label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #1F2937;
}

input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  font-size: 14px;
  color: #1F2937;
}

input:focus {
  outline: none;
  border-color:#6366F1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

button {
  width: 100%;
  margin-top: 10px;
  padding: 10px 12px;
  border: none;
  border-radius: 10px;
  background: #4F46E5;
  color: white;
  font-weight: 700;
  cursor: pointer;
}

.auth-footer {
  margin-top: 14px;
  font-size: 14px;
  color: #4B5563;
}

.auth-footer a {
  color: #4F46E5;
  font-weight: 600;
  text-decoration: none;
}
</style>
