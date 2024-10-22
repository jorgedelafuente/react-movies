import { act } from '@testing-library/react';
import { RouterProvider } from '@tanstack/react-router';

import { renderWithQueryContext, router } from '@/tests/test-utils';
import NavbarMenuList from './navbar-menu-list';

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
