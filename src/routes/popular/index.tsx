import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { filmsPopularQueryOptions } from '@/services/films/filmsQueryOptions';
import { ErrorComponent } from '@/components/layout/error-component/error-component.component';

import FilmList from '@/views/film-list/film-list.view';
import Spinner from '@/components/atoms/spinner/Spinner/spinner.component';

export const Route = createFileRoute('/popular/')({
   loader: ({ context: { queryClient } }) =>
      queryClient.ensureQueryData(filmsPopularQueryOptions),
   component: Index,
   errorComponent: ErrorComponent,
});

function Index() {
   const { data: popularFilms, isLoading } = useSuspenseQuery(
      filmsPopularQueryOptions
   );

   return <>{isLoading ? <Spinner /> : <FilmList list={popularFilms} />}</>;
}
