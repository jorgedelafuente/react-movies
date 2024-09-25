import { createFileRoute } from '@tanstack/react-router';

import { filmQueryOptions } from '@/services/films/filmQueryOptions';

export const Route = createFileRoute('/film/$filmId')({
   loader: ({ context: { queryClient }, params: { filmId } }) => {
      return queryClient.ensureQueryData(filmQueryOptions(Number(filmId)));
   },
});
