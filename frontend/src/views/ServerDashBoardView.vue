<!-- src/views/Protected.vue -->
<template>
  <div class="container mx-auto p-4 max-w-[300px]">
    <h1 class="text-2xl font-bold">Protected Page</h1>
    <p>You are logged in as: {{ user?.displayName }}</p>
    <button @click="logout" class="btn btn-secondary mt-4">Logout</button>
    <CreateServer />
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import CreateServer from '/src/components/CreateServer.vue'

const authStore = useAuthStore()
const user = authStore.user

const logout = async () => {
  await authStore.logout()
}
</script>

<style scoped>
/* Optional styles */
</style>
