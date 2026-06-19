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
            <div
              v-for="item in navItems"
              :key="item.label"
              class="header__nav-item"
              :class="{ 'header__nav-item--has-mega': item.mega?.length }"
            >
              <NuxtLink :to="item.to" class="header__nav-link">
                {{ item.label }}
              </NuxtLink>

              <div v-if="item.mega?.length" class="header__mega">
                <div class="container">
                  <div class="header__mega-inner">
                    <div
                      v-for="card in item.mega"
                      :key="card.id"
                      class="header__mega-card"
                    >
                      <p v-if="card.title" class="header__mega-card-title">{{ card.title }}</p>

                      <ul v-if="card.links.length" class="header__mega-list">
                        <li v-for="link in card.links" :key="link.key">
                          <NuxtLink :to="link.to" class="header__mega-link">
                            {{ link.label }}
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
          </nav>

          <AppButton @click="openConsultationModal">{{ header?.ctr_button_text }}</AppButton>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useModalStore, MODAL_NAMES } from '~/stores/modal'

const urlApi = useRuntimeConfig().public.apiUrl

const { data: headerResponse } = await useFetch(
  `${urlApi}/api/header-component?populate[header_contacts_list]=true`,
)

const header = computed(() => headerResponse.value?.data)

const contacts = computed(() => header.value?.header_contacts_list ?? [])

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

const businessMega = [
  {
    id: 'business-1',
    title: 'Импортерам',
    links: [
      { key: 'business-invoice', label: 'Оплата инвойсов', to: '/business/invoice' },
      { key: 'business-contract', label: 'Оплата валютного контракта', to: '/business/oplata-valyutnogo-kontrakta' },
      { key: 'business-consulting', label: 'Консалтинг ВЭД', to: '/business/konsalting-ved' },
    ],
  },
  {
    id: 'business-2',
    title: 'Экспортерам',
    links: [
      { key: 'business-return', label: 'Возврат валютной выручки', to: '/business/vozvrat-valyutnoj-vyruchki' },
    ],
  },
]

// TODO: заменить ссылки на реальные страницы, когда они будут готовы
const privateClientsMega = [
  {
    id: 'private-1',
    title: 'Покупка и продажа',
    links: [
      { key: 'private-buy', label: 'Покупка криптовалюты', to: '/' },
      { key: 'private-sell', label: 'Продажа криптовалюты', to: '/' },
      { key: 'private-exchange', label: 'Обмен валют', to: '/' },
    ],
  },
  {
    id: 'private-2',
    title: 'Хранение и сервис',
    links: [
      { key: 'private-storage', label: 'Безопасное хранение', to: '/' },
      { key: 'private-wallet', label: 'Создание кошелька', to: '/' },
      { key: 'private-support', label: 'Поддержка 24/7', to: '/' },
    ],
  },
]

const navItems = computed(() => [
  { label: 'Бизнесу', to: '/business', mega: businessMega },
  { label: 'Частным клиентам', to: '/', mega: privateClientsMega },
  { label: 'Международные расчеты', to: '/' },
  { label: 'Обмен криптовалюты', to: '/exchange' },
  { label: 'Блог', to: '/blog' },
  { label: 'Контакты', to: '/contacts' },
  { label: 'о Bitox', to: '/about' },
])
</script>
