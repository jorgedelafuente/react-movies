import { useSuspenseQuery } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';

import { ErrorComponent } from '@/components/layout/error-component/error-component.component';
import {
   seasonQueryOptions,
   seriesQueryOptions,
} from '@/services/series/seriesQueryOptions';
import SeasonInfo from '@/views/season-info/season-info.view';

export const Route = createLazyFileRoute('/tv/$seriesId_/season/$seasonNumber')(
   {
      errorComponent: ErrorComponent,
      component: SeasonComponent,
   }
);

function SeasonComponent() {
   const { seriesId, seasonNumber } = Route.useParams();
   const id = Number(seriesId);
   const { data: seriesInfo } = useSuspenseQuery(seriesQueryOptions(id));
   const { data: season } = useSuspenseQuery(
      seasonQueryOptions(id, Number(seasonNumber))
   );

   return <SeasonInfo seriesInfo={seriesInfo} season={season} />;
}
