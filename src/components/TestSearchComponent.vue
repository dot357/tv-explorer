<script setup lang="ts">
import { onMounted } from 'vue';
import { useSearchShows } from '@/composables/useSearchShows';

const search = useSearchShows('', { debounceMs: 300 });

onMounted(() => {
  // optional: initial query
  // search.query.value = 'office';
});
</script>

<template>
  <div class="space-y-3">
    <input
      v-model="search.query.value"
      placeholder="Search shows…"
      class="input w-full"
      aria-label="Search shows"
    />

    <!-- {{ search }} -->
    <p v-if="search.loading.value" class="text-sm">Searching…</p>
    <p v-else-if="search.error.value" class="text-sm text-error">Oops: {{ search.error.message }}</p>

    <ul class="grid grid-cols-2 md:grid-cols-4 gap-3" v-if="!search.loading.value && !search.error.value">
      <li v-for="hit in search.sorted.value" :key="hit.show.id">
        <article class="card">
          <img
            v-if="hit.show.image?.medium"
            :src="hit.show.image.medium"
            :alt="hit.show.name"
            class="w-full aspect-[2/3] object-cover rounded-xl"
          />
          <h3 class="mt-2 text-sm font-medium">{{ hit.show.name }}</h3>
          <div>
            <span 
                class="chip" 
                v-for="(genre, genreIndex) in hit.show.genres"
                :key="genreIndex"
                >
                {{ genre }}
            </span>
          </div>
         
        </article>
      </li>
    </ul>
  </div>
</template>
