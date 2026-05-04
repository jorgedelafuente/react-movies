import { createFileRoute, redirect } from '@tanstack/react-router';

import { getCurrentSession } from '@/services/supabase/auth';
import FavoritesView from '@/views/favorites/favorites.view';

export const Route = createFileRoute('/favorites/')({
   beforeLoad: async () => {
      const session = await getCurrentSession();
      if (!session) {
         throw redirect({ to: '/' });
      }
   },
   component: FavoritesView,
});
