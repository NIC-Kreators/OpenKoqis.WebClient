<template>
  <div class="otp-container" :class="[themeClass]">
    <div class="otp-grid">
      <input
        v-for="(_, index) in length"
        :key="index"
        :ref="el => (inputRefs[index] = el as HTMLInputElement)"
        v-model="digits[index]"
        type="text"
        inputmode="numeric"
        maxlength="1"
        :aria-label="`Цифра ${index + 1}`"
        class="otp-box"
        :class="{ 'is-filled': !!digits[index] }"
        @input="onInput(index, $event)"
        @keydown="onKeyDown(index, $event)"
        @paste="onPaste($event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    length?: number
    modelValue?: string
    dark?: boolean
  }>(),
  {
    length: 6,
    modelValue: '',
    dark: true
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void
  (e: 'complete', val: string): void
}>()

const digits = ref<string[]>(Array(props.length).fill(''))
const inputRefs = ref<HTMLInputElement[]>([])

const themeClass = computed(() => (props.dark ? 'theme-dark' : 'theme-light'))

// Synchronize external modelValue
watch(
  () => props.modelValue,
  newVal => {
    const chars = (newVal || '').split('')
    for (let i = 0; i < props.length; i++) {
      digits.value[i] = chars[i] || ''
    }
  },
  { immediate: true }
)

const updateModel = () => {
  const code = digits.value.join('')
  emit('update:modelValue', code)
  if (code.length === props.length) {
    emit('complete', code)
  }
}

const onInput = (index: number, event: Event) => {
  const input = event.target as HTMLInputElement
  const val = input.value.replace(/\D/g, '')

  if (val.length > 0) {
    digits.value[index] = val.slice(-1)
    if (index < props.length - 1) {
      inputRefs.value[index + 1]?.focus()
    }
  } else {
    digits.value[index] = ''
  }
  updateModel()
}

const onKeyDown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace') {
    if (!digits.value[index] && index > 0) {
      digits.value[index - 1] = ''
      inputRefs.value[index - 1]?.focus()
      updateModel()
      event.preventDefault()
    }
  } else if (event.key === 'ArrowLeft' && index > 0) {
    inputRefs.value[index - 1]?.focus()
  } else if (event.key === 'ArrowRight' && index < props.length - 1) {
    inputRefs.value[index + 1]?.focus()
  }
}

const onPaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pasted = event.clipboardData?.getData('text') || ''
  const cleanDigits = pasted.replace(/\D/g, '').slice(0, props.length).split('')

  cleanDigits.forEach((char, idx) => {
    digits.value[idx] = char
  })
  updateModel()

  const targetIdx = Math.min(cleanDigits.length, props.length - 1)
  inputRefs.value[targetIdx]?.focus()
}
</script>

<style scoped>
.otp-container {
  width: 100%;
}

.otp-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
}

.otp-box {
  box-sizing: border-box;
  width: 100%;
  height: 60px;
  border-radius: 12px;
  text-align: center;
  font: 600 24px var(--font-sans);
  outline: none;
  transition: all 0.15s ease;
}

/* Dark Theme */
.theme-dark .otp-box {
  background: #0B0D0C;
  border: 1px solid #2F3631;
  color: #F2F5F1;
}
.theme-dark .otp-box:hover {
  border-color: #3E4840;
}
.theme-dark .otp-box:focus {
  border-color: #4CD137;
  box-shadow: 0 0 0 4px rgba(76, 209, 55, 0.25);
}

/* Light Theme */
.theme-light .otp-box {
  background: #FFFFFF;
  border: 1px solid #8A948A;
  color: #0E1410;
}
.theme-light .otp-box:hover {
  border-color: #3E4840;
}
.theme-light .otp-box:focus {
  border-color: #2F8F22;
  box-shadow: 0 0 0 4px rgba(76, 209, 55, 0.25);
}
</style>
