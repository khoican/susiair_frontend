<script setup lang="ts">
import { Badge, ClipboardCheck } from "lucide-vue-next";
import type { DocumentItem } from "~/types/api";

defineProps<{
  items: DocumentItem[];
}>();

/**
 * Menyusun label sisa hari kedaluwarsa dokumen.
 *
 * @param days Sisa hari dari API.
 * @returns Teks seperti `152 days left` atau `Expired`.
 */
function daysLabel(days: number): string {
  return days > 0 ? `${days} days left` : "Expired";
}
</script>

<template>
  <div
    v-if="items.length"
    class="flex flex-col overflow-hidden rounded-md bg-surface"
  >
    <template v-for="(doc, idx) in items" :key="doc.id">
      <div
        class="flex items-start justify-between gap-2 p-4 transition-colors active:bg-low"
      >
        <div
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-container-low text-primary"
          :class="
            doc.status === 'expired'
              ? 'bg-danger-soft text-danger'
              : doc.status === 'soon'
                ? 'bg-warning-soft text-warning'
                : doc.status === 'safe'
                  ? 'bg-success-soft text-success'
                  : ''
          "
        >
          <ClipboardCheck
            v-if="doc.label.toLowerCase().includes('medical')"
            :size="20"
          />
          <Badge v-else :size="20" />
        </div>
        <div class="flex min-w-0 flex-1 flex-col gap-2">
          <span
            class="text-base font-semibold leading-snug"
            :class="
              doc.status === 'expired'
                ? 'text-danger'
                : doc.status === 'soon'
                  ? 'text-warning'
                  : doc.status === 'safe'
                    ? 'text-success'
                    : 'text-primary'
            "
          >
            {{ doc.label }}
          </span>
          <span class="text-2xs text-secondary"
            >Exp: {{ formatDay(doc.expiryDate) }} ·
            {{ daysLabel(doc.daysRemaining) }}</span
          >
        </div>
        <StatusBadge
          :status="doc.status"
          :color="doc.badgeColor"
          :days-remaining="doc.daysRemaining"
        />
      </div>
      <div v-if="idx < items.length - 1" class="mx-4 h-px bg-container" />
    </template>
  </div>

  <p
    v-else
    class="m-0 rounded-md bg-muted p-4 text-center text-base text-secondary"
  >
    No documents on file.
  </p>
</template>
