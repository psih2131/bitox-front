<template>
  <main v-if="service" class="service-page">
    <ServiceHeroSec v-if="service.service_hero_sec" :section="service.service_hero_sec" />
    <HomeStatsSec v-if="service.service_stats_sec" :section="service.service_stats_sec" />
    <ServiceInvoicesSec v-if="service.services_invoice_sec" :section="service.services_invoice_sec" />
    <ServiceEconomySec v-if="service.service_economy_sec" :section="service.service_economy_sec" />
    <HomeBenefitsSec v-if="service.services_benefits_sec" :section="service.services_benefits_sec" />
    <HomeCountriesSec v-if="service.services_countries_list" :section="service.services_countries_list" />
    <ServiceOtherSec :current-slug="service.slug" />
    <ServiceExamplesSec
      v-if="service.services_invoice_example_sec"
      :section="service.services_invoice_example_sec"
    />
    <HomeReviewsSec />
    <HomeMediaSec v-if="service.service_media_about_us_sec" :section="service.service_media_about_us_sec" />
    <HomeFaqSec v-if="service.services_faq_sec" :section="service.services_faq_sec" />
    <ServiceContactSec />
  </main>
</template>

<script setup>
import { getStrapiMediaUrl } from '~/utils/strapi'

const urlApi = useRuntimeConfig().public.apiUrl
const route = useRoute()

const serviceId = computed(() => route.query.id)

const populate = [
  'populate[service_hero_sec][populate]=image',
  'populate[service_stats_sec][populate]=stats_element',
  'populate[services_invoice_sec][populate][invoice_elements][populate][invoice_image]=true',
  'populate[services_invoice_sec][populate][invoice_elements][populate][invoice_element_list_items]=true',
  'populate[service_economy_sec][populate][economy_list_items][populate]=image',
  'populate[services_benefits_sec][populate]=benefits_items',
  'populate[services_countries_list][populate][countries_list][populate]=image',
  'populate[services_invoice_example_sec][populate][examples_items][populate]=image',
  'populate[service_media_about_us_sec][populate][posts][populate]=logo',
  'populate[services_faq_sec][populate]=questions_list',
  'populate[Seo][populate]=shareImage',
].join('&')

const { data: serviceResponse } = await useFetch(
  () => (serviceId.value ? `${urlApi}/api/services/${serviceId.value}?${populate}` : null),
  { watch: [serviceId] },
)

const service = computed(() => serviceResponse.value?.data)

if (!serviceId.value || !serviceResponse.value?.data) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Услуга не найдена',
  })
}

const pageSeo = serviceResponse.value.data.Seo

useSeoMeta({
  title: pageSeo.metaTitle || 'Bitox',
  description: pageSeo.metaDescription || 'Bitox',
  ogImage: getStrapiMediaUrl(pageSeo.shareImage, urlApi) || undefined,
})
</script>
