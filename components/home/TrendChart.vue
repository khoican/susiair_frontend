<script setup lang="ts">
import {
  CategoryScale,
  Chart,
  type ChartOptions,
  Filler,
  LineElement,
  LinearScale,
  PointElement,
  type ScriptableContext,
  Tooltip
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import { Line } from 'vue-chartjs'
import type { Range } from '~/types/api'
import { ANCHOR_DATE } from '~/utils/date'

Chart.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Filler, annotationPlugin)

const RANGES: { value: Range, label: string }[] = [
  { value: '1w', label: '1W' },
  { value: '1m', label: '1M' },
  { value: '3m', label: '3M' },
  { value: '6m', label: '6M' },
  { value: '1y', label: '1Y' }
]

const pilotStore = usePilotStore()

const series = computed(() => pilotStore.summary?.chart.series ?? [])
const hasData = computed(() => series.value.length > 0)

const chartData = computed(() => ({
  labels: series.value.map(point => formatDay(point.date)),
  datasets: [
    {
      data: series.value.map(point => point.sum),
      borderColor: '#22c5e8',
      backgroundColor: 'rgba(34, 197, 232, 0.12)',
      fill: true,
      tension: 0.3,
      pointRadius: (context: ScriptableContext<'line'>) =>
        context.dataIndex === series.value.length - 1 ? 4 : 2,
      pointBackgroundColor: '#22c5e8'
    }
  ]
}))

const chartOptions = computed<ChartOptions<'line'>>(() => {
  const limitLine = pilotStore.summary?.chart.limitLine ?? 0
  const labels = series.value.map(p => formatDay(p.date))
  const anchorIdx = labels.findIndex((_, i) => series.value[i]?.date === ANCHOR_DATE)
  const annotations: any = {
    limit: {
      type: 'line',
      yMin: limitLine,
      yMax: limitLine,
      borderColor: '#e63757',
      borderWidth: 2,
      borderDash: [6, 4],
      label: {
        display: true,
        content: `Limit ${limitLine}`,
        position: 'end',
        backgroundColor: '#e63757',
        color: '#ffffff',
        font: { size: 10, weight: 'bold' },
        padding: 4
      }
    },
    ...(anchorIdx >= 0
      ? {
          today: {
            type: 'line',
            xMin: anchorIdx,
            xMax: anchorIdx,
            borderColor: '#0e2138',
            borderWidth: 1,
            borderDash: [4, 4],
            label: {
              display: true,
              content: 'Today',
              position: 'start',
              backgroundColor: 'rgba(14, 33, 56, 0.8)',
              color: '#ffffff',
              font: { size: 10 },
              padding: 4
            }
          },
          future: {
            type: 'box',
            xMin: anchorIdx,
            xMax: labels.length - 1,
            backgroundColor: 'rgba(14, 33, 56, 0.04)',
            borderWidth: 0
          }
        }
      : {})
  }
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { displayColors: false },
      annotation: { annotations }
    },
    scales: {
      y: {
        min: 0,
        max: pilotStore.summary?.chart.yMax ?? 45,
        title: { display: true, text: 'hrs' },
        grid: { color: 'rgba(14, 33, 56, 0.06)' },
        ticks: { precision: 0 }
      },
      x: { grid: { display: false } }
    }
  }
})
</script>

<template>
  <section class="chart">
    <div class="chart__toggle">
      <button
        v-for="option in RANGES"
        :key="option.value"
        type="button"
        class="chart__tab"
        :class="{ 'chart__tab--active': pilotStore.range === option.value }"
        @click="pilotStore.setRange(option.value)"
      >
        {{ option.label }}
      </button>
    </div>

    <div class="chart__legend">
      <span class="chart__legend-item">
        <i class="chart__dot" />Flight hours
      </span>
      <span class="chart__legend-item">
        <i class="chart__dash" />Limit
      </span>
    </div>

    <div class="chart__canvas">
      <Line v-if="hasData" :data="chartData" :options="chartOptions" />
      <p v-else class="chart__empty">
        No flight data for this range.
      </p>
    </div>
  </section>
</template>
