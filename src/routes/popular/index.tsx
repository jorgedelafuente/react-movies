import { createFileRoute } from '@tanstack/react-router';

import { ErrorComponent } from '@/components/layout/error-component/error-component.component';
import { filmsPopularQueryOptions } from '@/services/films/filmListQueryOptions';
import FilmListPage from '@/views/film-list/film-list-page.view';

export const Route = createFileRoute('/popular/')({
   loader: ({ context: { queryClient } }) =>
      queryClient.ensureQueryData(filmsPopularQueryOptions),
   component: () => <FilmListPage queryOptions={filmsPopularQueryOptions} />,
   errorComponent: ErrorComponent,
});
