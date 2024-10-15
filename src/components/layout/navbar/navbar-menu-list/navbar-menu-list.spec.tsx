import { act } from '@testing-library/react';
import { RouterProvider, createRouter } from '@tanstack/react-router';

import {
   createTestQueryClient,
   renderWithQueryContext,
} from '@/tests/test-utils';
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
   it('NavbarMenuList should match snapshot', async () => {
      const { container } = await act(async () =>
         renderWithQueryContext(
            <RouterProvider router={router} defaultComponent={NavbarMenuList} />
         )
      );
      expect(container).toMatchSnapshot();
   });
});
