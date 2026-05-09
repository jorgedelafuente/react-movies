import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AUTH_MODAL_MODE } from '@/types/auth.types';

import { useAuth } from './useAuth';

vi.mock('@/services/supabase/auth', () => ({
   signInWithPassword: vi.fn(),
   signUpWithPassword: vi.fn(),
   signOut: vi.fn(),
   sendPasswordResetEmail: vi.fn(),
   getCurrentSession: vi.fn(),
   getCurrentUser: vi.fn(),
   onAuthStateChange: vi.fn(),
}));

import * as authService from '@/services/supabase/auth';

const MOCK_USER = { id: 'user-123', email: 'test@example.com', metadata: {} };
const MOCK_SESSION = { expires_at: 9999999999 } as never;

const INITIAL_STATE = {
   user: null,
   session: null,
   isLoading: false,
   error: null,
   isModalOpen: false,
   modalMode: AUTH_MODAL_MODE.LOGIN,
};

beforeEach(() => {
   vi.clearAllMocks();
   useAuth.setState(INITIAL_STATE);
   vi.mocked(authService.onAuthStateChange).mockReturnValue({
      unsubscribe: vi.fn(),
   } as never);
});

describe('useAuth — initial state', () => {
   it('has correct defaults', () => {
      const state = useAuth.getState();
      expect(state.user).toBeNull();
      expect(state.session).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.isModalOpen).toBe(false);
      expect(state.modalMode).toBe(AUTH_MODAL_MODE.LOGIN);
   });
});

describe('useAuth — signIn', () => {
   it('sets user and session on success', async () => {
      vi.mocked(authService.signInWithPassword).mockResolvedValue({ user: MOCK_USER, error: null });
      vi.mocked(authService.getCurrentSession).mockResolvedValue(MOCK_SESSION);

      await act(async () => {
         await useAuth.getState().signIn('test@example.com', 'password123');
      });

      const state = useAuth.getState();
      expect(state.user).toEqual(MOCK_USER);
      expect(state.session).toEqual(MOCK_SESSION);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.isModalOpen).toBe(false);
   });

   it('sets error and clears loading on failure', async () => {
      vi.mocked(authService.signInWithPassword).mockResolvedValue({
         user: null,
         error: { message: 'Invalid credentials', code: 'invalid_grant' },
      });

      await act(async () => {
         await useAuth.getState().signIn('test@example.com', 'wrong');
      });

      const state = useAuth.getState();
      expect(state.user).toBeNull();
      expect(state.error).toEqual({ message: 'Invalid credentials', code: 'invalid_grant' });
      expect(state.isLoading).toBe(false);
   });

   it('sets isLoading to true while request is in flight', async () => {
      let resolve!: (v: { user: null; error: { message: string } }) => void;
      vi.mocked(authService.signInWithPassword).mockReturnValue(
         new Promise((r) => { resolve = r; })
      );

      act(() => { useAuth.getState().signIn('test@example.com', 'password123'); });

      expect(useAuth.getState().isLoading).toBe(true);

      await act(async () => { resolve({ user: null, error: { message: 'fail' } }); });
   });
});

describe('useAuth — signUp', () => {
   it('sets user and session on success', async () => {
      vi.mocked(authService.signUpWithPassword).mockResolvedValue({ user: MOCK_USER, error: null });
      vi.mocked(authService.getCurrentSession).mockResolvedValue(MOCK_SESSION);

      await act(async () => {
         await useAuth.getState().signUp('new@example.com', 'password123');
      });

      const state = useAuth.getState();
      expect(state.user).toEqual(MOCK_USER);
      expect(state.session).toEqual(MOCK_SESSION);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
   });

   it('sets error on failure', async () => {
      vi.mocked(authService.signUpWithPassword).mockResolvedValue({
         user: null,
         error: { message: 'Email already registered' },
      });

      await act(async () => {
         await useAuth.getState().signUp('existing@example.com', 'password123');
      });

      expect(useAuth.getState().error).toEqual({ message: 'Email already registered' });
      expect(useAuth.getState().user).toBeNull();
   });
});

describe('useAuth — signOut', () => {
   it('clears user and session on success', async () => {
      useAuth.setState({ user: MOCK_USER, session: MOCK_SESSION });
      vi.mocked(authService.signOut).mockResolvedValue({ error: null });

      await act(async () => {
         await useAuth.getState().signOut();
      });

      const state = useAuth.getState();
      expect(state.user).toBeNull();
      expect(state.session).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
   });

   it('sets error and retains user on failure', async () => {
      useAuth.setState({ user: MOCK_USER, session: MOCK_SESSION });
      vi.mocked(authService.signOut).mockResolvedValue({
         error: { message: 'Sign out failed' },
      });

      await act(async () => {
         await useAuth.getState().signOut();
      });

      expect(useAuth.getState().user).toEqual(MOCK_USER);
      expect(useAuth.getState().error).toEqual({ message: 'Sign out failed' });
   });
});

