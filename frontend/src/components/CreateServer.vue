<template>
  <div class="container mx-auto p-4">
    <h2 class="text-xl font-bold mb-4">Create a New Server</h2>
    <form @submit.prevent="createServer" class="space-y-4">
      <div>
        <label class="block text-sm font-medium">Server Name</label>
        <input v-model="serverName" type="text" class="input input-bordered w-full" required />
      </div>
      <div>
        <label class="block text-sm font-medium">Memory (MB)</label>
        <input
          v-model.number="memory"
          type="number"
          min="512"
          max="16384"
          class="input input-bordered w-full"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium">Disk Space (MB)</label>
        <input
          v-model.number="disk"
          type="number"
          min="1024"
          max="102400"
          class="input input-bordered w-full"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary w-full" :disabled="isLoading">
        <span v-if="isLoading" class="loading loading-spinner"></span>
        <span v-else>Create Server</span>
      </button>
    </form>
    <p v-if="message" class="text-green-500 mt-4">{{ message }}</p>
    <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>

    <!-- Modal for displaying server information -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white p-6 rounded shadow-lg w-1/3">
        <h3 class="text-lg font-bold mb-4">Server Created Successfully</h3>
        <p><strong>Server Name:</strong> {{ serverName }}</p>
        <p><strong>Memory:</strong> {{ memory }} MB</p>
        <p><strong>Disk Space:</strong> {{ disk }} MB</p>
        <p><strong>Username:</strong> {{ serverInfo.username }}</p>
        <p><strong>Password:</strong> {{ serverInfo.temp_password }}</p>
        <button @click="closeModal" class="btn btn-secondary mt-4">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const serverName = ref('')
const memory = ref(1024) // Default 1GB
const disk = ref(10240) // Default 10GB
const isLoading = ref(false)
const message = ref('')
const error = ref('')
const showModal = ref(false)
const serverInfo = ref({})

const createServer = async () => {
  isLoading.value = true
  message.value = ''
  error.value = ''
  showModal.value = false
  serverInfo.value = {}

  try {
    const response = await fetch('http://147.79.74.105:3000/create-server', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: authStore.user.uid,
        server_name: serverName.value,
        memory: memory.value,
        disk: disk.value,
      }),
    })

    if (!response.ok) {
      // Handle HTTP errors
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to create server.')
    }

    const data = await response.json()
    message.value = data.message || 'Server created successfully!'
    serverInfo.value = {
      ...data.server,
      username: data.server.user,
      temp_password: data.server.temp_password,
    }
    showModal.value = true
  } catch (err) {
    error.value = err.message
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const closeModal = () => {
  showModal.value = false
}
</script>

<style scoped>
/* Optional styles */
</style>
