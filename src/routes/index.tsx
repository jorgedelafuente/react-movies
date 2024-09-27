import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { filmsPopularQueryOptions } from '@/services/films/filmsQueryOptions';

import FilmList from '@/views/film-list/film-list.view';
import Spinner from '@/components/atoms/spinner/Spinner/spinner.component';

export const Route = createFileRoute('/')({
   loader: ({ context: { queryClient } }) =>
      queryClient.ensureQueryData(filmsPopularQueryOptions),
   component: Index,
});

function Index() {
   const { data: popularFilms, isLoading } = useSuspenseQuery(
      filmsPopularQueryOptions
   );

   return <>{isLoading ? <Spinner /> : <FilmList list={popularFilms} />}</>;
}
