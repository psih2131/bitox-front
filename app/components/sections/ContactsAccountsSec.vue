<template>
  <section ref="sectionRef" class="contacts-accounts-sec">
    <div class="container">
      <nav class="contacts-accounts-sec__breadcrumbs" aria-label="Хлебные крошки">
        <NuxtLink to="/" class="contacts-accounts-sec__breadcrumb-link">Главная</NuxtLink>
        <span class="contacts-accounts-sec__breadcrumb-sep">/</span>
        <span class="contacts-accounts-sec__breadcrumb-current">Официальные аккаунты</span>
      </nav>

      <div class="contacts-accounts-sec__row">
        <div class="contacts-accounts-sec__main">
          <div class="contacts-accounts-sec__title-wrap">
            <h1 class="contacts-accounts-sec__title">
              Наши
              <span class="contacts-accounts-sec__badge">
                <svg
                  class="contacts-accounts-sec__badge-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M8 1.5L14.5 13.5H1.5L8 1.5Z"
                    stroke="#FFDD2D"
                    stroke-width="1.4"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M8 6.2V9.2"
                    stroke="#FFDD2D"
                    stroke-width="1.4"
                    stroke-linecap="round"
                  />
                  <circle cx="8" cy="11.4" r="0.8" fill="#FFDD2D" />
                </svg>
                Защита от мошенников
              </span>
              <span class="contacts-accounts-sec__title-line">официальные</span>
              <span class="contacts-accounts-sec__title-line">аккаунты</span>
            </h1>
          </div>

          <p class="contacts-accounts-sec__text">
            Наши сотрудники никогда не пишут первыми. Если вам написали от имени bitox
            или у вас возникли сомнения в аккаунте — сверьте его с данными на этой странице.
          </p>
        </div>

        <article class="contacts-accounts-sec__card">
        <div class="contacts-accounts-sec__avatar" aria-hidden="true" />

        <h2 class="contacts-accounts-sec__card-name">Менеджер | «ФИО»</h2>
        <p class="contacts-accounts-sec__card-role">
          Специалист по первичной обработке заявок
        </p>

        <p class="contacts-accounts-sec__card-login">
          Логин:<br>
          <a href="#">@bitox_ved</a>,
          а также
          <a href="#">@bitox_ved2</a>
        </p>

        <p class="contacts-accounts-sec__card-date">
          Дата загрузки последней фотографии в профиле: 12.05.2026
        </p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'

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
