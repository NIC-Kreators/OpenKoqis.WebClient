<template>
  <div class="root-admin-page">
    <!-- Truck backdrop on the right with linear gradient shading -->
    <div class="truck-backdrop">
      <TruckSilhouette placement="right" :dim="0.9" />
      <div class="gradient-overlay" />
    </div>

    <main class="wizard-container">
      <!-- Wizard Header -->
      <header class="wizard-header">
        <OpenKoqisLogo :dark="true" :size="26" />
        <span class="first-launch-tag">Первый запуск</span>
      </header>

      <!-- Step Indicator -->
      <div class="step-indicator">
        <span class="step-label">Шаг {{ currentStep }} из 4</span>
        <div class="step-bars" aria-hidden="true">
          <span class="step-bar" :class="{ 'is-active': currentStep >= 1 }" />
          <span class="step-bar" :class="{ 'is-active': currentStep >= 2 }" />
          <span class="step-bar" :class="{ 'is-active': currentStep >= 3 }" />
          <span class="step-bar" :class="{ 'is-active': currentStep >= 4 }" />
        </div>
      </div>

      <!-- ================= STEP 1: WELCOME ================= -->
      <section v-if="currentStep === 1" class="step-content anim-fade">
        <h1 class="step-title">Добро пожаловать в&nbsp;OpenKoqis</h1>
        <p class="step-paragraph">
          Открытая платформа для умного вывоза мусора. Датчики в контейнерах сообщают, насколько они заполнены, а TruckBrain строит маршруты для мусоровозов.
        </p>
        <p class="step-paragraph">
          Сначала создадим Root Admin — главный аккаунт этой установки. Это займёт пару минут.
        </p>

        <div class="truckbrain-status-pill">
          <span class="pulse-indicator" aria-hidden="true" />
          <span>TruckBrain включён — маршруты доступны</span>
        </div>

        <footer class="wizard-footer">
          <button type="button" class="action-btn-primary" @click="currentStep = 2">
            <span>Начать</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </footer>
      </section>

      <!-- ================= STEP 2: WHO IS ROOT ================= -->
      <section v-else-if="currentStep === 2" class="step-content anim-fade">
        <div class="title-group">
          <h1 class="step-title">Кто такой Root Admin</h1>
          <p class="step-paragraph">
            Это главный аккаунт системы. Прежде чем создавать его, важно понять, чем он отличается от обычного.
          </p>
        </div>

        <ul class="root-features-list">
          <li class="feature-item">
            <span class="feature-icon-box is-green">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4CD137" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="7.5" cy="15.5" r="4.5" />
                <path d="M10.7 12.3 20 3M17 6l3 3M14.5 8.5l2.5 2.5" />
              </svg>
            </span>
            <div class="feature-texts">
              <strong class="feature-name">Полный доступ</strong>
              <span class="feature-desc">Root Admin может всё: видеть и менять любые данные и настройки.</span>
            </div>
          </li>

          <li class="feature-item">
            <span class="feature-icon-box is-green">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4CD137" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="8" r="3.5" />
                <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
                <circle cx="17" cy="9" r="2.5" />
                <path d="M16.5 14.2c2.8.2 5 2.2 5 5.3" />
              </svg>
            </span>
            <div class="feature-texts">
              <strong class="feature-name">Управляет администраторами</strong>
              <span class="feature-desc">Создаёт других администраторов и раздаёт им права.</span>
            </div>
          </li>

          <li class="feature-item">
            <span class="feature-icon-box is-amber">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F2A93B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </span>
            <div class="feature-texts">
              <strong class="feature-name">Его важно защитить</strong>
              <span class="feature-desc">Если этот аккаунт взломают, под угрозой окажется вся система. Используйте надёжный пароль и никому его не передавайте.</span>
            </div>
          </li>

          <li class="feature-item">
            <span class="feature-icon-box is-green">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4CD137" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
            </span>
            <div class="feature-texts">
              <strong class="feature-name">Не для каждого дня</strong>
              <span class="feature-desc">Для обычной работы создайте отдельный аккаунт администратора, а Root Admin держите на крайний случай.</span>
            </div>
          </li>
        </ul>

        <footer class="wizard-footer">
          <button type="button" class="action-btn-secondary" @click="currentStep = 1">
            Назад
          </button>
          <button type="button" class="action-btn-primary" @click="currentStep = 3">
            <span>Понятно, дальше</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </footer>
      </section>

      <!-- ================= STEP 3: CREATE / CONNECT ACCOUNT ================= -->
      <section v-else-if="currentStep === 3" class="step-content anim-fade">
        <!-- Mode Switcher Tab (Режим А vs Режим Б) -->
        <div class="mode-select-bar">
          <button
            type="button"
            class="mode-select-btn"
            :class="{ 'is-active': setupMode === 'mode_a' }"
            @click="setupMode = 'mode_a'"
          >
            Режим А: Создать локально
          </button>
          <button
            type="button"
            class="mode-select-btn"
            :class="{ 'is-active': setupMode === 'mode_b' }"
            @click="setupMode = 'mode_b'"
          >
            Режим Б: Keycloak / Внешняя IdP
          </button>
        </div>

        <!-- Mode A: Создание аккаунта -->
        <div v-if="setupMode === 'mode_a'" class="form-wrapper">
          <div class="title-group">
            <h1 class="step-title">Создайте Root Admin</h1>
            <p class="step-paragraph">
              OpenKoqis создаст новый аккаунт. Логин и пароль задаёте вы.
            </p>
          </div>

          <form class="step-form" @submit.prevent="submitRootAdmin">
            <!-- Login -->
            <div class="form-field">
              <label for="ra-login" class="field-label">Логин</label>
              <input
                id="ra-login"
                v-model="modeAForm.login"
                type="text"
                class="form-input"
                required
              />
              <span class="field-hint">Латиница, цифры, точка и дефис</span>
            </div>

            <!-- Email & Phone -->
            <div class="fields-row">
              <div class="form-field flex-1">
                <label for="ra-email" class="field-label">Email</label>
                <input
                  id="ra-email"
                  v-model="modeAForm.email"
                  type="email"
                  class="form-input"
                  required
                />
              </div>

              <div class="form-field flex-1">
                <label for="ra-phone" class="field-label">Телефон</label>
                <div class="phone-input-group">
                  <button type="button" class="country-prefix-btn" aria-label="Код страны: Казахстан, +7">
                    <span>KZ +7</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  <input
                    id="ra-phone"
                    v-model="modeAForm.phone"
                    type="tel"
                    placeholder="700 000 00 00"
                    class="form-input phone-field"
                    required
                  />
                </div>
              </div>
            </div>

            <!-- Password with live strength criteria -->
            <div class="form-field">
              <label for="ra-pass" class="field-label">Пароль</label>
              <div class="input-with-toggle">
                <input
                  id="ra-pass"
                  v-model="modeAForm.password"
                  :type="isPassShown ? 'text' : 'password'"
                  class="form-input is-focused-demo"
                  required
                />
                <button
                  type="button"
                  class="toggle-btn"
                  @click="isPassShown = !isPassShown"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>

              <!-- Strength Bars -->
              <div class="strength-meter-row">
                <div class="strength-bars">
                  <span class="bar" :class="{ 'is-ok': passwordStrength >= 1 }" />
                  <span class="bar" :class="{ 'is-ok': passwordStrength >= 2 }" />
                  <span class="bar" :class="{ 'is-ok': passwordStrength >= 3 }" />
                  <span class="bar" :class="{ 'is-ok': passwordStrength >= 4 }" />
                </div>
                <span class="strength-label">
                  Надёжность: {{ strengthText }}
                </span>
              </div>

              <!-- 4 Rule Checkmarks -->
              <ul class="password-rules-grid">
                <li class="rule-item" :class="{ 'is-checked': ruleLen }">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" :stroke="ruleLen ? '#4CD137' : '#6F7A70'" stroke-width="2.4" stroke-linecap="round">
                    <path v-if="ruleLen" d="M5 12l5 5 9-10" />
                    <circle v-else cx="12" cy="12" r="7" />
                  </svg>
                  <span>Не меньше 12 символов</span>
                </li>
                <li class="rule-item" :class="{ 'is-checked': ruleCase }">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" :stroke="ruleCase ? '#4CD137' : '#6F7A70'" stroke-width="2.4" stroke-linecap="round">
                    <path v-if="ruleCase" d="M5 12l5 5 9-10" />
                    <circle v-else cx="12" cy="12" r="7" />
                  </svg>
                  <span>Строчные и заглавные буквы</span>
                </li>
                <li class="rule-item" :class="{ 'is-checked': ruleDigit }">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" :stroke="ruleDigit ? '#4CD137' : '#6F7A70'" stroke-width="2.4" stroke-linecap="round">
                    <path v-if="ruleDigit" d="M5 12l5 5 9-10" />
                    <circle v-else cx="12" cy="12" r="7" />
                  </svg>
                  <span>Хотя бы одна цифра</span>
                </li>
                <li class="rule-item" :class="{ 'is-checked': ruleSpecial }">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" :stroke="ruleSpecial ? '#4CD137' : '#6F7A70'" stroke-width="2.4" stroke-linecap="round">
                    <path v-if="ruleSpecial" d="M5 12l5 5 9-10" />
                    <circle v-else cx="12" cy="12" r="7" />
                  </svg>
                  <span>Спецсимвол (! ? # …)</span>
                </li>
              </ul>
            </div>

            <!-- Confirm Password -->
            <div class="form-field">
              <label for="ra-pass2" class="field-label">Повторите пароль</label>
              <input
                id="ra-pass2"
                v-model="modeAForm.confirmPass"
                :type="isPassShown ? 'text' : 'password'"
                class="form-input"
                required
              />
              <span v-if="modeAForm.password && modeAForm.password === modeAForm.confirmPass" class="match-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
                  <path d="M5 12l5 5 9-10" />
                </svg>
                Пароли совпадают
              </span>
            </div>

            <footer class="wizard-footer">
              <button type="button" class="action-btn-secondary" @click="currentStep = 2">
                Назад
              </button>
              <button type="submit" class="action-btn-primary" :disabled="isSubmitting">
                <span>{{ isSubmitting ? 'Создание…' : 'Создать Root Admin' }}</span>
              </button>
            </footer>
          </form>
        </div>

        <!-- Mode B: Подключение через Keycloak -->
        <div v-else class="form-wrapper">
          <div class="title-group">
            <h1 class="step-title">Подключите Root Admin</h1>
            <p class="step-paragraph">
              Аккаунты этой установки хранятся во внешней системе учётных записей. OpenKoqis не создаёт новый аккаунт, а подключает существующий.
            </p>
          </div>

          <form class="step-form" @submit.prevent="submitRootAdmin">
            <div class="form-field">
              <label for="rb-login" class="field-label">Логин во внешней системе</label>
              <div class="input-with-icon">
                <input
                  id="rb-login"
                  v-model="modeBForm.login"
                  type="text"
                  class="form-input is-success"
                  required
                />
                <svg class="field-check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4CD137" stroke-width="2.4" stroke-linecap="round">
                  <path d="M5 12l5 5 9-10" />
                </svg>
              </div>

              <!-- Found User Card -->
              <div class="found-user-card">
                <span class="user-avatar-initials">AC</span>
                <div class="user-info-text">
                  <strong class="user-id-name">{{ modeBForm.login }}</strong>
                  <span class="user-id-status">Найден во внешней системе учётных записей (Keycloak)</span>
                </div>
              </div>
            </div>

            <!-- External Password Notice -->
            <div class="keycloak-notice-card">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A9B2AA" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="4" y="10" width="16" height="11" rx="2.5" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
              <p class="notice-desc">
                Пароль управляется в системе учётных записей вашей организации. Здесь его задавать не нужно.
              </p>
            </div>

            <!-- Contact info -->
            <div class="section-subheading">
              <span class="subheading-title">Контактные данные</span>
              <span class="subheading-desc">Их можно использовать для входа и восстановления доступа.</span>
            </div>

            <div class="fields-row">
              <div class="form-field flex-1">
                <label for="rb-email" class="field-label">Email</label>
                <input
                  id="rb-email"
                  v-model="modeBForm.email"
                  type="email"
                  class="form-input"
                  required
                />
              </div>

              <div class="form-field flex-1">
                <label for="rb-phone" class="field-label">Телефон</label>
                <div class="phone-input-group">
                  <button type="button" class="country-prefix-btn">
                    <span>KZ +7</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  <input
                    id="rb-phone"
                    v-model="modeBForm.phone"
                    type="tel"
                    placeholder="700 000 00 00"
                    class="form-input phone-field"
                    required
                  />
                </div>
              </div>
            </div>

            <footer class="wizard-footer">
              <button type="button" class="action-btn-secondary" @click="currentStep = 2">
                Назад
              </button>
              <button type="submit" class="action-btn-primary" :disabled="isSubmitting">
                <span>{{ isSubmitting ? 'Подключение…' : 'Подключить Root Admin' }}</span>
              </button>
            </footer>
          </form>
        </div>
      </section>

      <!-- ================= STEP 4: DONE ================= -->
      <section v-else-if="currentStep === 4" class="step-content anim-fade">
        <div class="success-icon-badge" aria-hidden="true">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#08130A" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12l5 5 9-10" />
          </svg>
        </div>

        <h1 class="step-title">Root Admin создан</h1>
        <p class="step-paragraph">
          Установка готова к работе. Что сделать дальше:
        </p>

        <ol class="next-steps-list">
          <li class="next-step-item">
            <span class="step-num">1</span>
            <span>Создайте администратора для повседневной работы</span>
          </li>
          <li class="next-step-item">
            <span class="step-num">2</span>
            <span>Добавьте первые контейнеры с датчиками</span>
          </li>
          <li class="next-step-item">
            <span class="step-num">3</span>
            <span>Добавьте мусоровозы, чтобы TruckBrain строил маршруты</span>
          </li>
        </ol>

        <footer class="wizard-footer">
          <NuxtLink to="/login" class="action-btn-primary">
            <span>Перейти ко входу</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </NuxtLink>
        </footer>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const currentStep = ref(1)
const setupMode = ref<'mode_a' | 'mode_b'>('mode_a')
const isPassShown = ref(false)
const isSubmitting = ref(false)

// Mode A Form
const modeAForm = ref({
  login: 'root',
  email: 'admin@example.com',
  phone: '700 000 00 01',
  password: 'Musor-Route-2026',
  confirmPass: 'Musor-Route-2026'
})

// Mode B Form
const modeBForm = ref({
  login: 'admin.city',
  email: 'admin.city@astana.gov.kz',
  phone: '701 450 12 34'
})

// Live password strength calculations
const ruleLen = computed(() => modeAForm.value.password.length >= 12)
const ruleCase = computed(() => /[a-z]/.test(modeAForm.value.password) && /[A-Z]/.test(modeAForm.value.password))
const ruleDigit = computed(() => /\d/.test(modeAForm.value.password))
const ruleSpecial = computed(() => /[^a-zA-Z0-9]/.test(modeAForm.value.password))

const passwordStrength = computed(() => {
  let score = 0
  if (ruleLen.value) score++
  if (ruleCase.value) score++
  if (ruleDigit.value) score++
  if (ruleSpecial.value) score++
  return score
})

const strengthText = computed(() => {
  if (passwordStrength.value >= 4) return 'отличная'
  if (passwordStrength.value >= 3) return 'хорошая'
  if (passwordStrength.value >= 2) return 'средняя'
  return 'слабая'
})

const submitRootAdmin = () => {
  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    currentStep.value = 4
  }, 600)
}
</script>

