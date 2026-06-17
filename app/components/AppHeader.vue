<template>
  <header class="header">
    <div class="header__top">
      <div class="container">
        <div class="header__top-inner">
          <div class="header__top-left">
            <div v-if="header?.address" class="header__location">
              <svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 0C2.01866 0 0 1.87171 0 4.17241C0 8.11762 4.09132 10.8183 4.26549 10.9314C4.33585 10.9772 4.41808 11 4.5 11C4.58192 11 4.66415 10.9772 4.73451 10.9314C4.90868 10.8183 9 8.11762 9 4.17241C9 1.87171 6.98134 0 4.5 0ZM4.5 6.06897C3.37224 6.06897 2.45455 5.21808 2.45455 4.17241C2.45455 3.12675 3.37224 2.27586 4.5 2.27586C5.62776 2.27586 6.54545 3.12675 6.54545 4.17241C6.54545 5.21808 5.62776 6.06897 4.5 6.06897Z" fill="#FFDD2D" />
              </svg>

              <span>{{ header.address }}</span>
            </div>

            <div v-if="header?.time_work" class="header__time">
              <span>{{ header.time_work }}</span>
            </div>
          </div>

          <div class="header__top-right">
            <a
              v-for="contact in contacts"
              :key="contact.id"
              :href="contact.link || '#'"
              class="header__contact"
              :class="{ 'header__contact--phone': isPhoneContact(contact) }"
            >
              <span v-if="contact.svg_icon" v-html="contact.svg_icon" />
              <span>{{ contact.text }}</span>
            </a>

            <button
              v-if="header?.call_btn_text"
              type="button"
              class="header__callback"
              @click="openCallbackModal"
            >
              {{ header.call_btn_text }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="header__main">
      <div class="container">
        <div class="header__main-inner">
          <NuxtLink to="/" class="header__logo">{{ header?.text_logo }}</NuxtLink>

          <nav class="header__nav">
            <div class="header__nav-dropdown header__nav-dropdown--services">
              <span class="header__nav-link header__nav-dropdown-toggle">Бизнесу</span>
            </div>

            <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="header__nav-link"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>

          <AppButton @click="openConsultationModal">{{ header?.ctr_button_text }}</AppButton>
        </div>
      </div>

      <div v-if="serviceCategories.length" class="header__mega">
        <div class="container">
          <div class="header__mega-inner">
            <div
              v-for="category in serviceCategories"
              :key="category.id"
              class="header__mega-card"
            >
              <p v-if="category.title" class="header__mega-card-title">{{ category.title }}</p>

              <ul v-if="category.services.length" class="header__mega-list">
                <li
                  v-for="service in category.services"
                  :key="service.documentId"
                >
                  <NuxtLink
                    :to="{
                      path: `/services/${service.slug}`,
                      query: { id: service.documentId },
                    }"
                    class="header__mega-link"
                  >
                    {{ service.title }}
                  </NuxtLink>
                </li>
              </ul>
            </div>

            <div class="header__mega-cta">
              <AppBannerBtn type="button" @click="openConsultationModal">
                Заказать консультацию
              </AppBannerBtn>
              <p class="header__mega-cta-text">
                Подберем оптимальное решение вашей задачи
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useModalStore, MODAL_NAMES } from '~/stores/modal'
import { mapStrapiServiceCategories } from '~/utils/strapi'

const urlApi = useRuntimeConfig().public.apiUrl

const [{ data: headerResponse }, { data: categoriesResponse }] = await Promise.all([
  useFetch(`${urlApi}/api/header-component?populate[header_contacts_list]=true`),
  useFetch(`${urlApi}/api/services-categories?populate[services]=true&pagination[pageSize]=100`),
])

const header = computed(() => headerResponse.value?.data)

const contacts = computed(() => header.value?.header_contacts_list ?? [])

const serviceCategories = computed(() =>
  mapStrapiServiceCategories(categoriesResponse.value?.data ?? [], urlApi),
)

function isPhoneContact(contact) {
  return contact.link?.startsWith('tel:')
}

const modalStore = useModalStore()

function openConsultationModal() {
  modalStore.open(MODAL_NAMES.consultation)
}

function openCallbackModal() {
  modalStore.open(MODAL_NAMES.callback)
}

const navLinks = [
  { label: 'Партнерская программа', to: '/partners' },
  { label: 'Обмен криптовалюты', to: '/exchange' },
  { label: 'Блог', to: '/blog' },
  { label: 'Контакты', to: '/contacts' },
  { label: 'о Bitox', to: '/about' },
]
</script>
