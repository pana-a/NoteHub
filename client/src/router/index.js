import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
   
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import ('../views/RegisterView.vue')
    },
    {
      path: '/notes',
      name: 'notes',
      component: () => import ('../views/NotesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/notes/new',
      name: 'noteCreate',
      component: () => import ('../views/NoteCreateView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/notes/:id',
      name: 'noteDetails',
      component: () => import ('../views/NoteDetailsView.vue'),
      meta: { requiresAuth: true }
    },

    {
      path: '/invitations',
      name: 'invitations',
      component: () => import ('../views/InvitationsView.vue'),
      meta: { requiresAuth: true }
    }
  ],
})

import { useAuthStore } from '@/stores/auth'

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }

  if ((to.name === 'login' || to.name === 'register') && authStore.isAuthenticated) {
    return { name: 'notes' }
  }
})

export default router
