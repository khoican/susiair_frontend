<script setup lang="ts">
import { Eye, EyeOff } from 'lucide-vue-next'

definePageMeta({ layout: 'blank' })

const runtimeConfig = useRuntimeConfig()
const auth = useAuthStore()
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

/**
 * Menangani submit form login.
 *
 * @returns Promise yang selesai setelah percobaan login diproses.
 */
async function onSubmit(): Promise<void> {
  error.value = ''
  loading.value = true
  try {
    await auth.login(username.value, password.value)
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="login" @submit.prevent="onSubmit">
    <header class="login__brand">
      <img class="login__logo" src="/logo.png" alt="Susi Air">
      <h1 class="login__title">
        Susi Air Pilot
      </h1>
      <p class="login__subtitle">
        Flight hours, duty limits &amp; documents
      </p>
    </header>

    <label class="login__field">
      <span class="login__label">Username</span>
      <input
        v-model="username"
        type="text"
        autocomplete="username"
        required
        @input="error = ''"
      >
    </label>

    <label class="login__field">
      <span class="login__label">Password</span>
      <span class="login__control">
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          required
          @input="error = ''"
        >
        <button
          type="button"
          class="login__toggle"
          :aria-label="showPassword ? 'Hide password' : 'Show password'"
          @click="showPassword = !showPassword"
        >
          <EyeOff v-if="showPassword" :size="18" />
          <Eye v-else :size="18" />
        </button>
      </span>
    </label>

    <p v-if="error" class="login__error" role="alert">
      {{ error }}
    </p>

    <button class="login__submit" type="submit" :disabled="loading">
      {{ loading ? 'Signing in…' : 'Sign In' }}
    </button>

    <p class="login__hint">
      Demo — <strong>{{ runtimeConfig.public.demoUsername }}</strong> / <strong>{{ runtimeConfig.public.demoPassword }}</strong>
    </p>
  </form>
</template>
