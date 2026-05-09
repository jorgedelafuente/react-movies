import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AUTH_MODAL_MODE } from '@/types/auth.types';
import { useAuth } from '@/utils/hooks/useAuth';

vi.mock('@tanstack/react-router', async (importOriginal) => {
   const actual = await importOriginal<typeof import('@tanstack/react-router')>();
   return { ...actual, useNavigate: () => vi.fn() };
});

import LogoutForm from './logout-form.component';

const INITIAL_STATE = {
   user: { id: 'user-123', email: 'test@example.com' },
   session: null, isLoading: false, error: null,
   isModalOpen: true, modalMode: AUTH_MODAL_MODE.LOGOUT,
};

beforeEach(() => {
   useAuth.setState(INITIAL_STATE as never);
});

describe('LogoutForm', () => {
   it('renders sign out and cancel buttons', () => {
      render(<LogoutForm />);
      expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
   });

   it('calls signOut and closes modal on "Sign out" click', async () => {
      const mockSignOut = vi.fn().mockResolvedValue(undefined);
      const mockSetModalOpen = vi.fn();
      useAuth.setState({ ...INITIAL_STATE, signOut: mockSignOut, setModalOpen: mockSetModalOpen } as never);

      render(<LogoutForm />);
      fireEvent.click(screen.getByRole('button', { name: /^sign out$/i }));

      expect(mockSignOut).toHaveBeenCalledOnce();
   });

   it('closes modal on "Cancel" click', () => {
      const mockSetModalOpen = vi.fn();
      useAuth.setState({ ...INITIAL_STATE, setModalOpen: mockSetModalOpen } as never);

      render(<LogoutForm />);
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

      expect(mockSetModalOpen).toHaveBeenCalledWith(false);
   });

   it('disables sign out button while loading', () => {
      useAuth.setState({ ...INITIAL_STATE, isLoading: true } as never);

      render(<LogoutForm />);

      expect(screen.getByRole('button', { name: /signing out/i })).toBeDisabled();
   });
});
