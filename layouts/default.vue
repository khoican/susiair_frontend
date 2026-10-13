<script setup lang="ts">
import BottomNav from "~/components/common/BottomNav.vue";
</script>

<template>
  <div class="app-shell app-shell--default">
    <main class="app-shell__content">
      <slot />
    </main>
    <BottomNav />
  </div>
</template>
