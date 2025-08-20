import { describe, it, expect } from 'vitest';
import { Adapter} from '../services/NetworkHandler';
import type { NetResult, RequestFn } from '@/types/NetworkHandlerTypes';


type Map = { ping: RequestFn<void, { pong: true }> };

describe('Adapter', () => {
  it('executes registered functions and lists keys', async () => {
    const ad = new Adapter<Map>({
      async ping() {
        return { data: { pong: true }, status: 200 } satisfies NetResult<{ pong: true }>;
      },
    });

    expect(ad.list()).toEqual(['ping']);
    const res = await ad.execute('ping');
    expect(res.status).toBe(200);
    expect(res.data.pong).toBe(true);
  });
});
