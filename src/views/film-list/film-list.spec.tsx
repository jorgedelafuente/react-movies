import { QueryClient } from '@tanstack/react-query';
import {
   createRootRoute,
   createRouter,
   RouterProvider,
} from '@tanstack/react-router';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MOCK_FILM_LIST, MOCK_SERIES_LIST } from '@/tests/__mocks__/mocks';
import { renderWithQueryContext } from '@/tests/test-utils';
import { FilmListSchema } from '@/types/films.schemas';
import { LIST_VIEWS } from '@/types/list-view.types';
import { SeriesListSchema } from '@/types/series.schemas';
import { useListView } from '@/utils/hooks/useListView';

import FilmList from './film-list.view';

const rootRoute = createRootRoute();
const queryClient = new QueryClient();

export const router = createRouter({
   routeTree: rootRoute,
   context: {
      queryClient,
   },
});

const films = FilmListSchema.parse(MOCK_FILM_LIST).results;

const renderFilmList = async () => {
   const element = () => <FilmList list={films} />;
   await act(async () => {
      renderWithQueryContext(
         <RouterProvider router={router} defaultComponent={element} />
      );
   });
};

beforeEach(() => {
   useListView.setState({ view: LIST_VIEWS.CARDS });
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

   it('shows cards by default and no table', async () => {
      await renderFilmList();

      expect(screen.getByRole('radio', { name: /cards/i })).toBeChecked();
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
   });

   it('switches to the table view when the user picks "Table"', async () => {
      await renderFilmList();

      await userEvent.click(screen.getByRole('radio', { name: /table/i }));

      expect(screen.getByRole('radio', { name: /table/i })).toBeChecked();
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(
         screen.queryByRole('heading', { name: films[0].title })
      ).not.toBeInTheDocument();
   });

   it('switches back to cards', async () => {
      useListView.setState({ view: LIST_VIEWS.TABLE });
      await renderFilmList();

      await userEvent.click(screen.getByRole('radio', { name: /cards/i }));

      expect(screen.queryByRole('table')).not.toBeInTheDocument();
      expect(
         screen.getByRole('heading', { name: films[0].title })
      ).toBeInTheDocument();
   });
});
