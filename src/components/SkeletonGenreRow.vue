<script setup lang="ts">
const props = defineProps<{
  label?: string
  count?: number   // number of card placeholders
}>()
const n = Array.from({ length: Math.max(1, (typeof props.count === 'number' ? props.count : 8)) })
</script>

<template>
  <section class="w-full">
    <!-- Row header -->
    <div class="flex items-center gap-2 mb-2 ">
      <div class="skeleton skeleton-line" style="--lines: 1; --l-h: 18px; --g-gap: 0; --c-bg: transparent; width: 120px;"></div>
     
    </div>

    <!-- Horizontal scroller with card placeholders -->
    <div
      class="relative flex gap-4 overflow-x-auto snap-x snap-mandatory  py-2 [scrollbar-width:none]"
      role="list"
      aria-busy="true"
      :aria-label="`Loading ${label || 'row'}`"
    >
      <div
        v-for="(_, i) in n"
        :key="i"
        role="listitem"
        class="snap-start shrink-0 w-44 sm:w-52 md:w-56 lg:w-64"
      >
        <div class="rounded-2xl ring-1 ring-white/10 bg-surface/50 overflow-hidden p-2">
          <!-- Poster -->
          <div class="skeleton skeleton-rect rounded-xl" style="--rect-h: 220px;"></div>

          <!-- Title lines -->
          <div class=" skeleton skeleton-line" style="--lines: 2; --l-h: 12px; --g-gap: 8px;"></div>
        </div>
      </div>
    </div>

    <!-- SR-only hint -->
    <p class="sr-only">Content is loading…</p>
  </section>
</template>
