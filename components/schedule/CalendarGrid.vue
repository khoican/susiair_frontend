<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import type { ScheduleItem } from '~/types/api'

const props = withDefaults(defineProps<{
  year: number
  month: number
  schedules: ScheduleItem[]
  anchor?: string
}>(), {
  anchor: '2026-05-15'
})

const emit = defineEmits<{
  select: [iso: string]
}>()

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const leadingBlanks = computed(() => new Date(Date.UTC(props.year, props.month - 1, 1)).getUTCDay())
const daysInMonth = computed(() => new Date(Date.UTC(props.year, props.month, 0)).getUTCDate())

const byDay = computed(() => {
  const map = new Map<number, ScheduleItem>()
  for (const item of props.schedules) {
    map.set(Number(item.duty_date.slice(8, 10)), item)
  }
  return map
})

/**
 * Menghitung sisa tugas yang belum tercatat logbook.
 *
 * @param item Entri jadwal.
 * @returns Jumlah sisa (`count_schedules - count_logbooks`), minimal 0.
 */
function remaining(item: ScheduleItem): number {
  return Math.max(item.count_schedules - item.count_logbooks, 0)
}

/**
 * Menentukan status selesai, fallback ke perbandingan logbook bila field API kosong.
 *
 * @param item Entri jadwal.
 * @returns `true` bila tugas dianggap selesai.
 */
function completed(item: ScheduleItem): boolean {
  return item.isCompleted ?? item.count_logbooks === item.count_schedules
}

/**
 * Membangun ISO date untuk tanggal pada bulan aktif.
 *
 * @param day Tanggal 1-31.
 * @returns String `YYYY-MM-DD`.
 */
function isoDate(day: number): string {
  return `${props.year}-${String(props.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/**
 * Menentukan apakah tanggal jatuh pada akhir pekan.
 *
 * @param day Tanggal 1-31.
 * @returns `true` bila hari Sabtu atau Minggu.
 */
function isWeekend(day: number): boolean {
  const column = (leadingBlanks.value + day - 1) % 7
  return column === 0 || column === 6
}

/**
 * Menentukan apakah tanggal adalah anchor date aktif.
 *
 * @param day Tanggal 1-31.
 * @returns `true` bila cocok dengan anchor.
 */
function isToday(day: number): boolean {
  return isoDate(day) === props.anchor
}
</script>

<template>
  <div class="grid">
    <span v-for="day in WEEKDAYS" :key="day" class="grid__weekday">{{ day }}</span>

    <span v-for="n in leadingBlanks" :key="`blank-${n}`" class="grid__blank" />

    <button
      v-for="day in daysInMonth"
      :key="day"
      type="button"
      class="grid__cell"
      :class="{
        'grid__cell--duty': byDay.has(day),
        'grid__cell--weekend': isWeekend(day),
        'grid__cell--today': isToday(day)
      }"
      :style="byDay.has(day) ? { background: byDay.get(day)!.base_color } : undefined"
      @click="emit('select', isoDate(day))"
    >
      <!-- ponytail: teks selalu putih di atas base_color; warna terang bisa kurang kontras — ganti ke warna teks berbasis luminance bila perlu -->
      <span class="grid__day">{{ day }}</span>
      <span class="grid__base">{{ byDay.get(day)?.base_name }}</span>
      <span v-if="byDay.has(day)" class="grid__indicator">
        <Check v-if="completed(byDay.get(day)!)" :size="12" />
        <template v-else>{{ remaining(byDay.get(day)!) }}</template>
      </span>
    </button>
  </div>
</template>
