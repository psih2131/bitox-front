<template>
  <section ref="sectionRef" class="team-sec">
    <div class="container">
      <div class="team-sec__head">
        <h2 class="team-sec__title">{{ sectionTitle }}</h2>
        <p class="team-sec__subtitle">{{ sectionSubtitle }}</p>

        <div v-if="team.length" class="team-sec__nav">
          <button
            type="button"
            class="team-sec__arrow"
            aria-label="Предыдущий слайд"
            :disabled="swiperReady && isBeginning"
            @click="prev()"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12L5.64645 12.3536L5.29289 12L5.64645 11.6464L6 12ZM18 11.5C18.2761 11.5 18.5 11.7239 18.5 12C18.5 12.2761 18.2761 12.5 18 12.5L18 12L18 11.5ZM10 16L9.64645 16.3536L5.64645 12.3536L6 12L6.35356 11.6464L10.3536 15.6464L10 16ZM6 12L5.64645 11.6464L9.64645 7.64645L10 8L10.3536 8.35355L6.35356 12.3536L6 12ZM6 12L6 11.5L18 11.5L18 12L18 12.5L6 12.5L6 12Z" fill="white" />
            </svg>
          </button>

          <button
            type="button"
            class="team-sec__arrow"
            aria-label="Следующий слайд"
            :disabled="swiperReady && isEnd"
            @click="next()"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 12L18.3536 11.6464L18.7071 12L18.3536 12.3536L18 12ZM6 12.5C5.72386 12.5 5.5 12.2761 5.5 12C5.5 11.7239 5.72386 11.5 6 11.5V12V12.5ZM14 8L14.3536 7.64645L18.3536 11.6464L18 12L17.6464 12.3536L13.6464 8.35355L14 8ZM18 12L18.3536 12.3536L14.3536 16.3536L14 16L13.6464 15.6464L17.6464 11.6464L18 12ZM18 12V12.5H6V12V11.5H18V12Z" fill="white" />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="team.length" class="team-sec__grid">
        <article
          v-for="member in team"
          :key="member.id"
          class="team-sec__card"
        >
          <div class="team-sec__card-media">
            <img
              v-if="member.image"
              :src="member.image"
              :alt="member.name"
              class="team-sec__card-img"
              width="365"
              height="404"
            />
            <span v-if="member.role" class="team-sec__card-badge">{{ member.role }}</span>
          </div>

          <h3 class="team-sec__card-name">{{ member.name }}</h3>
          <p class="team-sec__card-text">{{ member.text }}</p>
        </article>
      </div>

      <div v-if="team.length" class="team-sec__slider-wrap">
        <ClientOnly>
          <swiper-container ref="swiperRef" :init="false" class="team-sec__slider">
            <swiper-slide v-for="member in team" :key="`slide-${member.id}`">
              <article class="team-sec__card team-sec__card--slide">
                <div class="team-sec__card-media">
                  <img
                    v-if="member.image"
                    :src="member.image"
                    :alt="member.name"
                    class="team-sec__card-img"
                    width="365"
                    height="404"
                  />
                  <span v-if="member.role" class="team-sec__card-badge">{{ member.role }}</span>
                </div>

                <h3 class="team-sec__card-name">{{ member.name }}</h3>
                <p class="team-sec__card-text">{{ member.text }}</p>
              </article>
            </swiper-slide>
          </swiper-container>
        </ClientOnly>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import { getStrapiMediaUrl } from '~/utils/strapi'

const props = defineProps({
  section: {
    type: Object,
    default: null,
  },
})

const apiUrl = useRuntimeConfig().public.apiUrl

const { data: teamsResponse } = await useFetch(`${apiUrl}/api/teams?populate[image]=true`)

const sectionTitle = computed(() => props.section?.title ?? 'Наша команда')
const sectionSubtitle = computed(
  () => props.section?.subtitle
    ?? 'За 3 года работы наши специалисты накопили огромный опыт и решают любые задачи клиентов эффективно и в срок',
)

const team = computed(() => {
  const data = teamsResponse.value?.data ?? []

  return data.map((member) => ({
    id: member.id,
    name: member.name,
    role: member.postition,
    text: member.description,
    image: getStrapiMediaUrl(member.image, apiUrl),
  }))
})

const sectionRef = ref(null)
const swiperRef = ref(null)
const swiperReady = ref(false)

const { next, prev, isBeginning, isEnd, reInitialize } = useSwiper(swiperRef, {
  slidesPerView: 1,
  spaceBetween: 0,
  speed: 500,
})

watch(swiperRef, async (el) => {
  if (!el) return

  await nextTick()
  reInitialize()
  swiperReady.value = true
})

watch(team, async () => {
  if (!swiperRef.value) return

  await nextTick()
  reInitialize()
})

let teamAnimation

onMounted(() => {
  if (!sectionRef.value) return

  teamAnimation = gsap.context(() => {
    gsap.from('.team-sec__head', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power2.out',
    })

    gsap.from('.team-sec__grid .team-sec__card', {
      opacity: 0,
      y: 24,
      duration: 0.5,
      stagger: 0.1,
      delay: 0.15,
      ease: 'power2.out',
    })

    gsap.from('.team-sec__slider-wrap', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      delay: 0.15,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  teamAnimation?.revert()
})
</script>
