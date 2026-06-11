<template>
  <section ref="sectionRef" class="exchange-calc-sec">
    <div class="container">
      <div class="exchange-calc-sec__layout">
        <div class="exchange-calc-sec__form-card">
          <h2 class="exchange-calc-sec__title">Калькулятор заявки</h2>

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
            <template v-if="activeTab === 'cashless'">
              <div class="exchange-calc-sec__row exchange-calc-sec__row--2">
                <label class="exchange-calc-sec__field">
                  <span class="exchange-calc-sec__label">Отдаете</span>
                  <div class="exchange-calc-sec__select-wrap">
                    <select v-model="cashless.give" class="exchange-calc-sec__select">
                      <option>СБП (Сбербанк)</option>
                      <option>СБП (Тинькофф)</option>
                    </select>
                  </div>
                </label>

                <label class="exchange-calc-sec__field">
                  <span class="exchange-calc-sec__label">Получаете</span>
                  <div class="exchange-calc-sec__select-wrap">
                    <select v-model="cashless.receive" class="exchange-calc-sec__select">
                      <option>Tether TRC20</option>
                      <option>Tether ERC20</option>
                    </select>
                  </div>
                </label>
              </div>

              <label class="exchange-calc-sec__field">
                <span class="exchange-calc-sec__label">Страна</span>
                <div class="exchange-calc-sec__select-wrap">
                  <select v-model="cashless.country" class="exchange-calc-sec__select">
                    <option>Россия</option>
                    <option>Казахстан</option>
                  </select>
                </div>
              </label>

              <label class="exchange-calc-sec__field">
                <span class="exchange-calc-sec__label">Сумма</span>
                <div class="exchange-calc-sec__input-wrap">
                  <input
                    v-model="cashless.amount"
                    type="text"
                    class="exchange-calc-sec__input"
                    inputmode="numeric"
                  />
                  <span class="exchange-calc-sec__suffix">₽</span>
                </div>
              </label>
            </template>

            <template v-else-if="activeTab === 'cash'">
              <div class="exchange-calc-sec__row exchange-calc-sec__row--2">
                <label class="exchange-calc-sec__field">
                  <span class="exchange-calc-sec__label">Отдаете</span>
                  <div class="exchange-calc-sec__select-wrap">
                    <select v-model="cash.give" class="exchange-calc-sec__select">
                      <option>RUB наличные</option>
                      <option>USD наличные</option>
                    </select>
                  </div>
                </label>

                <label class="exchange-calc-sec__field">
                  <span class="exchange-calc-sec__label">Получаете</span>
                  <div class="exchange-calc-sec__select-wrap">
                    <select v-model="cash.receive" class="exchange-calc-sec__select">
                      <option>Tether TRC20</option>
                      <option>Bitcoin</option>
                    </select>
                  </div>
                </label>
              </div>

              <div class="exchange-calc-sec__row exchange-calc-sec__row--2">
                <label class="exchange-calc-sec__field">
                  <span class="exchange-calc-sec__label">Страна</span>
                  <div class="exchange-calc-sec__select-wrap">
                    <select v-model="cash.country" class="exchange-calc-sec__select">
                      <option>Россия</option>
                      <option>ОАЭ</option>
                    </select>
                  </div>
                </label>

                <label class="exchange-calc-sec__field">
                  <span class="exchange-calc-sec__label">Город</span>
                  <div class="exchange-calc-sec__select-wrap">
                    <select v-model="cash.city" class="exchange-calc-sec__select">
                      <option>Москва</option>
                      <option>Санкт-Петербург</option>
                    </select>
                  </div>
                </label>
              </div>

              <label class="exchange-calc-sec__field">
                <span class="exchange-calc-sec__label">Сумма</span>
                <div class="exchange-calc-sec__input-wrap">
                  <input
                    v-model="cash.amount"
                    type="text"
                    class="exchange-calc-sec__input"
                    inputmode="numeric"
                  />
                </div>
              </label>
            </template>

            <template v-else>
              <div class="exchange-calc-sec__row exchange-calc-sec__row--2">
                <label class="exchange-calc-sec__field">
                  <span class="exchange-calc-sec__label">Страна</span>
                  <div class="exchange-calc-sec__select-wrap">
                    <select v-model="invoice.country" class="exchange-calc-sec__select">
                      <option>Китай</option>
                      <option>Турция</option>
                    </select>
                  </div>
                </label>

                <label class="exchange-calc-sec__field">
                  <span class="exchange-calc-sec__label">Валюта</span>
                  <div class="exchange-calc-sec__select-wrap">
                    <select v-model="invoice.currency" class="exchange-calc-sec__select">
                      <option>CNY (юань) ¥</option>
                      <option>USD $</option>
                    </select>
                  </div>
                </label>
              </div>

              <div class="exchange-calc-sec__row exchange-calc-sec__row--2">
                <label class="exchange-calc-sec__field">
                  <span class="exchange-calc-sec__label">Сумма</span>
                  <div class="exchange-calc-sec__input-wrap">
                    <input
                      v-model="invoice.amount"
                      type="text"
                      class="exchange-calc-sec__input"
                      inputmode="numeric"
                    />
                    <span class="exchange-calc-sec__suffix">¥</span>
                  </div>
                </label>

                <label class="exchange-calc-sec__field">
                  <span class="exchange-calc-sec__label">За что оплата</span>
                  <div class="exchange-calc-sec__select-wrap">
                    <select v-model="invoice.purpose" class="exchange-calc-sec__select">
                      <option>Оборудование</option>
                      <option>Товары</option>
                      <option>Услуги</option>
                    </select>
                  </div>
                </label>
              </div>

              <label class="exchange-calc-sec__field">
                <span class="exchange-calc-sec__label">Комментарий</span>
                <div class="exchange-calc-sec__textarea-wrap">
                  <textarea
                    v-model="invoice.comment"
                    class="exchange-calc-sec__textarea"
                    rows="4"
                    placeholder="Дополнительная информация по инвойсу"
                  />
                </div>
              </label>
            </template>
          </form>
        </div>

        <aside class="exchange-calc-sec__sidebar">
          <h3 class="exchange-calc-sec__sidebar-title">Результат</h3>

          <template v-if="activeTab === 'cashless'">
            <div class="exchange-calc-sec__result-block">
              <p class="exchange-calc-sec__result-label">Отдаете</p>
              <p class="exchange-calc-sec__result-value">{{ cashless.amount }} ₽</p>
              <p class="exchange-calc-sec__result-note">Через СБП</p>
            </div>

            <div class="exchange-calc-sec__result-block">
              <p class="exchange-calc-sec__result-label">Курс</p>
              <p class="exchange-calc-sec__result-value">1 USDT = 93.65 ₽</p>
              <p class="exchange-calc-sec__result-note">Зафиксирован на 15 мин</p>
            </div>

            <div class="exchange-calc-sec__result-block exchange-calc-sec__result-block--accent">
              <p class="exchange-calc-sec__result-label">Получаете</p>
              <p class="exchange-calc-sec__result-value">≈ 803 USDT</p>
              <p class="exchange-calc-sec__result-note">{{ cashless.receive }}</p>
            </div>
          </template>

          <template v-else-if="activeTab === 'cash'">
            <div class="exchange-calc-sec__info-box">
              <p class="exchange-calc-sec__info-title">Курс наличного обмена</p>
              <p class="exchange-calc-sec__info-text">
                Курс зависит от города, объёма и времени сделки. Точную сумму
                получения менеджер сообщит в Telegram.
              </p>
            </div>

            <div class="exchange-calc-sec__params">
              <p class="exchange-calc-sec__params-title">Параметры заявки</p>

              <div class="exchange-calc-sec__params-row">
                <span>Отдаете</span>
                <strong>{{ cash.amount }} ₽ наличными</strong>
              </div>
              <div class="exchange-calc-sec__params-row">
                <span>Получаете</span>
                <strong>{{ cash.receive }}</strong>
              </div>
              <div class="exchange-calc-sec__params-row">
                <span>Локация</span>
                <strong>{{ cash.country }}, {{ cash.city }}</strong>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="exchange-calc-sec__info-box">
              <p class="exchange-calc-sec__info-title">Оплата инвойса по запросу</p>
              <p class="exchange-calc-sec__info-text">
                Менеджер проверит инвойс, рассчитает курс и согласует детали
                в Telegram.
              </p>
            </div>

            <div class="exchange-calc-sec__params">
              <p class="exchange-calc-sec__params-title">Данные инвойса</p>

              <div class="exchange-calc-sec__params-row">
                <span>Страна</span>
                <strong>{{ invoice.country }}</strong>
              </div>
              <div class="exchange-calc-sec__params-row">
                <span>Валюта</span>
                <strong>{{ invoice.currency }}</strong>
              </div>
              <div class="exchange-calc-sec__params-row">
                <span>Сумма</span>
                <strong>{{ invoice.amount }} ¥</strong>
              </div>
              <div class="exchange-calc-sec__params-row">
                <span>За что</span>
                <strong>{{ invoice.purpose }}</strong>
              </div>
            </div>
          </template>

          <p
            v-if="activeTab === 'cashless'"
            class="exchange-calc-sec__sidebar-text"
          >
            Перейдите в Telegram, чтобы оформить заявку
          </p>

          <AppClientBtn class="exchange-calc-sec__sidebar-btn">
            Перейти к заявке в Telegram
          </AppClientBtn>
        </aside>
      </div>
    </div>
  </section>
</template>

<script setup>
import gsap from 'gsap'

const sectionRef = ref(null)

const tabs = [
  { id: 'cashless', label: 'Безналичный' },
  { id: 'cash', label: 'Наличный' },
  { id: 'invoice', label: 'Оплата инвойсов' },
]

const activeTab = ref('cashless')

const cashless = reactive({
  give: 'СБП (Сбербанк)',
  receive: 'Tether TRC20',
  country: 'Россия',
  amount: '75 200',
})

const cash = reactive({
  give: 'RUB наличные',
  receive: 'Tether TRC20',
  country: 'Россия',
  city: 'Москва',
  amount: '150 000',
})

const invoice = reactive({
  country: 'Китай',
  currency: 'CNY (юань) ¥',
  amount: '120 000',
  purpose: 'Оборудование',
  comment: '',
})

let sectionAnimation

onMounted(() => {
  if (!sectionRef.value) return

  sectionAnimation = gsap.context(() => {
    gsap.from('.exchange-calc-sec__layout', {
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power2.out',
    })
  }, sectionRef.value)
})

onUnmounted(() => {
  sectionAnimation?.revert()
})
</script>
