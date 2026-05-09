import { createFileRoute } from '@tanstack/react-router';

import {
   filmCreditsQueryOptions,
   filmQueryOptions,
   filmRecommendationsQueryOptions,
} from '@/services/films/filmQueryOptions';

export const Route = createFileRoute('/film/$filmId')({
   loader: ({ context: { queryClient }, params: { filmId } }) => {
      const id = Number(filmId);
      return Promise.all([
         queryClient.ensureQueryData(filmQueryOptions(id)),
         queryClient.ensureQueryData(filmCreditsQueryOptions(id)),
         queryClient.ensureQueryData(filmRecommendationsQueryOptions(id)),
      ]);
   },
});
