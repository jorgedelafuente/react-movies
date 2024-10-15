// import { TanStackRouterDevtools } from '@tanstack/router-devtools';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
   Outlet,
   createRootRouteWithContext,
   NotFoundRouteComponent,
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';

import { ErrorComponent } from '@/components/layout/error-component/error-component.component';
import { NotFoundComponent } from '@/components/layout/not-found-component/not-found.component';

import Navbar from '@/components/layout/navbar/navbar.component';

import SearchInput from '@/components/layout/navbar/search-input/search-input';
import NavbarMenuList from '@/components/layout/navbar/navbar-menu-list/navbar-menu-list';

export const Route = createRootRouteWithContext<{
   queryClient: QueryClient;
}>()({
   component: RootComponent,
   errorComponent: ErrorComponent,
   notFoundComponent: NotFoundComponent as NotFoundRouteComponent,
});

function RootComponent() {
   return (
      <>
         <Navbar>
            <NavbarMenuList />
            <SearchInput />
         </Navbar>

         <Outlet />
         {/* <ReactQueryDevtools buttonPosition="bottom-left" /> */}
         {/* <TanStackRouterDevtools position="bottom-right" /> */}
      </>
   );
}
