<script setup lang="ts">
import CapacityPanel from '~/components/home/CapacityPanel.vue'
import { documentsByUrgency, summarizeAttention } from '~/utils/home'

definePageMeta({ layout: 'default' })

const pilotStore = usePilotStore()
const documentsStore = useDocumentsStore()
const loading = ref(true)
const error = ref('')

const orderedDocs = computed(() => documentsByUrgency(documentsStore.items))

const attention = computed(() => {
  const cardsData = pilotStore.summary?.cards
  if (!cardsData) return undefined
  const chips = summarizeAttention(cardsData, documentsStore.items)
  if (chips.length === 0) return undefined
  return chips
})

/**
 * Memuat profil, ringkasan jam terbang, dan dokumen secara paralel.
 */
async function loadDashboard(): Promise<void> {
  loading.value = true
  error.value = ''
  try {
    await Promise.all([
      pilotStore.fetchProfile(),
      pilotStore.fetchSummary(pilotStore.range),
      documentsStore.fetchDocuments()
    ])
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
}

onMounted(loadDashboard)
</script>

<template>
  <div class="home">
    <template v-if="loading">
        <div class="skeleton skeleton home-skeleton-header" />
        <div class="skeleton skeleton home-skeleton-metric" />
        <div class="home__grid-row">
          <div v-for="n in 4" :key="n" class="skeleton skeleton home-skeleton-row" />
        </div>
      <div class="skeleton skeleton home-skeleton-chart" />
      <div class="skeleton skeleton home-skeleton-doc" />
    </template>

    <div v-else-if="error" class="home__error" role="alert">
      <p class="home__error-text">
        {{ error }}
      </p>
      <button type="button" class="home__retry" @click="loadDashboard">
        Try again
      </button>
    </div>

    <template v-else>
      <AppHeader
        v-if="pilotStore.profile"
        :name="pilotStore.profile.name"
        :total-flight-hours="pilotStore.profile.totalFlightHours"
        :avatar-url="pilotStore.profile.avatarUrl"
        :chips="attention"
      />

      <CapacityPanel v-if="pilotStore.summary?.cards" :cards="pilotStore.summary.cards" />

      <section class="home__section">
        <h2 class="home__heading">
          Trend
        </h2>
        <ClientOnly>
          <TrendChart />
          <template #fallback>
            <div class="skeleton skeleton home-skeleton-chart" />
          </template>
        </ClientOnly>
      </section>

      <section class="home__section">
        <h2 class="home__heading">
          Documents
        </h2>
        <DocumentList :items="orderedDocs" />
      </section>
    </template>
  </div>
</template>
