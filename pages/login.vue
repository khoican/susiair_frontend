<script setup lang="ts">
import { Eye, EyeOff } from "lucide-vue-next";

definePageMeta({ layout: "blank" });

const runtimeConfig = useRuntimeConfig();
const auth = useAuthStore();
const username = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const error = ref("");

/**
 * Menangani submit form login.
 *
 * @returns Promise yang selesai setelah percobaan login diproses.
 */
async function onSubmit(): Promise<void> {
  error.value = "";
  loading.value = true;
  try {
    await auth.login(username.value, password.value);
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div
    class="mx-auto flex min-h-screen w-full max-w-app flex-col items-center justify-center bg-bg p-4"
  >
    <form
      class="relative flex min-h-screen w-full max-w-app flex-col justify-center gap-4 bg-bg p-4"
      @submit.prevent="onSubmit"
    >
      <header
        class="relative flex flex-col items-center gap-2 overflow-hidden rounded-lg bg-container-low px-4 py-5 shadow-card"
      >
        <div
          class="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-primary-fixed opacity-30 blur-2xl"
        />
        <div
          class="pointer-events-none absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-secondary-fixed-dim opacity-30 blur-2xl"
        />
        <img
          class="relative z-10 h-13 w-auto rounded-md object-contain"
          src="/logo.png"
          alt="Susi Air"
        >
        <p
          class="relative z-10 m-0 max-w-17.5 text-center text-base text-secondary"
        >
          Flight hours, duty limits &amp; documents
        </p>
      </header>

      <label class="flex flex-col gap-1">
        <span
          class="flex items-center gap-1 text-base font-semibold text-primary"
          >Username</span
        >
        <div
          class="flex items-center overflow-hidden rounded-md border bg-white transition focus-within:border-navy focus-within:bg-white focus-within:ring"
        >
          <input
            v-model="username"
            class="font-inherit w-full flex-1 border-none bg-transparent px-4 py-2 text-base text-primary focus:outline-none"
            type="text"
            autocomplete="username"
            required
            @input="error = ''"
          >
        </div>
      </label>

      <label class="flex flex-col gap-1">
        <span
          class="flex items-center gap-1 text-base font-semibold text-primary"
          >Password</span
        >
        <div
          class="flex items-center overflow-hidden rounded-md border bg-white transition focus-within:border-navy focus-within:bg-white focus-within:ring"
        >
          <input
            v-model="password"
            class="font-inherit w-full flex-1 border-none bg-transparent px-4 py-2 text-base text-primary focus:outline-none"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            required
            @input="error = ''"
          >
          <button
            type="button"
            class="flex cursor-pointer items-center justify-center border-none bg-transparent p-2 text-secondary transition hover:text-primary active-scale-sm"
            :aria-label="showPassword ? 'Hide password' : 'Show password'"
            @click="showPassword = !showPassword"
          >
            <EyeOff v-if="showPassword" :size="18" />
            <Eye v-else :size="18" />
          </button>
        </div>
      </label>

      <p
        v-if="error"
        class="m-0 rounded-md bg-danger-soft px-4 py-2 text-base font-semibold text-danger"
        role="alert"
      >
        {{ error }}
      </p>

      <button
        class="shadow-card flex min-h-12 w-full cursor-pointer items-center justify-center gap-1 rounded-full border-none bg-danger px-4 py-2 font-inherit text-base font-bold text-white transition active-scale-98 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        :disabled="loading"
      >
        {{ loading ? "Signing in…" : "Sign In" }}
      </button>

      <p class="m-0 border-t pt-2 text-center text-xs text-secondary">
        Demo - <strong>{{ runtimeConfig.public.demoUsername }}</strong> /
        <strong>{{ runtimeConfig.public.demoPassword }}</strong>
      </p>
    </form>
  </div>
</template>
