import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import Spinner from '@/components/atoms/spinner/spinner.component';
import { ErrorComponent } from '@/components/layout/error-component/error-component.component';
import { filmsNowPlayingQueryOptions } from '@/services/films/filmsQueryOptions';
import FilmList from '@/views/film-list/film-list.view';

export const Route = createFileRoute('/now-playing/')({
   loader: ({ context: { queryClient } }) =>
      queryClient.ensureQueryData(filmsNowPlayingQueryOptions),
   component: Index,
   errorComponent: ErrorComponent,
});

function Index() {
   const { data: nowPlaying, isLoading } = useSuspenseQuery(
      filmsNowPlayingQueryOptions
   );

   return <>{isLoading ? <Spinner /> : <FilmList list={nowPlaying} />}</>;
}
