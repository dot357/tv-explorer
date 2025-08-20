<script setup lang="ts">
import { ref, watch, nextTick, computed, onMounted, onBeforeUnmount } from 'vue'
import { useSearchShows } from '@/composables/useSearchShows'
import ShowCard from '@/components/ShowCard.vue'
import { Button } from 'primevue'
import InputText from 'primevue/inputtext';

// your existing setup
const search = useSearchShows('', { debounceMs: 300 })
const topNine = computed(() => (search.sorted.value ?? []).slice(0, 9))

// open overlay when there is any query
const isOpen = computed(() =>
  search.query.value.length > 0 &&
  (search.loading.value || search.sorted.value.length > 0 || search.error.value)
)

// a11y
const panelRef = ref<HTMLElement | null>(null)
const close = () => { search.query.value = '' }

// focus the dialog panel when opening, return focus to input when closing
const inputRef = ref<HTMLInputElement | null>(null)
watch(isOpen, async (open) => {
  if (open) {
    await nextTick()
    panelRef.value?.focus()
    // lock bacakground scroll
    document.documentElement.style.overflow = 'hidden'
  } else {
    document.documentElement.style.overflow = ''
    if(inputRef.value === undefined || inputRef.value?.focus === undefined){
      return
    }
    inputRef.value?.focus()
  }
})

// ESC key on window
const onKeydown = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen.value) close() }
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center gap-2 relative">
      
      <label for="show-search" class="sr-only">Search shows</label>
      
      <InputText
        id="show-search"
        ref="inputRef"
        v-model="search.query.value"
        type="search"
        placeholder="Search shows…"
        autocomplete="off"
        class="input w-full px-2 py-3 bg-surface rounded-sm ring-black/10"
        :disabled="search.loading.value"        
        aria-describedby="search-help"
      />

      <Button
        label="Clear"
        @click="close"
        :disabled="!search.query.value || search.loading.value"
        class="btn absolute right-[10px] bg-surface"
        aria-label="Clear search input"
      />
    </div>

    <p id="search-help" class="sr-only">
      Type a show name and press Enter or keep typing to see results.
    </p>

    <!-- Modal overlay -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      aria-hidden="false"
      @click.self="close"
    >
      <!-- Dialog panel -->
      <section
        ref="panelRef"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="'search-results-title'"
        :aria-describedby="'search-results-desc'"
        tabindex="-1"
        class="mx-auto mt-16 md:max-w-5xl rounded-xl bg-surface p-4 md:p-6 shadow-2xl
              ring-1 ring-black/10 dark:ring-white/10
              flex flex-col
              max-h-[calc(100dvh-8rem)]
              max-w-[90vw]
              overscroll-contain"
      >
        <header class="flex flex-col items-start md:flex-row md:items-center justify-between gap-2 sticky top-0 bg-surface/95 backdrop-blur-sm py-2 -mx-4 px-4 md:mx-0 md:px-0 z-10">
          <h2 id="search-results-title" class="text-lg md:text-xl font-semibold">
          Search results
          </h2>
          <p id="search-results-desc" class="text-sm text-muted">
          Press Esc to close. Click outside the panel or use the Close button.
          </p>
        </header>
        <!-- Scrollable body -->
        <div
          class="mt-4 grow overflow-y-auto pr-1 -mr-1
                [touch-action:pan-y]  /* smoother iOS scrolling */"
          :aria-busy="search.loading.value ? 'true' : 'false'"
        >
          <p v-if="search.loading.value" class="text-sm">Searching…</p>
          <p v-else-if="search.error.value" class="text-sm text-error">Oops: {{ search.error.value.message }}</p>

          <template v-else>
            <p v-if="!topNine.length" class="text-sm text-muted italic" role="status">
              No shows found. Try another search.
            </p>

            <p v-else class="text-sm text-muted mb-2" aria-live="polite">
              Showing {{ topNine.length }} result{{ topNine.length === 1 ? '' : 's' }} (max 9)
            </p>

            <ul
              v-if="topNine.length"
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4"
              role="list"
              aria-label="Search results grid"
            >
              <li v-for="hit in topNine" :key="hit.show.id" role="listitem">
                <ShowCard
                  :show="hit.show"
                  as="a"
                  :href="`/show/${hit.show.id}`"
                  class="h-full"
                />
              </li>
            </ul>
          </template>
        </div>
      </section>

    </div>
  </div>
</template>
