import { createFileRoute } from '@tanstack/react-router';

import { ErrorComponent } from '@/components/layout/error-component/error-component.component';
import { seriesTopRatedQueryOptions } from '@/services/series/seriesListQueryOptions';
import FilmListPage from '@/views/film-list/film-list-page.view';

export const Route = createFileRoute('/series/top-rated/')({
   loader: ({ context: { queryClient } }) =>
      queryClient.ensureQueryData(seriesTopRatedQueryOptions),
   component: () => <FilmListPage queryOptions={seriesTopRatedQueryOptions} />,
   errorComponent: ErrorComponent,
});
