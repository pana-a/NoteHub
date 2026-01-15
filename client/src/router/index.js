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
      component: () => import ('../views/NotesView.vue')
    },
    {
      path: '/notes/new',
      name: 'noteCreate',
      component: () => import ('../views/NoteCreateView.vue')
    },
    {
      path: '/notes/:id',
      name: 'noteDetails',
      component: () => import ('../views/NoteDetailsView.vue')
    },

    {
      path: '/invitations',
      name: 'invitations',
      component: () => import ('../views/InvitationsView.vue')
    }
  ],
})

export default router
