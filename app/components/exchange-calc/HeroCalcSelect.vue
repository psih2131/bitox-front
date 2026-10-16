<template>
  <div
    ref="rootRef"
    class="calc-select"
    :class="[`calc-select--${variant}`, { 'calc-select--open': isOpen }]"
  >
    <button
      type="button"
      class="calc-select__btn"
      :aria-label="ariaLabel"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      @click="toggle"
      @keydown="onKeydown"
    >
      <span class="calc-select__value">{{ currentLabel }}</span>
      <span class="calc-select__arrow" aria-hidden="true" />
    </button>

    <ul
      v-if="isOpen"
      class="calc-select__list"
      :class="{ 'calc-select__list--up': openUp }"
      role="listbox"
      :aria-label="ariaLabel"
    >
      <li
        v-for="(option, index) in options"
        :key="option.value"
        role="option"
        class="calc-select__option"
        :class="{
          'calc-select__option--active': option.value === modelValue,
          'calc-select__option--focus': index === focusIndex,
        }"
        :aria-selected="option.value === modelValue"
        @click="choose(option)"
        @mouseenter="focusIndex = index"
      >
        <span class="calc-select__option-text">{{ option.label }}</span>
        <svg
          v-if="option.value === modelValue"
          class="calc-select__check"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
        >
          <path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </li>
    </ul>
  </div>
</template>

<script setup>
// Выпадающий список в стиле сайта вместо стандартного <select>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  // [{ value, label }]
  options: {
    type: Array,
    default: () => [],
  },
  ariaLabel: {
    type: String,
    default: '',
  },
  // inline — правая половина поля «сумма | валюта», full — отдельное поле
  variant: {
    type: String,
    default: 'full',
  },
})

const emit = defineEmits(['update:modelValue'])

const LIST_MAX_HEIGHT = 260

const rootRef = ref(null)
const isOpen = ref(false)
const openUp = ref(false)
const focusIndex = ref(-1)

const currentLabel = computed(() => {
  const option = props.options.find((item) => item.value === props.modelValue)
  return option ? option.label : '—'
})

function open() {
  if (!props.options.length) return

  // Шапка страницы обрезает всё, что выходит за её край, — если снизу мало места, открываем вверх
  const rect = rootRef.value?.getBoundingClientRect()
  const container = rootRef.value?.closest('section')
  const bottomEdge = Math.min(
    window.innerHeight,
    container ? container.getBoundingClientRect().bottom : window.innerHeight,
  )
  const listHeight = Math.min(LIST_MAX_HEIGHT, props.options.length * 44 + 12)
  openUp.value = rect ? bottomEdge - rect.bottom < listHeight + 8 && rect.top > listHeight : false

  focusIndex.value = Math.max(0, props.options.findIndex((item) => item.value === props.modelValue))
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

function toggle() {
  if (isOpen.value) close()
  else open()
}

function choose(option) {
  emit('update:modelValue', option.value)
  close()
}

function onKeydown(event) {
  if (event.key === 'Escape') {
    close()
    return
  }

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    if (!isOpen.value) {
      open()
      return
    }
    const step = event.key === 'ArrowDown' ? 1 : -1
    const count = props.options.length
    focusIndex.value = (focusIndex.value + step + count) % count
    return
  }

  if ((event.key === 'Enter' || event.key === ' ') && isOpen.value) {
    event.preventDefault()
    const option = props.options[focusIndex.value]
    if (option) choose(option)
  }
}

function handleClickOutside(event) {
  if (isOpen.value && !rootRef.value?.contains(event.target)) close()
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>
