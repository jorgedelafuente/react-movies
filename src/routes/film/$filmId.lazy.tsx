import { useSuspenseQuery } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';

import {
   filmQueryOptions,
   filmVideoQueryOptions,
} from '@/services/films/filmQueryOptions';
import { FilmErrorComponent } from '@/components/layout/error-component/error-component';

import Spinner from '@/components/atoms/spinner/Spinner/spinner.component';
import FilmInfo from '@/views/film-info/film-info.view';
import { VIDEO_TYPES } from '@/views/film-info/film-info.constants';

export const Route = createLazyFileRoute('/film/$filmId')({
   errorComponent: FilmErrorComponent,
   component: FilmComponent,
});

function FilmComponent() {
   const filmId = Route.useParams().filmId;
   const { data: filmInfo, isLoading } = useSuspenseQuery(
      filmQueryOptions(Number(filmId))
   );
   const { data: filmTrailerList } = useSuspenseQuery(
      filmVideoQueryOptions(Number(filmId))
   );

   const filmTrailer = filmTrailerList.results.filter(
      (item) => item.type === VIDEO_TYPES.TRAILER
   );

   const officialFilmTrailer =
      (Array.isArray(filmTrailer) &&
         filmTrailer.find(
            (item) =>
               item.name === VIDEO_TYPES.FINAL_TRAILER ||
               item.name === VIDEO_TYPES.OFFICIAL_TRAILER
         )) ||
      filmTrailer[0];

   return (
      <>
         {isLoading ? (
            <Spinner />
         ) : (
            <FilmInfo filmInfo={filmInfo} filmTrailer={officialFilmTrailer} />
         )}
      </>
   );
}
