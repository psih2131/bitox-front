<template>
  <section ref="sectionRef" class="exchange-benefits-sec">
    <div class="container">
      <h2 class="exchange-benefits-sec__title">Выгоды работы с нами</h2>

      <div class="exchange-benefits-sec__grid-wrap">
        <img
          :src="decorImage"
          alt=""
          class="exchange-benefits-sec__decor"
          width="380"
          height="308"
        />

        <div class="exchange-benefits-sec__grid">
          <article class="exchange-benefits-sec__card">
            <div class="exchange-benefits-sec__card-top">
              <span class="exchange-benefits-sec__card-icon exchange-benefits-sec__card-icon--dark">
                <img :src="confWhite" alt="" />
              </span>
              <h3 class="exchange-benefits-sec__card-title">
                Получение наличных в 128 странах
              </h3>
            </div>

            <p class="exchange-benefits-sec__card-text">
              Россия (Москва, Санкт-Петербург, Владивосток), США, ОАЭ, Германия,
              Сербия, Бразилия, Польша, Таиланд, Литва, Гонконг, Турция,
              Великобритания, Аргентина, Филиппины, Индонезия, Сингапур, Малайзия,
              Ливан, Мексика, Испания и другие.
            </p>
          </article>

          <article class="exchange-benefits-sec__card exchange-benefits-sec__card--wide">
            <div class="exchange-benefits-sec__card-top">
              <span class="exchange-benefits-sec__card-icon exchange-benefits-sec__card-icon--dark">
                <img :src="confWhite" alt="" />
              </span>
              <h3 class="exchange-benefits-sec__card-title">
                Приём и выплата в 50 валютах
              </h3>
            </div>

            <div class="exchange-benefits-sec__cols">
              <div class="exchange-benefits-sec__col">
                <div class="exchange-benefits-sec__cluster">
                  <p class="exchange-benefits-sec__cluster-title">Фиатные валюты</p>
                  <ul class="exchange-benefits-sec__fiat-list">
                    <li v-for="currency in fiatCurrencies" :key="currency">
                      {{ currency }}
                    </li>
                  </ul>
                </div>
              </div>

              <div class="exchange-benefits-sec__col">
                <div class="exchange-benefits-sec__cluster">
                  <p class="exchange-benefits-sec__cluster-title">Криптовалюта</p>
                  <p class="exchange-benefits-sec__cluster-text">USDT, USDC</p>
                </div>

                <div class="exchange-benefits-sec__cluster">
                  <p class="exchange-benefits-sec__cluster-title">Перевод на карту</p>
                  <p class="exchange-benefits-sec__cluster-text">
                    Сбер, Тинькофф или QR-Код Тинькофф, СБП
                  </p>
                </div>
              </div>
            </div>
          </article>

          <article class="exchange-benefits-sec__card">
            <div class="exchange-benefits-sec__card-top">
              <span class="exchange-benefits-sec__card-icon exchange-benefits-sec__card-icon--dark">
                <img :src="confWhite" alt="" />
              </span>
              <h3 class="exchange-benefits-sec__card-title">
                Низкие комиссии: от 0.1%
              </h3>
            </div>

            <p class="exchange-benefits-sec__card-text">
              Курс зависит от объёма: чем больше объём, тем ниже комиссия.
              Без скрытых комиссий и доплат.
            </p>
          </article>

          <article class="exchange-benefits-sec__card">
            <div class="exchange-benefits-sec__card-top">
              <span class="exchange-benefits-sec__card-icon exchange-benefits-sec__card-icon--dark">
                <img :src="confWhite" alt="" />
              </span>
              <h3 class="exchange-benefits-sec__card-title">Простая верификация</h3>
            </div>

            <p class="exchange-benefits-sec__card-text">
              Для обмена наличными — минимальная идентификация по паспорту.
              Для пополнения и вывода на кошелёк — без регистрации на бирже.
            </p>
          </article>

          <article class="exchange-benefits-sec__card exchange-benefits-sec__card--dark">
            <div class="exchange-benefits-sec__card-top">
              <span class="exchange-benefits-sec__card-icon exchange-benefits-sec__card-icon--light">
                <img :src="confBlack" alt="" />
              </span>
              <h3 class="exchange-benefits-sec__card-title">Обмен от 5 минут</h3>
            </div>

            <ul class="exchange-benefits-sec__list">
              <li>Обмен криптовалюта-криптовалюта от 5 минут</li>
              <li>Обмен криптовалюта-фиат от 15 минут</li>
              <li>В редких случаях до 2 дней</li>
            </ul>
          </article>
        </div>
      </div>

      <div class="exchange-benefits-sec__action">
        <AppClientBtn>Начать перевод</AppClientBtn>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import confBlack from '~/assets/images/icons/conf-black.png'
import confWhite from '~/assets/images/icons/conf-white.png'
import decorImage from '~/assets/images/gr-16.png'

const fiatCurrencies = [
  'RUB (₽, Российский рубль)',
  'USD ($, Доллар США)',
  'EUR (€, Евро)',
  'KRW (₩, Вона Республики Корея)',
  'CNY (¥, Юань Китая)',
  'AED (د.إ, Дирхам Объединённых Арабских Эмиратов)',
  'JPY (¥, Иена Японии)',
  'и других валютах',
]

const sectionRef = ref(null)

let sectionAnimation

onMounted(() => {
  if (!sectionRef.value) return

  sectionAnimation = gsap.context(() => {
    gsap.from('.exchange-benefits-sec__title', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power2.out',
    })

    gsap.from('.exchange-benefits-sec__card', {
      opacity: 0,
      y: 24,
      duration: 0.5,
      stagger: 0.1,
      delay: 0.1,
      ease: 'power2.out',
    })

    gsap.from('.exchange-benefits-sec__decor', {
      opacity: 0,
      scale: 0.92,
      duration: 0.7,
      delay: 0.15,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  sectionAnimation?.revert()
})
</script>
