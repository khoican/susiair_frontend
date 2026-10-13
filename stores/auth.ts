import type { LoginPilot, LoginResult } from '~/types/api'

/**
 * Store autentikasi pilot: token JWT (cookie `auth_token`) dan profil sesi.
 *
 * @returns State dan aksi autentikasi (token, pilot, isAuthenticated, login, logout).
 */
export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>('auth_token')
  const pilot = ref<LoginPilot | null>(null)
  const isAuthenticated = computed(() => Boolean(token.value))

  /**
   * Login pilot lalu menyimpan token ke cookie dan profil ke state.
   *
   * @param username Username pilot.
   * @param password Password pilot.
   * @throws {Error} Bila kredensial salah (`401`) atau validasi gagal (`400`).
   */
  async function login(username: string, password: string): Promise<LoginResult> {
    const res = await useApi()<LoginResult>('/auth/login', {
      method: 'POST',
      body: { username, password }
    })
    token.value = res.accessToken
    pilot.value = res.pilot
    await navigateTo('/')
    return res
  }

  /**
   * Logout client-side: menghapus token dan profil lalu kembali ke `/login`.
   */
  function logout(): void {
    token.value = null
    pilot.value = null
    navigateTo('/login')
  }

  return { token, pilot, isAuthenticated, login, logout }
})
