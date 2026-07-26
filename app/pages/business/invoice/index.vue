<template>
  <main v-if="invoiceSingle" class="service-page">
    <ServiceHeroSec v-if="invoiceSingle.service_hero_sec" :section="invoiceSingle.service_hero_sec" />
    <CryptoExchangeCalcSec />
    <HomeStatsSec />
    <ServiceInvoicesSec v-if="invoiceSingle.services_invoice_sec" :section="invoiceSingle.services_invoice_sec" />
    <ServiceEconomySec />
    <HomeChoiceSec />
    <HomeBenefitsSec />
    <BusinessCountriesSec
      v-if="invoices.length"
      :title="invoiceSingle.service_county_sec_v2?.title_section"
      :countries="invoices"
    />
    <BusinessOtherSec />
    <ServiceExamplesSec
      v-if="invoiceSingle.services_invoice_example_sec"
      :section="invoiceSingle.services_invoice_example_sec"
    />
    <HomeReviewsSec />
    <HomeMediaSec v-if="invoiceSingle.service_media_about_us_sec" :section="invoiceSingle.service_media_about_us_sec" />
    <HomeFaqSec v-if="invoiceSingle.services_faq_sec" :section="invoiceSingle.services_faq_sec" />
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

const [{ data: invoiceSingleResponse }, { data: invoicesResponse }] = await Promise.all([
  useFetch(`${urlApi}/api/invoice-singl?${populate}`),
  useFetch(
    `${urlApi}/api/invoices?fields[0]=title&fields[1]=slug&populate=flag&pagination[pageSize]=100`,
  ),
])

const invoiceSingle = computed(() => invoiceSingleResponse.value?.data)

const invoices = computed(() =>
  mapStrapiInvoices(invoicesResponse.value?.data ?? [], urlApi),
)

if (!invoiceSingleResponse.value?.data) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Страница не найдена',
  })
}

useStrapiSeo(invoiceSingleResponse.value.data.Seo, { apiUrl: urlApi })
</script>
