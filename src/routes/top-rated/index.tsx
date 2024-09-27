import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { filmsTopRatedQueryOptions } from '@/services/films/filmsQueryOptions';

import Container from '@/components/layout/container/container.component';
import FilmList from '@/views/film-list/film-list.view';
import Spinner from '@/components/atoms/spinner/Spinner/spinner.component';

export const Route = createFileRoute('/top-rated/')({
   loader: ({ context: { queryClient } }) =>
      queryClient.ensureQueryData(filmsTopRatedQueryOptions),
   component: Index,
});

function Index() {
   const { data: popularFilms, isLoading } = useSuspenseQuery(
      filmsTopRatedQueryOptions
   );

   return (
      <Container>
         {isLoading ? <Spinner /> : <FilmList list={popularFilms} />}
      </Container>
   );
}
