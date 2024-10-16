import { screen, act } from '@testing-library/react';
import {
   RouterProvider,
   createRouter,
   createRootRoute,
} from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import { MOCK_FILM_LIST } from '@/tests/__mocks__/mocks';
import { renderWithQueryContext } from '@/tests/test-utils';

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
      const element = () => <FilmList list={MOCK_FILM_LIST.results} />;
      await act(async () => {
         renderWithQueryContext(
            <RouterProvider router={router as any} defaultComponent={element} />
         );
      });

      expect(screen.getByText(/The Substance/i)).toBeInTheDocument();
   });
});
