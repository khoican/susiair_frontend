<script setup lang="ts">
definePageMeta({ layout: 'default' })

const auth = useAuthStore()
</script>

<template>
  <div class="placeholder">
    <p>Dashboard segera hadir.</p>
    <button type="button" @click="auth.logout()">
      Sign Out
    </button>
  </div>
</template>

<style scoped lang="scss">
.placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;

  button {
    padding: 10px 20px;
    border: none;
    border-radius: var(--radius-xl);
    background: var(--color-brand-red);
    color: #ffffff;
    font-family: inherit;
    font-weight: 700;
    cursor: pointer;
  }
}
</style>
