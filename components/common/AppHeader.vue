<script setup lang="ts">
import type { AttentionChip } from '~/utils/home'

const props = defineProps<{
  name: string
  totalFlightHours: number
  avatarUrl: string
  chips?: AttentionChip[]
}>()

const initials = computed(() =>
  props.name
    .split(' ')
    .map(part => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()
)

const hoursValue = computed(() =>
  props.totalFlightHours.toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  })
)

const displayChips = computed<AttentionChip[]>(() => (props.chips && props.chips.length > 0 ? props.chips : [{ tone: 'success', text: 'Within limits' }]))

const CHIP_TONE: Record<AttentionChip['tone'], string> = {
  danger: 'bg-danger-soft text-danger',
  warn: 'bg-warning-soft text-warning',
  success: 'bg-success-soft text-success'
}
</script>

<template>
  <header class="mx-4 mb-4 flex items-center justify-between rounded-b-md bg-surface p-4 shadow-card">
    <div class="flex flex-col">
      <p class="m-0 text-2xs text-secondary">
        Good day,
      </p>
      <h1 class="m-0 text-lg font-extrabold text-primary">
        {{ name }}
      </h1>
    </div>

    <img
      v-if="avatarUrl"
      class="h-10 w-10 rounded-full object-cover bg-container"
      :src="avatarUrl"
      :alt="name"
    >
    <span v-else class="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
      {{ initials }}
    </span>
  </header>

  <div class="mx-4 mb-4 flex flex-col gap-2 rounded-md bg-surface p-4 shadow-card">
    <p class="m-0 text-2xs uppercase tracking-wider text-secondary">
      Total flight hours
    </p>
    <p class="m-0 text-3xl font-extrabold text-primary">
      {{ hoursValue }}<span class="ml-1 text-sm font-semibold text-chart">hrs</span>
    </p>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="chip in displayChips"
        :key="chip.text"
        class="rounded-full px-3 py-1 text-2xs font-bold"
        :class="CHIP_TONE[chip.tone]"
      >{{ chip.text }}</span>
    </div>
  </div>
</template>
