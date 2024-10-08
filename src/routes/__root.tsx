import {
   Outlet,
   createRootRouteWithContext,
   NotFoundRouteComponent,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { QueryClient } from '@tanstack/react-query';

import { FilmErrorComponent } from '@/components/layout/error-component/error-component.component';
import { NotFoundComponent } from '@/components/layout/not-found-component/not-found.component';

import Navbar from '@/components/layout/navbar/navbar.component';

import SearchInput from '@/components/layout/navbar/search-input/search-input';
import NavbarMenuList from '@/components/layout/navbar/navbar-menu-list/navbar-menu-list';

export const Route = createRootRouteWithContext<{
   queryClient: QueryClient;
}>()({
   component: RootComponent,
   errorComponent: FilmErrorComponent,
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
         <ReactQueryDevtools buttonPosition="top-right" />
         <TanStackRouterDevtools position="bottom-right" />
      </>
   );
}
