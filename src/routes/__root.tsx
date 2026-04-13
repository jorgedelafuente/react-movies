import {
   Outlet,
   createRootRouteWithContext,
   NotFoundRouteComponent,
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { ErrorComponent } from '@/components/layout/error-component/error-component.component';
import { NotFoundComponent } from '@/components/layout/not-found-component/not-found.component';
import Navbar from '@/components/layout/navbar/navbar.component';
import { useAuth } from '@/utils/hooks/useAuth';

export const Route = createRootRouteWithContext<{
   queryClient: QueryClient;
}>()({
   component: RootComponent,
   errorComponent: ErrorComponent,
   notFoundComponent: NotFoundComponent as NotFoundRouteComponent,
});

function RootComponent() {
   const initialize = useAuth((state) => state.initialize);
   const destroy = useAuth((state) => state.destroy);

   useEffect(() => {
      initialize();
      return () => destroy();
   }, []);

   return (
      <>
         <Navbar />
         <Outlet />
      </>
   );
}
