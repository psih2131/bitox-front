import { defineSitemapEventHandler } from '#imports'

const urlApi = useRuntimeConfig().public.apiUrl

export default defineSitemapEventHandler(() => {
    return [
        { loc: `${urlApi}`, _sitemap: 'pages' },
        { loc: `${urlApi}/business`, _sitemap: 'pages' },
        { loc: `${urlApi}/individuals`, _sitemap: 'pages' },
        { loc: `${urlApi}/transfers`, _sitemap: 'pages' },
        { loc: `${urlApi}/crypto-exchange`, _sitemap: 'pages' },
        { loc: `${urlApi}/about`, _sitemap: 'pages' },
        { loc: `${urlApi}/partners`, _sitemap: 'pages' },
        { loc: `${urlApi}/contacts`, _sitemap: 'pages' },
        { loc: `${urlApi}/blog`, _sitemap: 'pages' },
        { loc: `${urlApi}/exchange`, _sitemap: 'pages' },
        { loc: `${urlApi}/business/invoice`, _sitemap: 'pages' },

    ] 
})