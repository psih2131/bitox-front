<template>
  <section ref="sectionRef" class="service-invoices-sec">
    <div class="container service-invoices-sec__inner">
      <h2 class="service-invoices-sec__title">
        Какие инвойсы мы помогаем оплачивать
      </h2>

      <div class="service-invoices-sec__grid">
        <article
          v-for="card in cards"
          :key="card.id"
          class="service-invoices-sec__card"
        >
          <div class="service-invoices-sec__card-media">
            <img
              :src="cardImage"
              alt=""
              class="service-invoices-sec__card-img"
            />
          </div>

          <div class="service-invoices-sec__card-body">
            <h3 class="service-invoices-sec__card-title">{{ card.title }}</h3>
            <p class="service-invoices-sec__card-text">{{ card.text }}</p>

            <div class="service-invoices-sec__tags">
              <span
                v-for="tag in card.tags"
                :key="tag"
                class="service-invoices-sec__tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import cardImage from '~/assets/images/gr-7.png'

const sectionRef = ref(null)

const cards = [
  {
    id: 1,
    title: 'Инвойсы поставщиков',
    text: 'Товары от зарубежных контрагентов',
    tags: ['Оборудование', 'Сырье', 'Комплектующие'],
  },
  {
    id: 2,
    title: 'Инвойсы поставщиков',
    text: 'Товары от зарубежных контрагентов',
    tags: ['Оборудование', 'Сырье', 'Комплектующие'],
  },
  {
    id: 3,
    title: 'Инвойсы поставщиков',
    text: 'Товары от зарубежных контрагентов',
    tags: ['Оборудование', 'Сырье', 'Комплектующие'],
  },
]

let sectionAnimation

onMounted(() => {
  if (!sectionRef.value) return

  sectionAnimation = gsap.context(() => {
    gsap.from('.service-invoices-sec__title', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power2.out',
    })

    gsap.from('.service-invoices-sec__card', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      stagger: 0.12,
      delay: 0.1,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  sectionAnimation?.revert()
})
</script>
