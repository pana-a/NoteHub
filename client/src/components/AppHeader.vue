<template>
  <header class="app-header">
    <div class="app-header-inner">
      <RouterLink class="brand" to="/notes">NotesHUB</RouterLink>

      <nav v-if="isAuthed" class="nav">
        <RouterLink class="nav-link" to="/notes" active-class="active">Notes</RouterLink>
        <RouterLink class="nav-link" to="/invitations" active-class="active">Invitations</RouterLink>

        <button class="nav-link logout" type="button" @click="handleLogout">
          Logout
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isAuthed = computed(() => authStore.isAuthenticated)

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
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
  justify-content: space-between;
  gap: 16px;
}

.brand {
  color: white;
  font-weight: 800;
  font-size: 18px;
  text-decoration: none;
  background: transparent; 
  padding: 0;                
  border-radius: 0;    
}

.nav {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 700;
  font-size: 14px;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.08);
  cursor: pointer;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.16);
}

.active {
  background: rgba(255, 255, 255, 0.22);
  border-color: rgba(255, 255, 255, 0.28);
}

.logout {
  background: rgba(255, 255, 255, 0.08);
}
</style>
