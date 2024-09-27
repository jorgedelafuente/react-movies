import { render } from '@testing-library/react';
import NavbarMenuList from './navbar-menu-list';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { routeTree } from '@/routeTree.gen';

const queryClient = new QueryClient();
const router = createRouter({
   routeTree,
   context: {
      queryClient,
   },
   defaultPreload: 'intent',
   defaultStaleTime: 60000,
});

describe('NavbarMenuList', () => {
   it('NavbarMenuList should match snapshot', () => {
      const { container } = render(
         <QueryClientProvider client={new QueryClient()}>
            <RouterProvider router={router} defaultComponent={NavbarMenuList} />
         </QueryClientProvider>
      );
      expect(container).toMatchSnapshot();
   });
});
