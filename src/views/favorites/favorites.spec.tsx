import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createTestQueryClient } from '@/tests/test-utils';
import { FAVORITE_STATUSES } from '@/types/favorites.types';
import { MEDIA_TYPES } from '@/types/media.types';
import { useAuth } from '@/utils/hooks/useAuth';
import { useFavorites } from '@/utils/hooks/useFavorites';

import FavoritesView from './favorites.view';

vi.mock('@tanstack/react-router', async (importOriginal) => {
   const actual =
      await importOriginal<typeof import('@tanstack/react-router')>();
   return {
      ...actual,
      Link: ({
         children,
         ...props
      }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
         to?: string;
         params?: Record<string, string>;
      }) => <a {...props}>{children}</a>,
   };
});

vi.mock('@/utils/hooks/useFavorites', () => ({
   useFavorites: vi.fn(),
}));

vi.mock('@/services/supabase/favorites', () => ({
   getUserFavorites: vi.fn(),
   addFavorite: vi.fn(),
   removeFavorite: vi.fn(),
   updateFavoriteStatus: vi.fn(),
}));

const MOCK_FAVORITES = [
   {
      id: 'fav-1',
      user_id: 'user-123',
      film_id: 533535,
      media_type: MEDIA_TYPES.MOVIE,
      film_title: 'Deadpool & Wolverine',
      film_poster_path: '/poster1.jpg',
      film_release_date: '2024-07-24',
      created_at: '2024-01-15T10:00:00.000Z',
      status: FAVORITE_STATUSES.SAVED,
      watched_at: null,
   },
   {
      id: 'fav-2',
      user_id: 'user-123',
      film_id: 933260,
      media_type: MEDIA_TYPES.MOVIE,
      film_title: 'The Substance',
      film_poster_path: '/poster2.jpg',
      film_release_date: '2024-09-07',
      created_at: '2024-02-20T10:00:00.000Z',
      status: FAVORITE_STATUSES.WATCH_NEXT,
      watched_at: null,
   },
   {
      id: 'fav-3',
      user_id: 'user-123',
      film_id: 1399,
      media_type: MEDIA_TYPES.TV,
      film_title: 'Game of Thrones',
      film_poster_path: '/poster3.jpg',
      film_release_date: '2011-04-17',
      created_at: '2024-03-01T10:00:00.000Z',
      status: FAVORITE_STATUSES.WATCHED,
      watched_at: '2024-04-01T10:00:00.000Z',
   },
];

const mockSetStatus = vi.fn();

const renderView = () =>
   render(
      <QueryClientProvider client={createTestQueryClient()}>
         <FavoritesView />
      </QueryClientProvider>
   );

beforeEach(() => {
   vi.clearAllMocks();
   useAuth.setState({
      user: { id: 'user-123', email: 'test@example.com' } as never,
   });
   vi.mocked(useFavorites).mockReturnValue({
      favorites: MOCK_FAVORITES,
      isLoading: false,
      isFavorited: vi.fn().mockReturnValue(true),
      toggle: vi.fn(),
      setStatus: mockSetStatus,
      isPending: false,
   });
});

