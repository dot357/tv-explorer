<script setup lang="ts" >
import type { Show } from '@/types/adapters/tv.adaptersTypes';
import { genreBgClass, genreColorClass } from '@/utils/genreClass';
import { computed } from 'vue';

const props = defineProps<{
  show: Show
  as?: 'div' | 'a'                        
  href?: string                            
  openInNewTab?: boolean                   
}>();

const isLink = (props.as === 'a') && !!props.href;
const target   = props.openInNewTab ? '_blank' : undefined;
const rel      = props.openInNewTab ? 'noopener noreferrer' : undefined;


const posterSrc = props.show?.image?.medium ?? '';
const posterAlt = posterSrc ? props.show?.name : `${props.show?.name} (no poster available)`;

const computedShowName = computed(() => props.show?.name ?? 'Show N/A');
</script>

<template>
  <!-- Wrapper: focusable surface (link or div) -->
  <component
    :is="as ?? 'div'"
    v-bind="$attrs"
    :href="isLink ? href : undefined"
    :target="isLink ? target : undefined"
    :rel="isLink ? rel : undefined"
    class="card-focus group"
    :aria-label="computedShowName"
  >
    <article
      class="card rounded-xl p-2 bg-surface/60 hover:bg-surface ring-1 ring-white/10"
    >
      <header class="flex items-start gap-2 relative">

          
        <div
            class="absolute top-0 right-0 flex gap-2 text-sm bg-bg/50 px-4 rounded-l-sm font-bold user-select-none"
            role="status"
            :aria-label="`Average rating: ${show?.rating?.average ?? 'N/A'} out of 10`"
            >
            <span aria-hidden="true">
                {{ show?.rating?.average ?? 'N/A' }} / 10
            </span>
            </div>
            <figure class="w-full">
          <!-- Poster with intrinsic sizes + lazy loading -->
          <img
            v-if="posterSrc"
            :src="posterSrc"
            :alt="posterAlt"
            class="w-full aspect-[2/3] object-cover rounded-sm"
            loading="lazy"
            decoding="async"
            width="210" height="315"          
            sizes="(max-width: 768px) 40vw, 210px"
          />
          <div
            v-else
            class="w-full aspect-[2/3] rounded-xl grid place-items-center bg-muted/10 text-muted text-xs"
            role="img"
            :aria-label="posterAlt"
          >
            No image
          </div>
          <figcaption class="sr-only">{{ computedShowName }}</figcaption>
        </figure>


         
      
      </header>

      <h3 class="mt-2 text-sm font-semibold line-clamp-2">
        {{ computedShowName}}
      </h3>

      <!-- Genres as a list for screen readers -->
      <ul class="mt-1 flex flex-wrap gap-1" aria-label="Genres">
        <li
          v-for="(genre, idx) in show?.genres ?? []"
          :key="idx"
        >
          <span
            class="genre-chip focusable-chip"
            :class="[genreColorClass(genre), genreBgClass(genre, 14)]"
            aria-hidden="false"
          >
            {{ genre }}
          </span>
        </li>
      </ul>
    </article>
  </component>
</template>

