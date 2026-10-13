import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '~/stores/auth'

const { caller, useApiMock, navigateMock } = vi.hoisted(() => ({
  caller: vi.fn(),
  useApiMock: vi.fn(),
  navigateMock: vi.fn()
}))

mockNuxtImport('useApi', () => useApiMock)
mockNuxtImport('navigateTo', () => navigateMock)

beforeEach(() => {
  setActivePinia(createPinia())
  caller.mockReset()
  useApiMock.mockReset()
  navigateMock.mockReset()
  useApiMock.mockReturnValue(caller)
})

describe('useAuthStore', () => {
  it('stores the token and pilot then redirects home on login', async () => {
    caller.mockResolvedValue({
      accessToken: 'jwt-token',
      pilot: { id: '1', name: 'John Doe', username: 'johndoe' }
    })

    const store = useAuthStore()
    await store.login('johndoe', 'susiairtest')

    expect(caller).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      body: { username: 'johndoe', password: 'susiairtest' }
    })
    expect(store.token).toBe('jwt-token')
    expect(store.isAuthenticated).toBe(true)
    expect(store.pilot?.name).toBe('John Doe')
    expect(navigateMock).toHaveBeenCalledWith('/')
  })

  it('clears the token and redirects to login on logout', () => {
    const store = useAuthStore()
    store.token = 'jwt-token'

    store.logout()

    expect(store.token).toBeNull()
    expect(store.pilot).toBeNull()
    expect(navigateMock).toHaveBeenCalledWith('/login')
  })
})
