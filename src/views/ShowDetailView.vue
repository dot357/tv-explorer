<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useShow } from '@/composables/useShow';
import { useEpisodes } from '@/composables/useEpisodes';
import { twMerge } from 'tailwind-merge';
import { genreBgClass, genreColorClass } from '@/utils/genreClass';

// PrimeVue (local registration for <script setup>)
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
defineOptions({ components: { DataTable, Column } });

const route = useRoute();
const router = useRouter();

// guard against NaN and keep it reactive
const showId = computed<number | null>(() => {
  const raw = route.params.id;
  if (typeof raw === 'string' && raw.trim() !== '') {
    const n = Number(raw);
    return Number.isNaN(n) ? null : n;
  }
  return null;
});

// pass the REF, not its value
const { show, loading, error, refresh } = useShow(showId);

// episodes by show id (pass the REF)
const {
  episodes,
  loading: episodesLoading,
  error: episodesError,
  refreshEpisodes
} = useEpisodes(showId);

// helpers
const formatCode = (season?: number, number?: number) =>
  `S${String(season ?? 0).padStart(2, '0')}E${String(number ?? 0).padStart(2, '0')}`;

const stripHtml = (html?: string) => (html ? html.replace(/<[^>]*>/g, '').trim() : '');

function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural
}

</script>

<template>
  <section class="p-4" aria-labelledby="show-title">
    <button class="btn mb-3" @click="router.back()" aria-label="Go back to previous page">
      ← Back
    </button>

    <div v-if="loading" role="status" aria-live="polite" class="space-y-2">
      <div class="skeleton skeleton-line" style="--lines:1; --l-h:24px; width: 60%"></div>
      <div class="skeleton skeleton-rect" style="height: 180px;"></div>
      <div class="skeleton skeleton-line" style="--lines:3;"></div>
    </div>

    <div v-else-if="error">
      <p class="text-red-500" role="alert">
        Couldn’t load the show.
        <button class="btn ml-2" @click="refresh">Try again</button>
      </p>
    </div>

    <article
      v-else-if="show"
      class="relative h-[800px] flex items-end ring-2 ring-black/60 rounded-sm
              bg-fixed bg-center bg-cover"
      :style="{ backgroundImage: `url(${show.image?.original || show.image?.medium})` }"
    >
      <div class="absolute top-0 left-0 right-0 w-full h-[800px]" />
      <div class="z-10 bg-surface/90 backdrop-blur w-full h-[400px] mt-auto px-4 py-4">
        <h1 id="show-title" class="text-2xl font-semibold mb-2">{{ show.name }}</h1>

        <p class="mb-2">
          <span class="chip" aria-label="Show rating">
            <i class="pi pi-star" aria-hidden="true"></i> {{ show.rating?.average ?? 'N/A' }}
          </span>
          <span class="chip ml-2" v-if="show.premiered">Premiered: {{ show.premiered }}</span>
          <span class="chip ml-2" v-if="show.language">Language: {{ show.language }}</span>
        </p>

        <p class="text-sm opacity-80 mb-2" v-if="show.genres?.length">
          <span
            v-for="genre in show.genres"
            :key="genre"
            :class="twMerge(
              'genre-chip focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              'ring-offset-surface',
              `${genreColorClass(genre)} ${genreBgClass(genre, 100)}`
            )"
          >
            {{ genre }}
          </span>
        </p>

        <div
          class="prose prose-invert max-w-none h-[200px] overflow-scroll md:h-[unset] md:overflow-auto"
          v-if="show.summary"
          v-html="show.summary"
        />

        <a
          v-if="show.officialSite"
          class="btn btn-primary mt-auto inline-block"
          :href="show.officialSite"
          target="_blank"
          rel="noopener noreferrer"
        >
          Official site
        </a>
      </div>
    </article>

    <p v-else>No data for this show.</p>

    <!-- Episodes Table -->
    <section class="mt-8" aria-labelledby="episodes-heading">
      <h2 id="episodes-heading" class="text-xl font-semibold mb-3">Episodes</h2>

      <div v-if="episodesLoading" role="status" aria-live="polite" class="space-y-2">
        <div class="skeleton skeleton-line" style="--lines:1; width: 30%"></div>
        <div class="skeleton skeleton-line" style="--lines:4;"></div>
      </div>

      <div v-else-if="episodesError" role="alert" class="text-red-500">
        Couldn’t load episodes.
        <button class="btn ml-2" @click="refreshEpisodes">Try again</button>
      </div>
      <div  v-else >
        <DataTable
        
          :value="episodes"
          dataKey="id"
          :paginator="true"
          :rows="20"
          :rowsPerPageOptions="[10, 20, 50]"
          sortField="airdate"
          :sortOrder="1"
          responsiveLayout="scroll"
          tableStyle="min-width: 640px"
          aria-labelledby="episodes-heading"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <p 
                  class="font-medium" 
                  aria-live="polite" 
                  role="status"
                >
                  Total {{ episodes.length }} {{ pluralize(episodes.length, 'episode', 'episodes') }}
                </p>
              <button class="btn" @click="refreshEpisodes" aria-label="Refresh episodes">Refresh</button>
            </div>
          </template>

          <Column header="Code" >
            <template #body="{ data }">
              {{ formatCode(data.season, data.number) }}
            </template>
          </Column>

          <Column field="name" header="Title" :sortable="true" />

          <Column field="airdate" header="Air date" :sortable="true">
            <template #body="{ data }">
              {{ data.airdate ?? (data.airstamp ? new Date(data.airstamp).toISOString().slice(0, 10) : '—') }}
            </template>
          </Column>

          <Column field="runtime" header="Runtime (min)" :sortable="true">
            <template #body="{ data }">
              {{ data.runtime ?? '—' }}
            </template>
          </Column>

          <Column header="Summary">
            <template #body="{ data }">
              <span class="line-clamp-2 block" :title="stripHtml(data.summary)">
                {{ stripHtml(data.summary.slice(0,100)) + '...' || '—' }}
              </span>
            </template>
          </Column>
        </DataTable>
      </div>
    </section>
  </section>
</template>
