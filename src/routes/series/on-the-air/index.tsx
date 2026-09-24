import { createFileRoute } from '@tanstack/react-router';

import { ErrorComponent } from '@/components/layout/error-component/error-component.component';
import { seriesOnTheAirQueryOptions } from '@/services/series/seriesListQueryOptions';
import FilmListPage from '@/views/film-list/film-list-page.view';

export const Route = createFileRoute('/series/on-the-air/')({
   loader: ({ context: { queryClient } }) =>
      queryClient.ensureQueryData(seriesOnTheAirQueryOptions),
   component: () => <FilmListPage queryOptions={seriesOnTheAirQueryOptions} />,
   errorComponent: ErrorComponent,
});
