<script setup lang="ts">
import type { DutyLegendItem } from '~/types/api'

defineProps<{
  legend: DutyLegendItem[]
}>()
</script>

<template>
  <ul class="legend">
    <li v-for="item in legend" :key="item.code" class="legend__item">
      <span class="legend__swatch" :style="{ background: item.color }" />
      <span class="legend__code">{{ item.code }}</span>
      <span class="legend__label">{{ item.label }}</span>
    </li>
  </ul>
</template>
