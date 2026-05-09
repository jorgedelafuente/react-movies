import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AUTH_MODAL_MODE } from '@/types/auth.types';
import { useAuth } from '@/utils/hooks/useAuth';

import RegisterForm from './register-form.component';

const INITIAL_STATE = {
   user: null, session: null, isLoading: false, error: null,
   isModalOpen: true, modalMode: AUTH_MODAL_MODE.SIGNUP,
};

beforeEach(() => {
   useAuth.setState(INITIAL_STATE);
});

describe('RegisterForm', () => {
   it('renders email, password, confirm fields and submit button', () => {
      render(<RegisterForm />);
      expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
   });

   it('shows inline error when passwords do not match', () => {
      render(<RegisterForm />);

      fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'abc123' } });
      fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'different' } });
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
   });

   it('does not call signUp when passwords do not match', () => {
      const mockSignUp = vi.fn();
      useAuth.setState({ ...INITIAL_STATE, signUp: mockSignUp });

      render(<RegisterForm />);
      fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'abc123' } });
      fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'different' } });
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      expect(mockSignUp).not.toHaveBeenCalled();
   });

   it('calls signUp with correct credentials when passwords match', () => {
      const mockSignUp = vi.fn();
      useAuth.setState({ ...INITIAL_STATE, signUp: mockSignUp });

      render(<RegisterForm />);
      fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: 'new@example.com' } });
      fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'abc123' } });
      fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'abc123' } });
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      expect(mockSignUp).toHaveBeenCalledWith('new@example.com', 'abc123');
   });

   it('shows auth error message from store', () => {
      useAuth.setState({ ...INITIAL_STATE, error: { message: 'Email already registered' } });

      render(<RegisterForm />);

      expect(screen.getByText('Email already registered')).toBeInTheDocument();
   });

   it('disables submit and shows loading text while loading', () => {
      useAuth.setState({ ...INITIAL_STATE, isLoading: true });

      render(<RegisterForm />);

      expect(screen.getByRole('button', { name: /creating account/i })).toBeDisabled();
   });

   it('switches to login modal on "Sign in" click', () => {
      const mockSetModalOpen = vi.fn();
      useAuth.setState({ ...INITIAL_STATE, setModalOpen: mockSetModalOpen });

      render(<RegisterForm />);
      fireEvent.click(screen.getByText('Sign in'));

      expect(mockSetModalOpen).toHaveBeenCalledWith(true, AUTH_MODAL_MODE.LOGIN);
   });
});
