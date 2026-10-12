/**
 * Menggeser bulan/tahun dengan pembungkusan lintas-tahun.
 *
 * @param year Tahun awal.
 * @param month Bulan awal 1-12.
 * @param delta Pergeseran bulan (mis. `1` atau `-1`).
 * @returns Tahun dan bulan hasil normalisasi.
 */
export const ANCHOR_DATE = '2026-05-15'

/**
 * Menggeser bulan/tahun dengan pembungkusan lintas-tahun.
 *
 * @param year Tahun awal.
 * @param month Bulan awal 1-12.
 * @param delta Pergeseran bulan (mis. `1` atau `-1`).
 * @returns Tahun dan bulan hasil normalisasi.
 */
export function shiftMonth(year: number, month: number, delta: number): { year: number, month: number } {
  const zeroBased = month - 1 + delta
  const normalizedYear = year + Math.floor(zeroBased / 12)
  const normalizedMonth = ((zeroBased % 12) + 12) % 12 + 1
  return { year: normalizedYear, month: normalizedMonth }
}
