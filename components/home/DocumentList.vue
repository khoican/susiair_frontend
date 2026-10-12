<script setup lang="ts">
import type { DocumentItem } from '~/types/api'

defineProps<{
  items: DocumentItem[]
}>()

/**
 * Menyusun label sisa hari kedaluwarsa dokumen.
 *
 * @param days Sisa hari dari API.
 * @returns Teks seperti `152 days left` atau `Expired`.
 */
function daysLabel(days: number): string {
  return days > 0 ? `${days} days left` : 'Expired'
}
</script>

<template>
  <ul v-if="items.length" class="docs">
    <li v-for="doc in items" :key="doc.id" class="docs__item">
      <div class="docs__info">
        <span class="docs__label">{{ doc.label }}</span>
        <span class="docs__meta">{{ formatDay(doc.expiryDate) }} · {{ daysLabel(doc.daysRemaining) }}</span>
      </div>
      <StatusBadge :status="doc.status" :color="doc.badgeColor" :days-remaining="doc.daysRemaining" />
    </li>
  </ul>

  <p v-else class="docs__empty">
    No documents on file.
  </p>
</template>
