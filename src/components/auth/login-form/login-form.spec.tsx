import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AUTH_MODAL_MODE } from '@/types/auth.types';
import { useAuth } from '@/utils/hooks/useAuth';

import LoginForm from './login-form.component';

const INITIAL_STATE = {
   user: null, session: null, isLoading: false, error: null,
   isModalOpen: true, modalMode: AUTH_MODAL_MODE.LOGIN,
};

beforeEach(() => {
   useAuth.setState(INITIAL_STATE);
});

describe('LoginForm', () => {
   it('renders email, password fields and submit button', () => {
      render(<LoginForm />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
   });

   it('calls signIn with entered credentials on submit', async () => {
      const mockSignIn = vi.fn();
      useAuth.setState({ ...INITIAL_STATE, signIn: mockSignIn });

      render(<LoginForm />);

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
   });

   it('shows error message when auth error is set', () => {
      useAuth.setState({ ...INITIAL_STATE, error: { message: 'Invalid credentials' } });

      render(<LoginForm />);

      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
   });

   it('disables submit button and shows loading text while loading', () => {
      useAuth.setState({ ...INITIAL_STATE, isLoading: true });

      render(<LoginForm />);

      const btn = screen.getByRole('button', { name: /signing in/i });
      expect(btn).toBeDisabled();
   });

   it('switches to reset password modal on "Forgot password?" click', () => {
      const mockSetModalOpen = vi.fn();
      useAuth.setState({ ...INITIAL_STATE, setModalOpen: mockSetModalOpen });

      render(<LoginForm />);
      fireEvent.click(screen.getByText(/forgot password/i));

      expect(mockSetModalOpen).toHaveBeenCalledWith(true, AUTH_MODAL_MODE.RESET_PASSWORD);
   });

   it('switches to register modal on "Register" click', () => {
      const mockSetModalOpen = vi.fn();
      useAuth.setState({ ...INITIAL_STATE, setModalOpen: mockSetModalOpen });

      render(<LoginForm />);
      fireEvent.click(screen.getByText('Register'));

      expect(mockSetModalOpen).toHaveBeenCalledWith(true, AUTH_MODAL_MODE.SIGNUP);
   });
});
