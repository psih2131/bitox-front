const urlApi = useRuntimeConfig().public.apiUrl
const PAGE_SIZE = 100

interface ServerItems {
  data: ServerItem[]
  meta: {
    pagination?: {
      pageCount?: number
      total?: number
    }
  }
}

interface ServerItem {
  id: number
  slug: string
  updatedAt: string
}

function transfersUrl(page: number) {
  return `${urlApi}/api/transfers-pages?status=published&pagination[pageSize]=${PAGE_SIZE}&pagination[page]=${page}`
}

export default defineSitemapEventHandler(async () => {
  try {
    const firstPage = await $fetch<ServerItems>(transfersUrl(1))

    if (!firstPage || !Array.isArray(firstPage.data)) return []

    const pageCount = firstPage.meta?.pagination?.pageCount ?? 1
    const items = [...firstPage.data]

    for (let page = 2; page <= pageCount; page++) {
      const nextPage = await $fetch<ServerItems>(transfersUrl(page))

      if (Array.isArray(nextPage?.data)) {
        items.push(...nextPage.data)
      }
    }

    return items.map((post: ServerItem) => ({
      loc: `/transfers/${post.slug}`,
      lastmod: post.updatedAt,
      changefreq: 'weekly',
      priority: 0.7,
    }))
  } catch (error) {
    console.error(error)
    return []
  }
})
