import { queryOptions } from '@tanstack/react-query';

import type { MediaType } from '@/types/media.types';

import { fetchMediaImages } from './images';

export const mediaImagesQueryOptions = (mediaType: MediaType, id: number) =>
   queryOptions({
      queryKey: ['media-images', { mediaType, id }],
      queryFn: () => fetchMediaImages(mediaType, id),
      // Artwork rarely changes; avoid refetching when the user returns.
      staleTime: 1000 * 60 * 60,
   });
