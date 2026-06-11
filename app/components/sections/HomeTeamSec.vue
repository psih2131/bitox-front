<template>
  <section ref="sectionRef" class="team-sec">
    <div class="container">
      <div class="team-sec__head">
        <h2 class="team-sec__title">Наша команда</h2>
        <p class="team-sec__subtitle">
          За 3 года&nbsp; работы наши специалисты накопили огромный опыт и решают любые задачи клиентов эффективно и в срок
        </p>
      </div>

      <div class="team-sec__grid">
        <article
          v-for="member in team"
          :key="member.id"
          class="team-sec__card"
        >
          <div class="team-sec__card-media">
            <img
              :src="member.image"
              :alt="member.name"
              class="team-sec__card-img"
              width="365"
              height="404"
            />
            <span class="team-sec__card-badge">{{ member.role }}</span>
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
import teamMember1 from '~/assets/images/team/team-member-1-227797.png'
import teamMember2 from '~/assets/images/team/team-member-2-575ead.png'
import teamMember3 from '~/assets/images/team/team-member-3.png'

const sectionRef = ref(null)

const team = [
  {
    id: 1,
    name: 'Дмитрий Воронов',
    role: 'Генеральный директор',
    image: teamMember1,
    text: 'Предприниматель, в крипте с 2014 года. Запустил bitox.global в 2023 году. Отвечает за стратегию и направления развития компании',
  },
  {
    id: 2,
    name: 'Дмитрий Воронов',
    role: 'Генеральный директор',
    image: teamMember2,
    text: 'Предприниматель, в крипте с 2014 года. Запустил bitox.global в 2023 году. Отвечает за стратегию и направления развития компании',
  },
  {
    id: 3,
    name: 'Дмитрий Воронов',
    role: 'Генеральный директор',
    image: teamMember3,
    text: 'Предприниматель, в крипте с 2014 года. Запустил bitox.global в 2023 году. Отвечает за стратегию и направления развития компании',
  },
]

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
