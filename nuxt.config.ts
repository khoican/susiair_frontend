export default defineNuxtConfig({
  modules: ['@nuxt/a11y', '@nuxt/eslint', '@nuxt/image', '@nuxt/test-utils/module', '@pinia/nuxt'],
  compatibilityDate: '2025-07-15',
  css: [
    '@fontsource/plus-jakarta-sans/400.css',
    '@fontsource/plus-jakarta-sans/500.css',
    '@fontsource/plus-jakarta-sans/700.css',
    '@fontsource/plus-jakarta-sans/800.css',
    '~/assets/scss/app.scss'
  ],
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://susiairbackend-production.up.railway.app/api',
      demoUsername: process.env.NUXT_PUBLIC_DEMO_USERNAME || 'johndoe',
      demoPassword: process.env.NUXT_PUBLIC_DEMO_PASSWORD || 'passjhondoe'
    }
  }
})