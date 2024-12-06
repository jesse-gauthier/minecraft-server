<!-- src/views/Home.vue -->
<template>
  <main class="flex">
    <ServerContainer :userInformation="userInformation" />
    <div class="container mx-auto p-4 flex gap-3">
      <ActionButton action="Start" :server="userInformation.servers" />
      <ActionButton action="Stop" :server="userInformation.servers" />
      <ActionButton action="Restart" :server="userInformation.servers" />
      <ActionButton action="Backup" :server="userInformation.servers" />
      <ActionButton action="Delete" :server="userInformation.servers" />
      <ActionButton action="Create" :server="userInformation.servers" />
    </div>
  </main>
</template>

<script setup>
// Imports
import { ref } from 'vue'

// Components
import ActionButton from '@/components/server/actions/ActionButton.vue'
import ServerContainer from '@/components/server/ServerContainer.vue'

const userInformation = ref({
  name: 'John Doe',
  email: 'john.doe@example.com',
  servers: {
    server1: {
      name: 'Server 1',
      status: 'online',
      id: '1',
    },
  },
})
</script>

<style scoped>
/* Optional styles */
</style>
