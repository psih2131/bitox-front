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

    <!-- Список выносим в body, чтобы шапка страницы его не обрезала -->
    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="dropRef"
        class="calc-select__dropdown"
        :style="dropStyle"
      >
        <ul
          ref="listRef"
          class="calc-select__list"
          :style="{ maxHeight: `${listMaxHeight}px` }"
          :class="{ 'calc-select__list--scroll': thumb.visible }"
          role="listbox"
          :aria-label="ariaLabel"
          @scroll="updateThumb"
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

        <!-- Свой ползунок: виден всегда, в том числе на телефонах и Mac -->
        <div v-if="thumb.visible" class="calc-select__track" aria-hidden="true">
          <div
            class="calc-select__thumb"
            :style="{ height: `${thumb.height}px`, transform: `translateY(${thumb.top}px)` }"
            @pointerdown="startThumbDrag"
          />
        </div>
      </div>
    </Teleport>
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
const LIST_MIN_WIDTH = 200
const OPTION_HEIGHT = 44
const GAP = 6
const EDGE = 8
const TRACK_INSET = 6

const rootRef = ref(null)
const dropRef = ref(null)
const listRef = ref(null)
const isOpen = ref(false)
const focusIndex = ref(-1)
const dropStyle = ref({})
const listMaxHeight = ref(LIST_MAX_HEIGHT)
const thumb = reactive({ visible: false, height: 0, top: 0 })

const currentLabel = computed(() => {
  const option = props.options.find((item) => item.value === props.modelValue)
  return option ? option.label : '—'
})

const fullListHeight = computed(() =>
  Math.min(LIST_MAX_HEIGHT, props.options.length * OPTION_HEIGHT + 12),
)

// Список всегда открываем вниз — на всю высоту, сколько помещается до низа экрана
function updatePosition() {
  const rect = rootRef.value?.getBoundingClientRect()
  if (!rect) return

  const viewportWidth = document.documentElement.clientWidth
  const width = Math.min(Math.max(rect.width, LIST_MIN_WIDTH), viewportWidth - EDGE * 2)

  let left = rect.left
  if (left + width > viewportWidth - EDGE) left = rect.right - width
  left = Math.min(Math.max(left, EDGE), viewportWidth - width - EDGE)

  const top = rect.bottom + GAP
  const spaceBelow = window.innerHeight - top - EDGE

  listMaxHeight.value = Math.max(OPTION_HEIGHT + 12, Math.min(LIST_MAX_HEIGHT, spaceBelow))
  dropStyle.value = { top: `${top}px`, left: `${left}px`, width: `${width}px` }

  nextTick(updateThumb)
}

function updateThumb() {
  const list = listRef.value
  if (!list) return

  const { scrollHeight, clientHeight, scrollTop } = list
  thumb.visible = scrollHeight > clientHeight + 1
  if (!thumb.visible) return

  const trackHeight = clientHeight - TRACK_INSET * 2
  thumb.height = Math.max(28, (trackHeight * clientHeight) / scrollHeight)
  thumb.top = (scrollTop / (scrollHeight - clientHeight)) * (trackHeight - thumb.height)
}

// Ползунок можно тянуть мышкой
function startThumbDrag(event) {
  const list = listRef.value
  if (!list) return
  event.preventDefault()

  const startY = event.clientY
  const startScroll = list.scrollTop
  const trackHeight = list.clientHeight - TRACK_INSET * 2
  const ratio = (list.scrollHeight - list.clientHeight) / Math.max(1, trackHeight - thumb.height)

  const onMove = (moveEvent) => {
    list.scrollTop = startScroll + (moveEvent.clientY - startY) * ratio
  }
  const onUp = () => {
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
    // Отпустили мышку за пределами списка — не закрываем его
    ignoreNextClick = true
    setTimeout(() => { ignoreNextClick = false }, 0)
  }
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
}

// Прокручиваем только сам список, страницу не трогаем
function scrollOptionIntoView(index) {
  const list = listRef.value
  const option = list?.children[index]
  if (!option) return

  const top = option.offsetTop - 6
  const bottom = option.offsetTop + option.offsetHeight + 6
  if (top < list.scrollTop) list.scrollTop = top
  else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight
}

let frame = 0
function onViewportChange() {
  if (!isOpen.value || frame) return
  frame = requestAnimationFrame(() => {
    frame = 0
    updatePosition()
  })
}

async function open() {
  if (!props.options.length) return

  focusIndex.value = Math.max(0, props.options.findIndex((item) => item.value === props.modelValue))
  isOpen.value = true
  updatePosition()

  window.addEventListener('scroll', onViewportChange, { passive: true })
  window.addEventListener('resize', onViewportChange)

  await nextTick()
  scrollOptionIntoView(focusIndex.value)
  updateThumb()

  // Если до низа экрана совсем мало места — немного прокручиваем страницу
  const rect = rootRef.value?.getBoundingClientRect()
  if (!rect) return
  const spaceBelow = window.innerHeight - rect.bottom - GAP - EDGE
  const minNeed = Math.min(fullListHeight.value, 3 * OPTION_HEIGHT + 12)
  if (spaceBelow < minNeed) {
    const maxShift = Math.max(0, rect.top - 120)
    window.scrollBy({ top: Math.min(fullListHeight.value - spaceBelow, maxShift), behavior: 'smooth' })
  }
}

function close() {
  isOpen.value = false
  window.removeEventListener('scroll', onViewportChange)
  window.removeEventListener('resize', onViewportChange)
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
    scrollOptionIntoView(focusIndex.value)
    return
  }

  if ((event.key === 'Enter' || event.key === ' ') && isOpen.value) {
    event.preventDefault()
    const option = props.options[focusIndex.value]
    if (option) choose(option)
  }
}

let ignoreNextClick = false

function handleClickOutside(event) {
  if (!isOpen.value || ignoreNextClick) return
  if (rootRef.value?.contains(event.target) || dropRef.value?.contains(event.target)) return
  close()
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  close()
  if (frame) cancelAnimationFrame(frame)
})
</script>
