<template>
  <main class="exchange-page">
    <CryptoExchangeHeroSec v-if="exchange?.exchange_hero_sec" :section="exchange.exchange_hero_sec" />
    <CryptoExchangeCalcSec />
    <HomeStatsSec />
    <ExchangeBenefitsSec />
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
import { getStrapiMediaUrl } from '~/utils/strapi'

const urlApi = useRuntimeConfig().public.apiUrl

const exchangePopulate = [
  'populate[exchange_hero_sec][populate]=image_section',
  'populate[exchange_client_use_sec][populate]=element',
  'populate[exchange_sec_staps][populate][staps_elements]=true',
  'populate[exchange_sec_staps][populate][exchange_media_about_us][populate][posts][populate]=logo',
  'populate[exchange_faq_sec][populate]=questions_list',
  'populate[exhange_seo_sec]=true',
  'populate[Seo_cluster][populate]=shareImage',
].join('&')

const { data: exchangeResponse } = await useFetch(`${urlApi}/api/exchange?${exchangePopulate}`)

const exchange = computed(() => exchangeResponse.value?.data)
const mediaSection = computed(() => exchange.value?.exchange_sec_staps?.exchange_media_about_us)

const pageSeo = exchangeResponse.value?.data?.Seo_cluster?.[0]

useSeoMeta({
  title: pageSeo?.metaTitle || 'Обмен криптовалюты — Bitox',
  description:
    pageSeo?.metaDescription ||
    'Пункты приёма и выдачи наличных в России и по всему миру. Обмен криптовалюты для бизнеса и частных лиц.',
  ogImage: getStrapiMediaUrl(pageSeo?.shareImage, urlApi) || undefined,
})
</script>
