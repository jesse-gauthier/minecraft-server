// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import Login from '../views/LoginView.vue'
import ServerDashBoard from '../views/ServerDashBoardView.vue'

const routes = [
  { path: '/', name: 'Home', component: ServerDashBoard, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: Login },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation Guard
router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // Wait for Firebase auth to initialize
  if (!authStore.isAuthResolved) {
    await authStore.authReady
  }

  if (to.meta.requiresAuth && !authStore.user) {
    return { name: 'Login' }
  }
})

export default router
