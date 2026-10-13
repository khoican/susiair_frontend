<script setup lang="ts">
import type { DutyLegendItem } from '~/types/api'

defineProps<{
  legend: DutyLegendItem[]
}>()
</script>

<template>
  <ul class="m-0 flex list-none flex-col gap-2 p-0">
    <li v-for="item in legend" :key="item.code" class="flex items-center gap-2">
      <span class="h-4 w-4 shrink-0 rounded-sm" :style="{ background: item.color }" />
      <span class="min-w-10 text-base font-bold text-primary">{{ item.code }}</span>
      <span class="flex-1 truncate text-base text-secondary">{{ item.label }}</span>
    </li>
  </ul>
</template>
