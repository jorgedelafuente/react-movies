import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createTestQueryClient } from '@/tests/test-utils';
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
}));

const MOCK_FAVORITES = [
   {
      id: 'fav-1',
      user_id: 'user-123',
      film_id: 533535,
      film_title: 'Deadpool & Wolverine',
      film_poster_path: '/poster1.jpg',
      film_release_date: '2024-07-24',
      created_at: '2024-01-15T10:00:00.000Z',
   },
   {
      id: 'fav-2',
      user_id: 'user-123',
      film_id: 933260,
      film_title: 'The Substance',
      film_poster_path: '/poster2.jpg',
      film_release_date: '2024-09-07',
      created_at: '2024-02-20T10:00:00.000Z',
   },
];

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
         isPending: false,
      });

      renderView();
      expect(
         screen.getByText(/you haven't saved any favorites yet/i)
      ).toBeInTheDocument();
      expect(screen.getByText('Browse films')).toBeInTheDocument();
   });

   it('renders a row for each favorite', () => {
      renderView();
      expect(screen.getByText('Deadpool & Wolverine')).toBeInTheDocument();
      expect(screen.getByText('The Substance')).toBeInTheDocument();
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

   it('renders poster images when poster path is provided', () => {
      renderView();
      const images = screen.getAllByRole('img');
      expect(images.length).toBe(2);
      const alts = images.map((img) => img.getAttribute('alt'));
      expect(alts).toContain('Deadpool & Wolverine');
      expect(alts).toContain('The Substance');
   });
});
