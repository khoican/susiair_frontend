import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CalendarGrid from '~/components/schedule/CalendarGrid.vue'
import type { ScheduleItem } from '~/types/api'

const duty: ScheduleItem = {
  id: '97017',
  duty_date: '2026-05-15',
  status: 1,
  base_name: 'PDG',
  base_color: '#10B981',
  duty_type: 'DTY',
  count_schedules: 2,
  count_logbooks: 0,
  isCompleted: false
}

describe('CalendarGrid', () => {
  it('renders weekday headers, leading blanks, and all days of the month', async () => {
    const wrapper = await mountSuspended(CalendarGrid, {
      props: { year: 2026, month: 5, schedules: [] }
    })

    expect(wrapper.findAll('.grid__weekday')).toHaveLength(7)
    expect(wrapper.findAll('.grid__blank')).toHaveLength(5)
    expect(wrapper.findAll('.grid__cell')).toHaveLength(31)
  })

  it('renders a duty cell with base name and remaining indicator', async () => {
    const wrapper = await mountSuspended(CalendarGrid, {
      props: { year: 2026, month: 5, schedules: [duty] }
    })

    const cells = wrapper.findAll('.grid__cell')
    expect(wrapper.findAll('.grid__cell--duty')).toHaveLength(1)
    expect(cells[14].text()).toContain('PDG')
    expect(cells[14].text()).toContain('2')
  })

  it('emits the clicked ISO date', async () => {
    const wrapper = await mountSuspended(CalendarGrid, {
      props: { year: 2026, month: 5, schedules: [] }
    })

    await wrapper.findAll('.grid__cell')[14].trigger('click')
    expect(wrapper.emitted('select')).toEqual([['2026-05-15']])
  })
})
