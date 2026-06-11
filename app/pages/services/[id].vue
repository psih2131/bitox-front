<template>

  <main class="service-page">

    <ServiceHeroSec :service="service" />

    <HomeStatsSec />



    <ServiceInvoicesSec />

    <ServiceEconomySec />



    <HomeBenefitsSec />

    <HomeCountriesSec />



    <ServiceOtherSec :current-slug="service.slug" />

    <ServiceExamplesSec />



    <HomeReviewsSec />

    <HomeMediaSec />

    <HomeFaqSec />

    <ServiceContactSec />

  </main>

</template>



<script setup>

import { getServiceBySlug } from '~/data/services'



const route = useRoute()

const service = getServiceBySlug(route.params.id)



if (!service) {

  throw createError({

    statusCode: 404,

    statusMessage: 'Услуга не найдена',

  })

}



useSeoMeta({

  title: `${service.title} — Bitox`,

  description: service.description,

})

</script>

