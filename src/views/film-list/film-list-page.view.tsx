import {
   type QueryKey,
   useSuspenseQuery,
   type UseSuspenseQueryOptions,
} from '@tanstack/react-query';

import type { FilmInfoType } from '@/types/films.schemas';
import FilmList from '@/views/film-list/film-list.view';

type FilmListPageProps<TQueryKey extends QueryKey> = {
   /**
    * One of the list queries from `src/services` (`filmsPopularQueryOptions`,
    * `seriesOnTheAirQueryOptions`, ...). The route's loader must `ensureQueryData`
    * the same options so this render never suspends on first paint.
    */
   queryOptions: UseSuspenseQueryOptions<
      FilmInfoType[],
      Error,
      FilmInfoType[],
      TQueryKey
   >;
};

/**
 * The page body shared by every list route (`/popular`, `/series/top-rated`, ...):
 * read the list from the query cache and hand it to `FilmList`. Loading and
 * error states are handled by the router (`defaultPendingComponent` in
 * `main.tsx`, `errorComponent` on each route), not here.
 */
const FilmListPage = <TQueryKey extends QueryKey>({
   queryOptions,
}: FilmListPageProps<TQueryKey>) => {
   const { data } = useSuspenseQuery(queryOptions);
   return <FilmList list={data} />;
};

export default FilmListPage;
