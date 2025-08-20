<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, nextTick, computed } from 'vue'
import { Button } from 'primevue';
/**
 * Original createor : https://ryanmulligan.dev/blog/project-keyboard-navigation/
 * Ported to vue3 by Emre Can Eskimez
 */

type FocusBehavior = 'smooth' | 'auto'
const DEFAULT_SELECTOR = 'a,button,[role="link"],[role="button"]'

const props = withDefaults(defineProps<{
  label: string
  describedById?: string
  showControls?: boolean
  focusableSelector?: string
}>(), {
  showControls: true,
  // Give a default so the app works without passing anything
  focusableSelector: DEFAULT_SELECTOR,
})

const container = ref<HTMLElement | null>(null)
const helpId = ref(props.describedById || `hs-help-${Math.random().toString(36).slice(2)}`)

let items: HTMLElement[] = []
let focusedIndex = -1
let mediaQuery: MediaQueryList | null = null


//normalize the selector
const sanitizedSelector = computed(() => {
  const raw = (props.focusableSelector ?? DEFAULT_SELECTOR)
  const trimmed = typeof raw === 'string' ? raw.trim() : DEFAULT_SELECTOR
  return trimmed.length ? trimmed : DEFAULT_SELECTOR
})

//query safely
function querySafe(root: Element, selector: string) {
  try {
    return root.querySelectorAll<HTMLElement>(selector)
  } catch {
    // dev hint without crashing your UI
    if (import.meta.env?.DEV) {
      // eslint-disable-next-line no-console
      console.warn(`[HorizontalScroller] Invalid focusableSelector "${selector}", falling back to default.`)
    }
    return root.querySelectorAll<HTMLElement>(DEFAULT_SELECTOR)
  }
}

const getFocusableItems = () => {
  const root = container.value
  if (!root) return []
  return Array.from(querySafe(root, sanitizedSelector.value))
}

const setRovingTabindex = () => {
  items.forEach(el => el.setAttribute('tabindex', '-1'))
  // Make container focusable; items receive programmatic focus
  container.value?.setAttribute('tabindex', '0')
}

const focusItem = async (index: number, behavior: FocusBehavior = 'smooth') => {
  if (!items.length) return
  focusedIndex = (index + items.length) % items.length
  const el = items[focusedIndex]
  if (!el) return
  // Prevent double scroll (we scroll the element into view, then focus without scroll)
  el.scrollIntoView({ inline: 'start', block: 'nearest', behavior })
  await nextTick()
  el.focus({ preventScroll: true })
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!items.length) return
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    e.preventDefault()
    const prefersReduce = mediaQuery?.matches
    const behavior: FocusBehavior = prefersReduce ? 'auto' : 'smooth'
    if (e.key === 'ArrowRight') focusItem(focusedIndex === -1 ? 0 : focusedIndex + 1, behavior)
    else focusItem(focusedIndex <= 0 ? items.length - 1 : focusedIndex - 1, behavior)
  }
}

const handleClickItem = (e: Event) => {
  // If a user clicks an item, update the roving index so subsequent arrows continue from there
  const target = e.target as HTMLElement
  const anchor = target.closest(itemsSelector()) as HTMLElement | null
  if (!anchor) return
  const idx = items.indexOf(anchor)
  if (idx >= 0) focusedIndex = idx
}

const itemsSelector = () => sanitizedSelector.value

const next = () => focusItem(focusedIndex === -1 ? 0 : focusedIndex + 1)
const prev = () => focusItem(focusedIndex <= 0 ? items.length - 1 : focusedIndex - 1)

onMounted(() => {
  mediaQuery = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null

  items = getFocusableItems()
  setRovingTabindex()

  container.value?.addEventListener('keydown', handleKeydown)
  container.value?.addEventListener('click', handleClickItem, { capture: true })

  // Lazy-init the index to 0 when container receives focus via keyboard (not mouse)
  container.value?.addEventListener('focus', () => {
    if (focusedIndex === -1 && items.length) {
      // Do not steal scroll on first focus
      focusItem(0, 'auto')
    }
  }, { once: true, capture: true })


  const mutationObserver = new MutationObserver(() => {
    items = getFocusableItems()
    setRovingTabindex()
  })

   if (container.value) mutationObserver.observe(container.value, { childList: true, subtree: true })
})

onBeforeUnmount(() => {
  container.value?.removeEventListener('keydown', handleKeydown)
  container.value?.removeEventListener('click', handleClickItem, { capture: true } as any)
})

watch(() => props.focusableSelector, () => {
  items = getFocusableItems()
  setRovingTabindex()
})
</script>

<template>
  <section class="w-full">
    <div class="flex items-center gap-2 mb-2 px-2" v-if="showControls">
       <h2 class="text-xl font-semibold">
        <span>{{ label }}</span>
      </h2>
      <div class="ml-auto flex gap-1">
        <Button
          type="button"
          class="btn"
          @click="prev"
          aria-label="Scroll to previous item"
        >
          ◀
        </Button>
        <Button
          type="button"
          class="btn"
          @click="next"
          aria-label="Scroll to next item"
        >
          ▶
        </Button>
      </div>
    </div>


    <div
      ref="container"
      class="relative px-2 flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory
             [scrollbar-width:none] py-2
             focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      role="list"
      :aria-label="label"
      :aria-describedby="helpId"
    >
      <div class="absolute inset-y-0  left-0 w-4 pointer-events-none"></div>
      <slot />
    </div>

    <p :id="helpId" class="sr-only">
      Use Left and Right Arrow keys to navigate items.
    </p>
  </section>
</template>

<style scoped>
/* Webkit modifications */
::-webkit-scrollbar {
  height: 12px;
}
:host(:hover) ::-webkit-scrollbar-track {
  background: transparent;
}
:host(:hover) ::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,.2);
}
</style>
