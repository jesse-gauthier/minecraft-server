<template>
  <header class="flex justify-between p-4 inner-wrapper">
    <RouterLink to="/" id="branding" class="max-w-[150px]">
      <img src="@/assets/images/branding/logo.svg" />
    </RouterLink>
    <nav class="grow">
      <ul class="flex w-1/4 ml-auto justify-evenly">
        <li v-for="link of links" :key="link.path" class="capitalize">
          <RouterLink>{{ link.name }}</RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'

const links = {
  home: {
    path: '/',
    name: 'home',
  },
  educators: {
    path: '/educators',
    name: 'educators',
  },
  gamers: {
    path: '/gamers',
    name: 'gamers',
  },
  donate: {
    path: '/donate',
    name: 'donate',
    styled: true,
  },
}
</script>
