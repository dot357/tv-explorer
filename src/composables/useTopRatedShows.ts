import { computed } from 'vue';
import type { Show } from '@/types/adapters/tv.adaptersTypes';
import { useShowsPage } from './useShowsPage';

export function useTopRatedShows(limit = 12, pagesToScan = 2) {
  const pages = Array.from({ length: pagesToScan }, (_, i) => useShowsPage(i));

  const loading = computed(() => pages.some(p => p.loading.value));
  const error   = computed(() => pages.find(p => p.error.value)?.error.value ?? null);

  const items = computed<Show[]>(() => {
    const all = pages.flatMap(p => p.data.value ?? []);
    return all
      // (tvmaze doesn’t expose votes; we can just sort by rating)
      .sort((a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0))
      .slice(0, limit);
  });

  return { items, loading, error, refreshAll: () => pages.forEach(p => p.refresh()) };
}
