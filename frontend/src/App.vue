<!-- src/App.vue -->
<template>
  <div>
    <nav class="navbar bg-base-100">
      <div class="flex-1">
        <router-link class="btn btn-ghost normal-case text-xl" to="/"
          >Free Minecraft Server</router-link
        >
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script setup>
// No specific script needed
</script>

<style scoped>
/* Optional styles */
</style>
