<template>
  <section ref="sectionRef" class="about-offices-sec">
    <div class="container">
      <h2 class="about-offices-sec__title">Более 30 офисов по всей стране</h2>

      <div class="about-offices-sec__inner">

        <div class="about-offices-sec__map-wrapper">
            <img
            :src="mapImage"
            alt="Карта офисов Bitox по России"
            class="about-offices-sec__map"
            width="555"
            height="420"
          />
        </div>
        

        <div class="about-offices-sec__list-card">
          <h3 class="about-offices-sec__list-title">Список всех городов</h3>

          <ul class="about-offices-sec__list">
            <li
              v-for="city in cities"
              :key="city"
              class="about-offices-sec__city"
            >
              {{ city }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import mapImage from '@/assets/images/map-about-2.png'


const sectionRef = ref(null)

const cities = [
  'Москва',
  'Санкт-Петербург',
  'Екатеринбург',
  'Тюмень',
  'Саратов',
  'Самара',
  'Пермь',
  'Челябинск',
  'Омск',
  'Краснодар',
  'Ростов',
  'Ижевск',
  'Новосибирск',
  'Барнаул',
  'Красноярск',
  'Волгоград',
  'Томск',
  'Воронеж',
  'Казань',
  'Иркутск',
  'Хабаровск',
  'Владивосток',
  'Сочи',
  'Севастополь',
  'Симферополь',
  'Ставрополь',
  'Пятигорск',
  'Махачкала',
  'Грозный',
  'Новороссийск',
  'Якутск',
]

let sectionAnimation

onMounted(() => {
  if (!sectionRef.value) return

  sectionAnimation = gsap.context(() => {
    gsap.from('.about-offices-sec__title', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power2.out',
    })

    gsap.from('.about-offices-sec__inner', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      delay: 0.1,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  sectionAnimation?.revert()
})
</script>
