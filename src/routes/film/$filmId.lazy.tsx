import { useSuspenseQuery } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';

import { ErrorComponent } from '@/components/layout/error-component/error-component.component';
import {
   filmCreditsQueryOptions,
   filmQueryOptions,
   filmRecommendationsQueryOptions,
   filmVideoQueryOptions,
} from '@/services/films/filmQueryOptions';
import { pickTrailer } from '@/utils/pickTrailer';
import FilmInfo from '@/views/film-info/film-info.view';

export const Route = createLazyFileRoute('/film/$filmId')({
   errorComponent: ErrorComponent,
   component: FilmComponent,
});

function FilmComponent() {
   const filmId = Number(Route.useParams().filmId);
   const { data: filmInfo } = useSuspenseQuery(filmQueryOptions(filmId));
   const { data: filmVideos } = useSuspenseQuery(filmVideoQueryOptions(filmId));
   const { data: filmCredits } = useSuspenseQuery(
      filmCreditsQueryOptions(filmId)
   );
   const { data: recommendations } = useSuspenseQuery(
      filmRecommendationsQueryOptions(filmId)
   );

   return (
      <FilmInfo
         filmInfo={filmInfo}
         filmTrailer={pickTrailer(filmVideos.results)}
         filmCredits={filmCredits}
         recommendations={recommendations}
      />
   );
}
