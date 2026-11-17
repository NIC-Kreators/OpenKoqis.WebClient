<template>
  <component
    :is="to ? 'NuxtLink' : 'button'"
    :to="to"
    :type="to ? undefined : type"
    :disabled="disabled || loading"
    class="app-btn"
    :class="[
      `variant-${variant}`,
      `size-${size}`,
      themeClass,
      { 'is-loading': loading, 'is-disabled': disabled || loading, 'is-block': block }
    ]"
    v-bind="$attrs"
  >
    <svg
      v-if="loading"
      class="btn-spinner"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.4"
      stroke-linecap="round"
      aria-hidden="true"
    >
      <path d="M12 3a9 9 0 1 1-9 9" />
    </svg>
    <span v-if="$slots.icon && !loading" class="btn-icon-start">
      <slot name="icon" />
    </span>
    <span class="btn-text">
      <slot />
    </span>
    <span v-if="$slots['icon-end'] && !loading" class="btn-icon-end">
      <slot name="icon-end" />
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'md' | 'sm' | 'lg'
    type?: 'button' | 'submit' | 'reset'
    loading?: boolean
    disabled?: boolean
    block?: boolean
    to?: string
    dark?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    loading: false,
    disabled: false,
    block: false,
    to: undefined,
    dark: true
  }
)

const themeClass = computed(() => (props.dark ? 'theme-dark' : 'theme-light'))
</script>

<style scoped>
.app-btn {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 12px;
  font-family: var(--font-sans);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
  outline: none;
  white-space: nowrap;
}

/* Sizes */
.size-sm {
  min-height: 40px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 10px;
}

.size-md {
  min-height: 52px;
  padding: 0 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
}

.size-lg {
  min-height: 56px;
  padding: 0 32px;
  font-size: 17px;
  font-weight: 600;
  border-radius: 14px;
}

.is-block {
  width: 100%;
}

/* Variant Primary */
.variant-primary {
  border: none;
  background: #4CD137;
  color: #08130A;
}
.variant-primary:hover:not(.is-disabled) {
  background: #3DB82A;
}
.variant-primary:active:not(.is-disabled) {
  background: #35A324;
}

/* Variant Secondary */
.variant-secondary.theme-dark {
  border: 1px solid #2F3631;
  background: transparent;
  color: #F2F5F1;
}
.variant-secondary.theme-dark:hover:not(.is-disabled) {
  background: rgba(255, 255, 255, 0.05);
  border-color: #3E4840;
}

.variant-secondary.theme-light {
  border: 1px solid #8A948A;
  background: #FFFFFF;
  color: #0E1410;
}
.variant-secondary.theme-light:hover:not(.is-disabled) {
  border-color: #3E4840;
  background: #F4F6F2;
}

/* Variant Ghost */
.variant-ghost {
  border: none;
  background: transparent;
}
.variant-ghost.theme-dark {
  color: #C3CBC4;
}
.variant-ghost.theme-dark:hover:not(.is-disabled) {
  color: #F2F5F1;
  background: rgba(255, 255, 255, 0.05);
}
.variant-ghost.theme-light {
  color: #4E5950;
}
.variant-ghost.theme-light:hover:not(.is-disabled) {
  color: #0E1410;
  background: rgba(0, 0, 0, 0.04);
}

/* Variant Danger */
.variant-danger {
  border: none;
  background: #C93A2B;
  color: #FFFFFF;
}
.variant-danger:hover:not(.is-disabled) {
  background: #B3301F;
}

/* Disabled State */
.is-disabled {
  cursor: not-allowed;
}
.variant-primary.is-disabled.theme-dark {
  background: #262C27;
  color: #6A746B;
}
.variant-primary.is-disabled.theme-light {
  background: #DCE2DA;
  color: #6A746B;
}
.variant-secondary.is-disabled {
  opacity: 0.5;
}

/* Spinner */
.btn-spinner {
  animation: okSpin 0.8s linear infinite;
}

.btn-icon-start,
.btn-icon-end {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
