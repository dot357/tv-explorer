import { NetworkHandler } from '@/services/NetworkHandler';
import { tvAdapter } from '@/services/tv.adapter';

export const nh = new NetworkHandler(tvAdapter);