<style scoped>
.root-admin-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #050605;
  color: #F2F5F1;
  font-family: var(--font-sans);
  overflow-x: hidden;
}

.truck-backdrop {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #050605 0%, rgba(5, 6, 5, 0.94) 42%, rgba(5, 6, 5, 0) 74%);
}

.wizard-container {
  position: relative;
  box-sizing: border-box;
  max-width: 680px;
  min-height: 100vh;
  padding: 48px clamp(24px, 6vw, 96px);
  display: flex;
  flex-direction: column;
  gap: 36px;
  z-index: 5;
}

.wizard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.first-launch-tag {
  font-size: 13px;
  color: #A9B2AA;
}

/* Step Indicator */
.step-indicator {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.step-label {
  font-size: 13px;
  color: #A9B2AA;
}

.step-bars {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;
}

.step-bar {
  height: 4px;
  border-radius: 2px;
  background: #262C27;
  transition: background-color 0.25s ease;
}
.step-bar.is-active {
  background: #4CD137;
}

/* Step Content */
.step-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
}

.anim-fade {
  animation: okFade 0.6s ease-out both;
}

.step-title {
  margin: 0;
  font-family: 'Unbounded', system-ui, sans-serif;
  font-weight: 600;
  font-size: clamp(28px, 3.4vw, 44px);
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.step-paragraph {
  margin: 0;
  font-size: 17px;
  line-height: 1.6;
  color: #C3CBC4;
  max-width: 520px;
}

.truckbrain-status-pill {
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid #243026;
  background: rgba(76, 209, 55, 0.08);
  font-size: 14px;
  color: #C3CBC4;
}

.pulse-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4CD137;
  animation: okBlink 2.4s ease-in-out infinite;
}

