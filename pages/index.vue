<script setup lang="ts">
import { Timer } from "lucide-vue-next";
import CapacityPanel from "~/components/home/CapacityPanel.vue";
import DocumentList from "~/components/home/DocumentList.vue";
import TrendChart from "~/components/home/TrendChart.vue";
import { documentsByUrgency } from "~/utils/home";

definePageMeta({ layout: "default" });

const pilotStore = usePilotStore();
const documentsStore = useDocumentsStore();
const loading = ref(true);
const error = ref("");

const orderedDocs = computed(() => documentsByUrgency(documentsStore.items));

/**
 * Memuat profil, ringkasan jam terbang, dan dokumen secara paralel.
 */
async function loadDashboard(): Promise<void> {
  loading.value = true;
  error.value = "";
  try {
    await Promise.all([
      pilotStore.fetchProfile(),
      pilotStore.fetchSummary(pilotStore.range),
      documentsStore.fetchDocuments(),
    ]);
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    loading.value = false;
  }
}

onMounted(loadDashboard);
</script>

<template>
  <div class="flex flex-col gap-4">
    <template v-if="loading">
      <div class="skeleton h-12" />
      <div class="skeleton h-22" />
      <div class="flex flex-col gap-2">
        <div v-for="n in 4" :key="n" class="skeleton h-24" />
      </div>
      <div class="skeleton h-56" />
      <div class="skeleton h-50" />
    </template>

    <div
      v-else-if="error"
      class="mx-4 flex flex-col items-start gap-4 rounded-md bg-danger-soft p-4"
      role="alert"
    >
      <p class="m-0 text-base font-semibold text-danger">
        {{ error }}
      </p>
      <button
        type="button"
        class="active-scale cursor-pointer rounded-full border-none bg-danger px-4 py-2 font-inherit text-base font-bold text-white"
        @click="loadDashboard"
      >
        Try again
      </button>
    </div>

    <template v-else>
      <section
        v-if="pilotStore.profile"
        class="mx-4 flex flex-col gap-4 overflow-hidden rounded-md bg-surface shadow-card mb-8"
      >
        <div class="flex items-start justify-between gap-2 p-4">
          <div class="flex min-w-0 items-center gap-4">
            <div class="relative shrink-0">
              <img
                :src="pilotStore.profile.avatarUrl || '/logo.png'"
                :alt="pilotStore.profile.name"
                class="h-14 w-14 rounded-full bg-container object-cover shadow-card"
              />
              <span
                class="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-success shadow-card"
              />
            </div>
            <div class="flex min-w-0 flex-col">
              <span class="text-base text-secondary">Good day,</span>
              <h1
                class="m-0 truncate text-base font-extrabold leading-tight text-primary"
              >
                {{ pilotStore.profile.name }}
              </h1>
              <p class="mt-2 mb-0 truncate text-2xs text-secondary">
                Base info
              </p>
            </div>
          </div>
          <div
            class="flex shrink-0 items-center gap-2 rounded-full bg-success-soft p-2"
          >
            <span
              class="text-2xs font-bold uppercase tracking-wider text-success"
              >Active Duty</span
            >
          </div>
        </div>
        <div
          class="relative mx-4 mb-4 flex items-center justify-between overflow-hidden rounded-md bg-navy p-4 text-white shadow-elev"
        >
          <div
            class="pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-white-5"
          />
          <div class="relative z-10 flex flex-col gap-2">
            <span class="text-2xs uppercase tracking-wider text-white-70"
              >Total Logged Flight Time</span
            >
            <span class="text-2xl font-extrabold leading-tight"
              >{{ pilotStore.profile.totalFlightHours }}
              <span class="text-base font-semibold text-chart">hrs</span></span
            >
          </div>
        </div>
      </section>

      <section
        v-if="pilotStore.summary?.cards"
        class="mx-4 flex flex-col gap-1 mb-8"
      >
        <div
          class="flex flex-wrap items-center justify-between gap-2 px-1 mb-4"
        >
          <div class="flex items-center gap-1">
            <Timer class="text-primary w-5 h-5" />
            <h2 class="m-0 text-base font-bold text-primary">Hours to Limit</h2>
          </div>
        </div>
        <CapacityPanel :cards="pilotStore.summary.cards" />
      </section>

      <section
        class="mx-4 flex flex-col overflow-hidden rounded-md bg-surface shadow-card"
      >
        <header class="flex items-center justify-between gap-2 border-b p-4">
          <h2 class="m-0 text-base font-bold text-primary">
            Cumulative Flight Hours
          </h2>
          <span
            v-if="pilotStore.summary?.chart?.limitLine"
            class="rounded-full bg-danger-soft p-2 text-2xs font-bold text-danger text-nowrap"
            >Limit {{ pilotStore.summary.chart.limitLine }} hrs</span
          >
        </header>
        <div class="p-4">
          <ClientOnly>
            <TrendChart />
            <template #fallback>
              <div class="skeleton h-56" />
            </template>
          </ClientOnly>
        </div>
      </section>

      <section
        class="mx-4 flex flex-col overflow-hidden rounded-md bg-surface shadow-card"
      >
        <header class="flex items-center justify-between gap-2 border-b p-4">
          <h2 class="m-0 text-base font-bold text-primary">My Documents</h2>
        </header>
        <div class="px-1 py-0">
          <DocumentList :items="orderedDocs" />
        </div>
      </section>
    </template>
  </div>
</template>
