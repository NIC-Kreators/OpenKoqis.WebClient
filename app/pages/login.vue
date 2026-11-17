<template>
  <div class="login-page-container" :class="[isTruckBrain ? 'theme-truckbrain' : 'theme-monitoring']">
    <!-- Background: Truck silhouette for TruckBrain Dark mode -->
    <div v-if="isTruckBrain" class="truck-backdrop">
      <TruckSilhouette :dim="0.35" placement="center" />
    </div>

    <!-- Top floating bar with mode switcher & mockup navigation -->
    <div class="top-nav-bar">
      <div class="mode-switcher">
        <button
          type="button"
          class="mode-btn"
          :class="{ 'is-active': isTruckBrain }"
          @click="isTruckBrain = true"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          <span>TruckBrain (Тёмная)</span>
        </button>

        <button
          type="button"
          class="mode-btn"
          :class="{ 'is-active': !isTruckBrain }"
          @click="isTruckBrain = false"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          <span>Мониторинг (Светлая)</span>
        </button>
      </div>

      <div class="mockup-shortcuts">
        <NuxtLink to="/loading" class="shortcut-link">
          <span>Сплэш-экран</span>
        </NuxtLink>
        <NuxtLink to="/setup/root-admin" class="shortcut-link">
          <span>Root Admin Setup</span>
        </NuxtLink>
        <NuxtLink to="/design-system" class="shortcut-link">
          <span>UI Kit</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Main Login Content -->
    <main class="login-main">
      <form class="login-card" @submit.prevent="handleLogin">
        <div class="logo-wrapper">
          <OpenKoqisLogo :dark="isTruckBrain" :size="26" />
        </div>

        <h1 class="login-title">Вход</h1>

        <!-- Username / Email / Phone -->
        <div class="form-group">
          <label for="li-id" class="form-label">Email, телефон или логин</label>
          <input
            id="li-id"
            v-model="loginId"
            type="text"
            placeholder="name@example.com"
            autocomplete="username"
            class="form-input"
            required
          />
        </div>

        <!-- Password -->
        <div class="form-group">
          <div class="label-row">
            <label for="li-pass" class="form-label">Пароль</label>
            <NuxtLink to="/verify-sms" class="forgot-link">Забыли пароль?</NuxtLink>
          </div>
          <div class="input-with-button">
            <input
              id="li-pass"
              v-model="password"
              :type="isPasswordShown ? 'text' : 'password'"
              autocomplete="current-password"
              class="form-input has-toggle"
              required
            />
            <button
              type="button"
              class="password-toggle-btn"
              :aria-label="isPasswordShown ? 'Скрыть пароль' : 'Показать пароль'"
              @click="isPasswordShown = !isPasswordShown"
            >
              <svg v-if="isPasswordShown" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="submit-btn" :disabled="isLoading">
          <svg v-if="isLoading" class="btn-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
            <path d="M12 3a9 9 0 1 1-9 9" />
          </svg>
          <span>{{ isLoading ? 'Входим…' : 'Войти' }}</span>
        </button>

        <!-- Role Quick Switcher for Defense Demo -->
        <div class="roles-section">
          <div class="roles-caption">Быстрый выбор роли (Keycloak RBAC):</div>
          <div class="roles-grid">
            <button
              v-for="roleItem in demoRoles"
              :key="roleItem.role"
              type="button"
              class="role-badge-btn"
              :class="{ 'is-selected': selectedRole === roleItem.role }"
              @click="selectDemoRole(roleItem.role, roleItem.username)"
            >
              <span class="role-title">{{ roleItem.title }}</span>
              <span class="role-desc">{{ roleItem.user }}</span>
            </button>
          </div>
        </div>

        <div class="bottom-footnote">
          <span>Первый запуск системы?</span>
          <NuxtLink to="/setup/root-admin" class="setup-link">Настроить Root Admin</NuxtLink>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth, type UserRole } from '~/composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const isTruckBrain = ref(true)
