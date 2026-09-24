import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import Spinner from '@/components/atoms/spinner/spinner.component';
import { ErrorComponent } from '@/components/layout/error-component/error-component.component';
import { seriesPopularQueryOptions } from '@/services/series/seriesListQueryOptions';
import FilmList from '@/views/film-list/film-list.view';

export const Route = createFileRoute('/series/popular/')({
   loader: ({ context: { queryClient } }) =>
      queryClient.ensureQueryData(seriesPopularQueryOptions),
   component: Index,
   errorComponent: ErrorComponent,
});

function Index() {
   const { data: popularSeries, isLoading } = useSuspenseQuery(
      seriesPopularQueryOptions
   );

   return <>{isLoading ? <Spinner /> : <FilmList list={popularSeries} />}</>;
}
