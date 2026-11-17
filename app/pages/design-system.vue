<template>
  <div class="design-system-page" :class="[isDark ? 'theme-dark' : 'theme-light']">
    <div class="page-top-bar">
      <div class="bar-left">
        <OpenKoqisLogo :dark="isDark" :size="24" />
        <span class="bar-title">UI Kit & Design System</span>
      </div>

      <div class="bar-right">
        <button
          type="button"
          class="theme-toggle-btn"
          @click="isDark = !isDark"
        >
          <span>Тема: {{ isDark ? 'Тёмная (TruckBrain)' : 'Светлая (Мониторинг)' }}</span>
        </button>

        <NuxtLink to="/login" class="back-home-link">
          Ко входу
        </NuxtLink>
      </div>
    </div>

    <div class="design-system-content">
      <!-- Section 1: Inputs -->
      <section class="ds-section">
        <div class="section-header">
          <h1 class="section-title">Input — состояния</h1>
          <p class="section-subtitle">Один компонент, высота 52 px, радиус 12 px. Подпись сверху, подсказка или ошибка снизу.</p>
        </div>

        <div class="inputs-grid">
          <!-- 1. DEFAULT -->
          <div class="state-col">
            <span class="badge-state">DEFAULT</span>
            <span class="state-desc">Пустое поле, ждёт ввода.</span>
            <AppInput
              id="s1"
              v-model="stateVals.defaultVal"
              label="Email"
              placeholder="name@example.com"
              :dark="isDark"
            />
          </div>

          <!-- 2. HOVER -->
          <div class="state-col">
            <span class="badge-state">HOVER</span>
            <span class="state-desc">Курсор над полем: рамка темнее.</span>
            <AppInput
              id="s2"
              v-model="stateVals.hoverVal"
              label="Email"
              placeholder="name@example.com"
              :dark="isDark"
            />
          </div>

          <!-- 3. FOCUS -->
          <div class="state-col">
            <span class="badge-state">FOCUS</span>
            <span class="state-desc">Поле активно: зелёная рамка и подсветка.</span>
            <AppInput
              id="s3"
              v-model="stateVals.focusVal"
              label="Email"
              placeholder="name@example.com"
              :dark="isDark"
            />
          </div>

          <!-- 4. FILLED -->
          <div class="state-col">
            <span class="badge-state">FILLED</span>
            <span class="state-desc">Значение введено, фокуса нет.</span>
            <AppInput
              id="s4"
              v-model="stateVals.filledVal"
              label="Email"
              :dark="isDark"
            />
          </div>

          <!-- 5. ERROR -->
          <div class="state-col">
            <span class="badge-state">ERROR</span>
            <span class="state-desc">Ошибка проверки: красная рамка и текст под полем.</span>
            <AppInput
              id="s5"
              v-model="stateVals.errorVal"
              label="Email"
              error="Введите email полностью"
              :dark="isDark"
            />
          </div>

          <!-- 6. DISABLED -->
          <div class="state-col">
            <span class="badge-state">DISABLED</span>
            <span class="state-desc">Недоступно для ввода: приглушённые цвета.</span>
            <AppInput
              id="s6"
              v-model="stateVals.disabledVal"
              label="Email"
              :disabled="true"
              :dark="isDark"
            />
          </div>

          <!-- 7. PASSWORD -->
          <div class="state-col">
            <span class="badge-state">PASSWORD</span>
            <span class="state-desc">Кнопка «показать/скрыть», зона нажатия 44×44.</span>
            <AppInput
              id="s7"
              v-model="stateVals.passVal"
              type="password"
              label="Пароль"
              :dark="isDark"
            />
          </div>

          <!-- 8. PHONE -->
          <div class="state-col">
            <span class="badge-state">PHONE</span>
            <span class="state-desc">Код страны (по умолчанию +7) и маска номера.</span>
            <AppInput
              id="s8"
              v-model="stateVals.phoneVal"
              type="tel"
              label="Телефон"
              :show-phone-prefix="true"
              :dark="isDark"
            />
          </div>

          <!-- 9. OTP -->
          <div class="state-col">
            <span class="badge-state">OTP</span>
            <span class="state-desc">6 ячеек, фокус переходит сам; вставка кода целиком.</span>
            <span class="otp-custom-label">Код</span>
            <OtpInput
              v-model="stateVals.otpVal"
              :length="6"
              :dark="isDark"
            />
          </div>
        </div>
      </section>

      <div class="ds-divider" />

      <!-- Section 2: Buttons -->
      <section class="ds-section">
        <div class="section-header">
          <h2 class="section-title">Button — варианты</h2>
          <p class="section-subtitle">Высота 52 px, радиус 12 px. Контрастный зелёный фон `#4CD137` для основного действия.</p>
        </div>

        <div class="buttons-grid">
          <div class="btn-box">
            <span class="badge-state">PRIMARY</span>
            <AppButton variant="primary" :dark="isDark">
              Войти
            </AppButton>
          </div>

          <div class="btn-box">
            <span class="badge-state">PRIMARY · HOVER</span>
            <AppButton variant="primary" :dark="isDark" style="background: #3DB82A;">
              Войти
            </AppButton>
          </div>

          <div class="btn-box">
            <span class="badge-state">PRIMARY · LOADING</span>
            <AppButton variant="primary" :loading="true" :dark="isDark">
              Входим…
            </AppButton>
          </div>

          <div class="btn-box">
            <span class="badge-state">PRIMARY · DISABLED</span>
            <AppButton variant="primary" :disabled="true" :dark="isDark">
              Войти
            </AppButton>
          </div>

          <div class="btn-box">
            <span class="badge-state">SECONDARY</span>
            <AppButton variant="secondary" :dark="isDark">
              Назад
            </AppButton>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isDark = ref(false)

