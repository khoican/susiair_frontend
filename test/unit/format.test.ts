import { describe, expect, it } from 'vitest'
import { formatDay, formatHours, formatMonth } from '../../utils/format'
import { shiftMonth } from '../../utils/date'

describe('formatHours', () => {
  it('formats fractional hours with thousands separator', () => {
    expect(formatHours(1444.5)).toBe('1,444.5 hrs')
  })

  it('always shows one decimal', () => {
    expect(formatHours(15)).toBe('15.0 hrs')
  })
})

describe('formatDay', () => {
  it('formats ISO date as short month + day', () => {
    expect(formatDay('2026-05-15')).toBe('May 15')
  })
})

describe('formatMonth', () => {
  it('formats year and month as long label', () => {
    expect(formatMonth(2026, 5)).toBe('May 2026')
  })
})

describe('shiftMonth', () => {
  it('shifts within the same year', () => {
    expect(shiftMonth(2026, 5, -1)).toEqual({ year: 2026, month: 4 })
  })

  it('wraps backwards across the year boundary', () => {
    expect(shiftMonth(2026, 1, -1)).toEqual({ year: 2025, month: 12 })
  })

  it('wraps forwards across the year boundary', () => {
    expect(shiftMonth(2026, 12, 1)).toEqual({ year: 2027, month: 1 })
  })
})
