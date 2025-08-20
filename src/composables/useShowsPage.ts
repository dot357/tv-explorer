import { computed, ref, watchEffect } from 'vue';
import type { Show } from '@/types/adapters/tv.adaptersTypes';
import { nh } from '../services/nh';

const pageCache = new Map<number, Show[]>();

export function useShowsPage(page = 0) {
  const currentPage = ref(page);
  const { data, status, loading, error, run, cancel } =
    nh.useRequest('getShowsPage', { page: currentPage.value });

  // simple mem cahce
  const pageData = ref<Show[] | null>(pageCache.get(currentPage.value) ?? null);

  watchEffect(async (onCleanup) => {
    const p = currentPage.value;

    if (pageCache.has(p)) {
      pageData.value = pageCache.get(p)!;
      return;
    }

    run({ page: p });
    onCleanup(() => cancel());
  });

  watchEffect(() => {
    if (data.value) {
      pageCache.set(currentPage.value, data.value);
      pageData.value = data.value;
    }
  });

  const ok = computed(() => (status.value ?? 0) >= 200 && (status.value ?? 0) < 300);

  return {
    page: currentPage,
    data: pageData,
    loading,
    error,
    ok,
    setPage: (p: number) => (currentPage.value = p),
    refresh: () => run({ page: currentPage.value }),
    cancel,
  };
}
