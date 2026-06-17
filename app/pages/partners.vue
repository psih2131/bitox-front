<template>
  <main class="partners-page">
    <PartnerHeroSec v-if="partnership?.partnership_hero_sec" :section="partnership.partnership_hero_sec" />
    <PartnerIncomeCalcSec />
    <PartnerOffersSec v-if="partnership?.partnership_offer_section" :section="partnership.partnership_offer_section" />
    <PartnerHowStartSec
      v-if="partnership?.partnership_how_be_partner_sec"
      :section="partnership.partnership_how_be_partner_sec"
    />
    <HomeFaqSec v-if="partnership?.partnership_faq_sec" :section="partnership.partnership_faq_sec" />
    <ServiceContactSec />
  </main>
</template>

<script setup>
import { getStrapiMediaUrl } from '~/utils/strapi'

const urlApi = useRuntimeConfig().public.apiUrl

const populate = [
  'populate[partnership_hero_sec][populate]=image',
  'populate[partnership_offer_section][populate][partnership_offer_items][populate]=image',
  'populate[partnership_how_be_partner_sec]=true',
  'populate[partnership_faq_sec][populate]=questions_list',
  'populate[seo_cluster][populate]=shareImage',
].join('&')

const { data: partnershipResponse } = await useFetch(`${urlApi}/api/partnership?${populate}`)

const partnership = computed(() => partnershipResponse.value?.data)

const pageSeo = partnershipResponse.value?.data?.seo_cluster

useSeoMeta({
  title: pageSeo?.metaTitle || 'Партнерская программа — Bitox',
  description:
    pageSeo?.metaDescription ||
    'Партнерская программа для агентов до 30%. Приводите клиентов на обмен криптовалюты или международный платеж и получайте комиссию с каждой сделки.',
  ogImage: getStrapiMediaUrl(pageSeo?.shareImage, urlApi) || undefined,
})
</script>
