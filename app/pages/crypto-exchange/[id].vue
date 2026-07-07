<template>
  <main class="exchange-page">
    <CryptoExchangeHeroSec v-if="exchange?.exchange_hero_sec" :section="exchange.exchange_hero_sec" />
    <CryptoExchangeCalcSec />
    <HomeStatsSec />
    <ExchangeBenefitsSec v-if="exchange?.benefits_sec" :section="exchange.benefits_sec" />
    <ExchangeClientsSec v-if="exchange?.exchange_client_use_sec" :section="exchange.exchange_client_use_sec" />
    <ExchangeProcessSec v-if="exchange?.exchange_sec_staps" :section="exchange.exchange_sec_staps" />
    <HomeReviewsSec />
    <HomeMediaSec v-if="mediaSection" :section="mediaSection" />
    <HomeFaqSec v-if="exchange?.exchange_faq_sec" :section="exchange.exchange_faq_sec" bg-color="#F6F7F8" />
    <ExchangeSeoSec v-if="exchange?.exhange_seo_sec?.length" :sections="exchange.exhange_seo_sec" />
    <ServiceContactSec />
  </main>
</template>

<script setup>
import { buildStrapiSlugFilter, getStrapiMediaUrl } from '~/utils/strapi'

const urlApi = useRuntimeConfig().public.apiUrl
const route = useRoute()

const slug = computed(() => route.params.id)

const exchangePopulate = [
  'populate[exchange_hero_sec][populate]=image_section',
  'populate[benefits_sec][populate]=block_5_list',
  'populate[exchange_client_use_sec][populate]=element',
  'populate[exchange_sec_staps][populate][staps_elements]=true',
  'populate[exchange_sec_staps][populate][exchange_media_about_us][populate][posts][populate]=logo',
  'populate[exchange_faq_sec][populate]=questions_list',
  'populate[exhange_seo_sec]=true',
  'populate[Seo_cluster][populate]=shareImage',
].join('&')

const { data: exchangeResponse } = await useFetch(
  () => (slug.value ? `${urlApi}/api/exchange-pages?${buildStrapiSlugFilter(slug.value)}&${exchangePopulate}` : null),
  { watch: [slug] },
)

const exchange = computed(() => exchangeResponse.value?.data?.[0])
const mediaSection = computed(() => exchange.value?.exchange_sec_staps?.exchange_media_about_us)

if (!slug.value || !exchange.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Страница не найдена',
  })
}

const pageSeo = exchange.value?.Seo_cluster?.[0]

useSeoMeta({
  title: pageSeo?.metaTitle || 'Обмен криптовалюты — Bitox',
  description:
    pageSeo?.metaDescription ||
    'Пункты приёма и выдачи наличных в России и по всему миру. Обмен криптовалюты для бизнеса и частных лиц.',
  ogImage: getStrapiMediaUrl(pageSeo?.shareImage, urlApi) || undefined,
})
</script>
