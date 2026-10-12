/**
 * Memformat nilai jam terbang dengan satu desimal.
 *
 * @param value Total jam terbang.
 * @returns String seperti `1,444.5 hrs`.
 */
export function formatHours(value: number): string {
  return `${value.toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  })} hrs`
}

/**
 * Memformat tanggal ISO menjadi label pendek hari-bulan.
 *
 * @param iso Tanggal `YYYY-MM-DD`.
 * @returns String seperti `May 15`.
 */
export function formatDay(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC'
  })
}

/**
 * Memformat bulan/tahun menjadi label panjang.
 *
 * @param year Tahun (mis. `2026`).
 * @param month Bulan 1-12.
 * @returns String seperti `May 2026`.
 */
export function formatMonth(year: number, month: number): string {
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  })
}
