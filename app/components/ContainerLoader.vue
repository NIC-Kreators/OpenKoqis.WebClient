<template>
  <div class="container-loader">
    <svg
      viewBox="0 -44 240 344"
      width="220"
      height="315"
      role="img"
      :aria-label="`Контейнер заполняется: ${currentLevel}%`"
      class="bin-svg"
    >
      <defs>
        <clipPath id="okBinClip">
          <path d="M34 62 H206 L192 266 Q191 274 183 274 H57 Q49 274 48 266 Z" />
        </clipPath>
      </defs>

      <!-- Ultrasound sonar pulses (JSN-SR04T) -->
      <g fill="none" stroke="#4CD137" stroke-width="5" stroke-linecap="round">
        <path d="M106 12 A18 18 0 0 1 134 12" class="pulse-arc pulse-1" />
        <path d="M96 0 A32 32 0 0 1 144 0" class="pulse-arc pulse-2" />
        <path d="M86 -12 A46 46 0 0 1 154 -12" class="pulse-arc pulse-3" />
      </g>

      <!-- Bin Body & Waste Fill -->
      <path d="M34 62 H206 L192 266 Q191 274 183 274 H57 Q49 274 48 266 Z" fill="#FFFFFF" />
      <rect
        x="0"
        :y="fillY"
        width="240"
        :height="fillH"
        :fill="statusColor"
        clip-path="url(#okBinClip)"
        class="waste-level-rect"
      />

      <!-- Rib lines on plastic container -->
      <path
        d="M92 90 V250 M120 90 V250 M148 90 V250"
        stroke="rgba(14,20,16,0.14)"
        stroke-width="4"
        stroke-linecap="round"
      />

      <!-- Bin Outer Frame -->
      <path
        d="M34 62 H206 L192 266 Q191 274 183 274 H57 Q49 274 48 266 Z"
        fill="none"
        stroke="#0E1410"
        stroke-width="6"
        stroke-linejoin="round"
      />

      <!-- Lid & Sensor Module -->
      <rect x="22" y="36" width="196" height="24" rx="8" fill="#0E1410" />
      <rect x="104" y="24" width="32" height="14" rx="4" fill="#0E1410" />
      <circle cx="120" cy="31" r="3" fill="#4CD137" />

      <!-- Wheels -->
      <circle cx="64" cy="284" r="14" fill="#0E1410" />
      <circle cx="176" cy="284" r="14" fill="#0E1410" />
    </svg>

    <div class="loader-info">
      <div class="loader-percent">{{ currentLevel }}%</div>
      <div class="status-pill">
        <span class="status-dot" :style="{ backgroundColor: statusColor }" />
        <span class="status-text">{{ statusText }}</span>
      </div>
    </div>

    <div class="loader-caption">{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    message?: string
    autoAnimate?: boolean
    level?: number
  }>(),
  {
    message: 'Загружаем данные датчиков…',
    autoAnimate: true,
    level: 0
  }
)

const animProgress = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  if (props.autoAnimate) {
    timer = setInterval(() => {
      animProgress.value += 1.5
      if (animProgress.value > 140) {
        animProgress.value = 0
      }
    }, 40)
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const currentLevel = computed(() => {
  if (!props.autoAnimate && props.level !== undefined) {
    return Math.min(100, Math.max(0, Math.round(props.level)))
  }
  return Math.round(Math.min(animProgress.value, 100))
})

const fillH = computed(() => (212 * currentLevel.value) / 100)
const fillY = computed(() => 274 - fillH.value)

const statusColor = computed(() => {
  if (currentLevel.value >= 85) return '#C93A2B'
  if (currentLevel.value >= 60) return '#F2A93B'
  return '#4CD137'
})

const statusText = computed(() => {
  if (currentLevel.value >= 85) return 'Пора вывозить'
  if (currentLevel.value >= 60) return 'Скоро заполнится'
  return 'Норма'
})
</script>

<style scoped>
.container-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
  user-select: none;
}

.bin-svg {
  display: block;
}

.pulse-arc {
  animation: okPing 1.8s ease-out infinite;
}
.pulse-1 {
  animation-delay: 0s;
}
.pulse-2 {
  animation-delay: 0.25s;
}
.pulse-3 {
  animation-delay: 0.5s;
}

.waste-level-rect {
  transition: fill 0.3s ease;
}

.loader-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.loader-percent {
  font-family: 'Unbounded', system-ui, sans-serif;
  font-weight: 600;
  font-size: 44px;
  letter-spacing: -0.02em;
  line-height: 1;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 999px;
  background: #FFFFFF;
  border: 1px solid #DCE2DA;
  font-size: 14px;
  font-weight: 500;
  color: #2C352E;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  transition: background-color 0.3s ease;
}

.loader-caption {
  font-size: 15px;
  color: #4E5950;
}
</style>
