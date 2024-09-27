import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { filmsUpcoming } from '@/services/films/filmsQueryOptions';

import Container from '@/components/layout/container/container.component';
import FilmList from '@/views/film-list/film-list.view';
import Spinner from '@/components/atoms/spinner/Spinner/spinner.component';

export const Route = createFileRoute('/upcoming/')({
   loader: ({ context: { queryClient } }) =>
      queryClient.ensureQueryData(filmsUpcoming),
   component: Index,
});

function Index() {
   const { data: popularFilms, isLoading } = useSuspenseQuery(filmsUpcoming);

   return (
      <Container>
         {isLoading ? <Spinner /> : <FilmList list={popularFilms} />}
      </Container>
   );
}
