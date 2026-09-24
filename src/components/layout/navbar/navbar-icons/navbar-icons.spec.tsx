import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAxe } from '@/tests/test-utils';
import { AUTH_MODAL_MODE } from '@/types/auth.types';
import { THEME_OPTIONS } from '@/types/theme.types';
import { useAuth } from '@/utils/hooks/useAuth';
import { useTheme } from '@/utils/hooks/useTheme';

import LoginIcon from './login-icon/login-icon.component';
import ThemeToggleIcon from './theme-toggle-icon/theme-toggle-icon.component';

beforeEach(() => {
   useTheme.setState({ theme: THEME_OPTIONS.DARK });
   useAuth.setState({
      user: null,
      isModalOpen: false,
      modalMode: AUTH_MODAL_MODE.LOGIN,
   });
});

describe('ThemeToggleIcon', () => {
   it('names the mode a click moves to and flips the store', async () => {
      const user = userEvent.setup();
      const { violations } = await renderWithAxe(<ThemeToggleIcon />);
      expect(violations).toHaveNoViolations();

      const button = screen.getByRole('button', {
         name: 'Switch to light mode',
      });
      expect(button).toHaveAttribute('data-theme', THEME_OPTIONS.DARK);

      await user.click(button);

      expect(useTheme.getState().theme).toBe(THEME_OPTIONS.LIGHT);
      expect(
         screen.getByRole('button', { name: 'Switch to dark mode' })
      ).toHaveAttribute('data-theme', THEME_OPTIONS.LIGHT);
   });
});

describe('LoginIcon', () => {
   it('opens the sign-in modal when signed out', async () => {
      const user = userEvent.setup();
      const { violations } = await renderWithAxe(<LoginIcon />);
      expect(violations).toHaveNoViolations();

      const button = screen.getByRole('button', { name: 'Sign in' });
      expect(button).not.toHaveAttribute('data-signed-in');

      await user.click(button);

      expect(useAuth.getState()).toMatchObject({
         isModalOpen: true,
         modalMode: AUTH_MODAL_MODE.LOGIN,
      });
   });

   it('marks the signed-in state and opens the sign-out modal', async () => {
      const user = userEvent.setup();
      useAuth.setState({
         user: { id: 'user-123', email: 'test@example.com' } as never,
      });
      await renderWithAxe(<LoginIcon />);

      const button = screen.getByRole('button', { name: 'Sign out' });
      expect(button).toHaveAttribute('data-signed-in');

      await user.click(button);

      expect(useAuth.getState()).toMatchObject({
         isModalOpen: true,
         modalMode: AUTH_MODAL_MODE.LOGOUT,
      });
   });
});
