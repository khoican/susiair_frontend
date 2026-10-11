// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/a11y', '@nuxt/content', '@nuxt/eslint', '@nuxt/hints', '@nuxt/image', '@nuxt/scripts', '@nuxt/test-utils/module', '@nuxt/ui', '@ant-design-vue/nuxt', '@arkenv/nuxt/module', '@artmizu/nuxt-prometheus', '@askdoppler/nuxt', 'pinia-plugin-unstorage/nuxt', '@pinia/nuxt', '@pinia/colada-nuxt'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true }
})
