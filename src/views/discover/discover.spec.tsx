import { QueryClient } from '@tanstack/react-query';
import {
   createRootRoute,
   createRouter,
   RouterProvider,
} from '@tanstack/react-router';
import { act, fireEvent, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { MOCK_DISCOVER_MOVIES, MOCK_GENRES } from '@/tests/__mocks__/mocks';
import { renderWithQueryContext } from '@/tests/test-utils';
import {
   DISCOVER_SORTS,
   DiscoverMoviesSchema,
   type DiscoverPage,
   type DiscoverParams,
} from '@/types/discover.schemas';
import { MEDIA_TYPES } from '@/types/media.types';

import DiscoverView from './discover.view';

const page: DiscoverPage = DiscoverMoviesSchema.parse(MOCK_DISCOVER_MOVIES);
const genres = MOCK_GENRES.genres;

const defaultParams: DiscoverParams = {
   type: MEDIA_TYPES.MOVIE,
   sort: DISCOVER_SORTS.POPULAR,
   page: 2,
};

const renderView = async (
   override: Partial<React.ComponentProps<typeof DiscoverView>> = {}
) => {
   const onChange = vi.fn();
   const router = createRouter({
      routeTree: createRootRoute(),
      context: { queryClient: new QueryClient() },
   });
   const element = () => (
      <DiscoverView
         params={defaultParams}
         genres={genres}
         page={page}
         onChange={onChange}
         {...override}
      />
   );
   await act(async () => {
      renderWithQueryContext(
         <RouterProvider router={router} defaultComponent={element} />
      );
   });
   return { onChange };
};

describe('Discover view', () => {
   it('renders the filters, result count and current page', async () => {
      await renderView();
      expect(
         screen.getByRole('heading', { name: 'Discover' })
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Genre')).toBeInTheDocument();
      expect(screen.getByLabelText('Sort by')).toBeInTheDocument();
      expect(screen.getByLabelText('Year')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveTextContent('16,231 results');
      expect(screen.getByRole('status')).toHaveTextContent('page 2 of 500');
   });

   it('renders the results as cards', async () => {
      await renderView();
      expect(
         screen.getByRole('heading', { name: 'The Substance' })
      ).toBeInTheDocument();
   });

   it('marks the active media type and switching it drops the genre', async () => {
      const { onChange } = await renderView({
         params: { ...defaultParams, genre: 28 },
      });
      expect(screen.getByRole('button', { name: 'Films' })).toHaveAttribute(
         'aria-pressed',
         'true'
      );
      fireEvent.click(screen.getByRole('button', { name: 'Series' }));
      expect(onChange).toHaveBeenCalledWith({
         type: MEDIA_TYPES.TV,
         genre: undefined,
         page: 1,
      });
   });

   it('does nothing when the active type is clicked again', async () => {
      const { onChange } = await renderView();
      fireEvent.click(screen.getByRole('button', { name: 'Films' }));
      expect(onChange).not.toHaveBeenCalled();
   });

   it('changing genre, sort or year resets to page 1', async () => {
      const { onChange } = await renderView();

      fireEvent.change(screen.getByLabelText('Genre'), {
         target: { value: '18' },
      });
      expect(onChange).toHaveBeenLastCalledWith({ genre: 18, page: 1 });

      fireEvent.change(screen.getByLabelText('Sort by'), {
         target: { value: DISCOVER_SORTS.RATING },
      });
      expect(onChange).toHaveBeenLastCalledWith({
         sort: DISCOVER_SORTS.RATING,
         page: 1,
      });

      fireEvent.change(screen.getByLabelText('Year'), {
         target: { value: '1999' },
      });
      expect(onChange).toHaveBeenLastCalledWith({ year: 1999, page: 1 });

      fireEvent.change(screen.getByLabelText('Year'), {
         target: { value: '' },
      });
      expect(onChange).toHaveBeenLastCalledWith({ year: undefined, page: 1 });
   });

   it('hides the revenue sort for series', async () => {
      await renderView({ params: { ...defaultParams, type: MEDIA_TYPES.TV } });
      const options = Array.from(
         screen.getByLabelText('Sort by').querySelectorAll('option')
      ).map((o) => o.textContent);
      expect(options).not.toContain('Highest grossing');
      expect(options).toContain('Most popular');
   });

   it('pages forwards and backwards and disables at the bounds', async () => {
      const { onChange } = await renderView();
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      expect(onChange).toHaveBeenLastCalledWith({ page: 3 });
      fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
      expect(onChange).toHaveBeenLastCalledWith({ page: 1 });
   });

   it('disables Previous on the first page and Next on the last', async () => {
      await renderView({
         params: { ...defaultParams, page: 1 },
         page: { ...page, page: 1, total_pages: 1 },
      });
      // a single page needs no pagination at all
      expect(
         screen.queryByRole('navigation', { name: 'Pagination' })
      ).toBeNull();
   });

   it('caps the page count at the TMDB limit and disables Next there', async () => {
      await renderView({ params: { ...defaultParams, page: 500 } });
      expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Previous' })).toBeEnabled();
   });

   it('shows an empty state when nothing matches', async () => {
      await renderView({
         page: { page: 1, total_pages: 0, total_results: 0, results: [] },
      });
      expect(
         screen.getByText(/nothing matches those filters/i)
      ).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveTextContent('0 results');
   });
});
