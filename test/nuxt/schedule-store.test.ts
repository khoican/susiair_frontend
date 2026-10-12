import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { createPinia, setActivePinia } from 'pinia'
import { useScheduleStore } from '~/stores/schedule'

const { caller, useApiMock } = vi.hoisted(() => ({
  caller: vi.fn(),
  useApiMock: vi.fn()
}))

mockNuxtImport('useApi', () => useApiMock)

beforeEach(() => {
  setActivePinia(createPinia())
  caller.mockReset()
  useApiMock.mockReset()
  useApiMock.mockReturnValue(caller)
})

describe('useScheduleStore', () => {
  it('stores legend and schedules and clears loading on success', async () => {
    caller.mockResolvedValue({
      legend: [{ code: 'DTY', label: 'On Duty', color: '#10B981' }],
      schedules: []
    })

    const store = useScheduleStore()
    await store.fetchSchedules(2026, 5)

    expect(caller).toHaveBeenCalledWith('/schedules', { query: { year: 2026, month: 5 } })
    expect(store.legend).toHaveLength(1)
    expect(store.year).toBe(2026)
    expect(store.month).toBe(5)
    expect(store.loading).toBe(false)
    expect(store.error).toBe('')
  })

  it('wraps to the previous year when moving back from January', async () => {
    caller.mockResolvedValue({ legend: [], schedules: [] })

    const store = useScheduleStore()
    store.year = 2026
    store.month = 1
    await store.changeMonth(-1)

    expect(caller).toHaveBeenCalledWith('/schedules', { query: { year: 2025, month: 12 } })
  })

  it('captures the error message on failure', async () => {
    caller.mockRejectedValue(new Error('boom'))

    const store = useScheduleStore()
    await store.fetchSchedules(2026, 5)

    expect(store.error).toBe('boom')
    expect(store.loading).toBe(false)
  })
})
