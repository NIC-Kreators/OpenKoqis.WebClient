<template>
  <div class="index-redirect">
    <div class="redirect-card">
      <OpenKoqisLogo :dark="true" :size="32" />
      <div class="redirect-text">
        <span>Перенаправление на страницу входа…</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  router.replace('/login')
})
</script>

<style scoped>
.index-redirect {
  min-height: 100vh;
  background: #050605;
  color: #F2F5F1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-sans);
}

.redirect-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.redirect-text {
  font-size: 15px;
  color: #A9B2AA;
}
</style>
