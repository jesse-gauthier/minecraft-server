<template>
  <div class="container mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6">Servers</h2>
    <div class="space-y-4">
      <ul>
        <li
          v-for="server in userInformation.servers"
          :key="server.id"
          class="bg-base-200 p-4 rounded-lg shadow-md"
        >
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">{{ server.name }}</h3>
            <div class="flex gap-3">
              <!-- Server Status -->
              <span
                class="px-3 py-1 rounded-lg text-sm font-medium"
                :class="
                  server.status === 'online' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                "
              >
                {{ server.status === 'online' ? 'Online' : 'Offline' }}
              </span>
              <!-- View Button -->
              <div class="gap-4 self-center">
                <ActionButton action="Start" :server="userInformation.servers" />
                <ActionButton action="Stop" :server="userInformation.servers" />
                <ActionButton action="Restart" :server="userInformation.servers" />
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import ActionButton from '@/components/server/actions/ActionButton.vue'

// Define props for dynamic button rendering
defineProps({
  userInformation: {
    type: Object,
    required: true,
  },
})
</script>
