<script setup lang="ts">
import { limitStatus } from '~/utils/home'

const props = defineProps<{
  title: string
  current: number
  limit: number
}>()

const ratio = computed(() => (props.limit > 0 ? props.current / props.limit : 0))
const width = computed(() => `${Math.min(ratio.value, 1) * 100}%`)
const percent = computed(() => `${Math.round(ratio.value * 100)}%`)

const status = computed(() => limitStatus(ratio.value))

const remaining = computed(() => props.limit - props.current)
const remainingLabel = computed(() => {
  const value = Math.abs(remaining.value).toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  })
  return remaining.value >= 0 ? `${value} hrs left` : `${value} hrs over`
})
</script>

<template>
  <article class="row">
    <div class="row__head">
      <p class="row__title">
        {{ title }}
      </p>
      <span class="row__percent" :class="`row__percent--${status}`">{{ percent }}</span>
    </div>

    <p class="row__value">
      <span :class="{ 'row__value--over': status === 'over' }">{{ formatHours(current) }}</span>
      <span class="row__limit">/ {{ limit }}</span>
    </p>

    <div class="row__track">
      <div class="row__bar" :class="`row__bar--${status}`" :style="{ width }" />
    </div>

    <p class="row__remaining">
      {{ remainingLabel }}
    </p>
  </article>
</template>
