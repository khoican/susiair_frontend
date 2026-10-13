/**
 * Mengekstrak pesan error dari body respons error API.
 *
 * Envelope error backend: `{ statusCode, message, error }` di mana `message`
 * berupa `string` (satu error) atau `string[]` (beberapa error validasi).
 *
 * @param body Body respons error (bukan objek, `null`, atau tanpa `message` → `null`).
 * @returns Pesan gabungan (`', '` untuk array), atau `null` bila tidak ada pesan valid.
 */
export function extractApiMessage(body: unknown): string | null {
  if (!body || typeof body !== 'object' || !('message' in body)) return null
  const message = (body as { message?: unknown }).message
  if (Array.isArray(message)) {
    const joined = message.filter((item): item is string => typeof item === 'string').join(', ')
    return joined || null
  }
  if (typeof message === 'string' && message.trim()) return message
  return null
}