describe('FavoritesView', () => {
   it('renders the page heading', () => {
      renderView();
      expect(
         screen.getByRole('heading', { name: /my favorites/i })
      ).toBeInTheDocument();
   });

   it('shows loading text while fetching', () => {
      vi.mocked(useFavorites).mockReturnValue({
         favorites: [],
         isLoading: true,
         isFavorited: vi.fn(),
         toggle: vi.fn(),
         setStatus: vi.fn(),
         isPending: false,
      });

      renderView();
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
   });

   it('shows empty state message when no favorites', () => {
      vi.mocked(useFavorites).mockReturnValue({
         favorites: [],
         isLoading: false,
         isFavorited: vi.fn(),
         toggle: vi.fn(),
         setStatus: vi.fn(),
         isPending: false,
      });

      renderView();
      expect(
         screen.getByText(/you haven't saved any favorites yet/i)
      ).toBeInTheDocument();
      expect(screen.getByText('Browse films')).toBeInTheDocument();
      expect(screen.getByText('Browse series')).toBeInTheDocument();
   });

   it('renders a row for each favorite', () => {
      renderView();
      expect(screen.getByText('Deadpool & Wolverine')).toBeInTheDocument();
      expect(screen.getByText('The Substance')).toBeInTheDocument();
      expect(screen.getByText('Game of Thrones')).toBeInTheDocument();
   });

   it('labels each favorite as a film or a series', () => {
      renderView();
      // Scoped to the table: the type filter above it also reads "Series".
      const table = within(screen.getByRole('table'));
      expect(table.getAllByText('Film')).toHaveLength(2);
      expect(table.getAllByText('Series')).toHaveLength(1);
   });

   it('links series to the TV detail route and films to the film route', () => {
      renderView();
      const seriesLink = screen.getByText('Game of Thrones').closest('a');
      const filmLink = screen.getByText('The Substance').closest('a');
      expect(seriesLink).toHaveAttribute('to', '/tv/$seriesId');
      expect(filmLink).toHaveAttribute('to', '/film/$filmId');
   });

   it('displays the release year for each favorite', () => {
      renderView();
      const yearCells = screen.getAllByText('2024');
      expect(yearCells.length).toBeGreaterThanOrEqual(1);
   });

   it('sorts by year when the Year column header is clicked', () => {
      renderView();
      const yearHeader = screen.getByText(/year/i);
      fireEvent.click(yearHeader);

      // After clicking, sort icon should show active (▲ or ▼)
      expect(yearHeader.textContent).toMatch(/[▲▼]/);
   });

   it('reverses sort direction on second click of the same column', () => {
      renderView();
      const yearHeader = screen.getByText(/year/i);

      fireEvent.click(yearHeader);
      const firstDir = yearHeader.textContent;

      fireEvent.click(yearHeader);
      expect(yearHeader.textContent).not.toBe(firstDir);
   });

   describe('status sections', () => {
      it('shows every favorite under the All tab by default', () => {
         renderView();
         expect(screen.getByText('Deadpool & Wolverine')).toBeInTheDocument();
         expect(screen.getByText('The Substance')).toBeInTheDocument();
         expect(screen.getByText('Game of Thrones')).toBeInTheDocument();
      });

      it('counts each status on its tab', () => {
         renderView();
         const statusGroup = screen.getByRole('group', {
            name: /filter by status/i,
         });
         expect(
            within(statusGroup).getByRole('button', { name: /^All 3$/ })
         ).toBeInTheDocument();
         expect(
            within(statusGroup).getByRole('button', { name: /^Saved 1$/ })
         ).toBeInTheDocument();
         expect(
            within(statusGroup).getByRole('button', { name: /^Watchlist 1$/ })
         ).toBeInTheDocument();
         expect(
            within(statusGroup).getByRole('button', { name: /^Seen 1$/ })
         ).toBeInTheDocument();
      });

      it('narrows the table to the selected status', () => {
         renderView();
         fireEvent.click(screen.getByRole('button', { name: /^Watchlist 1$/ }));

         expect(screen.getByText('The Substance')).toBeInTheDocument();
         expect(
            screen.queryByText('Deadpool & Wolverine')
         ).not.toBeInTheDocument();
         expect(screen.queryByText('Game of Thrones')).not.toBeInTheDocument();
      });

      it('marks the active tab with aria-pressed', () => {
         renderView();
         const seen = screen.getByRole('button', { name: /^Seen 1$/ });
         fireEvent.click(seen);
         expect(seen).toHaveAttribute('aria-pressed', 'true');
      });

      it('explains an empty section instead of the onboarding copy', () => {
         vi.mocked(useFavorites).mockReturnValue({
            favorites: [MOCK_FAVORITES[0]],
            isLoading: false,
            isFavorited: vi.fn().mockReturnValue(true),
            toggle: vi.fn(),
            setStatus: mockSetStatus,
            isPending: false,
         });

         renderView();
         fireEvent.click(screen.getByRole('button', { name: /^Seen 0$/ }));

         expect(screen.getByText(/nothing here yet/i)).toBeInTheDocument();
         expect(
            screen.queryByText(/you haven't saved any favorites yet/i)
         ).not.toBeInTheDocument();
      });
   });

   describe('type filter', () => {
      it('narrows the table to films only', () => {
         renderView();
         fireEvent.click(screen.getByRole('button', { name: 'Films' }));

         expect(screen.getByText('Deadpool & Wolverine')).toBeInTheDocument();
         expect(screen.getByText('The Substance')).toBeInTheDocument();
         expect(screen.queryByText('Game of Thrones')).not.toBeInTheDocument();
      });

      it('narrows the table to series only', () => {
         renderView();
         fireEvent.click(
            within(
               screen.getByRole('group', { name: /filter by type/i })
            ).getByRole('button', { name: 'Series' })
         );

         expect(screen.getByText('Game of Thrones')).toBeInTheDocument();
         expect(
            screen.queryByText('Deadpool & Wolverine')
         ).not.toBeInTheDocument();
      });

      it('recounts the status tabs against the selected type', () => {
         renderView();
         fireEvent.click(screen.getByRole('button', { name: 'Films' }));

         const statusGroup = screen.getByRole('group', {
            name: /filter by status/i,
         });
         expect(
            within(statusGroup).getByRole('button', { name: /^All 2$/ })
         ).toBeInTheDocument();
         expect(
            within(statusGroup).getByRole('button', { name: /^Seen 0$/ })
         ).toBeInTheDocument();
      });

      it('combines with the status filter', () => {
         renderView();
         fireEvent.click(screen.getByRole('button', { name: 'Films' }));
         fireEvent.click(screen.getByRole('button', { name: /^Saved 1$/ }));

         expect(screen.getByText('Deadpool & Wolverine')).toBeInTheDocument();
         expect(screen.queryByText('The Substance')).not.toBeInTheDocument();
      });
   });

   describe('status control', () => {
      it('shows each row at its current status', () => {
         renderView();
         expect(
            screen.getByLabelText('Status for Game of Thrones')
         ).toHaveValue(FAVORITE_STATUSES.WATCHED);
         expect(
            screen.getByLabelText('Status for Deadpool & Wolverine')
         ).toHaveValue(FAVORITE_STATUSES.SAVED);
      });

      it('moves a favorite to another status', () => {
         renderView();
         fireEvent.change(
            screen.getByLabelText('Status for Deadpool & Wolverine'),
            { target: { value: FAVORITE_STATUSES.WATCHED } }
         );

         expect(mockSetStatus).toHaveBeenCalledWith(
            533535,
            MEDIA_TYPES.MOVIE,
            FAVORITE_STATUSES.WATCHED
         );
      });

      it('passes the series media type through for a series row', () => {
         renderView();
         fireEvent.change(screen.getByLabelText('Status for Game of Thrones'), {
            target: { value: FAVORITE_STATUSES.WATCH_NEXT },
         });

         expect(mockSetStatus).toHaveBeenCalledWith(
            1399,
            MEDIA_TYPES.TV,
            FAVORITE_STATUSES.WATCH_NEXT
         );
      });
   });

   it('renders poster images when poster path is provided', () => {
      renderView();
      const images = screen.getAllByRole('img');
      expect(images.length).toBe(3);
      const alts = images.map((img) => img.getAttribute('alt'));
      expect(alts).toContain('Deadpool & Wolverine');
      expect(alts).toContain('The Substance');
      expect(alts).toContain('Game of Thrones');
   });
});
