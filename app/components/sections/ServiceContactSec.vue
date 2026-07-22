<template>
  <section ref="sectionRef" class="service-contact-sec">
    <div class="container service-contact-sec__inner">
      <div class="service-contact-sec__content">
        <h2 class="service-contact-sec__title">
          Ваша задача —<br />
          наше решение
        </h2>

        <p class="service-contact-sec__subtitle">
          Оставьте заявку, а мы сделаем остальное
        </p>
      </div>

      <form class="service-contact-sec__form" @submit.prevent="handleSubmit">
        <label class="service-contact-sec__field service-contact-sec__field--full">
          <input
            v-model="firstName"
            type="text"
            class="service-contact-sec__input"
            placeholder="Как к вам обращаться?"
            autocomplete="name"
            aria-label="Как к вам обращаться?"
          />
        </label>

        <label class="service-contact-sec__field service-contact-sec__field--full">
          <input
            v-model="phone"
            type="tel"
            class="service-contact-sec__input"
            placeholder="+7 999 999 99 99"
            autocomplete="tel"
            aria-label="Телефон"
          />
        </label>

        <label class="service-contact-sec__checkbox">
          <input v-model="consent" type="checkbox" />
          <span class="service-contact-sec__checkbox-text">
            Отправляя данную форму, вы подтверждаете
            <a href="#">Согласие на обработку персональных данных</a>
            в соответствии с
            <a href="#">Условиями использования</a>
          </span>
        </label>

        <button
          type="submit"
          class="app-client-btn service-contact-sec__submit"
          :disabled="!canSubmit || isSubmitting"
        >
          {{ isSubmitting ? 'Отправка...' : 'Стать клиентом' }}
        </button>
      </form>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'

const sectionRef = ref(null)
const { isSubmitting, submit } = useFormSubmit()

const firstName = ref('')
const phone = ref('')
const consent = ref(false)

const canSubmit = computed(
  () => consent.value && phone.value.trim(),
)

async function handleSubmit() {
  if (!canSubmit.value || isSubmitting.value) return

  const success = await submit('/api/forms/contact', {
    title_form: 'Стать клиентом',
    firstName: firstName.value.trim(),
    phone: phone.value.trim(),
    consent: consent.value,
  })

  if (!success) return

  firstName.value = ''
  phone.value = ''
  consent.value = false
}

let sectionAnimation

onMounted(() => {
  if (!sectionRef.value) return

  sectionAnimation = gsap.context(() => {
    gsap.from('.service-contact-sec__content', {
      opacity: 0,
      x: -24,
      duration: 0.7,
      ease: 'power2.out',
    })

    gsap.from('.service-contact-sec__form', {
      opacity: 0,
      x: 24,
      duration: 0.7,
      delay: 0.1,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  sectionAnimation?.revert()
})
</script>
