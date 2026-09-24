import { createFileRoute, redirect } from '@tanstack/react-router';

import {
   type DiscoverSearch,
   DiscoverSearchSchema,
} from '@/types/discover.schemas';

/**
 * Discover moved to the home page. Keep the old URL working: forward to `/`
 * with the same filters so shared or bookmarked links still open the same
 * filtered view. `replace` keeps the redirect out of the history stack so
 * the back button does not bounce through it.
 */
export const Route = createFileRoute('/discover/')({
   validateSearch: (search: Record<string, unknown>): DiscoverSearch =>
      DiscoverSearchSchema.parse(search),
   beforeLoad: ({ search }) => {
      throw redirect({ to: '/', search, replace: true });
   },
});
