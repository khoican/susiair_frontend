import type { DocumentItem, DocumentStatus, FlightHoursCards } from '~/types/api'

export interface AttentionChip {
  tone: 'danger' | 'warn' | 'success'
  text: string
}

/**
 * Mengembalikan status bar berdasarkan rasio current/limit.
 *
 * @param ratio Rasio current/limit.
 * @returns Status bar (ok/warn/over).
 */
export function limitStatus(ratio: number): 'ok' | 'warn' | 'over' {
  if (ratio > 1) return 'over'
  if (ratio >= 0.85) return 'warn'
  return 'ok'
}

/**
 * Mengurutkan 4 kartu batas berdasar urgensi (rasio desc).
 *
 * @param cards Kartu batas dari API.
 * @returns Array kartu dalam urutan urgensi.
 */
export function sortByUrgency(cards: FlightHoursCards): Array<{ key: keyof FlightHoursCards, current: number, limit: number, ratio: number }> {
  const entries: Array<{ key: keyof FlightHoursCards, current: number, limit: number, ratio: number }> = [
    { key: 'annual', ...cards.annual, ratio: cards.annual.limit > 0 ? cards.annual.current / cards.annual.limit : 0 },
    { key: 'monthly', ...cards.monthly, ratio: cards.monthly.limit > 0 ? cards.monthly.current / cards.monthly.limit : 0 },
    { key: 'daily', ...cards.daily, ratio: cards.daily.limit > 0 ? cards.daily.current / cards.daily.limit : 0 },
    { key: 'weekly', ...cards.weekly, ratio: cards.weekly.limit > 0 ? cards.weekly.current / cards.weekly.limit : 0 }
  ]
  return entries.sort((a, b) => b.ratio - a.ratio)
}

/**
 * Mengurutkan dokumen berdasar urgensi (expired → soon → safe), lalu hari sisa naik.
 *
 * @param items Daftar dokumen.
 * @returns Dokumen terurut.
 */
export function documentsByUrgency(items: DocumentItem[]): DocumentItem[] {
  const priority: Record<DocumentStatus, number> = { expired: 0, soon: 1, safe: 2 }
  return [...items].sort((a, b) => {
    const pa = priority[a.status]
    const pb = priority[b.status]
    if (pa !== pb) return pa - pb
    if (a.daysRemaining !== b.daysRemaining) return a.daysRemaining - b.daysRemaining
    return 0
  })
}

/**
 * Membentuk chip status/urgensi untuk hero.
 *
 * @param cards Kartu batas.
 * @param docs Daftar dokumen.
 * @returns Daftar chip (maks 2–3 singkat).
 */
export function summarizeAttention(cards: FlightHoursCards, docs: DocumentItem[]): AttentionChip[] {
  const chips: AttentionChip[] = []
  const expired = docs.filter(d => d.status === 'expired').length
  if (expired > 0) {
    chips.push({ tone: 'danger', text: expired === 1 ? '1 document expired' : `${expired} documents expired` })
  }

  const annual = cards.annual
  if (annual.limit > 0) {
    const ratio = annual.current / annual.limit
    if (chips.length === 0 && ratio > 1) {
      chips.push({ tone: 'danger', text: `Annual ${Math.round(ratio * 100)}%` })
    } else if (ratio >= 0.85 && chips.length < 2) {
      chips.push({ tone: 'warn', text: `Annual ${Math.round(ratio * 100)}%` })
    }
  }

  const monthly = cards.monthly
  if (monthly.limit > 0 && chips.length < 2) {
    const ratio = monthly.current / monthly.limit
    if (ratio >= 0.85 && ratio > 1 ? false : true) {
      if (ratio >= 0.85) chips.push({ tone: 'warn', text: `Monthly ${Math.round(ratio * 100)}%` })
    }
  }

  const daily = cards.daily
  if (daily.limit > 0 && chips.length < 2) {
    const ratio = daily.current / daily.limit
    if (ratio > 1) chips.push({ tone: 'danger', text: `Daily ${Math.round(ratio * 100)}%` })
  }

  if (chips.length === 0) {
    const anyWarn = [cards.daily, cards.weekly, cards.monthly, cards.annual].some(v => v.limit > 0 && v.current / v.limit >= 0.85)
    if (anyWarn) {
      chips.push({ tone: 'warn', text: '2 limits near' })
    } else {
      chips.push({ tone: 'success', text: 'Within limits' })
    }
  }

  return chips.slice(0, 2)
}
