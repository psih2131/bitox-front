<template>
  <section ref="sectionRef" class="platform-sec">
    <div class="container">
      <h2 class="platform-sec__title">
        Единая платформа для бизнеса и частных клиентов
      </h2>

      <div class="platform-sec__grid">
        <article
          v-for="column in columns"
          :key="column.id"
          class="platform-sec__card"
        >
          <div class="platform-sec__card-head">
            <div class="platform-sec__card-text">
              <h3 class="platform-sec__card-title">{{ column.title }}</h3>
              <p class="platform-sec__card-subtitle">{{ column.subtitle }}</p>
            </div>

            <img
              :src="column.image"
              alt=""
              class="platform-sec__card-img"
            />
          </div>

          <ul class="platform-sec__list">
            <li
              v-for="service in column.services"
              :key="service.slug"
            >
              <NuxtLink
                :to="`/services/${service.slug}`"
                class="platform-sec__item"
              >
              <div class="platform-sec__item-content">
                <p class="platform-sec__item-title">{{ service.title }}</p>
                <p class="platform-sec__item-text">{{ service.text }}</p>
              </div>

              <span class="platform-sec__item-btn" aria-hidden="true">
                <svg
                  class="platform-sec__item-btn-icon platform-sec__item-btn-icon--default"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3.5 12.5L12.5 3.5M12.5 3.5H6.5M12.5 3.5V9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                <svg
                  class="platform-sec__item-btn-icon platform-sec__item-btn-icon--hover"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              </NuxtLink>
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gr1 from '~/assets/images/gr-1.png'
import gr2 from '~/assets/images/gr-2.png'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)

const columns = [
  {
    id: 'business',
    title: 'Бизнесу',
    subtitle: 'от 1000$ с контролем комплаенса и минимизацией рисков',
    image: gr1,
    services: [
      {
        slug: 'international-transfers',
        title: 'Международные переводы',
        text: 'Платежи в 70+ стран',
      },
      {
        slug: 'invoice-payment',
        title: 'Оплата инвойсов',
        text: 'Оплата счетов поставщикам',
      },
      {
        slug: 'currency-control',
        title: 'Валютный контроль',
        text: 'Валютные операции под ключ',
      },
      {
        slug: 'corporate-compliance',
        title: 'Корпоративный комплаенс',
        text: 'Проверка контрагентов',
      },
      {
        slug: 'bulk-payments',
        title: 'Массовые выплаты',
        text: 'Выплаты в один клик',
      },
    ],
  },
  {
    id: 'private',
    title: 'Частным лицам',
    subtitle: 'от 500$ с удобным процессом и сопровождением до зачисления',
    image: gr2,
    services: [
      {
        slug: 'abroad-transfer',
        title: 'Перевод за рубеж',
        text: 'Отправка средств за границу',
      },
      {
        slug: 'currency-receipt',
        title: 'Получение валюты',
        text: 'Зачисление без лишних шагов',
      },
      {
        slug: 'currency-exchange',
        title: 'Обмен валюты',
        text: 'Выгодный курс без скрытых комиссий',
      },
      {
        slug: 'crypto-operations',
        title: 'Криптооперации',
        text: 'Покупка и продажа криптовалюты',
      },
      {
        slug: 'personal-manager',
        title: 'Личный менеджер',
        text: 'Сопровождение на каждом этапе',
      },
    ],
  },
]

let platformAnimation

onMounted(() => {
  if (!sectionRef.value) return

  platformAnimation = gsap.context(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 80%',
        once: true,
      },
    })

    timeline
      .from('.platform-sec__title', {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: 'power2.out',
      })
      .from('.platform-sec__card', {
        opacity: 0,
        y: 32,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out',
      }, '-=0.3')
      .from('.platform-sec__card-img', {
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
      }, '-=0.5')
      .from('.platform-sec__item', {
        opacity: 0,
        y: 16,
        duration: 0.5,
        stagger: 0.06,
        ease: 'power2.out',
      }, '-=0.35')
  }, sectionRef.value)
})

onUnmounted(() => {
  platformAnimation?.revert()
})
</script>
