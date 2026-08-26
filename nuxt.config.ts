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
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' },
        { name: 'google-site-verification', content: '3TtbXpC5IYhG4cn4bzR2ZmTXWVhBR_QTUYWA6vo70co' },
        { name: 'yandex-verification', content: 'c5a2c5999ba8a5e0' },
        { name: 'description', content: 'Bitox - это биржа криптовалют, которая позволяет пользователям покупать и продавать криптовалюты с использованием банковских карт. Bitox - это биржа криптовалют, которая позволяет пользователям покупать и продавать криптовалюты с использованием банковских карт.' },
      ],
      htmlAttrs: {
        lang: 'ru',
      },
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      ],
      noscript: [
        {
          key: 'yandex-metrika',
          innerHTML: '<div><img src="https://mc.yandex.ru/watch/110824008" style="position:absolute; left:-9999px;" alt="" /></div>',
        },
      ],
      script: [
        {
          key: 'yandex-metrika',
          type: 'text/javascript',
          tagPosition: 'head',
          innerHTML: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=110824008','ym');ym(110824008,'init',{ssr:true,webvisor:true,clickmap:true,ecommerce:"dataLayer",referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});`,
        },
        {
          key: 'chatapp-widget',
          type: 'text/javascript',
          tagPosition: 'bodyClose',
          innerHTML: `(function(w,d,u,j){ var s=d.createElement('script');s.defer=true; s.onload = function () { var s=d.createElement('script'); s.defer=true;s.src=j+'?'+(Date.now()/60000|0); var h=d.getElementsByTagName('script')[0]; h.parentNode.insertBefore(s,h);};s.src=u+'?'+(Date.now()/60000|0); var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h); })(window,document, "https://cdn-us-east-1.chatapp.online/cabinet.chatapp.online/widgetsFiles/83456/2026/07/03/51b84000-95fe-4ce5-b901-c756b326f944.js", "https://cdn-us-east-1.chatapp.online/cabinet.chatapp.online/external/widget/v3/index.js")`,
        },
      ],
    },
  },

  css: ['~/assets/scss/main.scss', 'vue-yandex-maps/css'],
  modules: ['@pinia/nuxt', 'nuxt-swiper', 'vue-yandex-maps/nuxt', '@nuxtjs/sitemap'],

  yandexMaps: {
    apikey: 'af5a38a2-5bf8-44de-bfbe-b30e278e9df4',
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

  

  site: {
    url: 'https://bitox.global',
  },


  sitemap: {

    sitemaps: {
      pages: {
        sources: [
          '/api/__sitemap__/urls',
        ]
      },

      posts: {
        sources: [
          '/api/__sitemap__/blog-posts',
        ]
      },

      crypto_exchange: {
        sources: [
          '/api/__sitemap__/crypto-exchange',
        ]
      },

      business_pages: {
        sources: [
          '/api/__sitemap__/business-pages',
        ]
      },

      business_invoices: {
        sources: [
          '/api/__sitemap__/business-invoices',
        ]
      },

      docs: {
        sources: [
          '/api/__sitemap__/docs',
        ]
      },

      individuals: {
        sources: [
          '/api/__sitemap__/individuals',
        ]
      },

      services: {
        sources: [
          '/api/__sitemap__/services',
        ]
      },

      transfers: {
        sources: [
          '/api/__sitemap__/transfers',
        ]
      },



    }

  },


  runtimeConfig: {
    botToken: process.env.NUXT_BOT_TOKEN,
    groupId: process.env.NUXT_GROUP_ID,
    bitrixWebhookUrl: process.env.NUXT_BITRIX_WEBHOOK_URL || 'https://bitox.bitrix24.ru/rest/2120/0ocvb8ovrjgwim7z/',
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || process.env.PUBLIC_API_URL || 'http://localhost:1337',
    },
  },
})