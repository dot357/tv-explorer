import { computed,  watchEffect } from 'vue';
import type { Show } from '@/types/adapters/tv.adaptersTypes';
import { useShowsPage } from '../composables/useShowsPage';

export type UseGenreBucketsOptions = {
  pagesToScan?: number;      // how many pages (x250) to scan
  perGenreLimit?: number;    // max items per genre bucket
  minRating?: number;        // filter by rating.average
  genres?: string[];         // default: provide externally
};

export function useGenreBuckets(genres: string[], opts: UseGenreBucketsOptions = {}) {
  const pagesToScan = opts.pagesToScan ?? 2;      // scan first 2 API pages by default
  const perGenre    = opts.perGenreLimit ?? 12;
  const minRating   = opts.minRating ?? 0;

  // Kick off N page fetches
  const pages = Array.from({ length: pagesToScan }, (_, i) => useShowsPage(i));

  // Combine data
  const all = computed<Show[]>(() => {
    const chunks = pages.map(p => p.data.value ?? []);
    return ([] as Show[]).concat(...chunks);
  });

  // status/flags
  const loading = computed(() => pages.some(p => p.loading.value));
  const error   = computed(() => pages.find(p => p.error.value)?.error.value ?? null);

  // Build buckets
  const buckets = computed(() => {
    const map = new Map<string, Show[]>();
    for (const g of genres){
       map.set(g, [])
    };

    for (const show of all.value) {
      const rating = show.rating?.average ?? 0;
      if (rating < minRating) {continue;}

      for (const g of show.genres ?? []) {
        if (!map.has(g)) {continue;}
        const arr = map.get(g)!;
        arr.push(show)
      }
    }

    // sort each bucket by rating desc, then trim (in case order was not ideal)
    for (const [g, arr] of map) {
      arr.sort((a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0));
      map.set(g, arr.slice(0, perGenre));
    }

    return map;
  });

  // Ensure initial runs
  watchEffect(() => {
    for (const p of pages) {
      if (!p.data.value && !p.loading.value && !p.error.value) {
        p.refresh();
      }
    }
  });

  return {
    loading,
    error,
    buckets,           // Map<genre, Show[]>
    pages,             // exposes underlying pages if you want to paginate later
    refreshAll: () => pages.forEach(p => p.refresh()),
  };
}
