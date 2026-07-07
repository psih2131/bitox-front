<template>
  <main v-if="business" class="service-page">
    <ServiceHeroSec v-if="business.service_hero_sec" :section="business.service_hero_sec" />
    <HomeStatsSec />
    <ServiceInvoicesSec v-if="business.services_invoice_sec" :section="business.services_invoice_sec" />
    <ServiceEconomySec />
    <HomeBenefitsSec />
    <BusinessCountriesSec
      v-if="invoices.length"
      :title="business.service_county_sec_v2?.title_section"
      :countries="invoices"
    />
    <BusinessOtherSec />
    <ServiceExamplesSec
      v-if="business.services_invoice_example_sec"
      :section="business.services_invoice_example_sec"
    />
    <HomeReviewsSec />
    <HomeMediaSec v-if="business.service_media_about_us_sec" :section="business.service_media_about_us_sec" />
    <HomeFaqSec v-if="business.services_faq_sec" :section="business.services_faq_sec" />
    <ServiceContactSec />
  </main>
</template>

<script setup>
import { mapStrapiInvoices, STRAPI_SEO_POPULATE_PARTS } from '~/utils/strapi'

const urlApi = useRuntimeConfig().public.apiUrl

const populate = [
  'populate[service_hero_sec][populate]=image',
  'populate[services_invoice_sec][populate][invoice_elements][populate][invoice_image]=true',
  'populate[services_invoice_sec][populate][invoice_elements][populate][invoice_element_list_items]=true',
  'populate[service_county_sec_v2]=true',
  'populate[services_invoice_example_sec][populate][examples_items][populate][blog][populate]=post_image',
  'populate[service_media_about_us_sec][populate][posts][populate]=logo',
  'populate[services_faq_sec][populate]=questions_list',
  ...STRAPI_SEO_POPULATE_PARTS,
].join('&')

const [{ data: businessResponse }, { data: invoicesResponse }] = await Promise.all([
  useFetch(`${urlApi}/api/business?${populate}`),
  useFetch(
    `${urlApi}/api/invoices?fields[0]=title&fields[1]=slug&populate=flag&pagination[pageSize]=100`,
  ),
])

const business = computed(() => businessResponse.value?.data)

const invoices = computed(() =>
  mapStrapiInvoices(invoicesResponse.value?.data ?? [], urlApi),
)

if (!businessResponse.value?.data) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Страница не найдена',
  })
}

useStrapiSeo(businessResponse.value.data.Seo, { apiUrl: urlApi })
</script>
