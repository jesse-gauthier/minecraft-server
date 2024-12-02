<!-- src/views/Login.vue -->
<template>
  <div class="container mx-auto p-4 flex flex-col items-center">
    <h1 class="text-2xl font-bold mb-8">Login Page</h1>
    <button
      @click="login"
      class="btn hover:text-white w-64 h-12 flex items-center border-3 border-gray-400 justify-center"
    >
      <img
        class="w-6 h-6 mr-2"
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google Logo"
      />
      <span class="font-medium text-gray-700">Sign in with Google</span>
    </button>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const login = async () => {
  await authStore.login()
  router.push({ name: 'Home' })
}
</script>
