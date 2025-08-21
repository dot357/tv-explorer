// composables/useShow.ts
import { computed, unref, watch } from 'vue';
import type { Ref } from 'vue';
import type { Show } from '@/types/adapters/tv.adaptersTypes';
import { nh } from '@/services/nh';

export function useShow(id: number | Ref<number | null | undefined>) {
  const idRef = computed(() => unref(id));
  const req = nh.useRequest('getShow', { id: idRef.value as number });
  watch(idRef, (newId) => {
    if (newId === null || Number.isNaN(newId)) {
      req.cancel();
      req.data.value = null as unknown as Show;
      req.error.value = null;
      return;
    }
    req.run({ id: newId as number });
  }, { immediate: true });

  return {
    show: computed<Show | null>(() => req.data.value ?? null),
    loading: req.loading,
    error: req.error,
    status: req.status,
    refresh: () => {
      const v = idRef.value;
      if (v !== null && !Number.isNaN(v)) {
        req.run({ id: v as number })
        }
    },
    cancel: req.cancel,
  };
}
