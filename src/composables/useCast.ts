// composables/useCast.ts
import { computed, unref, watch } from 'vue';
import type { Ref } from 'vue';
import type { CastMember } from '@/types/adapters/tv.adaptersTypes'; // you can define CastMember here
import { nh } from '@/services/nh';

type MaybeRefNumber = number | Ref<number | null | undefined>;

export function useCast(showId: MaybeRefNumber) {
  const currentShowId = computed(() => unref(showId));

  const initialParams =
    typeof currentShowId.value === 'number' && !Number.isNaN(currentShowId.value)
      ? { id: currentShowId.value }
      : ({} as any);

  const request = nh.useRequest('getCast', initialParams);

  watch(
    currentShowId,
    (id) => {
      if (typeof id === 'number' && !Number.isNaN(id)) {
        request.run({ id });
      } else {
        request.cancel();
        request.data.value = [] as unknown as CastMember[];
        request.error.value = null;
      }
    },
    { immediate: true }
  );

  return {
    cast: computed<CastMember[]>(() => request.data.value ?? []),
    loading: request.loading,
    error: request.error,
    status: request.status,
    refreshCast: () => {
      const id = currentShowId.value;
      if (typeof id === 'number' && !Number.isNaN(id)) {
        request.run({ id });
      }
    },
    cancelRequest: request.cancel,
  };
}