const stateVals = ref({
  defaultVal: '',
  hoverVal: '',
  focusVal: 'admin@exa',
  filledVal: 'admin@example.com',
  errorVal: 'admin@',
  disabledVal: 'admin@example.com',
  passVal: 'secret-pass',
  phoneVal: '701 234 56 78',
  otpVal: '48'
})
</script>

<style scoped>
.design-system-page {
  box-sizing: border-box;
  min-height: 100vh;
  padding: 32px 48px;
  font-family: var(--font-sans);
  transition: all 0.25s ease;
}

.theme-light {
  background: #F4F6F2;
  color: #0E1410;
}
.theme-dark {
  background: #050605;
  color: #F2F5F1;
}

.page-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid;
  flex-wrap: wrap;
  gap: 16px;
}
.theme-light .page-top-bar {
  border-color: #DCE2DA;
}
.theme-dark .page-top-bar {
  border-color: #1F2521;
}

.bar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.bar-title {
  font-size: 15px;
  font-weight: 600;
  opacity: 0.8;
}

.bar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.theme-toggle-btn {
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid;
  background: transparent;
  cursor: pointer;
  font: 500 13px var(--font-sans);
  transition: all 0.15s ease;
}
.theme-light .theme-toggle-btn {
  border-color: #8A948A;
  color: #0E1410;
}
.theme-dark .theme-toggle-btn {
  border-color: #2F3631;
  color: #F2F5F1;
}

.back-home-link {
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  background: #4CD137;
  color: #08130A;
}

.design-system-content {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.ds-section {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-title {
  margin: 0;
  font-family: 'Unbounded', system-ui, sans-serif;
  font-weight: 600;
  font-size: 28px;
  letter-spacing: -0.02em;
}

.section-subtitle {
  margin: 0;
  font-size: 15px;
  opacity: 0.75;
}

.inputs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 28px 32px;
}

.state-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.badge-state {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: #2F7A22;
}

.state-desc {
  font-size: 13px;
  opacity: 0.7;
}

.otp-custom-label {
  font-size: 14px;
  font-weight: 500;
  margin-top: 4px;
}

.ds-divider {
  height: 1px;
}
.theme-light .ds-divider {
  background: #DCE2DA;
}
.theme-dark .ds-divider {
  background: #1F2521;
}

.buttons-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  align-items: flex-end;
}

.btn-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
