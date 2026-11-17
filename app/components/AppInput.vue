<template>
  <div class="app-input-group" :class="[themeClass, { 'has-error': !!error, 'is-disabled': disabled }]">
    <div v-if="label || $slots.label" class="input-header">
      <label v-if="label" :for="id" class="input-label">{{ label }}</label>
      <slot name="header-right" />
    </div>

    <div class="input-wrapper" :class="{ 'is-focused': isFocused }">
      <!-- Optional prefix button (e.g., KZ +7) -->
      <div v-if="showPhonePrefix" class="prefix-phone">
        <button
          type="button"
          class="phone-prefix-btn"
          aria-label="Код страны: Казахстан, +7"
        >
          <span>KZ +7</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      <slot name="prefix" />

      <input
        :id="id"
        ref="inputRef"
        :type="actualType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :maxlength="maxlength"
        class="input-field"
        @input="onInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />

      <!-- Password visibility toggle button -->
      <button
        v-if="type === 'password'"
        type="button"
        class="input-action-btn"
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

      <slot name="suffix" />
    </div>

    <!-- Error message or hint -->
    <div v-if="error" class="input-error-msg">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6M12 16.5v.5" />
      </svg>
      <span>{{ error }}</span>
    </div>
    <div v-else-if="hint" class="input-hint-msg">
      {{ hint }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    label?: string
    id?: string
    type?: string
    placeholder?: string
    hint?: string
    error?: string
    disabled?: boolean
    dark?: boolean
    showPhonePrefix?: boolean
    autocomplete?: string
    maxlength?: number
  }>(),
  {
    modelValue: '',
    label: '',
    id: () => `input-${Math.random().toString(36).slice(2, 9)}`,
    type: 'text',
    placeholder: '',
    hint: '',
    error: '',
    disabled: false,
    dark: true,
    showPhonePrefix: false,
    autocomplete: 'off',
    maxlength: undefined
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void
}>()

const isFocused = ref(false)
const isPasswordShown = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

const actualType = computed(() => {
  if (props.type === 'password') {
    return isPasswordShown.value ? 'text' : 'password'
  }
  return props.type
})

const themeClass = computed(() => (props.dark ? 'theme-dark' : 'theme-light'))

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped>
.app-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}

.input-label {
  font-size: 14px;
  font-weight: 500;
  transition: color 0.15s ease;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 12px;
  transition: all 0.15s ease;
  width: 100%;
}

.input-field {
  box-sizing: border-box;
  width: 100%;
  height: 52px;
  padding: 0 16px;
  border-radius: 12px;
  font: 400 16px var(--font-sans);
  outline: none;
  transition: all 0.15s ease;
}

/* Dark Theme */
.theme-dark .input-label {
  color: #C3CBC4;
}
.theme-dark .input-field {
  background: #0B0D0C;
  border: 1px solid #2F3631;
  color: #F2F5F1;
}
.theme-dark .input-field::placeholder {
  color: #6F7A70;
}
.theme-dark .input-field:hover:not(:disabled) {
  border-color: #3E4840;
}
.theme-dark .input-wrapper.is-focused .input-field {
  border-color: #4CD137;
  box-shadow: 0 0 0 4px rgba(76, 209, 55, 0.25);
}

/* Light Theme */
.theme-light .input-label {
  color: #3E4840;
}
.theme-light .input-field {
  background: #FFFFFF;
  border: 1px solid #8A948A;
  color: #0E1410;
}
.theme-light .input-field::placeholder {
  color: #7A857B;
}
.theme-light .input-field:hover:not(:disabled) {
  border-color: #3E4840;
}
.theme-light .input-wrapper.is-focused .input-field {
  border-color: #2F8F22;
  box-shadow: 0 0 0 4px rgba(76, 209, 55, 0.25);
}

/* Errors */
.has-error.theme-dark .input-field {
  border-color: #C4382B;
  background: #140A0A;
}
.has-error.theme-light .input-field {
  border-color: #C4382B;
  background: #FFF7F6;
}
.input-error-msg {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #C4382B;
}

.input-hint-msg {
  font-size: 13px;
  color: #8F998F;
}

/* Disabled */
.is-disabled.theme-dark .input-field {
  background: #121412;
  border-color: #1F2521;
  color: #555D56;
  cursor: not-allowed;
}
.is-disabled.theme-light .input-field {
  background: #EEF1EC;
  border-color: #D5DBD3;
  color: #6A746B;
  cursor: not-allowed;
}

/* Password Toggle Button */
.input-action-btn {
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
.theme-dark .input-action-btn {
  color: #A9B2AA;
}
.theme-dark .input-action-btn:hover {
  color: #F2F5F1;
}
.theme-light .input-action-btn {
  color: #4E5950;
}
.theme-light .input-action-btn:hover {
  color: #0E1410;
}

/* Phone prefix */
.prefix-phone {
  display: flex;
  align-items: center;
  margin-right: 8px;
}
.phone-prefix-btn {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 52px;
  padding: 0 12px;
  border-radius: 12px;
  font: 500 15px var(--font-sans);
  cursor: pointer;
  outline: none;
  transition: all 0.15s ease;
}
.theme-dark .phone-prefix-btn {
  border: 1px solid #2F3631;
  background: #0E110F;
  color: #F2F5F1;
}
.theme-light .phone-prefix-btn {
  border: 1px solid #8A948A;
  background: #FFFFFF;
  color: #0E1410;
}
</style>
