<template>
  <section class="exchange-calc-sec">
    <div class="container">
      <div v-if="isCalcDisabled" class="exchange-calc-offline">
        <div class="exchange-calc-offline__card">
          <p class="exchange-calc-offline__badge">Сейчас калькулятор недоступен</p>
          <h2 class="exchange-calc-offline__title">
            Работаем с 10:00 до 22:00 по UTC+3
          </h2>
          <p class="exchange-calc-offline__text">
            Оставьте заявку — менеджер ответит в рабочее время и поможет
            с обменом или оплатой инвойса.
          </p>
          <AppClientBtn
            class="exchange-calc-offline__btn"
            @click="openConsultationModal"
          >
            Перейти к заявке в Telegram
          </AppClientBtn>
        </div>
      </div>

      <div v-else class="exchange-calc-sec__layout">
        <div class="exchange-calc-sec__form-card">
          <p v-if="calcTitle" class="exchange-calc-sec__title">{{ calcTitle }}</p>
          <p v-else-if="countryName" class="exchange-calc-sec__title">{{ sectionTitle }} в {{ countryName }}</p>
          <p v-else class="exchange-calc-sec__title">{{ sectionTitle }}</p>

          <div class="exchange-calc-sec__tabs" role="tablist" aria-label="Тип заявки">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              type="button"
              class="exchange-calc-sec__tab"
              :class="{ 'exchange-calc-sec__tab--active': activeTab === tab.id }"
              role="tab"
              :aria-selected="activeTab === tab.id"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>

          <form class="exchange-calc-sec__form" @submit.prevent>
            <ExchangeCalcCashlessTab
              v-if="activeTab === 'cashless'"
              :items="cashlessItems"
              :countries="cashlessCountries"
            />
            <ExchangeCalcCashTab
              v-else-if="activeTab === 'cash'"
              :items="casheItems"
              :countries="cashCountries"
            />
            <ExchangeCalcInvoiceTab v-else />
          </form>
        </div>

        <aside class="exchange-calc-sec__sidebar">
          <p class="exchange-calc-sec__sidebar-title">Результат</p>

          <div id="exchange-calc-sidebar" />

          <p
            v-if="activeTab === 'cashless'"
            class="exchange-calc-sec__sidebar-text"
          >
            Перейдите в Telegram, чтобы оформить заявку
          </p>

          <AppClientBtn class="exchange-calc-sec__sidebar-btn" @click="openConsultationModal">
            Перейти к заявке в Telegram
          </AppClientBtn>
        </aside>
      </div>
    </div>
  </section>
</template>

<script setup>
import { getCurrencyName } from '~/data/currency-names'
import ExchangeCalcCashlessTab from '~/components/exchange-calc/CashlessTab.vue'
import ExchangeCalcCashTab from '~/components/exchange-calc/CashTab.vue'
import ExchangeCalcInvoiceTab from '~/components/exchange-calc/InvoiceTab.vue'
import { sortByLabel } from '~/components/exchange-calc/location-utils'
import { useModalStore, MODAL_NAMES } from '~/stores/modal'
import { isExchangeCalcOffline } from '~/utils/isExchangeCalcOffline'

const props = defineProps({
  countryName: {
    type: String,
    default: '',
  },
  sectionTitle: {
    type: String,
    default: 'Калькулятор перевода',
  },
  calcTitle: {
    type: String,
    default: '',
  },
  openTab: {
    type: String,
    default: 'cash',
  },
})

const modalStore = useModalStore()
const isCalcDisabled = ref(false)

function openConsultationModal() {
  modalStore.open(MODAL_NAMES.consultation)
}

const urlApi = useRuntimeConfig().public.apiUrl
const casheItems = ref([])
const cashlessItems = ref([])

const tabs = [
  { id: 'cashless', label: 'Безналичный' },
  { id: 'cash', label: 'Наличный' },
  { id: 'invoice', label: 'Оплата инвойсов' },
]

function resolveOpenTab(value) {
  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i].id === value) return value
  }

  return 'invoice'
}

const activeTab = ref(resolveOpenTab(props.openTab))

const locationPopulate = [
  'populate[calc][populate][exchange_data][populate][without_cache]=true',
  'populate[calc][populate][exchange_data][populate][cache][populate][citys]=true',
].join('&')

const { data: calcResponse } = useFetch(
  `${urlApi}/api/exchange-calc-component?${locationPopulate}`,
)

const calcData = computed(() => calcResponse.value?.data?.calc?.exchange_data)
const cashlessCountries = computed(() =>
  sortByLabel(calcData.value?.without_cache ?? [], (item) => item.name_country),
)
const cashCountries = computed(() =>
  sortByLabel(calcData.value?.cache ?? [], (item) => item.name_country),
)

async function getExchangeData() {
  try {
    const data = await $fetch('/api/exchange-rates')
    return data.items || []
  } catch (error) {
    console.error('Failed to load exchange rates', error)
    return []
  }
}

function sortItems(items) {
  casheItems.value = []
  cashlessItems.value = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const newItem = {
      nameRuFrom: getCurrencyName(item.from),
      nameRuTo: getCurrencyName(item.to),
      ...item,
    }

    if (item.from.includes('CASH')) {
      casheItems.value.push(newItem)
    } else {
      cashlessItems.value.push(newItem)
    }
  }
}

onMounted(async () => {
  isCalcDisabled.value = isExchangeCalcOffline()

  if (isCalcDisabled.value) return

  const items = await getExchangeData()
  sortItems(items)
})
</script>
