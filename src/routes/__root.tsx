import {
   Link,
   Outlet,
   createRootRouteWithContext,
   NotFoundRouteComponent,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { QueryClient } from '@tanstack/react-query';

import { FilmErrorComponent } from '@/components/layout/error-component/error-component';
import { NotFoundComponent } from '@/components/layout/not-found-component/not-found.component';

import Navbar from '@/components/layout/navbar/navbar.component';
import NavLink from '@/components/link/navlink.component';
import SearchInput from '@/components/search-input/search-input';

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
            <div>
               <NavLink path="/popular" text="Popular" /> |{' '}
               <NavLink path="/top-rated" text="Top Rated" /> |{' '}
               <NavLink path="/upcoming" text="Upcoming" />
            </div>
            <div>
               <SearchInput />
            </div>
         </Navbar>

         <Outlet />

         <ReactQueryDevtools buttonPosition="top-right" />
         <TanStackRouterDevtools position="bottom-right" />
      </>
   );
}
