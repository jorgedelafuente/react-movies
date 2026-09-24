import { createFileRoute } from '@tanstack/react-router';

import { ErrorComponent } from '@/components/layout/error-component/error-component.component';
import { filmsUpcomingQueryOptions } from '@/services/films/filmListQueryOptions';
import FilmListPage from '@/views/film-list/film-list-page.view';

export const Route = createFileRoute('/upcoming/')({
   loader: ({ context: { queryClient } }) =>
      queryClient.ensureQueryData(filmsUpcomingQueryOptions),
   component: () => <FilmListPage queryOptions={filmsUpcomingQueryOptions} />,
   errorComponent: ErrorComponent,
});
