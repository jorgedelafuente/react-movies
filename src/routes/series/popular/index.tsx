import { createFileRoute } from '@tanstack/react-router';

import { ErrorComponent } from '@/components/layout/error-component/error-component.component';
import { seriesPopularQueryOptions } from '@/services/series/seriesListQueryOptions';
import FilmListPage from '@/views/film-list/film-list-page.view';

export const Route = createFileRoute('/series/popular/')({
   loader: ({ context: { queryClient } }) =>
      queryClient.ensureQueryData(seriesPopularQueryOptions),
   component: () => <FilmListPage queryOptions={seriesPopularQueryOptions} />,
   errorComponent: ErrorComponent,
});
