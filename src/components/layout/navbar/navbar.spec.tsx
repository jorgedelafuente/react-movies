import { QueryClient } from '@tanstack/react-query';
import {
   createRootRoute,
   createRouter,
   RouterProvider,
} from '@tanstack/react-router';
import { act, screen, within } from '@testing-library/react';

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

describe('Navbar Component', () => {
   it('points the Series group at the series list routes', async () => {
      await renderNavbar();
      const series = within(screen.getByRole('group', { name: 'Series' }));

      expect(series.getByRole('link', { name: 'Popular' })).toHaveAttribute(
         'href',
         '/series/popular'
      );
      expect(series.getByRole('link', { name: 'Top Rated' })).toHaveAttribute(
         'href',
         '/series/top-rated'
      );
      expect(series.getByRole('link', { name: 'On The Air' })).toHaveAttribute(
         'href',
         '/series/on-the-air'
      );
   });

   it('points the Films group at the film list routes', async () => {
      await renderNavbar();
      const films = within(screen.getByRole('group', { name: 'Films' }));

      expect(films.getByRole('link', { name: 'Popular' })).toHaveAttribute(
         'href',
         '/popular'
      );
      expect(films.getByRole('link', { name: 'Top Rated' })).toHaveAttribute(
         'href',
         '/top-rated'
      );
      expect(films.getByRole('link', { name: 'Upcoming' })).toHaveAttribute(
         'href',
         '/upcoming'
      );
   });
});
