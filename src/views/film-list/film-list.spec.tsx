import { QueryClient } from '@tanstack/react-query';
import {
   createRootRoute,
   createRouter,
   RouterProvider,
} from '@tanstack/react-router';
import { act, screen } from '@testing-library/react';

import { MOCK_FILM_LIST, MOCK_SERIES_LIST } from '@/tests/__mocks__/mocks';
import { renderWithQueryContext } from '@/tests/test-utils';
import { FilmListSchema } from '@/types/films.schemas';
import { SeriesListSchema } from '@/types/series.schemas';

import FilmList from './film-list.view';

const rootRoute = createRootRoute();
const queryClient = new QueryClient();

export const router = createRouter({
   routeTree: rootRoute,
   context: {
      queryClient,
   },
});

describe('Film Lists Component', () => {
   it('should fetch the popular list from the popular page', async () => {
      const element = () => (
         <FilmList list={FilmListSchema.parse(MOCK_FILM_LIST).results} />
      );
      await act(async () => {
         renderWithQueryContext(
            <RouterProvider router={router} defaultComponent={element} />
         );
      });

      expect(screen.getAllByText(/The Substance/i)[0]).toBeInTheDocument();
   });
   it('renders a series list and links every card to the TV route', async () => {
      const element = () => (
         <FilmList list={SeriesListSchema.parse(MOCK_SERIES_LIST).results} />
      );
      await act(async () => {
         renderWithQueryContext(
            <RouterProvider router={router} defaultComponent={element} />
         );
      });

      expect(
         screen.getByRole('heading', { name: 'Game of Thrones' })
      ).toBeInTheDocument();

      const links = screen.getAllByRole('link', { name: /Game of Thrones/ });
      expect(links.length).toBeGreaterThan(0);
      links.forEach((link) => expect(link).toHaveAttribute('href', '/tv/1399'));
   });
});
