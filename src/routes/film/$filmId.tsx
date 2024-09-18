import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';

import {
   filmQueryOptions,
   filmVideoQueryOptions,
} from '@/services/films/filmQueryOptions';
import { FilmErrorComponent } from '@/components/layout/error-component/error-component';

import Spinner from '@/components/spinner/Spinner/spinner.component';
import FilmInfo from '@/views/film-info/film-info.view';

export const Route = createFileRoute('/film/$filmId')({
   loader: ({ context: { queryClient }, params: { filmId } }) => {
      return queryClient.ensureQueryData(filmQueryOptions(filmId));
   },
   errorComponent: FilmErrorComponent,
   component: FilmComponent,
});

function FilmComponent() {
   const filmId = Route.useParams().filmId;
   const { data: filmInfo, isLoading } = useSuspenseQuery(
      filmQueryOptions(filmId)
   );
   const { data: filmTrailerList } = useSuspenseQuery(
      filmVideoQueryOptions(filmId)
   );

   const filmTrailer = filmTrailerList.results.find(
      (item) => item.type === 'Trailer' && item.name === 'Official Trailer'
   );

   return (
      <>
         {isLoading ? (
            <Spinner />
         ) : (
            <FilmInfo filmInfo={filmInfo} filmTrailer={filmTrailer} />
         )}
      </>
   );
}
