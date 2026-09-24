import { createFileRoute } from '@tanstack/react-router';

import {
   seasonQueryOptions,
   seriesQueryOptions,
} from '@/services/series/seriesQueryOptions';

export const Route = createFileRoute('/tv/$seriesId_/season/$seasonNumber')({
   loader: ({
      context: { queryClient },
      params: { seriesId, seasonNumber },
   }) => {
      const id = Number(seriesId);
      const season = Number(seasonNumber);
      return Promise.all([
         queryClient.ensureQueryData(seriesQueryOptions(id)),
         queryClient.ensureQueryData(seasonQueryOptions(id, season)),
      ]);
   },
});
