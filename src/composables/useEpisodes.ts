// composables/useEpisodes.ts
import { computed, unref, watch } from 'vue';
import type { Ref } from 'vue';
import type { Episode } from '@/types/adapters/tv.adaptersTypes';
import { nh } from '@/services/nh';

type MaybeRefNumber = number | Ref<number | null | undefined>;

export function useEpisodes(showId: MaybeRefNumber) {
  const currentShowId = computed(() => unref(showId));
  const initialParams =
    typeof currentShowId.value === 'number' && !Number.isNaN(currentShowId.value)
      ? { id: currentShowId.value }
      : ({} as any);

  const request = nh.useRequest('getEpisodes', initialParams);

  watch(
    currentShowId,
    (id) => {
      if (typeof id === 'number' && !Number.isNaN(id)) {
        request.run({ id });
      } else {
        request.cancel();
        request.data.value = [] as unknown as Episode[];
        request.error.value = null;
      }
    },
    { immediate: true }
  );

  return {
    episodes: computed<Episode[]>(() => request.data.value ?? []),
    loading: request.loading,
    error: request.error,
    status: request.status,
    refreshEpisodes: () => {
      const id = currentShowId.value;
      if (typeof id === 'number' && !Number.isNaN(id)) {request.run({ id });}
    },
    cancelRequest: request.cancel,
  };
}
