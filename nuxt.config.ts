// https://nuxt.com/docs/api/configuration/nuxt-config
import dotenv from 'dotenv'

dotenv.config()

const yandexMapsApiKey = (process.env.NUXT_YANDEX_MAPS_API_KEY || '').trim()

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  ssr: true,

  app: {
    head: {
      meta: [
        { name: 'robots', content: 'noindex, nofollow' },
        { name: 'googlebot', content: 'noindex, nofollow' },
        { name: 'description', content: 'Bitox - это биржа криптовалют, которая позволяет пользователям покупать и продавать криптовалюты с использованием банковских карт. Bitox - это биржа криптовалют, которая позволяет пользователям покупать и продавать криптовалюты с использованием банковских карт.' },
      ],
      htmlAttrs: {
        lang: 'ru',
      },
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      ],
      script: [
        {
          key: 'chatapp-widget',
          type: 'text/javascript',
          tagPosition: 'bodyClose',
          innerHTML: `(function(w,d,u,j){ var s=d.createElement('script');s.defer=true; s.onload = function () { var s=d.createElement('script'); s.defer=true;s.src=j+'?'+(Date.now()/60000|0); var h=d.getElementsByTagName('script')[0]; h.parentNode.insertBefore(s,h);};s.src=u+'?'+(Date.now()/60000|0); var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h); })(window,document, "https://cdn-us-east-1.chatapp.online/cabinet.chatapp.online/widgetsFiles/83456/2026/07/03/51b84000-95fe-4ce5-b901-c756b326f944.js", "https://cdn-us-east-1.chatapp.online/cabinet.chatapp.online/external/widget/v3/index.js")`,
        },
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
    apikey: yandexMapsApiKey,
    initializeOn: 'onPluginInit',
    lang: 'ru_RU',
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
    botToken: process.env.NUXT_BOT_TOKEN,
    groupId: process.env.NUXT_GROUP_ID,
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || process.env.PUBLIC_API_URL || 'http://localhost:1337',
    },
  },
})