<script lang="ts" setup>
import { showGenres } from '@/data/genres';
import { useGenreBuckets } from '@/composables/useGenreBuckets';
import { useTopRatedShows } from '@/composables/useTopRatedShows';
import ShowCard from '@/components/ShowCard.vue';
import HorizontalScroller from '@/components/HorizontalScroller.vue';
import { Button } from 'primevue';
import SkeletonGenreRow from '@/components/SkeletonGenreRow.vue';
const { buckets, loading, error, refreshAll } = useGenreBuckets(
  showGenres.map(g => g.name),
  { pagesToScan: 2, perGenreLimit: 20, minRating: 0 }
);

const top = useTopRatedShows(12, 2);


</script>

<template>
    <section class="px-4 md:px-6 py-6 space-y-8">
      
    <header class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Discover</h1>
      <Button 
        class="btn" 
        label="Refresh" 
        :icon="`pi pi-refresh ${loading === true ? 'pi-spin pi-spinner' :''}`" 
        @click="refreshAll"
        
        />
    </header>

    <div v-if="error" class="text-error">Failed to load: {{ error.message }}</div>
    <div v-else-if="loading" class="text-muted">
      <SkeletonGenreRow label="Top Rated" :count="3" />

      <SkeletonGenreRow  
        v-for="(genre, genreIndex) in showGenres"
        :key="genreIndex"
        :label="genre.name" :count="3"
      />
    </div>
    <div v-else>
      <HorizontalScroller
        label="Top Rated"
        show-controls
        describedById="top-rated-help"
      >
      <template #default>
        <ShowCard 
          v-for="(show, showIndex) in top.items.value" 
          :key="showIndex" 
          :show="show"
          as="a"
          :href="`/show/${show.id}`"
          />
      </template>
    </HorizontalScroller>

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
    </div>


  </section>
</template>

