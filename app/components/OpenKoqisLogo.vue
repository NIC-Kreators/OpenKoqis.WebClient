<template>
  <div role="img" aria-label="OpenKoqis" :style="containerStyle">
    <svg
      viewBox="0 0 56 36"
      :width="iconWidth"
      :height="size"
      aria-hidden="true"
      style="display: block; flex-shrink: 0;"
    >
      <rect x="0" y="3" width="35" height="23" rx="4" fill="#4CD137" />
      <path d="M37 10 H46.5 L55 18.5 V26 H37 Z" fill="#4CD137" />
      <circle cx="10" cy="29.5" r="5.5" fill="#4CD137" />
      <circle cx="45" cy="29.5" r="5.5" fill="#4CD137" />
    </svg>
    <span
      v-if="!iconOnly"
      aria-hidden="true"
      :style="textStyle"
    >
      <span :style="{ color: inkColor }">open</span><span style="color: #4CD137">koqis</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    dark?: boolean
    size?: number
    iconOnly?: boolean
  }>(),
  {
    dark: true,
    size: 28,
    iconOnly: false
  }
)

const iconWidth = computed(() => Math.round((props.size * 56) / 36))
const fontSize = computed(() => Math.round(props.size * 0.8))
const gap = computed(() => Math.round(props.size * 0.4))
const inkColor = computed(() => (props.dark ? '#F2F5F1' : '#0E1410'))

const containerStyle = computed(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: `${gap.value}px`,
  userSelect: 'none' as const
}))

const textStyle = computed(() => ({
  fontFamily: 'Unbounded, system-ui, sans-serif',
  fontWeight: 700,
  fontSize: `${fontSize.value}px`,
  letterSpacing: '-0.02em',
  lineHeight: 1
}))
</script>
