<template>
  <footer class="app-footer">
    <div class="container">
      <div class="app-footer__card">
        <div class="app-footer__grid">
          <div class="app-footer__col app-footer__col-1">
            <NuxtLink to="/" class="app-footer__logo">{{ footer?.logo_text }}</NuxtLink>
            <p class="app-footer__legal footer_copy">© 2026 Bitox</p>
          </div>

          <div class="app-footer__col app-footer__col-2">
            <div class="app-footer__col-main">
              <p class="app-footer__label">Навигация</p>

              <nav class="app-footer__nav">
                <NuxtLink
                  v-for="link in navLinks"
                  :key="link.to"
                  :to="link.to"
                  class="app-footer__nav-link"
                >
                  {{ link.label }}
                </NuxtLink>
              </nav>
            </div>

            <div v-if="docsPagesCol2.length" class="app-footer__col-legal">
              <NuxtLink
                v-for="page in docsPagesCol2"
                :key="page.documentId"
                :to="`/docs/${page.slug}`"
                class="app-footer__legal app-footer__legal--link"
              >
                {{ page.title }}
              </NuxtLink>
            </div>
          </div>

          <div class="app-footer__col app-footer__col-3 ">
            <div class="app-footer__col-main">
              <div v-if="contacts.length" class="app-footer__contacts">
                <a
                  v-for="contact in contacts"
                  :key="contact.id"
                  :href="contact.link || '#'"
                  class="app-footer__contact-link"
                >
                  {{ contact.title }}
                </a>
              </div>

              <div v-if="socials.length" class="app-footer__socials">
                <a
                  v-for="social in socials"
                  :key="social.id"
                  :href="social.link || '#'"
                  class="app-footer__social-link"
                  :aria-label="social.name"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    v-if="social.icon"
                    :src="social.icon"
                    :alt="social.name"
                    width="18"
                    height="18"
                  />
                </a>
              </div>
            </div>

            <div v-if="docsPagesCol3.length" class="app-footer__col-legal">
              <NuxtLink
                v-for="page in docsPagesCol3"
                :key="page.documentId"
                :to="`/docs/${page.slug}`"
                class="app-footer__legal app-footer__legal--link"
              >
                {{ page.title }}
              </NuxtLink>
            </div>
          </div>

          <div class="app-footer__col app-footer__col-4 ">
            <p class="app-footer__legal footer_copy">© 2026 Bitox</p>

            <div v-if="docsPages.length" class="app-footer__col-legal">
              <NuxtLink
                v-for="page in docsPages"
                :key="page.documentId"
                :to="`/docs/${page.slug}`"
                class="app-footer__legal app-footer__legal--link"
              >
                {{ page.title }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { getStrapiMediaUrl } from '~/utils/strapi'

const urlApi = useRuntimeConfig().public.apiUrl

const [{ data: footerResponse }, { data: docsResponse }] = await Promise.all([
  useFetch(`${urlApi}/api/footer-component?populate[contacts_list]=true&populate[socials_media_links][populate]=icon`),
  useFetch(`${urlApi}/api/docs-pages?pagination[pageSize]=100&sort=createdAt:asc`),
])

const footer = computed(() => footerResponse.value?.data)
const docsPages = computed(() => docsResponse.value?.data ?? [])

const docsPagesCol2 = computed(() => docsPages.value.filter((_, index) => index % 2 === 0))
const docsPagesCol3 = computed(() => docsPages.value.filter((_, index) => index % 2 === 1))

const contacts = computed(() => footer.value?.contacts_list ?? [])

const socials = computed(() =>
  (footer.value?.socials_media_links ?? []).map((item) => ({
    id: item.id,
    link: item.link,
    name: item.icon?.alternativeText || '',
    icon: getStrapiMediaUrl(item.icon, urlApi),
  })),
)

const navLinks = [
  { label: 'Главная', to: '/' },
  { label: 'О Bitox', to: '/about' },
  { label: 'Контакты', to: '/contacts' },
  { label: 'Партнерская программа', to: '/partners' },
  { label: 'Обмен криптовалюты', to: '/exchange' },
  { label: 'Блог', to: '/blog' },
]
</script>
