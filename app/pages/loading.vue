<template>
  <div
    class="loading-page"
    :class="[isTruckBrain ? 'theme-truckbrain' : 'theme-monitoring']"
    @click="skipToDashboard"
  >
    <!-- Mode 1: TruckBrain включён (Тёмная тема) -->
    <div v-if="isTruckBrain" class="truckbrain-container">
      <div class="anim-wrapper">
        <div class="silhouette-layer">
          <TruckSilhouette :animate="true" placement="center" :dim="1" />
        </div>

        <div class="loading-center-overlay">
          <OpenKoqisLogo :dark="true" :size="34" />
          <div class="status-indicator">
            <span class="blinking-dot" :class="{ 'is-complete': isLoaded }" aria-hidden="true" />
            <span>{{ isLoaded ? 'Готово! Переход в дэшборд…' : 'Загружаем маршруты…' }}</span>
          </div>
          <div class="progress-track" aria-hidden="true">
            <div class="progress-bar" />
          </div>
        </div>
      </div>
    </div>

    <!-- Mode 2: Только мониторинг (Светлая тема) -->
    <div v-else class="monitoring-container">
      <div class="monitoring-center">
        <OpenKoqisLogo :dark="false" :size="30" />
        <ContainerLoader
          :auto-animate="true"
          :message="isLoaded ? 'Данные загружены! Переход в дэшборд…' : 'Загружаем данные датчиков…'"
        />
      </div>
    </div>

    <!-- Subtle skip hint at bottom -->
    <div class="bottom-skip-hint">
      <span>Нажмите в любом месте для быстрого перехода →</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isTruckBrain = ref(route.query.mode !== 'monitoring')
const isLoaded = ref(false)
let redirectTimer: ReturnType<typeof setTimeout> | null = null
let finishTimer: ReturnType<typeof setTimeout> | null = null

const skipToDashboard = () => {
  if (finishTimer) clearTimeout(finishTimer)
  if (redirectTimer) clearTimeout(redirectTimer)
  router.replace('/dashboard')
}

onMounted(() => {
  const animDuration = isTruckBrain.value ? 4000 : 3000
  const delayBeforeDashboard = 500 // Задержка ровно 0.5 сек перед переходом в дэшборд

  finishTimer = setTimeout(() => {
    isLoaded.value = true
    // Задержка в 0.5 сек после завершения анимации загрузки перед входом в дэшборд
    redirectTimer = setTimeout(() => {
      router.replace('/dashboard')
    }, delayBeforeDashboard)
  }, animDuration)
})

onUnmounted(() => {
  if (finishTimer) clearTimeout(finishTimer)
  if (redirectTimer) clearTimeout(redirectTimer)
})
</script>

<style scoped>
.loading-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: var(--font-sans);
  cursor: pointer;
  user-select: none;
}

.theme-truckbrain {
  background: #050605;
  color: #F2F5F1;
}

.theme-monitoring {
  background: #F4F6F2;
  color: #0E1410;
}

/* TruckBrain Splash Container */
.truckbrain-container {
  position: relative;
  width: 100%;
  flex: 1;
  min-height: 100vh;
  overflow: hidden;
}

.anim-wrapper {
  position: absolute;
  inset: 0;
}

.silhouette-layer {
  position: absolute;
  inset: 0;
}

.loading-center-overlay {
  position: absolute;
  top: 13%;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  opacity: 0;
  animation: okFade 1s ease-out 3.2s forwards;
  z-index: 20;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #A9B2AA;
  font-size: 15px;
}

.blinking-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4CD137;
  animation: okBlink 1.2s ease-in-out infinite;
}
.blinking-dot.is-complete {
  animation: none;
  box-shadow: 0 0 10px #4CD137;
}

.progress-track {
  width: 240px;
  height: 3px;
  background: #1C211D;
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  width: 100%;
  background: #4CD137;
  transform-origin: left;
  transform: scaleX(0);
  animation: okGrow 1.2s ease-in-out 3.3s forwards;
}

/* Monitoring Container */
.monitoring-container {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px 48px;
  box-sizing: border-box;
}

.monitoring-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
}

.bottom-skip-hint {
  position: absolute;
  bottom: 24px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  font-size: 12px;
  opacity: 0.4;
  transition: opacity 0.2s ease;
  z-index: 50;
  pointer-events: none;
}
.loading-page:hover .bottom-skip-hint {
  opacity: 0.8;
}
</style>