/* Features List (Step 2) */
.root-features-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 16px;
  border-radius: 14px;
  background: rgba(14, 17, 15, 0.75);
  border: 1px solid #1F2521;
}

.feature-icon-box {
  flex: none;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.feature-icon-box.is-green {
  background: rgba(76, 209, 55, 0.12);
}
.feature-icon-box.is-amber {
  background: rgba(242, 169, 59, 0.14);
}

.feature-texts {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.feature-name {
  font-size: 16px;
  font-weight: 600;
  color: #F2F5F1;
}

.feature-desc {
  font-size: 15px;
  line-height: 1.5;
  color: #A9B2AA;
}

/* Mode Switcher Bar (Step 3) */
.mode-select-bar {
  display: inline-flex;
  padding: 4px;
  border-radius: 12px;
  background: rgba(14, 17, 15, 0.9);
  border: 1px solid #1F2521;
  gap: 4px;
  align-self: flex-start;
}

.mode-select-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  color: #A9B2AA;
  transition: all 0.15s ease;
}
.mode-select-btn.is-active {
  background: #1B2A1C;
  color: #4CD137;
  font-weight: 600;
}

/* Forms (Step 3) */
.step-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 14px;
  font-weight: 500;
  color: #C3CBC4;
}

.field-hint {
  font-size: 13px;
  color: #8F998F;
}

