<template>
  <section v-if="section" ref="sectionRef" class="contacts-accounts-sec">
    <div class="container">
      <nav class="contacts-accounts-sec__breadcrumbs" aria-label="Хлебные крошки">
        <NuxtLink to="/" class="contacts-accounts-sec__breadcrumb-link">Главная</NuxtLink>
        <span class="contacts-accounts-sec__breadcrumb-sep">/</span>
        <span class="contacts-accounts-sec__breadcrumb-current">Официальные аккаунты</span>
      </nav>

      <div class="contacts-accounts-sec__row">
        <div class="contacts-accounts-sec__main">
          <div v-if="section.title" class="contacts-accounts-sec__title-wrap">
            <h1 class="contacts-accounts-sec__title" v-html="section.title" />
          </div>

          <p v-if="section.subtitle" class="contacts-accounts-sec__text">
            {{ section.subtitle }}
          </p>
        </div>

        <article class="contacts-accounts-sec__card">
          <div
            class="contacts-accounts-sec__avatar"
            :style="avatarUrl ? { backgroundImage: `url(${avatarUrl})`, backgroundSize: 'cover' } : undefined"
            aria-hidden="true"
          />

          <h2 v-if="section.telegram_title" class="contacts-accounts-sec__card-name">
            {{ section.telegram_title }}
          </h2>

          <p v-if="section.telegram_subtitle" class="contacts-accounts-sec__card-role">
            {{ section.telegram_subtitle }}
          </p>

          <p v-if="tgUsers.length" class="contacts-accounts-sec__card-login">
            Логин:<br>
            <template v-for="(user, index) in tgUsers" :key="user.id ?? index">
              <template v-if="index > 0">, а также </template>
              <a
                :href="user.link"
                target="_blank"
                rel="noopener noreferrer"
              >{{ user.title }}</a>
            </template>
          </p>

          <p v-if="section.telegram_subtitle_2" class="contacts-accounts-sec__card-date">
            {{ section.telegram_subtitle_2 }}
          </p>
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
    required: true,
  },
})

const apiUrl = useRuntimeConfig().public.apiUrl

const avatarUrl = computed(() => getStrapiMediaUrl(props.section.telegram_img, apiUrl))

const tgUsers = computed(() =>
  (props.section.tg_users ?? []).filter((user) => user?.title && user?.link),
)

const sectionRef = ref(null)

let sectionAnimation

onMounted(() => {
  if (!sectionRef.value) return

  sectionAnimation = gsap.context(() => {
    gsap.from('.contacts-accounts-sec__main', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power2.out',
    })

    gsap.from('.contacts-accounts-sec__card', {
      opacity: 0,
      y: 24,
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
