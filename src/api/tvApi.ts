
import axios from 'axios';


export const tvApi = axios.create({
  baseURL: 'https://api.tvmaze.com',
  timeout: 10000,
});

// setupCache(tvApi); 

// helper to set the TV API token
export function setTvToken(t: string) {
  tvApi.defaults.headers.common['Authorization'] = `Bearer ${t}`;
}