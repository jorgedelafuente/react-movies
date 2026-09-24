import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import Spinner from '@/components/atoms/spinner/spinner.component';
import { ErrorComponent } from '@/components/layout/error-component/error-component.component';
import { seriesTopRatedQueryOptions } from '@/services/series/seriesListQueryOptions';
import FilmList from '@/views/film-list/film-list.view';

export const Route = createFileRoute('/series/top-rated/')({
   loader: ({ context: { queryClient } }) =>
      queryClient.ensureQueryData(seriesTopRatedQueryOptions),
   component: Index,
   errorComponent: ErrorComponent,
});

function Index() {
   const { data: topRatedSeries, isLoading } = useSuspenseQuery(
      seriesTopRatedQueryOptions
   );

   return <>{isLoading ? <Spinner /> : <FilmList list={topRatedSeries} />}</>;
}
