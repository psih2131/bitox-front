import type { SitemapUrlInput } from '#sitemap/types'

const urlApi = useRuntimeConfig().public.apiUrl

interface BlogPost {
    data: [],
    meta: any
}

interface BlogPostData {
    id: number
    slug: string
    updatedAt: string
}

export default defineSitemapEventHandler(async () => {
    try {
        const posts = await $fetch<BlogPost>(`${urlApi}/api/blog-posts?status=published`)

        if (!posts || !Array.isArray(posts.data)) return []

        return posts.data.map((post: BlogPostData) => ({
            loc: `${urlApi}/blog/${post.slug}`,       // локальный маршрут
            lastmod: post.updatedAt,                // дата последнего изменения
            changefreq: 'weekly',
            priority: 0.7
        }))
        
    } catch (error) {
        console.error(error)
        return []
    }

   
}) 