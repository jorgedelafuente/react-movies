import { createFileRoute } from '@tanstack/react-router';

import { ErrorComponent } from '@/components/layout/error-component/error-component.component';
import { filmsNowPlayingQueryOptions } from '@/services/films/filmListQueryOptions';
import FilmListPage from '@/views/film-list/film-list-page.view';

export const Route = createFileRoute('/now-playing/')({
   loader: ({ context: { queryClient } }) =>
      queryClient.ensureQueryData(filmsNowPlayingQueryOptions),
   component: () => <FilmListPage queryOptions={filmsNowPlayingQueryOptions} />,
   errorComponent: ErrorComponent,
});
