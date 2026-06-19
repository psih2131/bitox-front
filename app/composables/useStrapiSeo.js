import { formatSeoRobots, getStrapiMediaUrl } from '~/utils/strapi'

export function useStrapiSeo(seo, options = {}) {
  const {
    apiUrl,
    fallbackTitle = 'Bitox',
    fallbackDescription = 'Bitox',
    fallbackOgType = 'website',
    fallbackOgImage = null,
  } = options

  const route = useRoute()
  const requestUrl = useRequestURL()

  const title = seo?.metaTitle || fallbackTitle
  const description = seo?.metaDescription || fallbackDescription
  const ogImage = getStrapiMediaUrl(seo?.shareImage, apiUrl) || fallbackOgImage
  const twitterImage = getStrapiMediaUrl(seo?.twitterImage, apiUrl) || ogImage
  const canonicalUrl = seo?.canonicalUrl || `${requestUrl.origin}${route.fullPath}`
  const ogUrl = seo?.ogUrl || canonicalUrl

  useSeoMeta({
    title,
    description,
    keywords: seo?.keywords || undefined,
    robots: formatSeoRobots(seo?.metaRobots),
    ogTitle: seo?.ogTitle || title,
    ogDescription: seo?.ogDescription || description,
    ogType: seo?.ogType || fallbackOgType,
    ogUrl,
    ogImage: ogImage || undefined,
    twitterCard: seo?.twitterCard || 'summary_large_image',
    twitterTitle: seo?.twitterTitle || seo?.ogTitle || title,
    twitterDescription: seo?.twitterDescription || seo?.ogDescription || description,
    twitterImage: twitterImage || undefined,
  })

  useHead({
    link: [
      {
        rel: 'canonical',
        href: canonicalUrl,
      },
    ],
  })
}
