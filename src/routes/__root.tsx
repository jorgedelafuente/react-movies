import {
   Outlet,
   createRootRouteWithContext,
   NotFoundRouteComponent,
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';

import { ErrorComponent } from '@/components/layout/error-component/error-component.component';
import { NotFoundComponent } from '@/components/layout/not-found-component/not-found.component';

import Navbar from '@/components/layout/navbar/navbar.component';
import AuthProvider from '@/components/providers/auth-provider.component';

export const Route = createRootRouteWithContext<{
   queryClient: QueryClient;
}>()({
   component: RootComponent,
   errorComponent: ErrorComponent,
   notFoundComponent: NotFoundComponent as NotFoundRouteComponent,
});

function RootComponent() {
   return (
      <AuthProvider>
         <Navbar />
         <Outlet />
      </AuthProvider>
   );
}
