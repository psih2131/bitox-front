<template>
  <section v-if="section" ref="sectionRef" class="partner-how-start-sec">
    <div class="container">
      <h2 v-if="section.section_title" class="partner-how-start-sec__title">
        {{ section.section_title }}
      </h2>

      <div class="partner-how-start-sec__grid">
        <div class="partner-how-start-sec__row partner-how-start-sec__row--top">
          <article class="partner-how-start-sec__card partner-how-start-sec__card--white">
            <div class="partner-how-start-sec__card-head">
              <span class="partner-how-start-sec__card-num">01</span>
              <h3 v-if="section.card_title_1" class="partner-how-start-sec__card-title">
                {{ section.card_title_1 }}
              </h3>
            </div>
            <p v-if="section.card_text_1" class="partner-how-start-sec__card-text">
              {{ section.card_text_1 }}
            </p>
          </article>

          <article class="partner-how-start-sec__card partner-how-start-sec__card--gray partner-how-start-sec__card--media">
            <span class="partner-how-start-sec__badge">Партнёрство<br />с bitox</span>

            <div class="partner-how-start-sec__card-content">
              <div class="partner-how-start-sec__card-head">
                <span class="partner-how-start-sec__card-num">02</span>
                <h3 v-if="section.card_title_2" class="partner-how-start-sec__card-title">
                  {{ section.card_title_2 }}
                </h3>
              </div>
              <p v-if="section.card_text_2" class="partner-how-start-sec__card-text">
                {{ section.card_text_2 }}
              </p>
            </div>

            <div class="partner-how-start-sec__card-media">
              <img
                :src="illustration"
                alt=""
                class="partner-how-start-sec__img"
                width="648"
                height="254"
              />
            </div>
          </article>
        </div>

        <div class="partner-how-start-sec__row partner-how-start-sec__row--bottom">
          <article class="partner-how-start-sec__card partner-how-start-sec__card--gray">
            <div class="partner-how-start-sec__card-head">
              <span class="partner-how-start-sec__card-num">03</span>
              <h3 v-if="section.card_title_3" class="partner-how-start-sec__card-title">
                {{ section.card_title_3 }}
              </h3>
            </div>
            <p v-if="section.card_text_3" class="partner-how-start-sec__card-text">
              {{ section.card_text_3 }}
            </p>
          </article>

          <article class="partner-how-start-sec__card partner-how-start-sec__card--dark">
            <div class="partner-how-start-sec__card-head">
              <span class="partner-how-start-sec__card-num partner-how-start-sec__card-num--light">04</span>
              <h3 v-if="section.card_title_4" class="partner-how-start-sec__card-title">
                {{ section.card_title_4 }}
              </h3>
            </div>
            <p v-if="section.card_text_4" class="partner-how-start-sec__card-text">
              {{ section.card_text_4 }}
            </p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import illustration from '~/assets/images/gr-12.png'

defineProps({
  section: {
    type: Object,
    required: true,
  },
})

const sectionRef = ref(null)

let sectionAnimation

onMounted(() => {
  if (!sectionRef.value) return

  sectionAnimation = gsap.context(() => {
    gsap.from('.partner-how-start-sec__title', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power2.out',
    })

    gsap.from('.partner-how-start-sec__card', {
      opacity: 0,
      y: 28,
      duration: 0.6,
      stagger: 0.1,
      delay: 0.15,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  sectionAnimation?.revert()
})
</script>
