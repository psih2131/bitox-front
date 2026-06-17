<template>
  <section ref="sectionRef" class="team-sec">
    <div class="container">
      <div class="team-sec__head">
        <h2 class="team-sec__title">{{ sectionTitle }}</h2>
        <p class="team-sec__subtitle">{{ sectionSubtitle }}</p>
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

    gsap.from('.team-sec__card', {
      opacity: 0,
      y: 24,
      duration: 0.5,
      stagger: 0.1,
      delay: 0.15,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  teamAnimation?.revert()
})
</script>
