<template>
  <section class="transfer-features-sec">
    <div class="container">
      <h2 class="transfer-features-sec__title">
        Быстрые международные переводы в {{ countryName }}
      </h2>

      <div class="transfer-features-sec__grid">
        <article class="transfer-features-sec__card">
          <div class="transfer-features-sec__visual">
            <div class="transfer-features-sec__pills">
              <span class="transfer-features-sec__pill">
                <span class="transfer-features-sec__pill-arrow">↑</span> WISE
              </span>
              <span class="transfer-features-sec__pill">
                <span class="transfer-features-sec__pill-arrow">↓</span> Revolut
              </span>
              <span class="transfer-features-sec__pill">
                <span class="transfer-features-sec__pill-arrow">↑</span> BBVA
              </span>
              <span class="transfer-features-sec__pill">
                <span class="transfer-features-sec__pill-arrow">↓</span> N26
              </span>
              <span class="transfer-features-sec__pill">+99</span>
            </div>
          </div>

          <p class="transfer-features-sec__text">
            Безопасно и законно отправляйте деньги в {{ countryName }} : USD, EUR, GBP, RUB
          </p>
        </article>

        <article class="transfer-features-sec__card">
          <div class="transfer-features-sec__visual transfer-features-sec__visual--image">
            <img
              :src="walletImage"
              alt=""
              class="transfer-features-sec__image"
            >
          </div>

          <p class="transfer-features-sec__text" v-if="citiesText">
            Получайте наличные или оплачивайте услуги в <span v-if="citiesText"> {{ citiesText }}</span>
          </p>
          <p class="transfer-features-sec__text" v-else>
            Получайте наличные или оплачивайте услуги
          </p>
        </article>

        <article class="transfer-features-sec__card">
          <div class="transfer-features-sec__visual">
            <div class="transfer-features-sec__pills">
              <span class="transfer-features-sec__pill">-6 789 USD</span>
              <span class="transfer-features-sec__pill">-3 499 EUR</span>
              <span class="transfer-features-sec__pill">-10 099 EUR</span>
              <span class="transfer-features-sec__pill">-54 795 USD</span>
            </div>
          </div>

          <p class="transfer-features-sec__text">
            Оплачивайте счета в рублях — мы конвертируем и переведем валюту вашим партнерам в {{ countryName }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import walletImage from '~/assets/images/gr-19.png'

const props = defineProps({
  countryName: {
    type: String,
    default: null,
  },
  countryCities: {
    type: Array,
    default: () => [],
  },
})

const citiesText = computed(() => {
  const names = []

  for (let i = 0; i < props.countryCities.length; i++) {
    const name = props.countryCities[i]?.name_city

    if (name) {
      names.push(name)
    }
  }

  return names.join(', ')
})
</script>
