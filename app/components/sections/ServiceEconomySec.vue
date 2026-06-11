<template>
  <section ref="sectionRef" class="service-economy-sec">
    <div class="container">
      <div class="service-economy-sec__card">
        <div class="service-economy-sec__content">
          <div class="service-economy-sec__content-top">
            <h2 class="service-economy-sec__title">
              Начните экономить<br />
              на международных платежах уже сегодня
            </h2>

            <p class="service-economy-sec__subtitle">
              Самый удобный способ: выгодно, официально и без рисков.
            </p>
          </div>
          

          <div class="service-economy-sec__actions">
            <AppClientBtn>Стать клиентом</AppClientBtn>
            <AppConsultBtn>Бесплатная консультация</AppConsultBtn>
          </div>
        </div>

        <div class="service-economy-sec__features">
          <article
            v-for="feature in features"
            :key="feature.id"
            class="service-economy-sec__feature"
          >
            <img
              :src="feature.image"
              alt=""
              class="service-economy-sec__feature-img"
            />

            <div class="service-economy-sec__feature-body">
              <h3 class="service-economy-sec__feature-title">{{ feature.title }}</h3>
              <p class="service-economy-sec__feature-text">{{ feature.text }}</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import ec1 from '~/assets/images/ec-1.png'
import ec2 from '~/assets/images/ec-2.png'
import ec3 from '~/assets/images/ec-3.png'

const sectionRef = ref(null)

const features = [
  {
    id: 1,
    image: ec1,
    title: 'Платите в рублях внутри РФ',
    text: 'Вы платите в рублях внутри РФ. Bitox оплачивает инвойс вашему поставщику с зарубежного счёта.',
  },
  {
    id: 2,
    image: ec2,
    title: 'На основании агентского договора',
    text: 'Bitox оплачивает счет от своего имени. Так вы не попадаете под прямую проверку зарубежного банка.',
  },
  {
    id: 3,
    image: ec3,
    title: 'Персональный менеджер',
    text: 'На каждом этапе к вам будет прикреплен персональный менеджер, который будет консультировать по всем вопросам',
  },
]

let sectionAnimation

onMounted(() => {
  if (!sectionRef.value) return

  sectionAnimation = gsap.context(() => {
    gsap.from('.service-economy-sec__card', {
      opacity: 0,
      y: 32,
      duration: 0.7,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  sectionAnimation?.revert()
})
</script>
