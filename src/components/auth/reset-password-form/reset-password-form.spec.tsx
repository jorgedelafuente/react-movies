import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AUTH_MODAL_MODE } from '@/types/auth.types';
import { useAuth } from '@/utils/hooks/useAuth';

import ResetPasswordForm from './reset-password-form.component';

const INITIAL_STATE = {
   user: null, session: null, isLoading: false, error: null,
   isModalOpen: true, modalMode: AUTH_MODAL_MODE.RESET_PASSWORD,
};

beforeEach(() => {
   useAuth.setState(INITIAL_STATE);
});

describe('ResetPasswordForm', () => {
   it('renders email field and send button', () => {
      render(<ResetPasswordForm />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
   });

   it('calls resetPassword with entered email on submit', async () => {
      const mockResetPassword = vi.fn().mockResolvedValue(undefined);
      useAuth.setState({ ...INITIAL_STATE, resetPassword: mockResetPassword });

      render(<ResetPasswordForm />);
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
      fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));

      expect(mockResetPassword).toHaveBeenCalledWith('user@example.com');
   });

   it('shows success state after submission with no error', async () => {
      const mockResetPassword = vi.fn().mockImplementation(async () => {
         // error stays null after successful reset
      });
      useAuth.setState({ ...INITIAL_STATE, resetPassword: mockResetPassword });

      render(<ResetPasswordForm />);
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
      fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));

      await waitFor(() => {
         expect(screen.getByText(/check your inbox/i)).toBeInTheDocument();
      });
      expect(screen.getByText('user@example.com')).toBeInTheDocument();
   });

   it('shows auth error message', () => {
      useAuth.setState({ ...INITIAL_STATE, error: { message: 'User not found' } });

      render(<ResetPasswordForm />);

      expect(screen.getByText('User not found')).toBeInTheDocument();
   });

   it('disables submit and shows loading text while loading', () => {
      useAuth.setState({ ...INITIAL_STATE, isLoading: true });

      render(<ResetPasswordForm />);

      expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled();
   });

   it('switches to login modal on "Back to sign in" click', () => {
      const mockSetModalOpen = vi.fn();
      useAuth.setState({ ...INITIAL_STATE, setModalOpen: mockSetModalOpen });

      render(<ResetPasswordForm />);
      fireEvent.click(screen.getByRole('button', { name: /back to sign in/i }));

      expect(mockSetModalOpen).toHaveBeenCalledWith(true, AUTH_MODAL_MODE.LOGIN);
   });
});
