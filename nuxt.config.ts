// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  ssr: true,

  app: {
    head: {
      meta: [
        { name: 'robots', content: 'noindex, nofollow' },
        { name: 'googlebot', content: 'noindex, nofollow' },
      ],
    },
  },

  routeRules: {
    '/**': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
      },
    },
  },
  
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

  runtimeConfig: {
    // The private keys which are only available within server-side
    botToken: process.env.NUXT_BOT_TOKEN,
    groupId: process.env.NUXT_GROUP_ID,
    yandexMapsApiKey: process.env.NUXT_YANDEX_MAPS_API_KEY,
    // Keys within public, will be also exposed to the client-side
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || process.env.PUBLIC_API_URL || 'http://localhost:1337',
    },
  },
})