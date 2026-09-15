<template>
    <div
    v-if="type == 'header-1'"
    @click="openTelegramBot"
    class="header__contact"
    >
        <span>
        <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.725 0.466725L12.3958 12.6265C12.3958 12.6265 12.0699 13.4696 11.1746 13.0653L5.80055 8.79825L5.77563 8.78567C6.50154 8.11068 12.1306 2.86956 12.3766 2.63199C12.7575 2.26406 12.521 2.04502 12.0788 2.32295L3.76401 7.79105L0.55617 6.67334C0.55617 6.67334 0.0513494 6.48739 0.00278445 6.08306C-0.0464195 5.67806 0.572784 5.45902 0.572784 5.45902L13.6502 0.146434C13.6502 0.146434 14.725 -0.342604 14.725 0.466725V0.466725Z" fill="#FFDD2D"/>
        </svg>
        </span>
        <span>Telegram</span>
    </div>


    <div
    v-else-if="type == 'header-2'"
    @click="openTelegramBot"
    class="mob-menu__social-link"
    >
    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_3105_9)">
    <path d="M14.725 0.466725L12.3958 12.6265C12.3958 12.6265 12.0699 13.4696 11.1746 13.0653L5.80055 8.79825L5.77563 8.78567C6.50154 8.11068 12.1306 2.86956 12.3766 2.63199C12.7575 2.26406 12.521 2.04502 12.0788 2.32295L3.76401 7.79105L0.55617 6.67334C0.55617 6.67334 0.0513494 6.48739 0.00278445 6.08306C-0.0464195 5.67806 0.572784 5.45902 0.572784 5.45902L13.6502 0.146434C13.6502 0.146434 14.725 -0.342604 14.725 0.466725Z" fill="white"/>
    </g>
    <defs>
    <clipPath id="clip0_3105_9">
    <rect width="15" height="14" fill="white"/>
    </clipPath>
    </defs>
    </svg>

    </div>



    <div
    v-else-if="type == 'footer-1'"
    @click="openTelegramBot"
    class="app-footer__social-link"
    >
    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_3105_9)">
    <path d="M14.725 0.466725L12.3958 12.6265C12.3958 12.6265 12.0699 13.4696 11.1746 13.0653L5.80055 8.79825L5.77563 8.78567C6.50154 8.11068 12.1306 2.86956 12.3766 2.63199C12.7575 2.26406 12.521 2.04502 12.0788 2.32295L3.76401 7.79105L0.55617 6.67334C0.55617 6.67334 0.0513494 6.48739 0.00278445 6.08306C-0.0464195 5.67806 0.572784 5.45902 0.572784 5.45902L13.6502 0.146434C13.6502 0.146434 14.725 -0.342604 14.725 0.466725Z" fill="white"/>
    </g>
    <defs>
    <clipPath id="clip0_3105_9">
    <rect width="15" height="14" fill="white"/>
    </clipPath>
    </defs>
    </svg>

    </div>


    <div
    v-else-if="type == 'modal-1'"
    @click="openTelegramBot"
    class="promo-modal__contact"
    >
    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.725 0.466725L12.3958 12.6265C12.3958 12.6265 12.0699 13.4696 11.1746 13.0653L5.80055 8.79825L5.77563 8.78567C6.50154 8.11068 12.1306 2.86956 12.3766 2.63199C12.7575 2.26406 12.521 2.04502 12.0788 2.32295L3.76401 7.79105L0.55617 6.67334C0.55617 6.67334 0.0513494 6.48739 0.00278445 6.08306C-0.0464195 5.67806 0.572784 5.45902 0.572784 5.45902L13.6502 0.146434C13.6502 0.146434 14.725 -0.342604 14.725 0.466725V0.466725Z" fill="#FFDD2D"/>
    </svg>
    <span>Telegram</span>
    </div>

    <!-- <button type="button" class="btn" @click="checkLeadByToken">
        go
    </button> -->
</template>

<script setup>

import TgBotButtonLink from '~/components/buttons/TgBotButtonLink.vue'

const props = defineProps({
    type: {
        type: String,
        default: 'header-1'
    }
})

const urlApi = useRuntimeConfig().public.apiUrl
const { $TgAnalitika } = useNuxtApp()


async function openTelegramBot() {
    const result = await $TgAnalitika.trackEvent()
    if (result) {
        window.open(result.data.link, '_blank')
    }
    console.log('result', result)
}
</script>
