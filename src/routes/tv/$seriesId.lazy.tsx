import { useSuspenseQuery } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';

import Spinner from '@/components/atoms/spinner/spinner.component';
import { ErrorComponent } from '@/components/layout/error-component/error-component.component';
import {
   seriesCreditsQueryOptions,
   seriesQueryOptions,
   seriesRecommendationsQueryOptions,
   seriesVideoQueryOptions,
} from '@/services/series/seriesQueryOptions';
import { VIDEO_TYPES } from '@/views/film-info/film-info.constants';
import SeriesInfo from '@/views/series-info/series-info.view';

export const Route = createLazyFileRoute('/tv/$seriesId')({
   errorComponent: ErrorComponent,
   component: SeriesComponent,
});

function SeriesComponent() {
   const seriesId = Number(Route.useParams().seriesId);
   const { data: seriesInfo, isLoading } = useSuspenseQuery(
      seriesQueryOptions(seriesId)
   );
   const { data: seriesTrailerList } = useSuspenseQuery(
      seriesVideoQueryOptions(seriesId)
   );
   const { data: seriesCredits } = useSuspenseQuery(
      seriesCreditsQueryOptions(seriesId)
   );
   const { data: recommendations } = useSuspenseQuery(
      seriesRecommendationsQueryOptions(seriesId)
   );

   const trailers = seriesTrailerList.results.filter(
      (item) => item.type === VIDEO_TYPES.TRAILER
   );

   const officialTrailer =
      trailers.find(
         (item) =>
            item.name === VIDEO_TYPES.FINAL_TRAILER ||
            item.name === VIDEO_TYPES.OFFICIAL_TRAILER
      ) ?? trailers[0];

   return (
      <>
         {isLoading ? (
            <Spinner />
         ) : (
            <SeriesInfo
               seriesInfo={seriesInfo}
               seriesTrailer={officialTrailer}
               seriesCredits={seriesCredits}
               recommendations={recommendations}
            />
         )}
      </>
   );
}
