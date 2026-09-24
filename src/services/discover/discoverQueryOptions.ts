import { queryOptions } from '@tanstack/react-query';

import type { DiscoverParams } from '@/types/discover.schemas';
import type { MediaType } from '@/types/media.types';

import { fetchDiscover, fetchGenres } from './discover';

export const discoverQueryOptions = (params: DiscoverParams) =>
   queryOptions({
      queryKey: ['discover', params],
      queryFn: () => fetchDiscover(params),
   });

/** Genre lists change rarely; keep them for the whole session. */
export const genresQueryOptions = (type: MediaType) =>
   queryOptions({
      queryKey: ['genres', { type }],
      queryFn: () => fetchGenres(type),
      staleTime: Infinity,
   });
