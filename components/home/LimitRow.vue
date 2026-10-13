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

const STATUS_TEXT: Record<string, string> = {
  ok: 'text-success',
  warn: 'text-warning',
  over: 'text-danger'
}

const STATUS_BAR: Record<string, string> = {
  ok: 'bg-success',
  warn: 'bg-warning',
  over: 'bg-danger'
}
</script>

<template>
  <article class="shadow-card mb-1 flex items-start justify-between gap-4 rounded-md border-l-4 bg-surface p-4 last:mb-0">
    <div class="flex min-w-0 flex-1 flex-col gap-1">
      <p class="m-0 flex items-center gap-1 text-base font-bold leading-snug text-primary">
        {{ title }}
      </p>
      <p class="m-0 text-2xs leading-snug text-secondary">
        {{ remainingLabel }}
      </p>
    </div>

    <div class="flex shrink-0 flex-col items-end gap-1">
      <span class="text-base font-extrabold" :class="STATUS_TEXT[status]">{{ percent }}</span>
      <p class="m-0">
        <span :class="{ 'text-danger': status === 'over' }">{{ formatHours(current) }}</span>
        <span class="text-secondary"> / {{ limit }}</span>
      </p>
      <div class="h-2 w-28 overflow-hidden rounded-full bg-muted">
        <div class="h-full rounded-full transition-all duration-300" :class="STATUS_BAR[status]" :style="{ width }" />
      </div>
    </div>
  </article>
</template>
