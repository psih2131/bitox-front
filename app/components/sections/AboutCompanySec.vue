<template>
  <section ref="sectionRef" class="about-company-sec">
    <div class="container about-company-sec__inner">
      <img
        :src="companyImage"
        alt=""
        class="about-company-sec__img"
        width="520"
        height="520"
      />

      <div class="about-company-sec__content">
        <h2 class="about-company-sec__title">О компании</h2>

        <div class="text-editor">
          <p>
            Bitox — финтех-компания, которая помогает бизнесу и частным клиентам
            проводить международные расчёты и обмен криптовалюты быстро, прозрачно
            и в рамках законодательства.
          </p>
          <p>
            Мы запустили bitox.global в 2023 году и за три года выстроили
            инфраструктуру с доступом к 70+ платёжным компаниям в разных странах.
            Наша задача — убрать лишние барьеры между вами и вашими контрагентами
            за рубежом.
          </p>
          <p>
            Команда работает с импортом, экспортом, валютным контролем и крипто-расчётами
            ежедневно. Мы не продаём «волшебные схемы» — мы даём понятные маршруты,
            документы и сопровождение на каждом этапе сделки.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import companyImage from '~/assets/images/gr-14.png'

const sectionRef = ref(null)

let sectionAnimation

onMounted(() => {
  if (!sectionRef.value) return

  sectionAnimation = gsap.context(() => {
    gsap.from('.about-company-sec__img', {
      opacity: 0,
      x: -24,
      duration: 0.6,
      ease: 'power2.out',
    })

    gsap.from('.about-company-sec__content', {
      opacity: 0,
      x: 24,
      duration: 0.6,
      delay: 0.1,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  sectionAnimation?.revert()
})
</script>
