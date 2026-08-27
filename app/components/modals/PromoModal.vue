<template>
  <div class="promo-modal" role="dialog" aria-modal="true" aria-labelledby="promo-modal-title">
    <button
      type="button"
      class="promo-modal__close"
      aria-label="Закрыть"
      @click="modalStore.close()"
    >
      <img :src="closeIcon" alt="" width="24" height="24" />
    </button>

    <div class="promo-modal__content">
      <h2 id="promo-modal-title" class="promo-modal__title">
        {{ title }}
      </h2>

      <p v-if="text" class="promo-modal__text">
        {{ text }}
      </p>

      <form class="promo-modal__form" @submit.prevent="handleSubmit">
        <label class="promo-modal__field">
          <span class="promo-modal__label">Номер телефона</span>

          <div class="promo-modal__control">
            <img :src="flagRu" alt="" class="promo-modal__flag" width="21" height="21" />
            <input
              :value="phone"
              type="tel"
              maxlength="18"
              inputmode="numeric"
              class="promo-modal__input"
              placeholder="+7 (999) 999 99 99"
              autocomplete="tel"
              @keydown="onPhoneKeydown"
              @input="onPhoneInput"
            />
          </div>
        </label>

        <button
          type="submit"
          class="app-btn promo-modal__submit"
          :disabled="!canSubmit || isSubmitting"
        >
          {{ isSubmitting ? 'Отправка...' : 'Получить консультацию и скидку до 50%' }}
        </button>

        <label class="promo-modal__checkbox">
          <input v-model="personalConsent" type="checkbox" />
          <span class="promo-modal__checkbox-text">
            Я даю согласие на обработку своих персональных данных
          </span>
        </label>

        <label class="promo-modal__checkbox">
          <input v-model="offerConsent" type="checkbox" />
          <span class="promo-modal__checkbox-text">
            Согласен с условиями публичной оферты о заключении договора оказания
            информационно-консультационных услуг
          </span>
        </label>
      </form>

      <div class="promo-modal__footer">
        <p class="promo-modal__footer-text">
          Если вопрос срочный — свяжитесь с нами прямо сейчас
        </p>

        <div class="promo-modal__contacts">
          <a
            v-if="telegramHref"
            :href="telegramHref"
            class="promo-modal__contact"
            :target="isExternalTelegram ? '_blank' : undefined"
            :rel="isExternalTelegram ? 'noopener noreferrer' : undefined"
          >
            <img :src="telegramIcon" alt="" width="15" height="14" />
            <span>Telegram</span>
          </a>

          <a
            v-if="phoneDisplay"
            :href="phoneHref"
            class="promo-modal__contact"
          >
            <img :src="phoneIcon" alt="" width="14" height="14" />
            <span>{{ phoneDisplay }}</span>
          </a>
        </div>
      </div>
    </div>

    <div v-if="imageUrl" class="promo-modal__visual" aria-hidden="true">
      <img :src="imageUrl" alt="" class="promo-modal__image" width="252" height="377" />
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useModalStore } from '~/stores/modal'
import { getStrapiMediaUrl } from '~/utils/strapi'
import flagRu from '~/assets/images/flags/russian.png'
import closeIcon from '~/assets/images/promo-modal/close.svg'
import telegramIcon from '~/assets/images/promo-modal/telegram.svg'
import phoneIcon from '~/assets/images/promo-modal/phone.svg'

const DEFAULT_TITLE = 'Оплата в любую точку мира'
const DEFAULT_TEXT = 'Скидка до 50% на первый платёж и бесплатная консультация по вашему вопросу. Проведём платёж туда, где банки бессильны — с комиссией от 0,5%.'
const DEFAULT_PHONE_DISPLAY = '+7 995 114 72 49'
const DEFAULT_PHONE_HREF = 'tel:+79951147249'

const modalStore = useModalStore()
const counterStore = useCounterStore()
const { globalInfo } = storeToRefs(counterStore)
const { isSubmitting, submit } = useFormSubmit()
const urlApi = useRuntimeConfig().public.apiUrl

const modalData = computed(() => globalInfo.value?.modal_30_sec ?? null)

const title = computed(() => modalData.value?.title?.trim() || DEFAULT_TITLE)
const text = computed(() => modalData.value?.text?.trim() || DEFAULT_TEXT)

const telegramHref = computed(() => modalData.value?.telegram_link?.trim() || '')
const isExternalTelegram = computed(() => /^https?:\/\//i.test(telegramHref.value))

const phoneDisplay = computed(() => modalData.value?.phone?.trim() || DEFAULT_PHONE_DISPLAY)

const phoneHref = computed(() => {
  const link = modalData.value?.phone_link?.trim()
  if (!link) return DEFAULT_PHONE_HREF
  if (/^(tel:|https?:\/\/)/i.test(link)) return link
  return `tel:${link.replace(/[^\d+]/g, '')}`
})

const imageUrl = computed(
  () => getStrapiMediaUrl(modalData.value?.image, urlApi) || '',
)

const phone = ref('+7 ')
const personalConsent = ref(true)
const offerConsent = ref(false)

const canSubmit = computed(
  () => phone.value.replace(/\D/g, '').length === 11 && personalConsent.value && offerConsent.value,
)

function onPhoneKeydown(event) {
  const allowed = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
  if (allowed.includes(event.key) || event.ctrlKey || event.metaKey) return
  if (!/^\d$/.test(event.key)) event.preventDefault()
}

function onPhoneInput({ target }) {
  const n = target.value.replace(/\D/g, '').replace(/^7|^8/, '').slice(0, 10)
  phone.value = n
    ? `+7 (${n.slice(0, 3)}${n.length > 3 ? `) ${n.slice(3, 6)}` : ''}${n.length > 6 ? ` ${n.slice(6, 8)}` : ''}${n.length > 8 ? ` ${n.slice(8, 10)}` : ''}`
    : '+7 '
  target.value = phone.value
}

async function handleSubmit() {
  if (isSubmitting.value) return

  await submit('/api/forms/consultation', {
    title_form: 'Промо: скидка до 50%',
    phone: phone.value.trim(),
    personalConsent: personalConsent.value,
    offerConsent: offerConsent.value,
    marketingConsent: false,
  }, {
    yandexGoal: 'popup_success',
    validate: () => canSubmit.value,
  })
}
</script>
