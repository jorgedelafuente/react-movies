import { render } from '@testing-library/react';
import NavbarMenuList from './navbar-menu-list';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';

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
         <RouterProvider router={router} defaultComponent={NavbarMenuList} />
      );
      expect(container).toMatchSnapshot();
   });
});
