import { render } from '@testing-library/react';
import { RouterProvider, createRouter } from '@tanstack/react-router';

import { createTestQueryClient } from '@/tests/test-utils';
import { routeTree } from '@/routeTree.gen';
import NavbarMenuList from './navbar-menu-list';

const router = createRouter({
   routeTree,
   context: {
      queryClient: createTestQueryClient(),
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
