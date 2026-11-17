<template>
  <div class="verify-sms-page">
    <div class="truck-backdrop">
      <TruckSilhouette :dim="0.35" placement="center" />
    </div>

    <main class="verify-main">
      <form class="verify-card" @submit.prevent="handleVerify">
        <!-- Back Link -->
        <NuxtLink to="/login" class="back-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          <span>Назад</span>
        </NuxtLink>

        <div class="card-header">
          <h1 class="card-title">Введите код</h1>
          <p class="card-desc">
            Мы отправили SMS с 6-значным кодом на <strong>+7 *** *** 12 34</strong>
          </p>
        </div>

        <fieldset class="otp-fieldset">
          <legend class="otp-legend">Код из SMS</legend>
          <OtpInput
            v-model="otpCode"
            :length="6"
            :dark="true"
            @complete="onCodeComplete"
          />
        </fieldset>

        <!-- Timer / Resend -->
        <div class="timer-section">
          <span v-if="timeLeft > 0" class="timer-text">
            Отправить код повторно через 0:{{ timeLeft.toString().padStart(2, '0') }}
          </span>
          <button
            v-else
            type="button"
            class="resend-btn"
            @click="resendCode"
          >
            Отправить код повторно
          </button>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="verify-btn"
          :disabled="otpCode.length < 6 || isSubmitting"
        >
          <svg v-if="isSubmitting" class="btn-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
            <path d="M12 3a9 9 0 1 1-9 9" />
          </svg>
          <span>{{ isSubmitting ? 'Проверка…' : 'Подтвердить' }}</span>
        </button>

        <div v-if="verificationSuccess" class="success-banner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4CD137" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12l5 5 9-10" />
          </svg>
          <span>Код успешно подтверждён! Вход в систему…</span>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const otpCode = ref('48')
const isSubmitting = ref(false)
const verificationSuccess = ref(false)
const timeLeft = ref(42)
let interval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})

const startTimer = () => {
  if (interval) clearInterval(interval)
  timeLeft.value = 42
  interval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value -= 1
    } else {
      if (interval) clearInterval(interval)
    }
  }, 1000)
}

const resendCode = () => {
  startTimer()
}

const onCodeComplete = (code: string) => {
  otpCode.value = code
}

const handleVerify = () => {
  if (otpCode.value.length < 6) return
  isSubmitting.value = true

  setTimeout(() => {
    isSubmitting.value = false
    verificationSuccess.value = true
    login('dispatcher')
    setTimeout(() => {
      router.push('/dashboard')
    }, 800)
  }, 600)
}
</script>

<style scoped>
.verify-sms-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #050605;
  color: #F2F5F1;
  font-family: var(--font-sans);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.truck-backdrop {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.verify-main {
  position: relative;
  box-sizing: border-box;
  flex: 1;
  min-height: 100vh;
  padding: 64px 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
}

.verify-card {
  box-sizing: border-box;
  width: 100%;
  max-width: 440px;
  padding: 40px;
  border-radius: 20px;
  background: rgba(14, 17, 15, 0.88);
  border: 1px solid #1F2521;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.back-link {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  font-size: 14px;
  color: #C3CBC4;
  text-decoration: none;
  transition: color 0.15s ease;
}
.back-link:hover {
  color: #F2F5F1;
}

.card-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-title {
  margin: 0;
  font-family: 'Unbounded', system-ui, sans-serif;
  font-weight: 600;
  font-size: 26px;
  letter-spacing: -0.02em;
}

.card-desc {
  margin: 0;
  font-size: 15px;
  line-height: 1.55;
  color: #C3CBC4;
}

.card-desc strong {
  color: #F2F5F1;
}

.otp-fieldset {
  margin: 0;
  padding: 0;
  border: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.otp-legend {
  font-size: 14px;
  font-weight: 500;
  color: #C3CBC4;
  padding: 0;
  margin-bottom: 4px;
}

.timer-section {
  display: flex;
  justify-content: center;
  font-size: 14px;
  color: #A9B2AA;
}

.timer-text {
  color: #8F998F;
}

.resend-btn {
  background: none;
  border: none;
  color: #7FE06C;
  font: 500 14px var(--font-sans);
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
}
.resend-btn:hover {
  color: #A6EE97;
}

.verify-btn {
  min-height: 52px;
  border: none;
  border-radius: 12px;
  background: #4CD137;
  color: #08130A;
  font: 600 16px var(--font-sans);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background-color 0.15s ease;
}
.verify-btn:hover:not(:disabled) {
  background: #3DB82A;
}
.verify-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-spinner {
  animation: okSpin 0.8s linear infinite;
}

.success-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 10px;
  background: rgba(76, 209, 55, 0.12);
  border: 1px solid #243026;
  font-size: 14px;
  color: #7FE06C;
}
</style>
