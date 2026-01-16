<template>
  <header class="app-header">
    <div class="app-header-inner">
      NotesHUB
    </div>
  </header>
  
  <main class="page">
    <div class="auth-card">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input
            type="email"
            v-model="email"
            required
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input
            type="password"
            v-model="password"
            required
          />
        </div>

        <button type="submit">
          Login
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
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const email = ref('')
const password = ref('')

function handleLogin() {
  console.log('Login:', email.value, password.value)
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
  margin: 0;
  padding: 0 24px;

  display: flex;
  align-items: center;

  color: white;
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
  border-radius: 12px;
  padding: 22px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
}

.auth-card h1 {
  margin: 0 0 18px;
  font-size: 24px;
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

input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

button {
  width: 100%;
  margin-top: 10px;
  padding: 10px 12px;
  border: none;
  border-radius: 10px;
  background: #4f46e5;
  color: white;
  font-weight: 700;
  cursor: pointer;
}

.auth-footer {
  margin-top: 14px;
  font-size: 14px;
}

.auth-footer a {
  color: #4f46e5;
  font-weight: 600;
  text-decoration: none;
}
</style>
