import { QueryClient } from '@tanstack/react-query';
import {
   createRootRoute,
   createRouter,
   RouterProvider,
} from '@tanstack/react-router';
import { act, fireEvent, screen, within } from '@testing-library/react';
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
      expect(screen.getByLabelText('Keyword')).toBeInTheDocument();
      expect(screen.getByLabelText('Streaming on')).toBeInTheDocument();
      expect(screen.getByLabelText('Sort by')).toBeInTheDocument();
      expect(screen.getByLabelText('Year')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveTextContent('16,231 results');
      expect(screen.getByRole('status')).toHaveTextContent('page 2 of 500');
   });

   it('keeps the result count and page position in the footer with the pager', async () => {
      await renderView();
      const footer = within(screen.getByRole('contentinfo'));
      expect(footer.getByRole('status')).toHaveTextContent('page 2 of 500');
      expect(
         footer.getByRole('navigation', { name: 'Pagination' })
      ).toBeInTheDocument();
      // Nothing about the results sits between the filters and the cards.
      expect(
         within(
            screen.getByRole('form', { name: 'Discover filters' })
               .parentElement!
         ).queryByRole('status')
      ).toBeNull();
   });

   it('collapses the filters behind a disclosure button on small screens', async () => {
      await renderView();
      const toggle = screen.getByRole('button', { name: /show filters/i });
      const form = screen.getByRole('form', { name: 'Discover filters' });

      // Closed by default: hidden on phones, always shown from `sm` up.
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      expect(toggle).toHaveAttribute('aria-controls', form.id);
      expect(form).toHaveClass('hidden', 'sm:flex');

      fireEvent.click(toggle);
      expect(toggle).toHaveAttribute('aria-expanded', 'true');
      expect(toggle).toHaveTextContent(/hide filters/i);
      expect(form).toHaveClass('flex');
      expect(form).not.toHaveClass('hidden');

      fireEvent.click(toggle);
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      expect(form).toHaveClass('hidden');
   });

   it('counts the active filters on the disclosure button', async () => {
      await renderView({
         params: {
            ...defaultParams,
            genre: 28,
            keyword: 4379,
            provider: 350,
            year: 1999,
         },
         keyword: { id: 4379, name: 'time travel' },
      });
      expect(
         screen.getByRole('button', { name: /show filters 4 active/i })
      ).toBeInTheDocument();
   });

   it('shows the resolved keyword and clearing it resets to page 1', async () => {
      const { onChange } = await renderView({
         params: { ...defaultParams, keyword: 4379 },
         keyword: { id: 4379, name: 'time travel' },
      });
      expect(screen.getByLabelText('Keyword')).toHaveValue('time travel');

      fireEvent.click(screen.getByRole('button', { name: 'Clear keyword' }));
      expect(onChange).toHaveBeenLastCalledWith({
         keyword: undefined,
         page: 1,
      });
   });

   it('shows no count when only the defaults are selected', async () => {
      await renderView();
      expect(
         screen.getByRole('button', { name: /show filters/i })
      ).not.toHaveTextContent(/\d/);
   });

   it('renders the results as cards', async () => {
      await renderView();
      expect(
         screen.getByRole('heading', { name: 'The Substance' })
      ).toBeInTheDocument();
   });

   it('marks the active media type and switching it drops the genre but keeps the provider', async () => {
      const { onChange } = await renderView({
         params: { ...defaultParams, genre: 28, provider: 350 },
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

   it('lists the streaming services and selecting one resets to page 1', async () => {
      const { onChange } = await renderView();
      const select = screen.getByLabelText('Streaming on');
      const options = Array.from(select.querySelectorAll('option')).map(
         (o) => o.textContent
      );
      expect(options).toEqual([
         'Any service',
         'Apple TV',
         'Disney+',
         'HBO Max',
         'Netflix',
         'Prime Video',
      ]);

      fireEvent.change(select, { target: { value: '350' } });
      expect(onChange).toHaveBeenLastCalledWith({ provider: 350, page: 1 });

      fireEvent.change(select, { target: { value: '' } });
      expect(onChange).toHaveBeenLastCalledWith({
         provider: undefined,
         page: 1,
      });
   });

   it('shows the chosen service as selected', async () => {
      await renderView({ params: { ...defaultParams, provider: 8 } });
      expect(screen.getByLabelText('Streaming on')).toHaveValue('8');
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
