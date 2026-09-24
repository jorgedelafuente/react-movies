import { QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { FavoriteInput } from '@/services/supabase/favorites';
import { createTestQueryClient } from '@/tests/test-utils';
import { MEDIA_TYPES } from '@/types/media.types';

import { useAuth } from './useAuth';
import { useFavorites } from './useFavorites';

const MOCK_USER_ID = 'user-123';

const MOCK_FAVORITE = {
   id: 'fav-1',
   user_id: MOCK_USER_ID,
   film_id: 533535,
   media_type: MEDIA_TYPES.MOVIE,
   film_title: 'Deadpool & Wolverine',
   film_poster_path: '/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
   film_release_date: '2024-07-24',
   created_at: '2024-01-01T00:00:00.000Z',
};

const MOCK_FILM_INPUT: FavoriteInput = {
   filmId: 533535,
   mediaType: MEDIA_TYPES.MOVIE,
   filmTitle: 'Deadpool & Wolverine',
   filmPosterPath: '/poster.jpg',
   filmReleaseDate: '2024-07-24',
};

const MOCK_SERIES_INPUT: FavoriteInput = {
   filmId: 1399,
   mediaType: MEDIA_TYPES.TV,
   filmTitle: 'Game of Thrones',
   filmPosterPath: '/got.jpg',
   filmReleaseDate: '2011-04-17',
};

vi.mock('@/services/supabase/favorites', () => ({
   getUserFavorites: vi.fn(),
   addFavorite: vi.fn(),
   removeFavorite: vi.fn(),
}));

import {
   addFavorite,
   getUserFavorites,
   removeFavorite,
} from '@/services/supabase/favorites';

const mockGetUserFavorites = vi.mocked(getUserFavorites);
const mockAddFavorite = vi.mocked(addFavorite);
const mockRemoveFavorite = vi.mocked(removeFavorite);

const wrapper = ({ children }: { children: React.ReactNode }) => (
   <QueryClientProvider client={createTestQueryClient()}>
      {children}
   </QueryClientProvider>
);

beforeEach(() => {
   vi.clearAllMocks();
   useAuth.setState({
      user: { id: MOCK_USER_ID, email: 'test@example.com' } as never,
   });
   mockGetUserFavorites.mockResolvedValue({
      data: [MOCK_FAVORITE],
      error: null,
   });
   mockAddFavorite.mockResolvedValue({ data: MOCK_FAVORITE, error: null });
   mockRemoveFavorite.mockResolvedValue({ error: null });
});

describe('useFavorites', () => {
   describe('favorites list', () => {
      it('returns favorites for the logged-in user', async () => {
         const { result } = renderHook(() => useFavorites(), { wrapper });

         await waitFor(() => expect(result.current.isLoading).toBe(false));

         expect(result.current.favorites).toEqual([MOCK_FAVORITE]);
         expect(mockGetUserFavorites).toHaveBeenCalledWith(MOCK_USER_ID);
      });

      it('returns empty list when no user is logged in', async () => {
         useAuth.setState({ user: null });

         const { result } = renderHook(() => useFavorites(), { wrapper });

         await waitFor(() => expect(result.current.isLoading).toBe(false));

         expect(result.current.favorites).toEqual([]);
         expect(mockGetUserFavorites).not.toHaveBeenCalled();
      });

      it('returns empty list when fetch fails', async () => {
         mockGetUserFavorites.mockResolvedValue({
            data: [],
            error: { message: 'Network error' },
         });

         const { result } = renderHook(() => useFavorites(), { wrapper });

         await waitFor(() => expect(result.current.isLoading).toBe(false));

         expect(result.current.favorites).toEqual([]);
      });
   });

   describe('isFavorited', () => {
      it('returns true for a film in favorites', async () => {
         const { result } = renderHook(() => useFavorites(), { wrapper });

         await waitFor(() => expect(result.current.isLoading).toBe(false));

         expect(result.current.isFavorited(533535, MEDIA_TYPES.MOVIE)).toBe(
            true
         );
      });

      it('returns false for a film not in favorites', async () => {
         const { result } = renderHook(() => useFavorites(), { wrapper });

         await waitFor(() => expect(result.current.isLoading).toBe(false));

         expect(result.current.isFavorited(999999, MEDIA_TYPES.MOVIE)).toBe(
            false
         );
      });

      it('does not treat a series with the same TMDB id as favorited', async () => {
         const { result } = renderHook(() => useFavorites(), { wrapper });

         await waitFor(() => expect(result.current.isLoading).toBe(false));

         expect(result.current.isFavorited(533535, MEDIA_TYPES.TV)).toBe(false);
      });
   });

   describe('toggle — add', () => {
      it('calls addFavorite when film is not yet favorited', async () => {
         mockGetUserFavorites.mockResolvedValue({ data: [], error: null });

         const { result } = renderHook(() => useFavorites(), { wrapper });
         await waitFor(() => expect(result.current.isLoading).toBe(false));

         act(() => {
            result.current.toggle(MOCK_FILM_INPUT);
         });

         await waitFor(() => expect(mockAddFavorite).toHaveBeenCalledOnce());
         expect(mockAddFavorite).toHaveBeenCalledWith(
            MOCK_USER_ID,
            MOCK_FILM_INPUT
         );
      });

      it('adds a series alongside a film with the same TMDB id', async () => {
         const sameIdSeries: FavoriteInput = {
            ...MOCK_SERIES_INPUT,
            filmId: 533535,
         };

         const { result } = renderHook(() => useFavorites(), { wrapper });
         await waitFor(() => expect(result.current.isLoading).toBe(false));

         act(() => {
            result.current.toggle(sameIdSeries);
         });

         await waitFor(() => expect(mockAddFavorite).toHaveBeenCalledOnce());
         expect(mockAddFavorite).toHaveBeenCalledWith(
            MOCK_USER_ID,
            sameIdSeries
         );
         expect(mockRemoveFavorite).not.toHaveBeenCalled();
      });

      it('optimistically adds the film before the server responds', async () => {
         mockGetUserFavorites.mockResolvedValue({ data: [], error: null });
         mockAddFavorite.mockImplementation(
            () =>
               new Promise((resolve) =>
                  setTimeout(
                     () => resolve({ data: MOCK_FAVORITE, error: null }),
                     100
                  )
               )
         );

         const { result } = renderHook(() => useFavorites(), { wrapper });
         await waitFor(() => expect(result.current.isLoading).toBe(false));

         act(() => {
            result.current.toggle(MOCK_FILM_INPUT);
         });

         await waitFor(() =>
            expect(result.current.isFavorited(533535, MEDIA_TYPES.MOVIE)).toBe(
               true
            )
         );
         expect(result.current.isPending).toBe(true);
      });

      it('optimistically stores the media type of a series', async () => {
         mockGetUserFavorites.mockResolvedValue({ data: [], error: null });
         mockAddFavorite.mockImplementation(() => new Promise(() => {}));

         const { result } = renderHook(() => useFavorites(), { wrapper });
         await waitFor(() => expect(result.current.isLoading).toBe(false));

         act(() => {
            result.current.toggle(MOCK_SERIES_INPUT);
         });

         await waitFor(() =>
            expect(result.current.isFavorited(1399, MEDIA_TYPES.TV)).toBe(true)
         );
         expect(result.current.isFavorited(1399, MEDIA_TYPES.MOVIE)).toBe(
            false
         );
      });

      it('does nothing when no user is logged in', async () => {
         useAuth.setState({ user: null });

         const { result } = renderHook(() => useFavorites(), { wrapper });
         await waitFor(() => expect(result.current.isLoading).toBe(false));

         act(() => {
            result.current.toggle(MOCK_FILM_INPUT);
         });

         expect(mockAddFavorite).not.toHaveBeenCalled();
      });

      it('rolls back optimistic add on server error', async () => {
         mockGetUserFavorites.mockResolvedValue({ data: [], error: null });
         mockAddFavorite.mockRejectedValue(new Error('Server error'));

         const { result } = renderHook(() => useFavorites(), { wrapper });
         await waitFor(() => expect(result.current.isLoading).toBe(false));

         act(() => {
            result.current.toggle(MOCK_FILM_INPUT);
         });

         await waitFor(() => expect(result.current.isPending).toBe(false));
         expect(result.current.isFavorited(533535, MEDIA_TYPES.MOVIE)).toBe(
            false
         );
      });
   });

   describe('toggle — remove', () => {
      it('calls removeFavorite with the media type when already favorited', async () => {
         const { result } = renderHook(() => useFavorites(), { wrapper });
         await waitFor(() => expect(result.current.isLoading).toBe(false));

         act(() => {
            result.current.toggle(MOCK_FILM_INPUT);
         });

         await waitFor(() => expect(mockRemoveFavorite).toHaveBeenCalledOnce());
         expect(mockRemoveFavorite).toHaveBeenCalledWith(
            MOCK_USER_ID,
            533535,
            MEDIA_TYPES.MOVIE
         );
      });

      it('optimistically removes the film before the server responds', async () => {
         mockRemoveFavorite.mockImplementation(
            () =>
               new Promise((resolve) =>
                  setTimeout(() => resolve({ error: null }), 100)
               )
         );

         const { result } = renderHook(() => useFavorites(), { wrapper });
         await waitFor(() => expect(result.current.isLoading).toBe(false));

         act(() => {
            result.current.toggle(MOCK_FILM_INPUT);
         });

         await waitFor(() =>
            expect(result.current.isFavorited(533535, MEDIA_TYPES.MOVIE)).toBe(
               false
            )
         );
         expect(result.current.isPending).toBe(true);
      });

      it('only removes the row matching both id and media type', async () => {
         const seriesRow = {
            ...MOCK_FAVORITE,
            id: 'fav-2',
            media_type: MEDIA_TYPES.TV,
            film_title: 'Some Series',
         };
         mockGetUserFavorites.mockResolvedValue({
            data: [MOCK_FAVORITE, seriesRow],
            error: null,
         });
         mockRemoveFavorite.mockImplementation(() => new Promise(() => {}));

         const { result } = renderHook(() => useFavorites(), { wrapper });
         await waitFor(() => expect(result.current.isLoading).toBe(false));

         act(() => {
            result.current.toggle({
               ...MOCK_FILM_INPUT,
               mediaType: MEDIA_TYPES.TV,
            });
         });

         await waitFor(() =>
            expect(result.current.isFavorited(533535, MEDIA_TYPES.TV)).toBe(
               false
            )
         );
         expect(result.current.isFavorited(533535, MEDIA_TYPES.MOVIE)).toBe(
            true
         );
      });

      it('rolls back optimistic remove on server error', async () => {
         mockRemoveFavorite.mockRejectedValue(new Error('Server error'));

         const { result } = renderHook(() => useFavorites(), { wrapper });
         await waitFor(() => expect(result.current.isLoading).toBe(false));

         act(() => {
            result.current.toggle(MOCK_FILM_INPUT);
         });

         await waitFor(() => expect(result.current.isPending).toBe(false));
         expect(result.current.isFavorited(533535, MEDIA_TYPES.MOVIE)).toBe(
            true
         );
      });
   });

   describe('isPending', () => {
      it('is false when no mutation is in flight', async () => {
         const { result } = renderHook(() => useFavorites(), { wrapper });
         await waitFor(() => expect(result.current.isLoading).toBe(false));

         expect(result.current.isPending).toBe(false);
      });
   });
});
