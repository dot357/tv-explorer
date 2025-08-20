import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Adapter, NetworkHandler } from '../services/NetworkHandler';
// import { Adapter, NetworkHandler } from '@/services/NetworkHandler';
import type { RequestFn, NetResult } from '@/types/NetworkHandlerTypes';

// --- helpers --------------------------------------------------------------
function delay(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const id = setTimeout(resolve, ms);
    if (signal) {
      const onAbort = () => {
        clearTimeout(id);
        const err = Object.assign(new Error('aborted'), { code: 'ABORT_ERR' });
        reject(err);
      };
      if (signal.aborted) onAbort();
      else signal.addEventListener('abort', onAbort, { once: true });
    }
  });
}

type OkPayload = { ok: true; n?: number };

// Build a test adapter with a few endpoints
type TestMap = {
  ok: RequestFn<{ n?: number }, OkPayload>;
  fail: RequestFn<void, never>;
  flaky: RequestFn<void, string>;
  slow: RequestFn<void, string>;
};

let adapter: Adapter<TestMap>;
let handler: NetworkHandler<TestMap>;

beforeEach(() => {
  let flakyCalls = 0;

  adapter = new Adapter<TestMap>({
    async ok(params, _ctx): Promise<NetResult<OkPayload>> {
      return { data: { ok: true, n: params?.n }, status: 200 };
    },
    async fail(): Promise<NetResult<never>> {
      // simulate axios-like failure
      const err: any = new Error('boom');
      err.status = 500;
      throw err;
    },
    async flaky(): Promise<NetResult<string>> {
      flakyCalls++;
      if (flakyCalls < 2) {
        const err: any = new Error('server down');
        err.status = 500;
        throw err;
      }
      return { data: 'finally ok', status: 200 };
    },
    async slow(_p, ctx): Promise<NetResult<string>> {
      await delay(10_000, ctx?.signal); // long task that we’ll cancel
      return { data: 'done', status: 200 };
    },
  });

  handler = new NetworkHandler(adapter);
});

afterEach(() => {
  vi.useRealTimers();
});

// --- tests ---------------------------------------------------------------
describe('NetworkHandler', () => {
  it('sets loading and returns data on success', async () => {
    const r = handler.useRequest('ok', { n: 7 });
    const p = r.run();
    expect(r.loading.value).toBe(true);
    await p;
    expect(r.loading.value).toBe(false);
    expect(r.status.value).toBe(200);
    expect(r.data.value).toEqual({ ok: true, n: 7 });
    expect(r.error.value).toBeNull();
  });

  it('captures error and status on failure', async () => {
    const r = handler.useRequest('fail');
    await r.run();
    expect(r.loading.value).toBe(false);
    expect(r.status.value).toBe(500);
    expect(r.data.value).toBeNull();
    expect(r.error.value?.message).toBeTruthy();
  });

  it('retries on retryable status and eventually succeeds', async () => {
    vi.useFakeTimers();
    const r = handler.useRequest('flaky', undefined, { retry: 1, retryDelayMs: 300 });
    const promise = r.run();
    // first attempt fails -> backoff 300ms -> second attempt succeeds
    await vi.advanceTimersByTimeAsync(300); // advance the backoff
    await promise;
    expect(r.status.value).toBe(200);
    expect(r.data.value).toBe('finally ok');
    expect(r.error.value).toBeNull();
  });

  it('cancel() aborts in-flight request and clears loading', async () => {
    vi.useFakeTimers(); // timers help us control time but not strictly required here
    const r = handler.useRequest('slow');
    const p = r.run();
    expect(r.loading.value).toBe(true);
    r.cancel();
    await p.catch(() => {}); // run() swallows abort by design; ensure it settles
    expect(r.loading.value).toBe(false);
    // after abort we expect no data and no error (by implementation choice)
    expect(r.data.value).toBeNull();
    
    expect(r.error.value).toBeNull();
  });

  it('refresh() reuses last params and keeps refs stable', async () => {
    const r = handler.useRequest('ok', { n: 1 });
    const firstRefs = { data: r.data, err: r.error, loading: r.loading };
    await r.run();
    const firstDataRef = r.data;
    await r.refresh();
    // same Ref instances should be reused
    expect(r.data).toBe(firstDataRef);
    expect(r.data).toBe(firstRefs.data);
    expect(r.error).toBe(firstRefs.err);
    expect(r.loading).toBe(firstRefs.loading);
  });

  it('mapResponse transforms payload', async () => {
    const r = handler.useRequest('ok', { n: 3 }, {
      mapResponse: (d) => ({ ...d, n: (d.n ?? 0) * 2 }),
    });
    await r.run();
    expect(r.data.value).toEqual({ ok: true, n: 6 });
  });
});