describe('useAuth — resetPassword', () => {
   it('clears loading and error on success', async () => {
      vi.mocked(authService.sendPasswordResetEmail).mockResolvedValue({ error: null });

      await act(async () => {
         await useAuth.getState().resetPassword('test@example.com');
      });

      const state = useAuth.getState();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
   });

   it('sets error on failure', async () => {
      vi.mocked(authService.sendPasswordResetEmail).mockResolvedValue({
         error: { message: 'User not found' },
      });

      await act(async () => {
         await useAuth.getState().resetPassword('nobody@example.com');
      });

      expect(useAuth.getState().error).toEqual({ message: 'User not found' });
      expect(useAuth.getState().isLoading).toBe(false);
   });
});

describe('useAuth — setModalOpen', () => {
   it('opens modal with default LOGIN mode', () => {
      useAuth.getState().setModalOpen(true);

      expect(useAuth.getState().isModalOpen).toBe(true);
      expect(useAuth.getState().modalMode).toBe(AUTH_MODAL_MODE.LOGIN);
   });

   it('opens modal with specified mode', () => {
      useAuth.getState().setModalOpen(true, AUTH_MODAL_MODE.SIGNUP);

      expect(useAuth.getState().isModalOpen).toBe(true);
      expect(useAuth.getState().modalMode).toBe(AUTH_MODAL_MODE.SIGNUP);
   });

   it('closes modal and clears error', () => {
      useAuth.setState({ isModalOpen: true, error: { message: 'some error' } });
      useAuth.getState().setModalOpen(false);

      expect(useAuth.getState().isModalOpen).toBe(false);
      expect(useAuth.getState().error).toBeNull();
   });
});

describe('useAuth — clearError', () => {
   it('clears an existing error', () => {
      useAuth.setState({ error: { message: 'Something went wrong' } });
      useAuth.getState().clearError();

      expect(useAuth.getState().error).toBeNull();
   });
});

describe('useAuth — setUser / setSession', () => {
   it('setUser updates the user directly', () => {
      useAuth.getState().setUser(MOCK_USER);
      expect(useAuth.getState().user).toEqual(MOCK_USER);

      useAuth.getState().setUser(null);
      expect(useAuth.getState().user).toBeNull();
   });

   it('setSession updates the session directly', () => {
      useAuth.getState().setSession(MOCK_SESSION);
      expect(useAuth.getState().session).toEqual(MOCK_SESSION);

      useAuth.getState().setSession(null);
      expect(useAuth.getState().session).toBeNull();
   });
});

describe('useAuth — initialize', () => {
   it('restores user and session from existing session', async () => {
      vi.mocked(authService.getCurrentSession).mockResolvedValue(MOCK_SESSION);
      vi.mocked(authService.getCurrentUser).mockResolvedValue(MOCK_USER);

      await act(async () => {
         await useAuth.getState().initialize();
      });

      expect(useAuth.getState().user).toEqual(MOCK_USER);
      expect(useAuth.getState().session).toEqual(MOCK_SESSION);
   });

   it('sets user and session to null when no active session', async () => {
      vi.mocked(authService.getCurrentSession).mockResolvedValue(null);
      vi.mocked(authService.getCurrentUser).mockResolvedValue(null);

      await act(async () => {
         await useAuth.getState().initialize();
      });

      expect(useAuth.getState().user).toBeNull();
      expect(useAuth.getState().session).toBeNull();
   });

   it('subscribes to auth state changes', async () => {
      vi.mocked(authService.getCurrentSession).mockResolvedValue(null);
      vi.mocked(authService.getCurrentUser).mockResolvedValue(null);

      await act(async () => {
         await useAuth.getState().initialize();
      });

      expect(authService.onAuthStateChange).toHaveBeenCalledOnce();
   });
});

describe('useAuth — destroy', () => {
   it('calls unsubscribe when destroyed after initialize', async () => {
      const mockUnsubscribe = vi.fn();
      vi.mocked(authService.onAuthStateChange).mockReturnValue({
         unsubscribe: mockUnsubscribe,
      } as never);
      vi.mocked(authService.getCurrentSession).mockResolvedValue(null);
      vi.mocked(authService.getCurrentUser).mockResolvedValue(null);

      await act(async () => { await useAuth.getState().initialize(); });

      useAuth.getState().destroy();

      expect(mockUnsubscribe).toHaveBeenCalledOnce();
   });

   it('is safe to call without prior initialize', () => {
      expect(() => useAuth.getState().destroy()).not.toThrow();
   });
});
