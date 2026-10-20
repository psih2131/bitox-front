const urlApi = useRuntimeConfig().public.apiUrl

// Админка отдаёт не больше 100 записей за запрос, поэтому забираем список порциями по 100
const PAGE_SIZE = 100

interface ServerItem {
  id: number
  slug: string
  updatedAt: string
}

interface ServerItems {
  data: ServerItem[]
  meta: {
    pagination?: {
      pageCount?: number
    }
  }
}

function pageUrl(page: number) {
  return `${urlApi}/api/business-pages?status=published&pagination[pageSize]=${PAGE_SIZE}&pagination[page]=${page}`
}

export default defineSitemapEventHandler(async () => {
  try {
    const firstPage = await $fetch<ServerItems>(pageUrl(1))

    if (!firstPage || !Array.isArray(firstPage.data)) return []

    const pageCount = firstPage.meta?.pagination?.pageCount ?? 1
    const items = [...firstPage.data]

    for (let page = 2; page <= pageCount; page++) {
      const nextPage = await $fetch<ServerItems>(pageUrl(page))

      if (Array.isArray(nextPage?.data)) {
        items.push(...nextPage.data)
      }
    }

    return items.map((item) => ({
      loc: `${urlApi}/business/${item.slug}`,
      lastmod: item.updatedAt,
      changefreq: 'weekly',
      priority: 0.7,
    }))
  } catch (error) {
    console.error(error)
    return []
  }
})
