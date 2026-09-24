import { QueryClient } from '@tanstack/react-query';
import {
   createRootRoute,
   createRouter,
   RouterProvider,
} from '@tanstack/react-router';
import { act, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithQueryContext } from '@/tests/test-utils';

import Navbar from './navbar.component';

const rootRoute = createRootRoute();
const queryClient = new QueryClient();

const router = createRouter({
   routeTree: rootRoute,
   context: {
      queryClient,
   },
});

const renderNavbar = async () => {
   await act(async () => {
      renderWithQueryContext(
         <RouterProvider router={router} defaultComponent={Navbar} />
      );
   });
};

const openMenu = async (label: string) => {
   const user = userEvent.setup();
   await user.click(screen.getByRole('button', { name: `${label} menu` }));
   return user;
};

describe('Navbar Component', () => {
   it('opens the Series menu with links to the series list routes', async () => {
      await renderNavbar();
      await openMenu('Series');

      const items = within(screen.getByRole('menu'));
      expect(
         items.getByRole('menuitem', { name: 'Popular' })
      ).toBeInTheDocument();
      expect(
         items.getByRole('menuitem', { name: 'Top Rated' })
      ).toBeInTheDocument();
      expect(
         items.getByRole('menuitem', { name: 'On The Air' })
      ).toBeInTheDocument();
   });

   it('opens the Films menu with links to the film list routes', async () => {
      await renderNavbar();
      await openMenu('Films');

      const items = within(screen.getByRole('menu'));
      expect(
         items.getByRole('menuitem', { name: 'Popular' })
      ).toBeInTheDocument();
      expect(
         items.getByRole('menuitem', { name: 'Top Rated' })
      ).toBeInTheDocument();
      expect(
         items.getByRole('menuitem', { name: 'Upcoming' })
      ).toBeInTheDocument();
   });

   it('navigates to the selected route when a Films menu item is chosen', async () => {
      await renderNavbar();
      const user = await openMenu('Films');

      await user.click(screen.getByRole('menuitem', { name: 'Upcoming' }));

      expect(router.state.location.pathname).toBe('/upcoming');
   });
});
