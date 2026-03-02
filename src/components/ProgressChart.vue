<template>
  <div class="progress-chart">
    <svg
      :width="width"
      :height="height"
      :viewBox="`0 0 ${width} ${height}`"
    >
      <g>
        <line
          v-for="(y, i) in yLines"
          :key="`line-${i}`"
          :x1="padding.left"
          :y1="y"
          :x2="width - padding.right"
          :y2="y"
          :stroke="gridColor"
          stroke-width="1"
        />
      </g>

      <g>
        <text
          v-for="(y, i) in yLabels"
          :key="`label-${i}`"
          :x="padding.left - 8"
          :y="yLabelsY[i] + 4"
          text-anchor="end"
          font-size="12"
          :fill="textColor"
        >
          {{ y }}
        </text>
      </g>

      <g>
        <text
          v-for="(_, i) in filteredData"
          :key="`date-${i}`"
          :x="xCoordinates[i]"
          :y="height - padding.bottom + 20"
          text-anchor="middle"
          font-size="10"
          :fill="textColor"
        >
          {{ formatDate(filteredData[i].date) }}
        </text>
      </g>

      <path
        v-if="filteredData.length > 0"
        :d="linePath"
        fill="none"
        :stroke="lineColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <path
        v-if="filteredData.length > 0"
        :d="areaPath"
        :fill="`url(#gradient-${uid})`"
      />

      <defs>
        <linearGradient :id="`gradient-${uid}`" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" :stop-color="lineColor" stop-opacity="0.3" />
          <stop offset="100%" :stop-color="lineColor" stop-opacity="0" />
        </linearGradient>
      </defs>

      <g>
        <circle
          v-for="(_, i) in filteredData"
          :key="`point-${i}`"
          :cx="xCoordinates[i]"
          :cy="yCoordinates[i]"
          r="6"
          :fill="lineColor"
          :stroke="bgColor"
          stroke-width="2"
        />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ChartDataPoint } from '@/types'

interface Props {
  data: ChartDataPoint[]
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 600,
  height: 300
})

const uid = ref(Math.random().toString(36).substr(2, 9))

const padding = { top: 20, right: 20, bottom: 40, left: 50 }
const chartWidth = computed(() => props.width - padding.left - padding.right)
const chartHeight = computed(() => props.height - padding.top - padding.bottom)

const filteredData = computed(() => {
  return props.data.slice(-20)
})

const maxSpeed = computed(() => {
  const speeds = filteredData.value.map(d => d.speed)
  return speeds.length > 0 ? Math.max(...speeds) + 20 : 100
})

const yLines = computed(() => {
  const lines = []
  const step = chartHeight.value / 4
  for (let i = 0; i <= 4; i++) {
    lines.push(padding.top + i * step)
  }
  return lines
})

const yLabels = computed(() => {
  const labels = []
  const step = maxSpeed.value / 4
  for (let i = 4; i >= 0; i--) {
    labels.push(Math.round(i * step))
  }
  return labels
})

const yLabelsY = computed(() => {
  const positions = []
  const step = chartHeight.value / 4
  for (let i = 0; i <= 4; i++) {
    positions.push(padding.top + i * step)
  }
  return positions
})

const xCoordinates = computed(() => {
  if (filteredData.value.length === 0) return []
  const step = chartWidth.value / Math.max(filteredData.value.length - 1, 1)
  return filteredData.value.map((_, i) => padding.left + i * step)
})

const yCoordinates = computed(() => {
  return filteredData.value.map(point => {
    const ratio = 1 - (point.speed / maxSpeed.value)
    return padding.top + ratio * chartHeight.value
  })
})

const linePath = computed(() => {
  if (filteredData.value.length === 0) return ''
  const points = filteredData.value.map((_, i) => `${xCoordinates.value[i]},${yCoordinates.value[i]}`)
  return `M ${points.join(' L ')}`
})

const areaPath = computed(() => {
  if (filteredData.value.length === 0) return ''
  const firstX = xCoordinates.value[0]
  const lastX = xCoordinates.value[xCoordinates.value.length - 1]
  const bottomY = props.height - padding.bottom
  const points = filteredData.value.map((_, i) => `${xCoordinates.value[i]},${yCoordinates.value[i]}`)
  return `M ${firstX},${bottomY} L ${points.join(' L ')} L ${lastX},${bottomY} Z`
})

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

const gridColor = 'var(--border-color, #e5e7eb)'
const textColor = 'var(--text-muted, #6b7280)'
const lineColor = 'var(--accent-primary, #3b82f6)'
const bgColor = 'var(--bg-tertiary, #ffffff)'
</script>

<style scoped lang="scss">
.progress-chart {
  width: 100%;
  height: 100%;
}
</style>