.form-input {
  box-sizing: border-box;
  width: 100%;
  height: 52px;
  padding: 0 16px;
  border-radius: 12px;
  border: 1px solid #2F3631;
  background: #0E110F;
  color: #F2F5F1;
  font: 400 16px var(--font-sans);
  outline: none;
  transition: all 0.15s ease;
}
.form-input:focus,
.form-input.is-focused-demo {
  border-color: #4CD137;
  box-shadow: 0 0 0 4px rgba(76, 209, 55, 0.2);
}
.form-input.is-success {
  border-color: #4CD137;
}

.fields-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.flex-1 {
  flex: 1 1 220px;
}

.phone-input-group {
  display: flex;
  gap: 8px;
}

.country-prefix-btn {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 52px;
  padding: 0 12px;
  border-radius: 12px;
  border: 1px solid #2F3631;
  background: #0E110F;
  color: #F2F5F1;
  font: 500 15px var(--font-sans);
  cursor: pointer;
}

.phone-field {
  flex: 1 1 auto;
  min-width: 0;
}

.input-with-toggle,
.input-with-icon {
  position: relative;
}

.toggle-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #A9B2AA;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.field-check-icon {
  position: absolute;
  right: 16px;
  top: 16px;
}

/* Password Strength & Rules */
.strength-meter-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
}

