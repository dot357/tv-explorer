// Core Types

export type NetResult<D> = {
  data: D;
  status: number;
  headers?: Record<string, string>;
};


export type RequestCtx = {
  signal?: AbortSignal;
  headers?: Record<string, string>;
  meta?: Record<string, unknown>;
};


export type RequestFn<P = unknown, R = unknown> = (params?: P, ctx?: RequestCtx) => Promise<NetResult<R>>;


export type RequestMap = Record<string, RequestFn<any, any>>;



export type NetworkError = {
  message: string;
  status?: number;
  code?: string;
  cause?: unknown;
};


// Network Hanlder types

export type UseRequestOptions<
  T extends RequestMap,
  K extends keyof T,
  R = Awaited<ReturnType<T[K]>> extends NetResult<infer D> ? D : unknown
> = {
  /** map/transform API payload into a view model */
  mapResponse?: (data: R) => R;
  /** retry count on failures (network/5xx) */
  retry?: number; // default 0
  /** backoff delay between retries in ms */
  retryDelayMs?: number; // default 400
  /** treat these statuses as retryable (default: 408, 429, 500-599) */
  isRetryableStatus?: (status?: number) => boolean;
};