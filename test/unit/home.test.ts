import { documentsByUrgency, limitStatus, sortByUrgency, summarizeAttention } from '../../utils/home'
import type { DocumentItem, FlightHoursCards } from '~/types/api'
import { expect, test } from 'vitest'

const cards: FlightHoursCards = {
  daily: { current: 6.4, limit: 8 },
  weekly: { current: 25.2, limit: 40 },
  monthly: { current: 87.2, limit: 100 },
  annual: { current: 1013.8, limit: 1050 }
}

const docs: DocumentItem[] = [
  { id: 'd1', label: 'A', expiryDate: '2026-05-01', daysRemaining: -14, status: 'expired', badgeColor: '#E63757' },
  { id: 'd2', label: 'B', expiryDate: '2026-06-11', daysRemaining: 27, status: 'soon', badgeColor: '#F59E0B' },
  { id: 'd3', label: 'C', expiryDate: '2026-05-29', daysRemaining: 14, status: 'soon', badgeColor: '#F59E0B' },
  { id: 'd4', label: 'D', expiryDate: '2026-10-14', daysRemaining: 152, status: 'safe', badgeColor: '#1FBF8F' }
]

test('limitStatus thresholds', () => {
  expect(limitStatus(0.8)).toBe('ok')
  expect(limitStatus(0.85)).toBe('warn')
  expect(limitStatus(1.2)).toBe('over')
  expect(limitStatus(1.0)).toBe('warn')
})

test('sortByUrgency orders annual first', () => {
  const sorted = sortByUrgency(cards)
  expect(sorted[0].key).toBe('annual')
  expect(sorted[1].key).toBe('monthly')
})

test('documentsByUrgency expired first, then days asc', () => {
  const sorted = documentsByUrgency(docs)
  expect(sorted[0].status).toBe('expired')
  expect(sorted[1].status).toBe('soon')
  expect(sorted[2].daysRemaining).toBe(27)
})

test('summarizeAttention surfaces urgent signals', () => {
  const chips = summarizeAttention(cards, docs)
  expect(chips[0].tone).toBe('danger')
  expect(chips[0].text).toContain('expired')
  expect(chips[1].tone).toBe('warn')
  expect(chips[1].text).toContain('Annual')
})
