import type { FlightHoursSummary, Pilot, Range } from '~/types/api'

/**
 * Store profil pilot dan ringkasan jam terbang.
 *
 * @returns State dan aksi profil/ringkasan (profile, summary, range, loading, error).
 */
export const usePilotStore = defineStore('pilot', () => {
  const profile = ref<Pilot | null>(null)
  const summary = ref<FlightHoursSummary | null>(null)
  const range = ref<Range>('1w')
  const loading = ref(false)
  const error = ref('')

  /**
   * Mengambil profil pilot dari `GET /pilot/me`.
   *
   * @throws {Error} Bila request gagal.
   */
  async function fetchProfile(): Promise<void> {
    profile.value = await useApi()<Pilot>('/pilot/me')
  }

  /**
   * Mengambil kartu dan chart jam terbang dari `GET /flight-hours/summary`.
   *
   * @param value Range aktif.
   * @throws {Error} Bila request gagal.
   */
  async function fetchSummary(value: Range): Promise<void> {
    range.value = value
    summary.value = await useApi()<FlightHoursSummary>('/flight-hours/summary', {
      query: { range: value }
    })
  }

  /**
   * Mengubah range lalu memuat ulang ringkasan.
   *
   * @param value Range tujuan.
   */
  async function setRange(value: Range): Promise<void> {
    loading.value = true
    error.value = ''
    try {
      await fetchSummary(value)
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  return { profile, summary, range, loading, error, fetchProfile, fetchSummary, setRange }
})
