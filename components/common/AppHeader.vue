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

const displayChips = computed(() => (props.chips && props.chips.length > 0 ? props.chips : [{ tone: 'success', text: 'Within limits' }]))
</script>

<template>
  <header class="header">
    <div class="header__identity">
      <p class="header__greeting">
        Good day,
      </p>
      <h1 class="header__name">
        {{ name }}
      </h1>
    </div>

    <img
      v-if="avatarUrl"
      class="header__avatar"
      :src="avatarUrl"
      :alt="name"
    >
    <span v-else class="header__avatar header__avatar--fallback">
      {{ initials }}
    </span>
  </header>

  <div class="metric">
    <p class="metric__label">
      Total flight hours
    </p>
    <p class="metric__value">
      {{ hoursValue }}<span class="metric__unit">hrs</span>
    </p>
    <div class="metric__chips">
      <span
        v-for="chip in displayChips"
        :key="chip.text"
        class="metric__chip"
        :class="`metric__chip--${chip.tone}`"
      >{{ chip.text }}</span>
    </div>
  </div>
</template>
