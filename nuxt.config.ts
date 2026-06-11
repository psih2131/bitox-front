// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  ssr: false,
  
  css: ['~/assets/scss/main.scss', 'vue-yandex-maps/css'],
  modules: ['@pinia/nuxt', 'nuxt-swiper', 'vue-yandex-maps/nuxt'],

  yandexMaps: {
    apikey: 'af5a38a2-5bf8-44de-bfbe-b30e278e9df4',
  },

  build: {
    transpile: ['vue-yandex-maps'],
  },

  components: [
    {
      path: '~/components/buttons',
      pathPrefix: false,
    },
    {
      path: '~/components/sections',
      pathPrefix: false,
    },
    {
      path: '~/components/faq',
      pathPrefix: false,
    },
    {
      path: '~/components/modals',
      pathPrefix: false,
    },
    {
      path: '~/components',
      pathPrefix: false,
      ignore: ['buttons/**', 'sections/**', 'faq/**', 'modals/**'],
    },
  ],
})