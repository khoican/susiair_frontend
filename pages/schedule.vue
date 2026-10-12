<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

definePageMeta({ layout: 'default' })

const scheduleStore = useScheduleStore()
const toast = ref('')
let toastTimer: ReturnType<typeof setTimeout> | undefined

const completedCount = computed(() =>
  scheduleStore.schedules.filter(item => item.isCompleted ?? item.count_logbooks === item.count_schedules).length
)

/**
 * Menampilkan toast sementara lalu menghilangkannya otomatis.
 *
 * @param message Pesan yang ditampilkan.
 */
function showToast(message: string): void {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.value = ''
  }, 2000)
}

onMounted(() => scheduleStore.fetchSchedules(scheduleStore.year, scheduleStore.month))
</script>

<template>
  <div class="schedule">
    <header class="schedule__header">
      <button type="button" class="schedule__nav" aria-label="Bulan sebelumnya" @click="scheduleStore.changeMonth(-1)">
        <ChevronLeft :size="20" />
      </button>
      <span class="schedule__label">{{ formatMonth(scheduleStore.year, scheduleStore.month) }}</span>
      <button type="button" class="schedule__nav" aria-label="Bulan berikutnya" @click="scheduleStore.changeMonth(1)">
        <ChevronRight :size="20" />
      </button>
    </header>

    <p v-if="scheduleStore.error" class="schedule__error" role="alert">
      {{ scheduleStore.error }}
    </p>

    <div v-else-if="scheduleStore.loading" class="skeleton schedule__skeleton" />

    <template v-else>
      <p class="schedule__summary">
        {{ scheduleStore.schedules.length }} duty days · {{ completedCount }} completed
      </p>

      <CalendarGrid
        :year="scheduleStore.year"
        :month="scheduleStore.month"
        :schedules="scheduleStore.schedules"
        @select="showToast('Detail page coming soon')"
      />

      <p v-if="!scheduleStore.schedules.length" class="schedule__empty">
        No duty scheduled this month.
      </p>

      <section class="schedule__legend">
        <h2 class="schedule__heading">
          Duty Legend
        </h2>
        <DutyLegend :legend="scheduleStore.legend" />
      </section>
    </template>

    <Transition name="toast">
      <div v-if="toast" class="schedule__toast" role="status">
        {{ toast }}
      </div>
    </Transition>
  </div>
</template>
