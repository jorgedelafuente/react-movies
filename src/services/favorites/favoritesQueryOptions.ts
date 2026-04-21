import { queryOptions } from '@tanstack/react-query';

import { getUserFavorites } from '@/services/supabase/favorites';

export const userFavoritesQueryOptions = (userId: string) =>
   queryOptions({
      queryKey: ['favorites', { userId }],
      queryFn: () => getUserFavorites(userId),
      enabled: Boolean(userId),
   });
