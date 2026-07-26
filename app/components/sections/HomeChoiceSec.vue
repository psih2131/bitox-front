<template>
  <section v-if="rows.length" class="choice-sec">
    <div class="container">
      <h2 class="choice-sec__title">{{ sectionTitle }}</h2>

      <div class="choice-sec__table" role="table" aria-label="Сравнение Bitox с банками и другими сервисами">
        <div class="choice-sec__head">
          <div class="choice-sec__row choice-sec__row--head" role="row">
            <div class="choice-sec__cell choice-sec__cell--label" role="columnheader" />
            <div
              class="choice-sec__cell choice-sec__cell--col-bitox choice-sec__cell--head-bitox"
              role="columnheader"
            >
              Bitox
            </div>
            <div class="choice-sec__cell choice-sec__cell--head" role="columnheader">
              Банки
            </div>
            <div class="choice-sec__cell choice-sec__cell--head" role="columnheader">
              Другие сервисы
            </div>
          </div>
        </div>

        <div class="choice-sec__body">
          <div
            v-for="(row, index) in rows"
            :key="row.id ?? row.label"
            class="choice-sec__row"
            :class="index % 2 === 0 ? 'choice-sec__row--odd' : 'choice-sec__row--even'"
            role="row"
          >
            <div class="choice-sec__cell choice-sec__cell--label" role="rowheader">
              {{ row.label }}
            </div>

            <div
              class="choice-sec__cell choice-sec__cell--col-bitox choice-sec__cell--value"
              role="cell"
            >
              <span class="choice-sec__icon choice-sec__icon--yes" aria-hidden="true">
                <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5.5L5 9.5L13 1.5" stroke="#313132" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <p class="choice-sec__text">{{ row.bitox }}</p>
            </div>

            <div class="choice-sec__cell choice-sec__cell--value" role="cell">
              <span class="choice-sec__icon choice-sec__icon--no" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L11 11M11 1L1 11" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
                </svg>
              </span>
              <p class="choice-sec__text">{{ row.banks }}</p>
            </div>

            <div class="choice-sec__cell choice-sec__cell--value" role="cell">
              <span class="choice-sec__icon choice-sec__icon--no" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L11 11M11 1L1 11" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
                </svg>
              </span>
              <p class="choice-sec__text">{{ row.others }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="choice-sec__mobile">
        <div class="choice-sec__tabs" role="tablist" aria-label="Сравнение сервисов">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            class="choice-sec__tab"
            :class="{
              'choice-sec__tab--active': activeTab === tab.id,
              'choice-sec__tab--bitox': tab.id === 'bitox',
            }"
            role="tab"
            :aria-selected="activeTab === tab.id"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="choice-sec__cards">
          <article
            v-for="(row, index) in rows"
            :key="row.id ?? row.label"
            class="choice-sec__card"
            :class="index % 2 === 0 ? 'choice-sec__card--odd' : 'choice-sec__card--even'"
          >
            <p class="choice-sec__card-label">{{ row.label }}</p>

            <div class="choice-sec__card-value">
              <span
                class="choice-sec__icon"
                :class="activeTab === 'bitox' ? 'choice-sec__icon--yes' : 'choice-sec__icon--no'"
                aria-hidden="true"
              >
                <svg
                  v-if="activeTab === 'bitox'"
                  width="14"
                  height="11"
                  viewBox="0 0 14 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1 5.5L5 9.5L13 1.5" stroke="#313132" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <svg
                  v-else
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1 1L11 11M11 1L1 11" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
                </svg>
              </span>

              <p class="choice-sec__card-text">{{ row[activeTab] }}</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const urlApi = useRuntimeConfig().public.apiUrl

const tabs = [
  { id: 'bitox', label: 'Bitox' },
  { id: 'banks', label: 'Банки' },
  { id: 'others', label: 'Другие сервисы' },
]

const activeTab = ref('bitox')

const defaultRows = [
  {
    id: 'default-1',
    label: 'Комиссия',
    bitox: 'От 0.5 + платежное поручение',
    banks: 'От 5% за платеж',
    others: 'От 3%, комиссии непрозрачны',
  },
  {
    id: 'default-2',
    label: 'Сроки платежа',
    bitox: 'Переведем от 2 часов',
    banks: 'От 5 дней и до нескольких месяцев',
    others: 'От 5 дней, возможны блокировки средств',
  },
  {
    id: 'default-3',
    label: 'Комфорт',
    bitox: 'Персональный менеджер по Телефону и в удобном для вас мессенджере, поддержка на нескольких языках',
    banks: '5/2 и контакт через почту',
    others: 'Ограниченная поддержка',
  },
  {
    id: 'default-4',
    label: 'Курс',
    bitox: 'По курсу ЦБ, без скрытых наценок',
    banks: 'Дополнительная банковская наценка ( 3-5% )',
    others: 'Условия непрозрачны',
  },
  {
    id: 'default-5',
    label: 'Возможности',
    bitox: '180+ стран, 50+ валют, нужная вам платежная система. Своя инфраструктура',
    banks: 'Ограниченные возможности банков из-за санкций',
    others: 'Выбор доступных решений невелик',
  },
]

const { data: choiceResponse } = await useFetch(
  `${urlApi}/api/choise-component?populate=table_row`,
)

const sectionTitle = computed(
  () => choiceResponse.value?.data?.title_section || 'Сделайте правильный выбор',
)

const rows = computed(() => {
  const items = choiceResponse.value?.data?.table_row

  if (!items?.length) return defaultRows

  return items
    .filter((item) => item?.title_row)
    .map((item) => ({
      id: item.id,
      label: item.title_row,
      bitox: item.value_bitox || '',
      banks: item.value_banks || '',
      others: item.value_other || '',
    }))
})
</script>
