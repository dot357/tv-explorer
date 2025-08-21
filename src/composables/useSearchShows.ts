
import { ref, watch, onBeforeUnmount, computed } from 'vue';
import type { Show } from '@/types/adapters/tv.adaptersTypes';
import { nh } from '@/services/nh';

type SearchHit = { score: number; show: Show };

export function useSearchShows(initial = '', options?: { debounceMs?: number; page?: number }) {
 
  const req = nh.useRequest('searchShows', { q: initial, page: options?.page ?? 0 });
  const query = ref(initial);
  const debounceMs = options?.debounceMs ?? 300;

    //   Node.Timer deprecated
  let debounceTimer : NodeJS.Timeout;


    // eases for search andd also can be calleable from outside
  const run = (q = query.value) => req.run({ q, page: options?.page ?? 0 });

  // debounced auto-search
  watch(query, (q) => {
    clearTimeout(debounceTimer);
    if (!q?.trim()) {
    //   Empty
      req.cancel();
      req.data.value = [] as unknown as SearchHit[]; // keep type happy, show empty state
      req.error.value = null;
      return;
    }
    debounceTimer = setTimeout(() => run(q), debounceMs);
  });

//   Clear side effects on unmount
  onBeforeUnmount(() => clearTimeout(debounceTimer));

  // convenience
  const results = computed(() => req.data.value ?? []);
  const shows = computed(() => results.value.map(r => r.show));
  const sorted = computed(() => [...results.value].sort((a, b) => (b.score ?? 0) - (a.score ?? 0)));

  return {
    query,
    run,
    cancel: req.cancel,
    // reactive state
    results,     
    shows,      
    sorted,     
    loading: req.loading,
    error: req.error,
    status: req.status,
  };
}
