<template>
  <main v-if="invoice" class="service-page">
    <ServiceHeroSec v-if="invoice.service_hero_sec" :section="invoice.service_hero_sec" />
    <HomeStatsSec v-if="invoice.service_stats_sec" :section="invoice.service_stats_sec" />
    <ServiceInvoicesSec v-if="invoice.services_invoice_sec" :section="invoice.services_invoice_sec" />
    <ServiceEconomySec v-if="invoice.service_economy_sec" :section="invoice.service_economy_sec" />
    <HomeBenefitsSec v-if="invoice.services_benefits_sec" :section="invoice.services_benefits_sec" />
    <BusinessCountriesSec
      v-if="invoices.length"
      :title="invoice.service_county_sec_v2?.title_section"
      :countries="invoices"
    />
    <ServiceOtherSec :current-slug="invoice.slug" />
    <ServiceExamplesSec
      v-if="invoice.services_invoice_example_sec"
      :section="invoice.services_invoice_example_sec"
    />
    <HomeReviewsSec />
    <HomeMediaSec v-if="invoice.service_media_about_us_sec" :section="invoice.service_media_about_us_sec" />
    <HomeFaqSec v-if="invoice.services_faq_sec" :section="invoice.services_faq_sec" />
    <ServiceContactSec />
  </main>
</template>

<script setup>
import { mapStrapiInvoices, STRAPI_SEO_POPULATE_PARTS } from '~/utils/strapi'

const urlApi = useRuntimeConfig().public.apiUrl
const route = useRoute()

const invoiceId = computed(() => route.query.id)

const populate = [
  'populate[service_hero_sec][populate]=image',
  'populate[service_stats_sec][populate]=stats_element',
  'populate[services_invoice_sec][populate][invoice_elements][populate][invoice_image]=true',
  'populate[services_invoice_sec][populate][invoice_elements][populate][invoice_element_list_items]=true',
  'populate[service_economy_sec][populate][economy_list_items][populate]=image',
  'populate[services_benefits_sec][populate]=benefits_items',
  'populate[service_county_sec_v2]=true',
  'populate[services_invoice_example_sec][populate][examples_items][populate][blog][populate]=post_image',
  'populate[service_media_about_us_sec][populate][posts][populate]=logo',
  'populate[services_faq_sec][populate]=questions_list',
  ...STRAPI_SEO_POPULATE_PARTS,
].join('&')

const { data: invoiceResponse } = await useFetch(
  () => (invoiceId.value ? `${urlApi}/api/invoices/${invoiceId.value}?${populate}` : null),
  { watch: [invoiceId] },
)

// список всех инвойсов (стран) для секции BusinessCountriesSec
const { data: invoicesResponse } = await useFetch(
  `${urlApi}/api/invoices?fields[0]=title&fields[1]=slug&populate=flag&pagination[pageSize]=100`,
)

const invoice = computed(() => invoiceResponse.value?.data)

const invoices = computed(() =>
  mapStrapiInvoices(invoicesResponse.value?.data ?? [], urlApi),
)

if (!invoiceId.value || !invoiceResponse.value?.data) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Инвойс не найден',
  })
}

useStrapiSeo(invoiceResponse.value.data.Seo, { apiUrl: urlApi })
</script>
