<template>

  <section ref="sectionRef" class="home-hero-sec">

    <div class="container home-hero-sec__inner">

      <div class="home-hero-sec__left">

        <div class="home-hero-sec__title-wrap">

          <h1 class="home-hero-sec__title">

            Международные платежи

            <span class="home-hero-sec__title-accent">для бизнеса</span>

          </h1>



          <span class="home-hero-sec__badge home-hero-sec__badge--transfers">

            Международные переводы

          </span>

          <span class="home-hero-sec__badge home-hero-sec__badge--crypto">

            Обмен криптовалют

          </span>

        </div>



        <div class="home-hero-sec__subtitle">

          <img

            :src="swiftImage"

            alt=""

            class="home-hero-sec__subtitle-icon"

            width="53"

            height="53"

          />

          <p class="home-hero-sec__subtitle-text">

            Работаем там где банки бессильны. В любую точку мира от 0,5%

          </p>

        </div>



        <div class="home-hero-sec__stats">

          <article

            v-for="card in statsCards"

            :key="card.value"

            class="home-hero-sec__stat"

            :class="{ 'home-hero-sec__stat--dark': card.dark }"

          >

            <p class="home-hero-sec__stat-value">{{ card.value }}</p>

            <p v-if="card.text" class="home-hero-sec__stat-text">{{ card.text }}</p>

          </article>

        </div>

      </div>



      <div class="home-hero-sec__right">

        <HomePaymentCalc />



      

          <img

            :src="cardsImage"

            alt=""

            class="home-hero-sec__decor-cards"

            width="198"

            height="151"

          />

          <img :src="coin1" alt="" class="home-hero-sec__decor-coin home-hero-sec__decor-coin--1" />

          <img :src="coin2" alt="" class="home-hero-sec__decor-coin home-hero-sec__decor-coin--2" />

          <img :src="coin3" alt="" class="home-hero-sec__decor-coin home-hero-sec__decor-coin--3" />

        



        <div class="home-hero-sec__deals">

          <p class="home-hero-sec__deals-label">

            <span class="home-hero-sec__deals-dot" />

            Общая сумма сделок за сегодня

          </p>

          <p class="home-hero-sec__deals-value">2.000.000 $</p>

        </div>

      </div>

    </div>

  </section>

</template>



<script setup>

import gsap from 'gsap'

import swiftImage from '~/assets/images/swift.png'

import cardsImage from '~/assets/images/gr-5.png'

import coin1 from '~/assets/images/coin-1.png'

import coin2 from '~/assets/images/coin-2.png'

import coin3 from '~/assets/images/coin-3.png'



const sectionRef = ref(null)



const statsCards = [

  { value: 'с 10 до 22', text: 'на связи', dark: false },

  { value: '2 минуты', text: 'среднее время ответа', dark: false },

  { value: 'от 1000 USD / EUR', text: 'платежи', dark: false },

  { value: 'от 2 часов', text: 'платим', dark: false },

  { value: '87%', text: 'клиентов возвращаются и делают второй платеж', dark: false },

  { value: 'для бизнеса и физлиц', text: '', dark: true },

]



let heroAnimation



onMounted(() => {

  if (!sectionRef.value) return



  heroAnimation = gsap.context(() => {

    gsap.from('.home-hero-sec__title-wrap', {

      opacity: 0,

      y: 32,

      duration: 0.7,

      ease: 'power2.out',

    })



    gsap.from('.home-hero-sec__subtitle', {

      opacity: 0,

      y: 24,

      duration: 0.6,

      delay: 0.1,

      ease: 'power2.out',

    })



    gsap.from('.home-hero-sec__stat', {

      opacity: 0,

      y: 20,

      duration: 0.5,

      stagger: 0.08,

      delay: 0.2,

      ease: 'power2.out',

    })



    gsap.from('.payment-calc', {

      opacity: 0,

      y: 24,

      duration: 0.6,

      delay: 0.15,

      ease: 'power2.out',

    })



    gsap.from('.home-hero-sec__deals', {

      opacity: 0,

      y: 20,

      duration: 0.5,

      delay: 0.35,

      ease: 'power2.out',

    })

  }, sectionRef.value)

})



onUnmounted(() => {

  heroAnimation?.revert()

})

</script>


