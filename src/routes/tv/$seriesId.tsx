import { createFileRoute } from '@tanstack/react-router';

import {
   seriesCreditsQueryOptions,
   seriesQueryOptions,
   seriesRecommendationsQueryOptions,
} from '@/services/series/seriesQueryOptions';

export const Route = createFileRoute('/tv/$seriesId')({
   loader: ({ context: { queryClient }, params: { seriesId } }) => {
      const id = Number(seriesId);
      return Promise.all([
         queryClient.ensureQueryData(seriesQueryOptions(id)),
         queryClient.ensureQueryData(seriesCreditsQueryOptions(id)),
         queryClient.ensureQueryData(seriesRecommendationsQueryOptions(id)),
      ]);
   },
});
