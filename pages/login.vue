<script setup lang="ts">
definePageMeta({ layout: 'blank' })

const auth = useAuthStore()
const username = ref('')
const password = ref('')
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
    <img class="login__logo" src="/logo.png" alt="Susi Air">

    <h1 class="login__title">
      Sign In
    </h1>

    <label class="login__field">
      <span>Username</span>
      <input
        v-model="username"
        type="text"
        autocomplete="username"
        required
        @input="error = ''"
      >
    </label>

    <label class="login__field">
      <span>Password</span>
      <input
        v-model="password"
        type="password"
        autocomplete="current-password"
        required
        @input="error = ''"
      >
    </label>

    <p v-if="error" class="login__error" role="alert">
      {{ error }}
    </p>

    <button class="login__submit" type="submit" :disabled="loading">
      {{ loading ? 'Signing in…' : 'Sign In' }}
    </button>
  </form>
</template>

<style scoped lang="scss">
.login {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__logo {
    width: 120px;
    margin: 0 auto;
  }

  &__title {
    margin: 0;
    text-align: center;
    font-size: 22px;
    font-weight: 800;
    color: var(--color-text-primary);
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text-secondary);

    input {
      padding: 12px 14px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-family: inherit;
      font-size: 14px;
      color: var(--color-text-primary);
      background: var(--color-card-surface);

      &:focus {
        outline: none;
        border-color: var(--color-brand-red);
      }
    }
  }

  &__error {
    margin: 0;
    padding: 10px 14px;
    border-radius: var(--radius-md);
    background: rgba(230, 55, 87, 0.1);
    color: var(--color-danger);
    font-size: 13px;
    font-weight: 600;
  }

  &__submit {
    padding: 14px;
    border: none;
    border-radius: var(--radius-xl);
    background: var(--color-brand-red);
    color: #ffffff;
    font-family: inherit;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}
</style>
