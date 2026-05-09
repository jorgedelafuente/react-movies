import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createTestQueryClient } from '@/tests/test-utils';
import { useAuth } from '@/utils/hooks/useAuth';
import { useFavorites } from '@/utils/hooks/useFavorites';

import FavoriteButton from './favorite-button.component';

vi.mock('@/utils/hooks/useFavorites', () => ({
   useFavorites: vi.fn(),
}));

vi.mock('@/services/supabase/favorites', () => ({
   getUserFavorites: vi.fn(),
   addFavorite: vi.fn(),
   removeFavorite: vi.fn(),
}));

const mockToggle = vi.fn();

const renderButton = (props = {}) =>
   render(
      <QueryClientProvider client={createTestQueryClient()}>
         <FavoriteButton
            filmId={533535}
            filmTitle="Deadpool & Wolverine"
            filmPosterPath="/poster.jpg"
            filmReleaseDate="2024-07-24"
            {...props}
         />
      </QueryClientProvider>
   );

beforeEach(() => {
   vi.clearAllMocks();
   useAuth.setState({
      user: { id: 'user-123', email: 'test@example.com' } as never,
   });
   vi.mocked(useFavorites).mockReturnValue({
      favorites: [],
      isLoading: false,
      isFavorited: vi.fn().mockReturnValue(false),
      toggle: mockToggle,
      isPending: false,
   });
});

describe('FavoriteButton', () => {
   describe('when user is not logged in', () => {
      it('renders nothing', () => {
         useAuth.setState({ user: null });
         const { container } = renderButton();
         expect(container).toBeEmptyDOMElement();
      });
   });

   describe('when user is logged in', () => {
      it('renders an "Add to favorites" button when film is not favorited', () => {
         renderButton();
         expect(
            screen.getByRole('button', { name: 'Add to favorites' })
         ).toBeInTheDocument();
      });

      it('renders a "Remove from favorites" button when film is favorited', () => {
         vi.mocked(useFavorites).mockReturnValue({
            favorites: [],
            isLoading: false,
            isFavorited: vi.fn().mockReturnValue(true),
            toggle: mockToggle,
            isPending: false,
         });

         renderButton();
         expect(
            screen.getByRole('button', { name: 'Remove from favorites' })
         ).toBeInTheDocument();
      });

      it('calls toggle with correct args when clicked', () => {
         renderButton();
         fireEvent.click(
            screen.getByRole('button', { name: 'Add to favorites' })
         );
         expect(mockToggle).toHaveBeenCalledWith(
            533535,
            'Deadpool & Wolverine',
            '/poster.jpg',
            '2024-07-24'
         );
      });

      it('is disabled while a mutation is pending', () => {
         vi.mocked(useFavorites).mockReturnValue({
            favorites: [],
            isLoading: false,
            isFavorited: vi.fn().mockReturnValue(false),
            toggle: mockToggle,
            isPending: true,
         });

         renderButton();
         expect(
            screen.getByRole('button', { name: 'Add to favorites' })
         ).toBeDisabled();
      });

      it('applies custom className', () => {
         renderButton({ className: 'my-custom-class' });
         expect(
            screen.getByRole('button', { name: 'Add to favorites' })
         ).toHaveClass('my-custom-class');
      });
   });
});
