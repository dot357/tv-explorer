<script lang="ts" setup>
import TestSearchComponent from '@/components/TestSearchComponent.vue';
import { showGenres } from '@/data/genres';
import { useGenreBuckets } from '@/composables/useGenreBuckets';
import { useTopRatedShows } from '@/composables/useTopRatedShows';
import ShowCard from '@/components/ShowCard.vue';
import HorizontalScroller from '@/components/HorizontalScroller.vue';

const { buckets, loading, error, refreshAll } = useGenreBuckets(
  showGenres.map(g => g.name),
  { pagesToScan: 2, perGenreLimit: 20, minRating: 0 }
);

const top = useTopRatedShows(12, 2);


</script>

<template>
    <div>
       
    </div>

    <section class="px-4 md:px-6 py-6 space-y-8">
         <TestSearchComponent />
    <header class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Discover</h1>
      <button class="btn" @click="refreshAll">Refresh</button>
    </header>

    <div v-if="error" class="text-error">Failed to load: {{ error.message }}</div>
    <div v-else-if="loading" class="text-muted">Loading…</div>

    <!-- Top rated rail -->
    <div v-if="top.items.value.length" class="space-y-3">
      <h2 class="text-lg font-semibold">Top Rated</h2>
      <div class="flex gap-3 overflow-x-auto pb-2">
        <ShowCard v-for="(show, showIndex) in top.items.value" :key="showIndex" :show="show" />
      </div>
    </div>

    <HorizontalScroller
    
    v-for="[genre, items] in buckets" :key="genre"
    :label="genre"
    show-controls
    >
    <template #default>
      
       <ShowCard 
            v-for="(show, showIndex) in items" 
            :key="showIndex" 
            :show="show"
            as="a"
            :href="`/show/${show.id}`"
            />
    </template>
    </HorizontalScroller>


  </section>
</template>

