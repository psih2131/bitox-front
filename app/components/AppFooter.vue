<template>
  <footer class="app-footer">
    <div class="container">
      <div class="app-footer__card">
        <div class="app-footer__grid">
          <div class="app-footer__col">
            <NuxtLink to="/" class="app-footer__logo">Bitox</NuxtLink>
            <p class="app-footer__legal">© 2026 Bitox</p>
          </div>

          <div class="app-footer__col">
            <div class="app-footer__col-main">
              <p class="app-footer__label">Навигация</p>

              <nav class="app-footer__nav">
                <a
                  v-for="link in navLinks"
                  :key="link"
                  href="#"
                  class="app-footer__nav-link"
                >
                  {{ link }}
                </a>
              </nav>
            </div>

            <a href="#" class="app-footer__legal app-footer__legal--link">
              Правила оказания услуг
            </a>
          </div>

          <div class="app-footer__col">
            <div class="app-footer__col-main">
              <div class="app-footer__contacts">
                <a href="#" class="app-footer__contact-link">Написать в Telegram</a>
                <a href="mailto:info@mail.ru" class="app-footer__contact-link">info@mail.ru</a>
                <a href="#" class="app-footer__contact-link">Обратная связь</a>
              </div>

              <div class="app-footer__socials">
                <a
                  v-for="social in socials"
                  :key="social.name"
                  :href="social.href"
                  class="app-footer__social-link"
                  :aria-label="social.name"
                >
                  <img :src="social.icon" :alt="social.name" width="18" height="18" />
                </a>
              </div>
            </div>

            <a href="#" class="app-footer__legal app-footer__legal--link">
              Политика конфиденциальности
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import iconWhatsapp from '~/assets/images/social/icon-whatsapp.svg'
import iconTelegram from '~/assets/images/social/icon-telegram.svg'
import iconVk from '~/assets/images/social/icon-vk.svg'

const navLinks = [
  'Бизнесу',
  'Частным клиентам',
  'Международные расчеты',
  'Обмен криптовалюты',
  'о Bitox',
]

const socials = [
  { name: 'WhatsApp', href: '#', icon: iconWhatsapp },
  { name: 'Telegram', href: '#', icon: iconTelegram },
  { name: 'VK', href: '#', icon: iconVk },
]
</script>
