<script setup lang="ts">
import type { FlightHoursCards } from "~/types/api";
import { formatHours } from "~/utils/format";
import { limitStatus, sortByUrgency } from "~/utils/home";

const props = defineProps<{
  cards: FlightHoursCards;
}>();

const ordered = computed(() => sortByUrgency(props.cards));
const display = computed(() => [
  {
    key: "annual",
    title: "Annual Limit",
    current: ordered.value[0].current,
    limit: ordered.value[0].limit,
  },
  {
    key: "monthly",
    title: "Monthly Limit",
    current: ordered.value[1].current,
    limit: ordered.value[1].limit,
  },
  {
    key: "weekly",
    title: "Weekly Limit",
    current: ordered.value[3].current,
    limit: ordered.value[3].limit,
  },
  {
    key: "daily",
    title: "Daily Limit",
    current: ordered.value[2].current,
    limit: ordered.value[2].limit,
  },
]);

const STATUS_TEXT: Record<string, string> = {
  ok: "text-success",
  warn: "text-warning",
  over: "text-danger",
};

const STATUS_BAR: Record<string, string> = {
  ok: "bg-success",
  warn: "bg-warning",
  over: "bg-danger",
};

/**
 * Menentukan status limit dari rasio pemakaian.
 *
 * @param current Pemakaian saat ini.
 * @param limit Batas limit.
 * @returns Status `ok`/`warn`/`over`.
 */
function getStatus(current: number, limit: number) {
  const ratio = limit > 0 ? current / limit : 0;
  return limitStatus(ratio);
}

/**
 * Menghitung lebar bar persentase (dibatasi 100%).
 *
 * @param current Pemakaian saat ini.
 * @param limit Batas limit.
 * @returns Lebar bar sebagai persentase CSS.
 */
function getWidth(current: number, limit: number) {
  const ratio = limit > 0 ? current / limit : 0;
  return `${Math.min(ratio, 1) * 100}%`;
}

/**
 * Menghitung persentase pemakaian dibulatkan.
 *
 * @param current Pemakaian saat ini.
 * @param limit Batas limit.
 * @returns Teks persentase seperti `80%`.
 */
function getPercent(current: number, limit: number) {
  const ratio = limit > 0 ? current / limit : 0;
  return `${Math.round(ratio * 100)}%`;
}
</script>

<template>
  <div class="grid grid-cols-1 gap-2">
    <article
      v-for="item in display"
      :key="item.key"
      class="shadow-card flex flex-col justify-between gap-2 rounded-md border border-transparent bg-surface p-4 transition active-scale-98"
    >
      <div>
        <div class="flex items-center justify-between mb-4">
          <span
            class="text-xs font-medium uppercase tracking-wider text-secondary"
            >{{ item.title }}</span
          >
          <span
            class="text-2xs font-bold"
            :class="STATUS_TEXT[getStatus(item.current, item.limit)]"
            >{{ getPercent(item.current, item.limit) }}</span
          >
        </div>
        <p class="m-0 text-2xl font-extrabold leading-tight text-primary">
          {{ formatHours(item.current) }}
          <small class="text-base font-medium text-secondary"
            >/ {{ item.limit }} hrs</small
          >
        </p>
      </div>
      <div class="mt-1 h-2 w-full overflow-hidden rounded-full bg-container">
        <div
          class="h-full rounded-full transition-all duration-500"
          :class="STATUS_BAR[getStatus(item.current, item.limit)]"
          :style="{ width: getWidth(item.current, item.limit) }"
        />
      </div>
    </article>
  </div>
</template>
