import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { ErrorComponent } from '@/components/layout/error-component/error-component.component';
import {
   discoverQueryOptions,
   genresQueryOptions,
} from '@/services/discover/discoverQueryOptions';
import {
   type DiscoverSearch,
   DiscoverSearchSchema,
   resolveDiscoverSearch,
} from '@/types/discover.schemas';
import DiscoverView from '@/views/discover/discover.view';

export const Route = createFileRoute('/discover/')({
   validateSearch: (search: Record<string, unknown>): DiscoverSearch =>
      DiscoverSearchSchema.parse(search),
   loaderDeps: ({ search }) => resolveDiscoverSearch(search),
   loader: ({ context: { queryClient }, deps }) =>
      Promise.all([
         queryClient.ensureQueryData(discoverQueryOptions(deps)),
         queryClient.ensureQueryData(genresQueryOptions(deps.type)),
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

   const update = (patch: DiscoverSearch) =>
      navigate({
         search: (prev) => ({ ...prev, ...patch }),
         resetScroll: false,
      });

   return (
      <DiscoverView
         params={params}
         genres={genres}
         page={page}
         onChange={update}
      />
   );
}
