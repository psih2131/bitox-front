export const services = [
  {
    slug: 'international-transfers',
    title: 'Международные переводы',
    subtitle: 'Платежи в 70+ стран',
    description: 'Переводим средства за рубеж с полным комплаенс-сопровождением, прозрачными условиями и персональным менеджером на каждом этапе сделки.',
    category: 'business',
  },
  {
    slug: 'invoice-payment',
    title: 'Оплата инвойсов',
    heroTitle: 'Оплата инвойсов за границу',
    subtitle: 'Оплата счетов поставщикам',
    description: 'Платежи поставщикам за товары и услуги в 180+ стран. Комиссия от 0,5%, срок проведения — от 2 часов.',
    category: 'business',
  },
  {
    slug: 'currency-control',
    title: 'Валютный контроль',
    subtitle: 'Валютные операции под ключ',
    description: 'Берём на себя валютный контроль и сопровождение сделки — от подготовки документов до зачисления средств.',
    category: 'business',
  },
  {
    slug: 'corporate-compliance',
    title: 'Корпоративный комплаенс',
    subtitle: 'Проверка контрагентов',
    description: 'Проверяем контрагентов и платёжные маршруты, чтобы снизить риски и обеспечить соответствие требованиям регуляторов.',
    category: 'business',
  },
  {
    slug: 'bulk-payments',
    title: 'Массовые выплаты',
    subtitle: 'Выплаты в один клик',
    description: 'Организуем массовые выплаты сотрудникам, партнёрам и подрядчикам — быстро, прозрачно и с полным отчётом по операциям.',
    category: 'business',
  },
  {
    slug: 'abroad-transfer',
    title: 'Перевод за рубеж',
    subtitle: 'Отправка средств за границу',
    description: 'Помогаем частным клиентам отправлять деньги за границу с понятным процессом и сопровождением до зачисления.',
    category: 'private',
  },
  {
    slug: 'currency-receipt',
    title: 'Получение валюты',
    subtitle: 'Зачисление без лишних шагов',
    description: 'Организуем получение валюты с минимальным количеством действий и прозрачными условиями зачисления.',
    category: 'private',
  },
  {
    slug: 'currency-exchange',
    title: 'Обмен валюты',
    subtitle: 'Выгодный курс без скрытых комиссий',
    description: 'Обмениваем валюту по выгодному курсу без скрытых комиссий и с понятным расчётом итоговой суммы.',
    category: 'private',
  },
  {
    slug: 'crypto-operations',
    title: 'Криптооперации',
    subtitle: 'Покупка и продажа криптовалюты',
    description: 'Проводим операции с криптовалютой с сопровождением специалиста и контролем рисков на каждом этапе.',
    category: 'private',
  },
  {
    slug: 'personal-manager',
    title: 'Личный менеджер',
    subtitle: 'Сопровождение на каждом этапе',
    description: 'Назначаем персонального менеджера, который ведёт сделку от первого запроса до успешного завершения платежа.',
    category: 'private',
  },
]

export function getServiceBySlug(slug) {
  return services.find((service) => service.slug === slug) ?? null
}
