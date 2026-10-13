<script setup lang="ts">
import {
  CalendarDays,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-vue-next";
import CalendarGrid from "~/components/schedule/CalendarGrid.vue";
import DutyLegend from "~/components/schedule/DutyLegend.vue";

definePageMeta({ layout: "default" });

const scheduleStore = useScheduleStore();
const toast = ref("");
let toastTimer: ReturnType<typeof setTimeout> | undefined;

const completedCount = computed(
  () =>
    scheduleStore.schedules.filter(
      (item) =>
        item.isCompleted ?? item.count_logbooks === item.count_schedules,
    ).length,
);

/**
 * Menampilkan toast sementara lalu menghilangkannya otomatis.
 *
 * @param message Pesan yang ditampilkan.
 */
function showToast(message: string): void {
  toast.value = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.value = "";
  }, 2000);
}

onMounted(() =>
  scheduleStore.fetchSchedules(scheduleStore.year, scheduleStore.month),
);
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      class="mx-4 mb-2 flex flex-wrap items-center justify-between gap-1 rounded-md bg-container px-4 py-1"
    >
      <div class="flex items-center gap-1">
        <span class="h-2 w-2 animate-pulse rounded-full bg-success" />
        <span
          class="text-2xs font-semibold uppercase tracking-wider text-secondary"
          >Live Roster Sync</span
        >
      </div>
      <div class="rounded-full bg-surface p-2 shadow-card">
        <span class="text-2xs font-bold text-primary">Anchor: 2026-05-15</span>
      </div>
    </div>

    <section
      class="mx-4 mb-4 flex flex-col gap-4 rounded-md bg-surface p-4 shadow-card"
    >
      <div class="flex items-center justify-between gap-2">
        <button
          type="button"
          class="flex h-8 w-8 cursor-pointer items-center justify-center border bg-white p-0 transition active-scale-95"
          aria-label="Bulan sebelumnya"
          @click="scheduleStore.changeMonth(-1)"
        >
          <ChevronLeft :size="20" />
        </button>
        <div class="flex flex-col items-center gap-2">
          <h1 class="m-0 text-base font-extrabold text-primary">
            {{ formatMonth(scheduleStore.year, scheduleStore.month) }}
          </h1>
          <span class="text-2xs text-secondary">Flight Schedule</span>
        </div>
        <button
          type="button"
          class="flex h-8 w-8 cursor-pointer items-center justify-center border bg-white p-0 transition active-scale-95"
          aria-label="Bulan berikutnya"
          @click="scheduleStore.changeMonth(1)"
        >
          <ChevronRight :size="20" />
        </button>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div class="flex items-center gap-2 rounded-md bg-container-low p-2">
          <div
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-navy text-white"
          >
            <CalendarDays :size="18" />
          </div>
          <div class="flex flex-col gap-2">
            <span class="text-base font-bold text-primary">{{
              scheduleStore.schedules.length
            }}</span>
            <span class="text-2xs uppercase tracking-wider text-secondary"
              >Duty Days</span
            >
          </div>
        </div>
        <div class="flex items-center gap-2 rounded-md bg-container-low p-2">
          <div
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-success text-white"
          >
            <CheckCircle :size="18" />
          </div>
          <div class="flex flex-col gap-2">
            <span class="text-base font-bold text-primary">{{
              completedCount
            }}</span>
            <span class="text-2xs uppercase tracking-wider text-secondary"
              >Completed</span
            >
          </div>
        </div>
      </div>
    </section>

    <p
      v-if="scheduleStore.error"
      class="mx-4 rounded-md bg-danger-soft p-4 text-base font-semibold text-danger"
      role="alert"
    >
      {{ scheduleStore.error }}
    </p>

    <div v-else-if="scheduleStore.loading" class="skeleton mx-4 h-80" />

    <template v-else>
      <section
        class="mx-4 mb-4 overflow-hidden rounded-md bg-surface shadow-card"
      >
        <CalendarGrid
          :year="scheduleStore.year"
          :month="scheduleStore.month"
          :schedules="scheduleStore.schedules"
          @select="showToast('Detail page coming soon')"
        />
      </section>

      <p
        v-if="!scheduleStore.schedules.length"
        class="m-0 rounded-md bg-muted p-4 text-center text-base text-secondary"
      >
        No duty scheduled this month.
      </p>

      <section
        class="mx-4 mb-4 overflow-hidden rounded-md bg-surface shadow-card"
      >
        <header class="border-b p-4">
          <h2 class="mb-2 mt-0 text-base font-bold text-primary">
            Duty Legend
          </h2>
        </header>
        <div class="p-4">
          <DutyLegend :legend="scheduleStore.legend" />
        </div>
      </section>
    </template>

    <Transition name="toast">
      <div
        v-if="toast"
        class="shadow-elev fixed bottom-22 left-1/2 -translate-x-1/2 rounded-full bg-navy px-4 py-2 text-base font-semibold text-white"
        role="status"
      >
        {{ toast }}
      </div>
    </Transition>
  </div>
</template>
