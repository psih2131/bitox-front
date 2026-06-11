<template>

  <article class="faq-item" :class="{ 'faq-item--open': isOpen }">

    <button

      type="button"

      class="faq-item__header"

      :aria-expanded="isOpen"

      :aria-controls="contentId"

      @click="isOpen = !isOpen"

    >

      <span class="faq-item__question">{{ question }}</span>



      <span

        class="faq-item__toggle"

        :class="{ 'faq-item__toggle--active': isOpen }"

        aria-hidden="true"

      >

      <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.877 22.3501L11.877 0.600098" stroke="white" stroke-width="1.2" stroke-linecap="square"/>
      <path d="M22.3496 11.0723L0.599609 11.0723" stroke="white" stroke-width="1.2" stroke-linecap="square"/>
      </svg>


      </span>

    </button>



    <Vue3SlideUpDown v-model="isOpen" :duration="400">

      <div :id="contentId" class="faq-item__body">

        <p class="faq-item__answer">{{ answer }}</p>

      </div>

    </Vue3SlideUpDown>

  </article>

</template>



<script setup>

import { Vue3SlideUpDown } from 'vue3-slide-up-down'



defineProps({

  question: {

    type: String,

    required: true,

  },

  answer: {

    type: String,

    required: true,

  },

})



const isOpen = ref(false)

const contentId = useId()

</script>