const isPasswordShown = ref(false)
const isLoading = ref(false)
const loginId = ref('admin.city@astana.gov.kz')
const password = ref('Musor-Route-2026')
const selectedRole = ref<UserRole>('dispatcher')

const demoRoles: Array<{ role: UserRole; title: string; user: string; username: string }> = [
  { role: 'dispatcher', title: 'Диспетчер', user: 'ЦУП Астана', username: 'admin.city@astana.gov.kz' },
  { role: 'driver', title: 'Водитель', user: 'Мусоровоз №01', username: 'driver.kamaz01' },
  { role: 'analyst', title: 'ML Аналитик', user: 'OR-Tools / Ridge', username: 'analyst.ml@openkoqis.kz' },
  { role: 'admin', title: 'Root Admin', user: 'Полный доступ', username: 'root' }
]

const selectDemoRole = (role: UserRole, username: string) => {
  selectedRole.value = role
  loginId.value = username
}

const handleLogin = async () => {
  isLoading.value = true
  login(selectedRole.value)
  // Задержка ровно 0.5 сек перед переходом на экран загрузки
  setTimeout(() => {
    isLoading.value = false
    router.push({ path: '/loading', query: { next: '/dashboard', mode: isTruckBrain.value ? 'truckbrain' : 'monitoring' } })
  }, 500)
}
</script>

<style scoped>
.login-page-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: var(--font-sans);
  transition: background-color 0.25s ease, color 0.25s ease;
}

/* Theme TruckBrain (Dark) */
.theme-truckbrain {
  background: #050605;
  color: #F2F5F1;
}

/* Theme Monitoring (Light) */
.theme-monitoring {
  background: #F4F6F2;
  color: #0E1410;
}

