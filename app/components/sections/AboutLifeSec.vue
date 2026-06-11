<template>
  <section ref="sectionRef" class="about-life-sec">
    <div class="container">
      <div class="about-life-sec__head">
        <h2 class="about-life-sec__title">Из жизни компании</h2>
        <p class="about-life-sec__subtitle">
          Команда, офис, мероприятия, партнёрские встречи
        </p>
      </div>

      <div ref="galleryRef" class="about-life-sec__gallery">
        <div class="about-life-sec__grid">
          <a
            v-for="image in mainImages"
            :key="image.id"
            :href="image.full"
            class="about-life-sec__item"
            :class="`about-life-sec__item--${image.layout}`"
            data-fancybox="about-life"
            :data-caption="image.caption"
          >
            <img
              :src="image.thumb"
              :alt="image.caption"
              class="about-life-sec__item-img"
            />
          </a>
        </div>

        <div v-if="!hasMore" class="about-life-sec__grid about-life-sec__grid--more">
          <a
            v-for="image in moreImages"
            :key="image.id"
            :href="image.full"
            class="about-life-sec__item about-life-sec__item--more"
            data-fancybox="about-life"
            :data-caption="image.caption"
          >
            <img
              :src="image.thumb"
              :alt="image.caption"
              class="about-life-sec__item-img"
            />
          </a>
        </div>
      </div>

      <div v-if="hasMore" class="about-life-sec__more">
        <AppClientBtn type="button" @click="showMore">
          Показать больше
        </AppClientBtn>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import galleryImage from '~/assets/images/exm-1.jpg'

const { $fancybox } = useNuxtApp()

const sectionRef = ref(null)
const galleryRef = ref(null)
const hasMore = ref(true)

const mainImages = [
  { id: 1, thumb: galleryImage, full: galleryImage, caption: 'Команда Bitox', layout: 'large' },
  { id: 2, thumb: galleryImage, full: galleryImage, caption: 'Рабочий процесс', layout: 'top-left' },
  { id: 3, thumb: galleryImage, full: galleryImage, caption: 'Офис', layout: 'top-right' },
  { id: 4, thumb: galleryImage, full: galleryImage, caption: 'Встреча с партнёрами', layout: 'wide' },
]

const moreImages = [
  { id: 5, thumb: galleryImage, full: galleryImage, caption: 'Мероприятие' },
  { id: 6, thumb: galleryImage, full: galleryImage, caption: 'Корпоратив' },
]

let sectionAnimation

const bindFancybox = () => {
  if (!galleryRef.value) return

  $fancybox.unbind(galleryRef.value)
  $fancybox.bind(galleryRef.value, '[data-fancybox="about-life"]', {})
}

const showMore = () => {
  hasMore.value = false
  nextTick(() => bindFancybox())
}

onMounted(() => {
  if (!sectionRef.value) return

  bindFancybox()

  sectionAnimation = gsap.context(() => {
    gsap.from('.about-life-sec__head', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power2.out',
    })

    gsap.from('.about-life-sec__item', {
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
  if (galleryRef.value) {
    $fancybox.unbind(galleryRef.value)
  }

  sectionAnimation?.revert()
})
</script>
