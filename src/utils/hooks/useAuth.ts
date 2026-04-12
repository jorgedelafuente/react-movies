import { create } from 'zustand';
import type { AuthState, User, AuthSession } from '@/types/auth.types';
import { AUTH_MODAL_MODE } from '@/types/auth.types';
import * as authService from '@/services/supabase/auth';

export const useAuth = create<AuthState>((set) => ({
   // State
   user: null,
   session: null,
   isLoading: false,
   error: null,
   isModalOpen: false,
   modalMode: AUTH_MODAL_MODE.LOGIN,

   // Actions
   signIn: async (email: string, password: string) => {
      set({ isLoading: true, error: null });

      const { user, error } = await authService.signInWithPassword(
         email,
         password
      );

      if (error) {
         set({ isLoading: false, error });
         return;
      }

      const session = await authService.getCurrentSession();

      set({
         user,
         session,
         isLoading: false,
         error: null,
         isModalOpen: false,
      });
   },

   signUp: async (email: string, password: string) => {
      set({ isLoading: true, error: null });

      const { user, error } = await authService.signUpWithPassword(
         email,
         password
      );

      if (error) {
         set({ isLoading: false, error });
         return;
      }

      const session = await authService.getCurrentSession();

      set({
         user,
         session,
         isLoading: false,
         error: null,
         isModalOpen: false,
      });
   },

   signOut: async () => {
      set({ isLoading: true, error: null });

      const { error } = await authService.signOut();

      if (error) {
         set({ isLoading: false, error });
         return;
      }

      set({
         user: null,
         session: null,
         isLoading: false,
         error: null,
      });
   },

   resetPassword: async (email: string) => {
      set({ isLoading: true, error: null });

      const { error } = await authService.sendPasswordResetEmail(email);

      if (error) {
         set({ isLoading: false, error });
         return;
      }

      set({
         isLoading: false,
         error: null,
      });
   },

   setModalOpen: (isOpen: boolean, mode = AUTH_MODAL_MODE.LOGIN) => {
      set({ isModalOpen: isOpen, modalMode: mode, error: null });
   },

   clearError: () => {
      set({ error: null });
   },

   initialize: async () => {
      set({ isLoading: true });

      const session = await authService.getCurrentSession();
      const user = await authService.getCurrentUser();

      set({
         user,
         session,
         isLoading: false,
      });
   },

   setUser: (user: User | null) => {
      set({ user });
   },

   setSession: (session: AuthSession | null) => {
      set({ session });
   },
}));
