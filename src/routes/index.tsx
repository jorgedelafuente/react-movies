import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { ErrorComponent } from '@/components/layout/error-component/error-component.component';
import {
   discoverQueryOptions,
   genresQueryOptions,
} from '@/services/discover/discoverQueryOptions';
import { keywordQueryOptions } from '@/services/search/searchQueryOptions';
import {
   type DiscoverSearch,
   DiscoverSearchSchema,
   resolveDiscoverSearch,
} from '@/types/discover.schemas';
import DiscoverView from '@/views/discover/discover.view';

/**
 * The home page is Discover: filtered browsing over TMDB's discover endpoints,
 * with every filter held in validated search params so a filtered view is a
 * shareable URL. `/discover` redirects here for older links.
 */
export const Route = createFileRoute('/')({
   validateSearch: (search: Record<string, unknown>): DiscoverSearch =>
      DiscoverSearchSchema.parse(search),
   loaderDeps: ({ search }) => resolveDiscoverSearch(search),
   loader: ({ context: { queryClient }, deps }) =>
      Promise.all([
         queryClient.ensureQueryData(discoverQueryOptions(deps)),
         queryClient.ensureQueryData(genresQueryOptions(deps.type)),
         // Resolve the keyword id in the URL to its name for the filter box.
         deps.keyword !== undefined &&
            queryClient.ensureQueryData(keywordQueryOptions(deps.keyword)),
      ]),
   component: Discover,
   errorComponent: ErrorComponent,
});

function Discover() {
   const search = Route.useSearch();
   const params = resolveDiscoverSearch(search);
   const navigate = useNavigate({ from: Route.fullPath });

   const { data: page } = useSuspenseQuery(discoverQueryOptions(params));
   const { data: genres } = useSuspenseQuery(genresQueryOptions(params.type));
   const { data: keywordLookup } = useQuery({
      ...keywordQueryOptions(params.keyword ?? 0),
      enabled: params.keyword !== undefined,
   });
   // An id TMDB no longer knows still shows up in the box, as "#id", so the
   // visitor can see why the list is empty and clear it.
   const keyword =
      params.keyword === undefined
         ? undefined
         : (keywordLookup ?? {
              id: params.keyword,
              name: `#${params.keyword}`,
           });

   const update = (patch: DiscoverSearch) =>
      navigate({
         search: (prev) => ({ ...prev, ...patch }),
         resetScroll: false,
      });

   return (
      <DiscoverView
         params={params}
         genres={genres}
         keyword={keyword}
         page={page}
         onChange={update}
      />
   );
}
