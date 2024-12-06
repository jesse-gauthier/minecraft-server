<template>
  <div>
    <h3 class="text-lg font-bold mb-4">{{ server.name }}</h3>
    <button
      v-if="action === 'Start'"
      @click="startServer(server.id)"
      class="btn btn-success text-white"
    >
      Start
    </button>
    <button
      v-if="action === 'Stop'"
      @click="stopServer(server.id)"
      class="btn btn-error text-white"
    >
      Stop
    </button>
    <button
      v-if="action === 'Restart'"
      @click="restartServer(server.id)"
      class="btn btn-warning text-black"
    >
      Restart
    </button>
    <button
      v-if="action === 'Backup'"
      @click="backupServer(server.id)"
      class="btn btn-info text-white"
    >
      Backup
    </button>
    <button
      v-if="action === 'Delete'"
      @click="deleteServer(server.id)"
      class="btn btn-error text-white"
    >
      Delete
    </button>
    <button
      v-if="action === 'Create'"
      @click="createServer({ name: 'New Server' })"
      class="btn btn-primary text-white"
    >
      Create Server
    </button>
  </div>
</template>

<script setup>
import { useServerStore } from '@/stores/serverStore'

// Access the Pinia store
const serverStore = useServerStore()

// Destructure store state and actions for usage in the template
const { startServer, stopServer, restartServer, createServer, deleteServer, backupServer } =
  serverStore

// Define props for dynamic button rendering
defineProps({
  action: {
    type: String,
    required: true,
  },
  server: {
    type: Object,
    required: true,
  },
})
</script>
