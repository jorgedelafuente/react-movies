import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import Spinner from '@/components/atoms/spinner/spinner.component';
import { ErrorComponent } from '@/components/layout/error-component/error-component.component';
import { filmsTopRatedQueryOptions } from '@/services/films/filmsQueryOptions';
import FilmList from '@/views/film-list/film-list.view';

export const Route = createFileRoute('/top-rated/')({
   loader: ({ context: { queryClient } }) =>
      queryClient.ensureQueryData(filmsTopRatedQueryOptions),
   component: Index,
   errorComponent: ErrorComponent,
});

function Index() {
   const { data: popularFilms, isLoading } = useSuspenseQuery(
      filmsTopRatedQueryOptions
   );

   return <>{isLoading ? <Spinner /> : <FilmList list={popularFilms} />}</>;
}
