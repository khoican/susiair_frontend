<script setup lang="ts">
import { BookOpen, CalendarDays, Home, Menu } from 'lucide-vue-next'

const route = useRoute()
const isActive = (path: string) => route.path === path
</script>

<template>
  <nav class="nav">
    <NuxtLink class="nav__item" :class="{ 'nav__item--active': isActive('/') }" to="/">
      <Home :size="22" />
      <span>Home</span>
    </NuxtLink>

    <NuxtLink class="nav__item" :class="{ 'nav__item--active': isActive('/schedule') }" to="/schedule">
      <CalendarDays :size="22" />
      <span>Schedule</span>
    </NuxtLink>

    <span class="nav__item nav__item--disabled">
      <BookOpen :size="22" />
      <span>Logbook</span>
    </span>

    <span class="nav__item nav__item--disabled">
      <Menu :size="22" />
      <span>More</span>
    </span>
  </nav>
</template>
