import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import Spinner from '@/components/atoms/spinner/spinner.component';
import { ErrorComponent } from '@/components/layout/error-component/error-component.component';
import { filmsUpcoming } from '@/services/films/filmsQueryOptions';
import FilmList from '@/views/film-list/film-list.view';

export const Route = createFileRoute('/upcoming/')({
   loader: ({ context: { queryClient } }) =>
      queryClient.ensureQueryData(filmsUpcoming),
   component: Index,
   errorComponent: ErrorComponent,
});

function Index() {
   const { data: popularFilms, isLoading } = useSuspenseQuery(filmsUpcoming);

   return <>{isLoading ? <Spinner /> : <FilmList list={popularFilms} />}</>;
}
