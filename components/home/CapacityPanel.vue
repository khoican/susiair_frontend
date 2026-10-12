<script setup lang="ts">
import type { FlightHoursCards } from '~/types/api'
import LimitRow from '~/components/home/LimitRow.vue'
import { sortByUrgency } from '~/utils/home'

const props = defineProps<{
  cards: FlightHoursCards
}>()

const ordered = computed(() => sortByUrgency(props.cards))
const display = computed(() => [
  { key: 'annual', title: 'Annual', current: ordered.value[0].current, limit: ordered.value[0].limit },
  { key: 'monthly', title: 'Monthly', current: ordered.value[1].current, limit: ordered.value[1].limit },
  { key: 'daily', title: 'Daily', current: ordered.value[2].current, limit: ordered.value[2].limit },
  { key: 'weekly', title: 'Weekly', current: ordered.value[3].current, limit: ordered.value[3].limit }
])
</script>

<template>
  <section class="panel">
    <h2 class="panel__heading">
      Duty capacity
    </h2>
    <div class="panel__list">
      <LimitRow
        v-for="item in display"
        :key="item.title"
        :title="item.title"
        :current="item.current"
        :limit="item.limit"
      />
    </div>
  </section>
</template>
