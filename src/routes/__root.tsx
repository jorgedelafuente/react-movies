import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { QueryClient } from '@tanstack/react-query';
import Navbar from '../components/navbar/navbar.component';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function NotFoundComponent() {
  return (
    <div>
      <p>This is the notFoundComponent configured on root route!!</p>
      <Link to="/">Start Over</Link>
    </div>
  );
}

function RootComponent() {
  return (
    <>
      <Navbar>
        <Link to="/" className="text-white" activeOptions={{ exact: true }}>
          <span className="text-white">Popular</span>
        </Link>{' '}
        {/* <Link
            to={'/popular'}
            activeProps={{
              className: 'font-bold',
            }}
          >
            Popular
          </Link>{' '} */}
        {/* <Link to={'/favorites'}>
          <span className="text-white">Favorites</span>
        </Link>{' '} */}
        {/* <Link
          to="/layout-a"
          activeProps={{
            className: 'font-bold',
          }}
        >
          Layout
        </Link>{' '} */}
        {/* <Link
          //   @ts-expect-error
          to="/this-route-does-not-exist"
          activeProps={{
            className: 'font-bold',
          }}
        >
          This Route Does Not Exist
        </Link> */}
      </Navbar>

      <hr />

      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
