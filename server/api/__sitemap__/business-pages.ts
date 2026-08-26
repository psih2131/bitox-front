import type { SitemapUrlInput } from '#sitemap/types'

const urlApi = useRuntimeConfig().public.apiUrl

interface ServerItems {
    data: [],
    meta: any
}

interface ServerItem {
    id: number
    slug: string
    updatedAt: string
}

export default defineSitemapEventHandler(async () => {
    try {
        const posts = await $fetch<ServerItems>(`${urlApi}/api/business-pages?status=published`)

        if (!posts || !Array.isArray(posts.data)) return []

        return posts.data.map((post: ServerItem) => ({
            loc: `${urlApi}/business/${post.slug}`,       // локальный маршрут
            lastmod: post.updatedAt,                // дата последнего изменения
            changefreq: 'weekly',
            priority: 0.7
        }))
        
    } catch (error) {
        console.error(error)
        return []
    }

   
}) 