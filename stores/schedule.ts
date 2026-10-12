import type { DutyLegendItem, ScheduleItem, SchedulesResponse } from '~/types/api'

/**
 * Store jadwal duty bulanan beserta legend.
 *
 * Bulan awal `2026-05` mengikuti anchor date `2026-05-15` (PRD D1).
 *
 * @returns State dan aksi jadwal (year, month, legend, schedules, loading, error).
 */
export const useScheduleStore = defineStore('schedule', () => {
  const year = ref(2026)
  const month = ref(5)
  const legend = ref<DutyLegendItem[]>([])
  const schedules = ref<ScheduleItem[]>([])
  const loading = ref(false)
  const error = ref('')

  /**
   * Mengambil jadwal bulanan dari `GET /schedules`.
   *
   * @param targetYear Tahun yang diminta.
   * @param targetMonth Bulan 1-12 yang diminta.
   * @throws {Error} Bila request gagal.
   */
  async function fetchSchedules(targetYear: number, targetMonth: number): Promise<void> {
    year.value = targetYear
    month.value = targetMonth
    loading.value = true
    error.value = ''
    try {
      const res = await useApi()<SchedulesResponse>('/schedules', {
        query: { year: targetYear, month: targetMonth }
      })
      legend.value = res.legend
      schedules.value = res.schedules
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  /**
   * Menggeser bulan sebesar `delta` (menyeberang tahun) lalu memuat ulang.
   *
   * @param delta Perubahan bulan, biasanya `1` atau `-1`.
   */
  async function changeMonth(delta: number): Promise<void> {
    if (loading.value) return
    const next = shiftMonth(year.value, month.value, delta)
    await fetchSchedules(next.year, next.month)
  }

  return { year, month, legend, schedules, loading, error, fetchSchedules, changeMonth }
})
