<script setup lang="ts">
import type { DocumentStatus } from '~/types/api'

const props = defineProps<{
  status?: DocumentStatus
  color?: string
  daysRemaining?: number
}>()

const LABELS: Record<DocumentStatus, string> = {
  safe: 'Safe',
  soon: 'Soon',
  expired: 'Expired'
}

const FALLBACK_COLORS: Record<DocumentStatus, string> = {
  safe: 'var(--color-success)',
  soon: 'var(--color-warning)',
  expired: 'var(--color-danger)'
}

/**
 * Menentukan status dari sisa hari bila `status` tidak diberikan.
 *
 * @returns Status dokumen hasil hitung (`safe`/`soon`/`expired`).
 */
function resolvedStatus(): DocumentStatus {
  if (props.status) return props.status
  const days = props.daysRemaining ?? 0
  if (days <= 0) return 'expired'
  if (days <= 30) return 'soon'
  return 'safe'
}

const badgeStatus = computed(resolvedStatus)
const label = computed(() => LABELS[badgeStatus.value])
const badgeColor = computed(() => props.color || FALLBACK_COLORS[badgeStatus.value])
</script>

<template>
  <span class="badge" :style="{ background: badgeColor }">
    {{ label }}
  </span>
</template>
