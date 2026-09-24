import { useSuspenseQuery } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';

import { ErrorComponent } from '@/components/layout/error-component/error-component.component';
import {
   seriesCreditsQueryOptions,
   seriesQueryOptions,
   seriesRecommendationsQueryOptions,
   seriesVideoQueryOptions,
} from '@/services/series/seriesQueryOptions';
import { pickTrailer } from '@/utils/pickTrailer';
import SeriesInfo from '@/views/series-info/series-info.view';

export const Route = createLazyFileRoute('/tv/$seriesId')({
   errorComponent: ErrorComponent,
   component: SeriesComponent,
});

function SeriesComponent() {
   const seriesId = Number(Route.useParams().seriesId);
   const { data: seriesInfo } = useSuspenseQuery(seriesQueryOptions(seriesId));
   const { data: seriesVideos } = useSuspenseQuery(
      seriesVideoQueryOptions(seriesId)
   );
   const { data: seriesCredits } = useSuspenseQuery(
      seriesCreditsQueryOptions(seriesId)
   );
   const { data: recommendations } = useSuspenseQuery(
      seriesRecommendationsQueryOptions(seriesId)
   );

   return (
      <SeriesInfo
         seriesInfo={seriesInfo}
         seriesTrailer={pickTrailer(seriesVideos.results)}
         seriesCredits={seriesCredits}
         recommendations={recommendations}
      />
   );
}
