import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import Spinner from '@/components/atoms/spinner/spinner.component';
import { ErrorComponent } from '@/components/layout/error-component/error-component.component';
import { seriesOnTheAirQueryOptions } from '@/services/series/seriesListQueryOptions';
import FilmList from '@/views/film-list/film-list.view';

export const Route = createFileRoute('/series/on-the-air/')({
   loader: ({ context: { queryClient } }) =>
      queryClient.ensureQueryData(seriesOnTheAirQueryOptions),
   component: Index,
   errorComponent: ErrorComponent,
});

function Index() {
   const { data: onTheAirSeries, isLoading } = useSuspenseQuery(
      seriesOnTheAirQueryOptions
   );

   return <>{isLoading ? <Spinner /> : <FilmList list={onTheAirSeries} />}</>;
}
