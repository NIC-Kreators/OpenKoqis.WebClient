// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'OpenKoqis — Мониторинг и маршрутизация ТБО (Алматы)',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Платформа мониторинга заполненности мусорных контейнеров, прогнозирования и оптимизации маршрутов мусоровозов (Smart Data Models, СанПиН РК, OpenStreetMap Алматы)' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Unbounded:wght@400;500;600;700;800&display=swap'
        }
      ]
    }
  },
  css: [
    'leaflet/dist/leaflet.css',
    '~/assets/css/main.css'
  ]
})
