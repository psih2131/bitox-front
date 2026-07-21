<template>
  <section ref="sectionRef" class="exchange-benefits-sec">
    <div class="container">
      <h2 class="exchange-benefits-sec__title">{{ sectionTitle }}</h2>

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
                {{ block1Title }}
              </h3>
            </div>

            <p class="exchange-benefits-sec__card-text">
              {{ block1Text }}
            </p>
          </article>

          <article class="exchange-benefits-sec__card exchange-benefits-sec__card--wide">
            <div class="exchange-benefits-sec__card-top">
              <span class="exchange-benefits-sec__card-icon exchange-benefits-sec__card-icon--dark">
                <img :src="confWhite" alt="" />
              </span>
              <h3 class="exchange-benefits-sec__card-title">
                {{ block2Title }}
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
                  <p class="exchange-benefits-sec__cluster-text">{{ block2Text2 }}</p>
                </div>

                <div class="exchange-benefits-sec__cluster">
                  <p class="exchange-benefits-sec__cluster-title">Перевод на карту</p>
                  <p class="exchange-benefits-sec__cluster-text">
                    {{ block2Text3 }}
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
                {{ block3Title }}
              </h3>
            </div>

            <p class="exchange-benefits-sec__card-text">
              {{ block3Text }}
            </p>
          </article>

          <article class="exchange-benefits-sec__card">
            <div class="exchange-benefits-sec__card-top">
              <span class="exchange-benefits-sec__card-icon exchange-benefits-sec__card-icon--dark">
                <img :src="confWhite" alt="" />
              </span>
              <h3 class="exchange-benefits-sec__card-title">{{ block4Title }}</h3>
            </div>

            <p class="exchange-benefits-sec__card-text">
              {{ block4Text }}
            </p>
          </article>

          <article class="exchange-benefits-sec__card exchange-benefits-sec__card--dark">
            <div class="exchange-benefits-sec__card-top">
              <span class="exchange-benefits-sec__card-icon exchange-benefits-sec__card-icon--light">
                <img :src="confBlack" alt="" />
              </span>
              <h3 class="exchange-benefits-sec__card-title">{{ block5Title }}</h3>
            </div>

            <ul class="exchange-benefits-sec__list">
              <li v-for="(item, index) in block5Items" :key="index">{{ item }}</li>
            </ul>
          </article>
        </div>
      </div>

      <div class="exchange-benefits-sec__action">
        <AppClientBtn @click="openConsultationModal">Начать перевод</AppClientBtn>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import confBlack from '~/assets/images/icons/conf-black.png'
import confWhite from '~/assets/images/icons/conf-white.png'
import decorImage from '~/assets/images/gr-16.png'
import { useModalStore, MODAL_NAMES } from '~/stores/modal'

const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
})

const modalStore = useModalStore()

function openConsultationModal() {
  modalStore.open(MODAL_NAMES.consultation)
}

const defaultFiatCurrencies = [
  'RUB (₽, Российский рубль)',
  'USD ($, Доллар США)',
  'EUR (€, Евро)',
  'KRW (₩, Вона Республики Корея)',
  'CNY (¥, Юань Китая)',
  'AED (د.إ, Дирхам Объединённых Арабских Эмиратов)',
  'JPY (¥, Иена Японии)',
  'и других валютах',
]

const defaultBlock5Items = [
  'Обмен криптовалюта-криптовалюта от 5 минут',
  'Обмен криптовалюта-фиат от 15 минут',
  'В редких случаях до 2 дней',
]

function splitList(text) {
  if (!text) return []

  return text.split('\n').map((item) => item.trim()).filter(Boolean)
}

const sectionTitle = computed(() => props.section.section_title || 'Выгоды работы с нами')
const block1Title = computed(() => props.section.block_1_title || 'Получение наличных в 128 странах')
const block1Text = computed(() => props.section.block_1_text || 'Россия (Москва, Санкт-Петербург, Владивосток), США, ОАЭ, Германия, Сербия, Бразилия, Польша, Таиланд, Литва, Гонконг, Турция, Великобритания, Аргентина, Филиппины, Индонезия, Сингапур, Малайзия, Ливан, Мексика, Испания и другие.')
const block2Title = computed(() => props.section.block_2_title || 'Приём и выплата в 50 валютах')
const block2Text2 = computed(() => props.section.block_2_text_2 || 'USDT, USDC')
const block2Text3 = computed(() => props.section.block_2_text_3 || 'Сбер, Тинькофф или QR-Код Тинькофф, СБП')
const block3Title = computed(() => props.section.block_3_title || 'Низкие комиссии: от 0.1%')
const block3Text = computed(() => props.section.block_3_text || 'Курс зависит от объёма: чем больше объём, тем ниже комиссия. Без скрытых комиссий и доплат.')
const block4Title = computed(() => props.section.block_4_title || 'Простая верификация')
const block4Text = computed(() => props.section.block_4_text || 'Для обмена наличными — минимальная идентификация по паспорту. Для пополнения и вывода на кошелёк — без регистрации на бирже.')
const block5Title = computed(() => props.section.block_5_title || 'Обмен от 5 минут')

const fiatCurrencies = computed(() => {
  const items = splitList(props.section.block_2_text_1)

  return items.length ? items : defaultFiatCurrencies
})

const block5Items = computed(() => {
  const items = props.section.block_5_list?.map((item) => item.text).filter(Boolean) ?? []

  return items.length ? items : defaultBlock5Items
})

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
