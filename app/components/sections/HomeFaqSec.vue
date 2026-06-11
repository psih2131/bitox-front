<template>
  <section
    ref="sectionRef"
    class="faq-sec"
    :style="bgColor ? { backgroundColor: bgColor } : undefined"
  >
    <div class="container">
      <h2 class="faq-sec__title">Часто задаваемые вопросы</h2>

      <div class="faq-sec__list">
        <FaqItem
          v-for="item in faqItems"
          :key="item.id"
          :question="item.question"
          :answer="item.answer"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'

defineProps({
  bgColor: {
    type: String,
    default: '',
  },
})

const sectionRef = ref(null)

const faqItems = [
  {
    id: 1,
    question: 'Чем перевод через Bitox отличается от прямого SWIFT-перевода через российский банк?',
    answer: 'Bitox использует собственную инфраструктуру счетов в банках и платёжных системах за пределами РФ, поэтому российский BIC не попадает в цепочку перевода. Это снимает риск блокировки корреспондентом и даёт предсказуемый результат на тех направлениях, где прямой SWIFT через банк сейчас возвращается или отклоняется. Менеджер заранее подбирает рабочий маршрут под валюту и страну получателя.',
  },
  {
    id: 2,
    question: 'Как выглядит еженедельный отчет?',
    answer: 'Еженедельный отчёт содержит сводку по всем проведённым операциям: суммы, валюты, статусы платежей и закрывающие документы. Отчёт формируется автоматически и отправляется на указанную почту каждый понедельник.',
  },
  {
    id: 3,
    question: 'Как выглядит еженедельный отчет?',
    answer: 'Еженедельный отчёт содержит сводку по всем проведённым операциям: суммы, валюты, статусы платежей и закрывающие документы. Отчёт формируется автоматически и отправляется на указанную почту каждый понедельник.',
  },
  {
    id: 4,
    question: 'Как выглядит еженедельный отчет?',
    answer: 'Еженедельный отчёт содержит сводку по всем проведённым операциям: суммы, валюты, статусы платежей и закрывающие документы. Отчёт формируется автоматически и отправляется на указанную почту каждый понедельник.',
  },
]

let faqAnimation

onMounted(() => {
  if (!sectionRef.value) return

  faqAnimation = gsap.context(() => {
    gsap.from('.faq-sec__title', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power2.out',
    })

    gsap.from('.faq-item', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.08,
      delay: 0.1,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  faqAnimation?.revert()
})
</script>

