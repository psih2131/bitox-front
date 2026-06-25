<template>
  <section ref="sectionRef" class="platform-sec">
    <div class="container">
      <h2 class="platform-sec__title">
        {{ sectionTitle }}
      </h2>

      <div class="platform-sec__grid">
        <article class="platform-sec__card">
          <div class="platform-sec__card-head">
            <div class="platform-sec__card-text">
              <h3 class="platform-sec__card-title">{{ col1Title }}</h3>
              <p v-if="col1Subtitle" class="platform-sec__card-subtitle">
                {{ col1Subtitle }}
              </p>
            </div>

            <img :src="gr1" alt="" class="platform-sec__card-img" />
          </div>

          <ul v-if="businessPages.length" class="platform-sec__list">
            <li v-for="page in businessPages" :key="page.id">
              <NuxtLink :to="`/business/${page.slug}`" class="platform-sec__item">
                <div class="platform-sec__item-content">
                  <p class="platform-sec__item-title">{{ page.title }}</p>
                  <p v-if="page.subtitle" class="platform-sec__item-text">{{ page.subtitle }}</p>
                </div>

                <span class="platform-sec__item-btn" aria-hidden="true">
                  <svg
                    class="platform-sec__item-btn-icon platform-sec__item-btn-icon--default"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3.5 12.5L12.5 3.5M12.5 3.5H6.5M12.5 3.5V9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                  <svg
                    class="platform-sec__item-btn-icon platform-sec__item-btn-icon--hover"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
              </NuxtLink>
            </li>
          </ul>
        </article>

        <article class="platform-sec__card">
          <div class="platform-sec__card-head">
            <div class="platform-sec__card-text">
              <h3 class="platform-sec__card-title">{{ col2Title }}</h3>
              <p v-if="col2Subtitle" class="platform-sec__card-subtitle">
                {{ col2Subtitle }}
              </p>
            </div>

            <img :src="gr2" alt="" class="platform-sec__card-img" />
          </div>

          <ul v-if="individualsPages.length" class="platform-sec__list">
            <li v-for="page in individualsPages" :key="page.id">
              <NuxtLink :to="`/individuals/${page.slug}`" class="platform-sec__item">
                <div class="platform-sec__item-content">
                  <p class="platform-sec__item-title">{{ page.title }}</p>
                  <p v-if="page.subtitle" class="platform-sec__item-text">{{ page.subtitle }}</p>
                </div>

                <span class="platform-sec__item-btn" aria-hidden="true">
                  <svg
                    class="platform-sec__item-btn-icon platform-sec__item-btn-icon--default"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3.5 12.5L12.5 3.5M12.5 3.5H6.5M12.5 3.5V9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                  <svg
                    class="platform-sec__item-btn-icon platform-sec__item-btn-icon--hover"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
              </NuxtLink>
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gr1 from '~/assets/images/gr-1.png'
import gr2 from '~/assets/images/gr-2.png'
import { mapStrapiBusinessPages, mapStrapiIndividualsPages } from '~/utils/strapi'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  section: {
    type: Object,
    default: null,
  },
})

const urlApi = useRuntimeConfig().public.apiUrl

const sectionTitle = computed(
  () => props.section?.section_title || 'Единая платформа для бизнеса и частных клиентов',
)
const col1Title = computed(() => props.section?.col_1_title || 'Бизнесу')
const col1Subtitle = computed(
  () => props.section?.col_1_subtitle || 'от 1000$ с контролем комплаенса и минимизацией рисков',
)
const col2Title = computed(() => props.section?.col_2_title || 'Частным лицам')
const col2Subtitle = computed(
  () => props.section?.col_2_subtitle || 'от 500$ с удобным процессом и сопровождением до зачисления',
)

const [{ data: businessPagesResponse }, { data: individualsPagesResponse }] = await Promise.all([
  useFetch(
    `${urlApi}/api/business-pages?fields[0]=title&fields[1]=slug&fields[2]=subtitle&populate=preview_image&pagination[pageSize]=100`,
  ),
  useFetch(
    `${urlApi}/api/individuals-pages?fields[0]=title&fields[1]=slug&fields[2]=subtitle&populate=preview_image&pagination[pageSize]=100`,
  ),
])

const sectionRef = ref(null)

const businessPages = computed(() =>
  mapStrapiBusinessPages(businessPagesResponse.value?.data ?? [], urlApi),
)

const individualsPages = computed(() =>
  mapStrapiIndividualsPages(individualsPagesResponse.value?.data ?? [], urlApi),
)

let platformAnimation

onMounted(() => {
  if (!sectionRef.value) return

  platformAnimation = gsap.context(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 80%',
        once: true,
      },
    })

    timeline
      .from('.platform-sec__title', {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: 'power2.out',
      })
      .from('.platform-sec__card', {
        opacity: 0,
        y: 32,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out',
      }, '-=0.3')
      .from('.platform-sec__card-img', {
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
      }, '-=0.5')
      .from('.platform-sec__item', {
        opacity: 0,
        y: 16,
        duration: 0.5,
        stagger: 0.06,
        ease: 'power2.out',
      }, '-=0.35')
  }, sectionRef.value)
})

onUnmounted(() => {
  platformAnimation?.revert()
})
</script>
