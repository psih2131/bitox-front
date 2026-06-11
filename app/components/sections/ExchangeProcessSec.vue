<template>
  <section ref="sectionRef" class="exchange-process-sec">
    <div class="container">
      <div class="exchange-process-sec__head">
        <h2 class="exchange-process-sec__title">Как происходит обмен</h2>
        <p class="exchange-process-sec__subtitle">
          Весь процесс занимает в среднем 15 минут — от заявки до получения средств
        </p>
      </div>

      <div class="exchange-process-sec__grid">
        <article
          v-for="step in steps"
          :key="step.id"
          class="exchange-process-sec__card"
          :class="{ 'exchange-process-sec__card--dark': step.dark }"
        >
          <span class="exchange-process-sec__num">{{ step.num }}</span>
          <h3 class="exchange-process-sec__card-title">{{ step.title }}</h3>
          <p class="exchange-process-sec__card-text">{{ step.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'

const steps = [
  {
    id: 'request',
    num: '01',
    title: 'Оставьте заявку',
    text: 'Введите сумму, валюту и контакт в калькуляторе. Менеджер свяжется в течение 5 минут.',
  },
  {
    id: 'rate',
    num: '02',
    title: 'Подтвердите курс',
    text: 'Согласуйте курс и маршрут.',
  },
  {
    id: 'transfer',
    num: '03',
    title: 'Передайте средства',
    text: 'Оплата принимается в криптовалюте или наличными. Перевод осуществляется согласно предоставленным реквизитам. Внесение наличных средств возможно по адресу офиса.',
  },
  {
    id: 'receive',
    num: '04',
    title: 'Получите обмен',
    text: 'Получите средства на свой кошелёк, карту или наличными в офисе.',
    dark: true,
  },
]

const sectionRef = ref(null)

let sectionAnimation

onMounted(() => {
  if (!sectionRef.value) return

  sectionAnimation = gsap.context(() => {
    gsap.from('.exchange-process-sec__head', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power2.out',
    })

    gsap.from('.exchange-process-sec__card', {
      opacity: 0,
      y: 24,
      duration: 0.5,
      stagger: 0.1,
      delay: 0.1,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  sectionAnimation?.revert()
})
</script>
