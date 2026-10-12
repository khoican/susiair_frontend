export default defineNuxtConfig({
  modules: ['@nuxt/a11y', '@nuxt/eslint', '@nuxt/image', '@nuxt/test-utils/module', '@pinia/nuxt'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://susiairbackend-production.up.railway.app/api'
    }
  }
})