.strength-bars {
  flex: 1 1 auto;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 4px;
}

.bar {
  height: 4px;
  border-radius: 2px;
  background: #262C27;
  transition: background-color 0.2s ease;
}
.bar.is-ok {
  background: #4CD137;
}

.strength-label {
  font-size: 13px;
  color: #C3CBC4;
}

.password-rules-grid {
  margin: 6px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 16px;
  font-size: 14px;
}

.rule-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #8F998F;
  transition: color 0.15s ease;
}
.rule-item.is-checked {
  color: #C3CBC4;
}

.match-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #7FE06C;
}

/* Keycloak Card (Mode B) */
.found-user-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 12px;
  background: rgba(76, 209, 55, 0.08);
  border: 1px solid #243026;
}

.user-avatar-initials {
  flex: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #1B2A1C;
  color: #7FE06C;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.user-info-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.user-id-name {
  font-size: 15px;
  font-weight: 600;
}

.user-id-status {
  font-size: 13px;
  color: #A9B2AA;
}

.keycloak-notice-card {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 16px;
  border-radius: 12px;
  background: rgba(14, 17, 15, 0.8);
  border: 1px solid #1F2521;
}

.notice-desc {
  margin: 0;
  font-size: 15px;
  line-height: 1.55;
  color: #C3CBC4;
}

.section-subheading {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.subheading-title {
  font-size: 15px;
  font-weight: 600;
}
.subheading-desc {
  font-size: 13px;
  color: #8F998F;
}

/* Step 4 (Done) */
.success-icon-badge {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #4CD137;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 10px rgba(76, 209, 55, 0.12), 0 0 48px rgba(76, 209, 55, 0.35);
  animation: okPop 0.6s ease-out both;
}

.next-steps-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.next-step-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 12px;
  background: rgba(14, 17, 15, 0.8);
  border: 1px solid #1F2521;
  font-size: 15px;
}

.step-num {
  flex: none;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #1B2A1C;
  color: #7FE06C;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 13px;
}

/* Footer & Buttons */
.wizard-footer {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.action-btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 28px;
  border-radius: 12px;
  background: #4CD137;
  color: #08130A;
  font-weight: 600;
  font-size: 16px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease;
}
.action-btn-primary:hover:not(:disabled) {
  background: #3DB82A;
}
.action-btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  padding: 0 24px;
  border-radius: 12px;
  border: 1px solid #2F3631;
  background: transparent;
  color: #F2F5F1;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.action-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: #3E4840;
}
</style>