.truck-backdrop {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* Top Floating Bar */
.top-nav-bar {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 24px;
  flex-wrap: wrap;
}

.mode-switcher {
  display: inline-flex;
  padding: 4px;
  border-radius: 12px;
  gap: 4px;
}
.theme-truckbrain .mode-switcher {
  background: rgba(14, 17, 15, 0.9);
  border: 1px solid #1F2521;
}
.theme-monitoring .mode-switcher {
  background: #FFFFFF;
  border: 1px solid #E0E5DE;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.mode-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 8px;
  border: none;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  transition: all 0.15s ease;
}
.theme-truckbrain .mode-btn {
  color: #A9B2AA;
}
.theme-truckbrain .mode-btn.is-active {
  background: #1B2A1C;
  color: #4CD137;
}
.theme-monitoring .mode-btn {
  color: #4E5950;
}
.theme-monitoring .mode-btn.is-active {
  background: #EEF1EC;
  color: #2F7A22;
  font-weight: 600;
}

.mockup-shortcuts {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.shortcut-link {
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.15s ease;
}
.theme-truckbrain .shortcut-link {
  color: #A9B2AA;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #1F2521;
}
.theme-truckbrain .shortcut-link:hover {
  color: #7FE06C;
  border-color: #4CD137;
}
.theme-monitoring .shortcut-link {
  color: #4E5950;
  background: #FFFFFF;
  border: 1px solid #E0E5DE;
}
.theme-monitoring .shortcut-link:hover {
  color: #2F7A22;
  border-color: #8A948A;
}

/* Main Area */
.login-main {
  position: relative;
  z-index: 5;
  box-sizing: border-box;
  flex: 1;
  padding: 32px 24px 64px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Login Card */
.login-card {
  box-sizing: border-box;
  width: 100%;
  max-width: 440px;
  padding: 40px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: all 0.25s ease;
}

.theme-truckbrain .login-card {
  background: rgba(14, 17, 15, 0.88);
  border: 1px solid #1F2521;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
}

.theme-monitoring .login-card {
  background: #FFFFFF;
  border: 1px solid #E0E5DE;
  box-shadow: 0 1px 2px rgba(14, 20, 16, 0.04), 0 12px 32px rgba(14, 20, 16, 0.06);
}

.logo-wrapper {
  display: flex;
  justify-content: center;
}

.login-title {
  margin: 0;
  text-align: center;
  font-family: 'Unbounded', system-ui, sans-serif;
  font-weight: 600;
  font-size: 26px;
  letter-spacing: -0.02em;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
}
.theme-truckbrain .form-label {
  color: #C3CBC4;
}
.theme-monitoring .form-label {
  color: #3E4840;
}

.forgot-link {
  font-size: 14px;
  text-decoration: none;
}
.theme-truckbrain .forgot-link {
  color: #7FE06C;
}
.theme-truckbrain .forgot-link:hover {
  color: #A6EE97;
}
.theme-monitoring .forgot-link {
  color: #2F7A22;
}
.theme-monitoring .forgot-link:hover {
  color: #1F5A16;
}

.input-with-button {
  position: relative;
  width: 100%;
}

.form-input {
  box-sizing: border-box;
  width: 100%;
  height: 52px;
  padding: 0 16px;
  border-radius: 12px;
  font: 400 16px var(--font-sans);
  outline: none;
  transition: all 0.15s ease;
}
.form-input.has-toggle {
  padding-right: 56px;
}

.theme-truckbrain .form-input {
  background: #0B0D0C;
  border: 1px solid #2F3631;
  color: #F2F5F1;
}
.theme-truckbrain .form-input::placeholder {
  color: #6F7A70;
}
.theme-truckbrain .form-input:hover {
  border-color: #3E4840;
}
.theme-truckbrain .form-input:focus {
  border-color: #4CD137;
  box-shadow: 0 0 0 4px rgba(76, 209, 55, 0.25);
}

.theme-monitoring .form-input {
  background: #FFFFFF;
  border: 1px solid #8A948A;
  color: #0E1410;
}
.theme-monitoring .form-input::placeholder {
  color: #7A857B;
}
.theme-monitoring .form-input:hover {
  border-color: #3E4840;
}
.theme-monitoring .form-input:focus {
  border-color: #2F8F22;
  box-shadow: 0 0 0 4px rgba(76, 209, 55, 0.25);
}

.password-toggle-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 10px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color 0.15s ease;
}
.theme-truckbrain .password-toggle-btn {
  color: #A9B2AA;
}
.theme-truckbrain .password-toggle-btn:hover {
  color: #F2F5F1;
}
.theme-monitoring .password-toggle-btn {
  color: #4E5950;
}
.theme-monitoring .password-toggle-btn:hover {
  color: #0E1410;
}

/* Submit Button */
.submit-btn {
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
  margin-top: 4px;
  transition: background-color 0.15s ease;
}
.submit-btn:hover:not(:disabled) {
  background: #3DB82A;
}
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-spinner {
  animation: okSpin 0.8s linear infinite;
}

/* Role Selector for Defense Demo */
.roles-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px dashed;
}
.theme-truckbrain .roles-section {
  border-color: #1F2521;
}
.theme-monitoring .roles-section {
  border-color: #E0E5DE;
}

.roles-caption {
  font-size: 12px;
  font-weight: 500;
  opacity: 0.7;
}

.roles-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.role-badge-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  border: 1px solid;
  background: transparent;
  transition: all 0.15s ease;
}
.theme-truckbrain .role-badge-btn {
  border-color: #2F3631;
  color: #C3CBC4;
}
.theme-truckbrain .role-badge-btn:hover {
  border-color: #4CD137;
}
.theme-truckbrain .role-badge-btn.is-selected {
  background: rgba(76, 209, 55, 0.12);
  border-color: #4CD137;
  color: #7FE06C;
}

.theme-monitoring .role-badge-btn {
  border-color: #DCE2DA;
  color: #4E5950;
}
.theme-monitoring .role-badge-btn:hover {
  border-color: #2F8F22;
}
.theme-monitoring .role-badge-btn.is-selected {
  background: #EEF1EC;
  border-color: #2F8F22;
  color: #2F7A22;
}

.role-title {
  font-size: 13px;
  font-weight: 600;
}
.role-desc {
  font-size: 11px;
  opacity: 0.8;
}

.bottom-footnote {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  opacity: 0.85;
}
.setup-link {
  font-weight: 500;
}
</style>
