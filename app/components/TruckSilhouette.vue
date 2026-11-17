<template>
  <div class="truck-silhouette-wrapper" :style="{ opacity: dim }">
    <div
      aria-hidden="true"
      class="haze-effect"
      :style="{
        background: `radial-gradient(ellipse 55% 50% at ${centerPos} 80%, rgba(255,240,205,0.12), rgba(255,240,205,0) 70%)`,
        ...animStyles.haze
      }"
    />
    <svg
      viewBox="0 0 800 560"
      aria-hidden="true"
      class="truck-svg"
      :style="{
        left: centerPos,
        width: svgWidth
      }"
    >
      <defs>
        <filter id="okBlur" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
        <filter id="okBlurS" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <linearGradient id="okBeam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#FFF1CF" stop-opacity="0.5" />
          <stop offset="1" stop-color="#FFF1CF" stop-opacity="0" />
        </linearGradient>
        <radialGradient id="okFloor" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="#FFF1CF" stop-opacity="0.3" />
          <stop offset="1" stop-color="#FFF1CF" stop-opacity="0" />
        </radialGradient>
      </defs>

      <!-- Headlight Beam & Ground Reflection -->
      <ellipse cx="400" cy="530" rx="380" ry="46" fill="url(#okFloor)" :style="animStyles.beam" />
      <polygon points="252,350 304,350 350,560 110,560" fill="url(#okBeam)" :style="animStyles.beam" />
      <polygon points="496,350 548,350 690,560 450,560" fill="url(#okBeam)" :style="animStyles.beam" />

      <!-- Truck Body Silhouette -->
      <g fill="#080A09">
        <rect x="185" y="52" width="430" height="28" rx="8" />
        <rect x="165" y="70" width="470" height="330" rx="16" />
        <rect x="228" y="178" width="344" height="244" rx="20" />
        <rect x="184" y="196" width="20" height="70" rx="6" />
        <rect x="596" y="196" width="20" height="70" rx="6" />
        <rect x="236" y="436" width="64" height="64" rx="10" fill="#050605" />
        <rect x="500" y="436" width="64" height="64" rx="10" fill="#050605" />
        <rect x="210" y="404" width="380" height="36" rx="10" fill="#0A0C0B" />
      </g>
      <rect x="252" y="198" width="296" height="112" rx="12" fill="#0B0E0C" />
      <path d="M300 302 L384 268 M416 302 L500 268" stroke="#1A1F1B" stroke-width="4" stroke-linecap="round" />
      <rect x="322" y="328" width="156" height="62" rx="8" fill="#0B0E0C" />
      <path d="M334 342 H466 M334 356 H466 M334 370 H466" stroke="#1E2420" stroke-width="3" stroke-linecap="round" />
      <rect x="246" y="332" width="64" height="36" rx="10" fill="#0F1210" />
      <rect x="490" y="332" width="64" height="36" rx="10" fill="#0F1210" />

      <!-- Outline / Contours -->
      <g fill="none" stroke="#3A423C" stroke-width="2" :style="animStyles.rim">
        <rect x="185" y="52" width="430" height="28" rx="8" />
        <rect x="165" y="70" width="470" height="330" rx="16" />
        <rect x="228" y="178" width="344" height="244" rx="20" />
        <rect x="252" y="198" width="296" height="112" rx="12" />
        <rect x="210" y="404" width="380" height="36" rx="10" />
        <rect x="184" y="196" width="20" height="70" rx="6" />
        <rect x="596" y="196" width="20" height="70" rx="6" />
        <path d="M204 212 H228 M596 212 H572" />
        <path d="M60 500 H740" stroke="#1F2521" />
      </g>

      <!-- Amber Roof Marker Lights -->
      <g fill="#FFB547" :style="animStyles.amber">
        <rect x="337" y="184" width="14" height="6" rx="3" />
        <rect x="361" y="184" width="14" height="6" rx="3" />
        <rect x="393" y="184" width="14" height="6" rx="3" />
        <rect x="425" y="184" width="14" height="6" rx="3" />
        <rect x="449" y="184" width="14" height="6" rx="3" />
      </g>

      <!-- Headlight Lanterns Glow -->
      <g :style="animStyles.lamp">
        <circle cx="278" cy="350" r="50" fill="#FFE9B8" filter="url(#okBlur)" />
        <circle cx="522" cy="350" r="50" fill="#FFE9B8" filter="url(#okBlur)" />
        <rect x="252" y="338" width="52" height="24" rx="7" fill="#FFF6DD" />
        <rect x="496" y="338" width="52" height="24" rx="7" fill="#FFF6DD" />
      </g>

      <!-- Green Telemetry LED on Windshield -->
      <g :style="animStyles.led">
        <circle cx="532" cy="216" r="10" fill="#4CD137" filter="url(#okBlurS)" />
        <circle cx="532" cy="216" r="4.5" fill="#7FE06C" />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    animate?: boolean
    placement?: 'center' | 'right'
    dim?: number
  }>(),
  {
    animate: false,
    placement: 'center',
    dim: 1
  }
)

const centerPos = computed(() => (props.placement === 'right' ? '70%' : '50%'))
const svgWidth = computed(() => (props.placement === 'right' ? 'min(820px, 64%)' : 'min(980px, 92%)'))

const animStyles = computed(() => {
  if (!props.animate) {
    return {
      lamp: { opacity: 1 },
      beam: { opacity: 1 },
      haze: { opacity: 1 },
      rim: { opacity: 1 },
      amber: { opacity: 1 },
      led: { animation: 'okBlink 2.4s ease-in-out infinite' }
    }
  }

  return {
    lamp: {
      opacity: 0,
      animation: 'okFlick 1.6s linear 0.8s forwards'
    },
    beam: {
      opacity: 0,
      animation: 'okFade 1.4s ease-out 1.7s forwards'
    },
    haze: {
      opacity: 0,
      animation: 'okFade 2s ease-out 1.9s forwards'
    },
    rim: {
      opacity: 0,
      animation: 'okFade 1.6s ease-out 2.1s forwards'
    },
    amber: {
      opacity: 0,
      animation: 'okFade 0.5s ease-out 3.0s forwards'
    },
    led: {
      opacity: 0,
      animation: 'okFade 0.3s ease-out 3.4s forwards, okBlink 2.4s ease-in-out 3.7s infinite'
    }
  }
})
</script>

<style scoped>
.truck-silhouette-wrapper {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  min-height: 700px;
  background: #050605;
  overflow: hidden;
  pointer-events: none;
}

.haze-effect {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.truck-svg {
  position: absolute;
  bottom: 0;
  transform: translateX(-50%);
  height: auto;
  pointer-events: none;
}
</style>
