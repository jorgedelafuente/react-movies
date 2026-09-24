import { queryOptions } from '@tanstack/react-query';

import type { MediaType } from '@/types/media.types';

import { fetchMediaReviews } from './reviews';

export const mediaReviewsQueryOptions = (mediaType: MediaType, id: number) =>
   queryOptions({
      queryKey: ['media-reviews', { mediaType, id }],
      queryFn: () => fetchMediaReviews(mediaType, id),
      // New reviews are rare; avoid refetching when the user returns.
      staleTime: 1000 * 60 * 10,
   });
