<template>
  <section ref="sectionRef" class="how-start-sec">
    <div class="container">
      <h2 class="how-start-sec__title">Как начать?</h2>

      <div class="how-start-sec__tabs" role="tablist" aria-label="Тип операции">
        <button
          type="button"
          class="how-start-sec__tab"
          :class="{ 'how-start-sec__tab--active': activeTab === 'payment' }"
          role="tab"
          :aria-selected="activeTab === 'payment'"
          @click="activeTab = 'payment'"
        >
          Международный платеж
        </button>
        <button
          type="button"
          class="how-start-sec__tab"
          :class="{ 'how-start-sec__tab--active': activeTab === 'crypto' }"
          role="tab"
          :aria-selected="activeTab === 'crypto'"
          @click="activeTab = 'crypto'"
        >
          Операция с криптовалютой
        </button>
      </div>

      <div class="how-start-sec__grid">
        <article
          v-for="step in currentSteps"
          :key="`${activeTab}-${step.id}`"
          class="how-start-sec__card"
        >
          <span class="how-start-sec__card-step">Шаг {{ step.step }}</span>
          <h3 class="how-start-sec__card-title">{{ step.title }}</h3>
          <p class="how-start-sec__card-text">{{ step.text }}</p>
        </article>
      </div>

      <div class="how-start-sec__btn-wrap">
        <AppButton>Начать взаимовыгодное сотрудничество</AppButton>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'

const sectionRef = ref(null)
const activeTab = ref('payment')

const paymentSteps = [
  {
    id: 1,
    step: 1,
    title: 'Заявка на сделку',
    text: 'Укажите сумму, валюту и реквизиты вашей компании для приёма платежа. После получения заявки специалисты проанализируют параметры сделки и подберут оптимальную схему валютного перевода.',
  },
  {
    id: 2,
    step: 2,
    title: 'Заключение договора',
    text: 'Подписываем агентский договор, фиксируем валюту, сумму, курс и условия. Это обеспечивает прозрачность перевода за рубеж и юридическую защиту сторон.',
  },
  {
    id: 3,
    step: 3,
    title: 'Выбор агента для платежа',
    text: 'Мы предлагаем проверенных агентов, которые примут платеж от покупателя. Подбираем оптимальный маршрут платежа за границу с учетом страны получателя, валюты и банковских требований.',
  },
  {
    id: 4,
    step: 4,
    title: 'Оплата от покупателя',
    text: 'Покупатель переводит деньги агенту с российского счета и предоставляет необходимые документы: контракт, инвойс и сопроводительные файлы.',
  },
  {
    id: 5,
    step: 5,
    title: 'Выплата в рублях',
    text: 'Предоставляем все необходимые закрывающие документы. Вы получаете отчет и все необходимые документы для бухгалтерии.',
  },
]

const cryptoSteps = [
  {
    id: 1,
    step: 1,
    title: 'Заявка на операцию',
    text: 'Укажите сумму, валюту и направление обмена. После получения заявки специалисты проанализируют параметры сделки и подберут оптимальный курс и схему проведения операции.',
  },
  {
    id: 2,
    step: 2,
    title: 'Заключение договора',
    text: 'Подписываем договор, фиксируем валюту, сумму, курс и условия. Это обеспечивает прозрачность операции и юридическую защиту сторон.',
  },
  {
    id: 3,
    step: 3,
    title: 'Проверка документов',
    text: 'Проводим проверку документов и соответствие операции требованиям законодательства. При необходимости запрашиваем дополнительные материалы для безопасного проведения сделки.',
  },
  {
    id: 4,
    step: 4,
    title: 'Перевод средств',
    text: 'Вы переводите средства по согласованным реквизитам и предоставляете необходимые документы. Мы контролируем поступление и подтверждаем начало операции.',
  },
  {
    id: 5,
    step: 5,
    title: 'Зачисление криптовалюты',
    text: 'Предоставляем все необходимые закрывающие документы. Вы получаете криптовалюту на указанный кошелёк или рублёвую выплату — в зависимости от условий сделки.',
  },
]

const currentSteps = computed(() => (
  activeTab.value === 'payment' ? paymentSteps : cryptoSteps
))

let howStartAnimation

onMounted(() => {
  if (!sectionRef.value) return

  howStartAnimation = gsap.context(() => {
    gsap.from('.how-start-sec__title', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power2.out',
    })

    gsap.from('.how-start-sec__tabs', {
      opacity: 0,
      y: 16,
      duration: 0.5,
      delay: 0.1,
      ease: 'power2.out',
    })

    gsap.from('.how-start-sec__card', {
      opacity: 0,
      y: 24,
      duration: 0.5,
      stagger: 0.08,
      delay: 0.2,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  howStartAnimation?.revert()
})
</script>
