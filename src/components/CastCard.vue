<!-- components/CastCard.vue -->
<script setup lang="ts">
import type { CastMember } from '@/types/adapters/tv.adaptersTypes'

defineProps<{
  cast: CastMember
}>()
</script>
 
<template>
  <article
    class="card card-focus group relative flex flex-col rounded-xl bg-surface shadow-card overflow-hidden hover:ring-2 hover:ring-primary/40 transition"
  >
    <!-- Person image -->
    <img
      v-if="cast.person?.image?.medium"
      :src="cast.person.image.medium"
      :alt="`Portrait of ${cast.person.name}`"
      class="w-full aspect-[2/3] object-cover"
      loading="lazy"
    />

    <!-- Fallback placeholder -->
    <div
      v-else
      class="w-full aspect-[2/3] flex items-center justify-center bg-muted/20 text-muted text-sm"
    >
      No Image
    </div>

    <!-- Content -->
    <div class="p-2 flex flex-col gap-1">
      <!-- Person name -->
      <h3 class="font-medium text-sm leading-tight text-text">
        {{ cast.person?.name }}
      </h3>

      <!-- Character name -->
      <p class="text-xs text-muted">
        as {{ cast.character?.name }}
      </p>
    </div>
  </article>
</template>
