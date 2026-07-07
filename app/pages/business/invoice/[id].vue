<template>
  <main v-if="invoice" class="service-page">
    <ServiceHeroSec v-if="invoice.service_hero_sec" :section="invoice.service_hero_sec" />
    <HomeStatsSec />
    <ServiceInvoicesSec v-if="invoice.services_invoice_sec" :section="invoice.services_invoice_sec" />
    <ServiceEconomySec />
    <HomeBenefitsSec />
    <BusinessCountriesSec
      v-if="invoices.length"
      :title="invoice.service_county_sec_v2?.title_section"
      :countries="invoices"
    />
    <BusinessOtherSec />
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
import { buildStrapiSlugFilter, mapStrapiInvoices, STRAPI_SEO_POPULATE_PARTS } from '~/utils/strapi'

const urlApi = useRuntimeConfig().public.apiUrl
const route = useRoute()

const slug = computed(() => route.params.id)

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

const { data: invoiceResponse } = await useFetch(
  () => (slug.value ? `${urlApi}/api/invoices?${buildStrapiSlugFilter(slug.value)}&${populate}` : null),
  { watch: [slug] },
)

// список всех инвойсов (стран) для секции BusinessCountriesSec
const { data: invoicesResponse } = await useFetch(
  `${urlApi}/api/invoices?fields[0]=title&fields[1]=slug&populate=flag&pagination[pageSize]=100`,
)

const invoice = computed(() => invoiceResponse.value?.data?.[0])

const invoices = computed(() =>
  mapStrapiInvoices(invoicesResponse.value?.data ?? [], urlApi),
)

if (!slug.value || !invoice.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Инвойс не найден',
  })
}

useStrapiSeo(invoice.value.Seo, { apiUrl: urlApi })
</script>
