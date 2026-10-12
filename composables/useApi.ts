import type { ApiError } from '~/types/api'

/**
 * Membuat instance `$fetch` terkonfigurasi untuk backend Susi Air.
 *
 * Instance otomatis: menyisipkan header `Authorization: Bearer <token>` dari
 * cookie `auth_token`, meng-unwrap envelope sukses `{ statusCode, data }`
 * menjadi `data`, menormalkan `message` error (string|string[]) menjadi string,
 * dan melakukan logout terpusat saat menerima `401`.
 *
 * @returns Instance `$fetch` dengan `baseURL` dari `runtimeConfig.public.apiBase`.
 */
export function useApi() {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('auth_token')

  return $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      if (token.value) {
        const headers = new Headers(options.headers as HeadersInit)
        headers.set('Authorization', `Bearer ${token.value}`)
        options.headers = headers
      }
    },
    onResponse({ response }) {
      const body = response._data as { data?: unknown } | null
      if (body && typeof body === 'object' && 'data' in body) {
        response._data = body.data
      }
    },
    onResponseError({ response, error }) {
      const body = response._data as ApiError | null
      if (error) {
        const message = body?.message
        if (Array.isArray(message)) {
          error.message = message.join(', ')
        } else if (typeof message === 'string') {
          error.message = message
        }
      }
      if (response.status === 401 && token.value) {
        token.value = null
        navigateTo('/login')
      }
    }
  })
}
