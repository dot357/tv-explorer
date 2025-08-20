// src/services/NetworkHandler.ts
import type { NetworkError, RequestMap, RequestFn, RequestCtx, NetResult, UseRequestOptions } from '@/types/NetworkHandlerTypes';
import { ref, type Ref } from 'vue';



/** Small helper to normalize unknown errors */
function normalizeError(err: unknown): NetworkError {
  // Axios-like
  // @ts-expect-error - loose shape
  const maybeAxios = err?.response?.status;
  // Fetch-like
  // @ts-expect-error - loose shape
  const maybeStatus = err?.status;

  if (typeof err === 'object' && err) {
    const anyErr = err as any;
    return {
      message: anyErr.message ?? 'Network error',
      status: anyErr.status ?? maybeAxios ?? maybeStatus,
      code: anyErr.code,
      cause: err,
    };
  }
  return { message: String(err ?? 'Network error') };
}

/** =========================
 *  Adapter: register your requests for a service
 *  ========================= */
export class Adapter<T extends RequestMap> {
  #requests: T;
  constructor(requests: T) {
    this.#requests = requests;
  }

  /** Add a request in a typed-safe way; returns a new Adapter with the added key */
  setRequest<K extends string, P, R>(name: K, fn: RequestFn<P, R>) {
    return new Adapter({ ...this.#requests, [name]: fn } as T & Record<K, RequestFn<P, R>>);
  }

  getRequest<K extends keyof T>(name: K): T[K] {
    return this.#requests[name];
  }

  execute<K extends keyof T>(name: K, params?: Parameters<T[K]>[0], ctx?: RequestCtx) {
    const fn = this.getRequest(name);
    if (!fn) throw new Error(`Request '${String(name)}' not found.`);
    return fn(params, ctx);
  }

  /** Helpful for tooling/debug */
  list(): (keyof T)[] {
    return Object.keys(this.#requests) as (keyof T)[];
  }
}

/** =========================
 *  Network Handler
 *  ========================= */



export class NetworkHandler<T extends RequestMap> {
  #adapter: Adapter<T>;
  constructor(adapter: Adapter<T>) {
    this.#adapter = adapter;
  }

  /**
   * Stable reactive request state for a given request key.
   * - `run(params?)` to execute
   * - `refresh()` to re-run last params
   * - `cancel()` to abort in-flight call
   */
  useRequest<K extends keyof T, R = Awaited<ReturnType<T[K]>> extends NetResult<infer D> ? D : unknown>(
    name: K,
    initialParams?: Parameters<T[K]>[0],
    opts?: UseRequestOptions<T, K, R>
  ) {
    const data = ref<R | null>(null) as Ref<R | null>;
    const status = ref<number | null>(null);
    const loading = ref<boolean>(false);
    const error = ref<NetworkError | null>(null);

    let lastParams = initialParams as Parameters<T[K]>[0] | undefined;
    let controller: AbortController | null = null;

    const retryCount = opts?.retry ?? 0;
    const retryDelayMs = opts?.retryDelayMs ?? 400;
    const isRetryable = opts?.isRetryableStatus ?? ((s?: number) => s === 408 || s === 429 || !!(s && s >= 500));

    const run = async (params?: Parameters<T[K]>[0], ctx?: RequestCtx) => {
      lastParams = params ?? lastParams;
      controller?.abort();
      controller = new AbortController();

      loading.value = true;
      error.value = null;

      let attempts = 0;

      const exec = async (): Promise<void> => {
        try {
          const res = await this.#adapter.execute(name, lastParams, { signal: controller!.signal, ...ctx });
          status.value = res.status ?? 200;
          const payload: R = res.data;
          data.value = opts?.mapResponse ? opts.mapResponse(payload) : payload;
        } catch (e) {
          const aborted =
            (typeof e === 'object' && e && ('name' in e) && (e as any).name === 'AbortError') ||
            (e as any)?.code === 'ABORT_ERR' ||
            controller?.signal.aborted;

          if (aborted) {
            status.value = 0;
            error.value = null;  // dont surface abort as an error 
            return;              // stop retries on abort
          }

          const ne = normalizeError(e);
          status.value = ne.status ?? 0;

          if (attempts < retryCount && isRetryable(ne.status)) {
            attempts += 1;
            if (retryDelayMs > 0) await new Promise(r => setTimeout(r, retryDelayMs));
            return exec();
          }
          error.value = ne;
        } finally {
          // If it was aborted, leave error null and status 0
          loading.value = false;
        }
      };

      await exec();
    };

    

    const refresh = () => run();
    const cancel = () => controller?.abort();

    return { data, status, loading, error, run, refresh, cancel };
  }

 
}

