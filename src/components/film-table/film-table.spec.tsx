import { QueryClient } from '@tanstack/react-query';
import {
   createRootRoute,
   createRouter,
   RouterProvider,
} from '@tanstack/react-router';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureAxe } from 'vitest-axe';

import { MOCK_FILM_LIST } from '@/tests/__mocks__/mocks';
import { renderWithQueryContext } from '@/tests/test-utils';
import { FilmListSchema } from '@/types/films.schemas';

import FilmTable from './film-table.component';

const axe = configureAxe({
   rules: {
      // jsdom does not fully implement pseudo-element styles used by this rule.
      'color-contrast': { enabled: false },
   },
});

const rootRoute = createRootRoute();
const queryClient = new QueryClient();

const router = createRouter({
   routeTree: rootRoute,
   context: {
      queryClient,
   },
});

const list = FilmListSchema.parse(MOCK_FILM_LIST).results;

const renderFilmTable = async () => {
   const element = () => <FilmTable list={list} />;
   let result!: ReturnType<typeof renderWithQueryContext>;
   await act(async () => {
      result = renderWithQueryContext(
         <RouterProvider router={router} defaultComponent={element} />
      );
   });
   return result;
};

describe('FilmTable', () => {
   it('renders a row for every film in the list', async () => {
      await renderFilmTable();

      expect(screen.getAllByRole('row')).toHaveLength(list.length + 1); // +1 header row
   });

   it('sort headers are reachable and toggleable by keyboard', async () => {
      await renderFilmTable();

      const ratingHeader = screen.getByRole('button', { name: /rating/i });
      await act(async () => {
         ratingHeader.focus();
      });
      expect(ratingHeader).toHaveFocus();

      await userEvent.keyboard('{Enter}');

      expect(
         screen.getByRole('columnheader', { name: /rating/i })
      ).toHaveAttribute('aria-sort', 'descending');
   });

   it('has no accessibility violations', async () => {
      const { container } = await renderFilmTable();

      expect(await axe(container)).toHaveNoViolations();
   });
});
