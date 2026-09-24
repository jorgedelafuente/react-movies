import { createFileRoute } from '@tanstack/react-router';

import { ErrorComponent } from '@/components/layout/error-component/error-component.component';
import { filmsTopRatedQueryOptions } from '@/services/films/filmListQueryOptions';
import FilmListPage from '@/views/film-list/film-list-page.view';

export const Route = createFileRoute('/top-rated/')({
   loader: ({ context: { queryClient } }) =>
      queryClient.ensureQueryData(filmsTopRatedQueryOptions),
   component: () => <FilmListPage queryOptions={filmsTopRatedQueryOptions} />,
   errorComponent: ErrorComponent,
});
