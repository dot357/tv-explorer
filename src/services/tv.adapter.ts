import type { CastMember, CrewMember, Episode, Season, Show } from "@/types/adapters/tv.adaptersTypes";
import { Adapter } from "../services/NetworkHandler";
import type { NetResult, RequestFn } from "@/types/NetworkHandlerTypes";
import { tvApi } from "../api/tvApi";

type TvRequests = {
  getShowsPage: RequestFn<{ page?: number }, Show[]>;
  // Lets confirm does search supports pagination?
  searchShows:  RequestFn<{ q: string; page?: number }, { score: number; show: Show }[]>;
  getSeasons:   RequestFn<{ id: number }, Season[]>;
  getEpisodes:  RequestFn<{ id: number; seasonId?: number }, Episode[]>;
  getCast:      RequestFn<{ id: number }, CastMember[]>;
  getCrew:      RequestFn<{ id: number }, CrewMember[]>;
};

export const tvAdapter = new Adapter<TvRequests>({
  async getShowsPage(params) {
    const { page = 0 } = params ?? {};
    const res = await tvApi.get<Show[]>('/shows', { params: { page } });
    return { data: res.data, status: res.status } satisfies NetResult<Show[]>;
  },

  async searchShows(params) {
    const { q, page = 0 } = params ?? ({} as { q: string; page?: number });
    if (!q || !q.trim()) {
      // Optional: enforce a non-empty search query
      return { data: [], status: 200 } as NetResult<{ score: number; show: Show }[]>;
    }
    const res = await tvApi.get<{ score: number; show: Show }[]>('/search/shows', { params: { q, page } });
    return { data: res.data, status: res.status } satisfies NetResult<{ score: number; show: Show }[]>;
  },

  async getSeasons(params) {
    const { id } = params ?? ({} as { id: number });
    if (id == null) {throw new Error('getSeasons: "id" is required');}
    const res = await tvApi.get<Season[]>(`/shows/${id}/seasons`);
    return { data: res.data, status: res.status } satisfies NetResult<Season[]>;
  },

  async getEpisodes(params) {
    const { id, seasonId } = params ?? ({} as { id: number; seasonId?: number });
    if (seasonId != null) {
      const res = await tvApi.get<Episode[]>(`/seasons/${seasonId}/episodes`);
      return { data: res.data, status: res.status } satisfies NetResult<Episode[]>;
    }
    if (id == null) {throw new Error('getEpisodes: "id" is required when "seasonId" is not provided');}
    const res = await tvApi.get<Episode[]>(`/shows/${id}/episodes`);
    return { data: res.data, status: res.status } satisfies NetResult<Episode[]>;
  },

  async getCast(params) {
    const { id } = params ?? ({} as { id: number });
    if (id == null) {throw new Error('getCast: "id" is required');}
    const res = await tvApi.get<CastMember[]>(`/shows/${id}/cast`);
    return { data: res.data, status: res.status } satisfies NetResult<CastMember[]>;
  },

  async getCrew(params) {
    const { id } = params ?? ({} as { id: number });
    if (id == null) {throw new Error('getCrew: "id" is required');}
    const res = await tvApi.get<CrewMember[]>(`/shows/${id}/crew`);
    return { data: res.data, status: res.status } satisfies NetResult<CrewMember[]>;
  },
});
