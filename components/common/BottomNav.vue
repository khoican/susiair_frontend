<script setup lang="ts">
import { BookOpen, CalendarDays, Home, Menu } from 'lucide-vue-next'

const route = useRoute()

/**
 * Menentukan kelas utilitas warna/berat teks aktif untuk sebuah tautan.
 *
 * @param path Path rute yang dibandingkan dengan route saat ini.
 * @returns String kelas utility bila aktif, string kosong bila tidak.
 */
function itemClass(path: string): string {
  return route.path === path ? 'text-primary font-bold' : 'text-secondary'
}
</script>

<template>
  <nav class="fixed bottom-0 left-1/2 z-50 w-full max-w-app -translate-x-1/2 border-t bg-white-90 backdrop-blur shadow-top" style="padding: 0 env(safe-area-inset-right, 0) calc(env(safe-area-inset-bottom, 0)) env(safe-area-inset-left, 0)">
    <div class="grid h-16 grid-cols-4 items-center px-1">
      <NuxtLink class="flex h-full flex-col items-center justify-center gap-2 text-xs font-semibold no-underline transition-colors active-scale-95" :class="itemClass('/')" to="/">
        <Home :size="22" />
        <span class="leading-none">Home</span>
      </NuxtLink>

      <NuxtLink class="flex h-full flex-col items-center justify-center gap-2 text-xs font-semibold no-underline transition-colors active-scale-95" :class="itemClass('/schedule')" to="/schedule">
        <CalendarDays :size="22" />
        <span class="leading-none">Schedule</span>
      </NuxtLink>

      <span class="relative flex h-full cursor-not-allowed flex-col items-center justify-center gap-2 text-xs font-semibold opacity-45">
        <span class="absolute top-2 right-2 rounded-full bg-container px-2 py-1 text-2xs uppercase tracking-wider text-secondary">Soon</span>
        <BookOpen :size="22" />
        <span class="leading-none">Logbook</span>
      </span>

      <span class="flex h-full cursor-not-allowed flex-col items-center justify-center gap-2 text-xs font-semibold opacity-45">
        <Menu :size="22" />
        <span class="leading-none">More</span>
      </span>
    </div>
  </nav>
</template>
