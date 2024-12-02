<!-- src/App.vue -->
<template>
  <div>
    <nav class="navbar bg-base-100">
      <div class="flex-1">
        <router-link class="btn btn-ghost normal-case text-xl" to="/"
          >Free Minecraft Server</router-link
        >
      </div>
      <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/dashboard">Dashboard</router-link></li>
        </ul>
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
