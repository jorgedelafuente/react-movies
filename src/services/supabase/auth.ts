import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

import type { AuthError,User } from '@/types/auth.types';

import { supabase } from './supabaseClient';

/**
 * Sign in with email and password
 */
export const signInWithPassword = async (
   email: string,
   password: string
): Promise<{ user: User | null; error: AuthError | null }> => {
   try {
      const { data, error } = await supabase.auth.signInWithPassword({
         email,
         password,
      });

      if (error) {
         return {
            user: null,
            error: { message: error.message, code: error.code },
         };
      }

      if (!data.user) {
         return { user: null, error: { message: 'No user returned' } };
      }

      const user: User = {
         id: data.user.id,
         email: data.user.email || '',
         metadata: data.user.user_metadata,
      };

      return { user, error: null };
   } catch (err) {
      return {
         user: null,
         error: {
            message: err instanceof Error ? err.message : 'Unknown error',
         },
      };
   }
};

/**
 * Sign up with email and password
 */
export const signUpWithPassword = async (
   email: string,
   password: string
): Promise<{ user: User | null; error: AuthError | null }> => {
   try {
      const { data, error } = await supabase.auth.signUp({
         email,
         password,
      });

      if (error) {
         return {
            user: null,
            error: { message: error.message, code: error.code },
         };
      }

      if (!data.user) {
         return { user: null, error: { message: 'No user returned' } };
      }

      const user: User = {
         id: data.user.id,
         email: data.user.email || '',
         metadata: data.user.user_metadata,
      };

      return { user, error: null };
   } catch (err) {
      return {
         user: null,
         error: {
            message: err instanceof Error ? err.message : 'Unknown error',
         },
      };
   }
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<{ error: AuthError | null }> => {
   try {
      const { error } = await supabase.auth.signOut();

      if (error) {
         return { error: { message: error.message, code: error.code } };
      }

      return { error: null };
   } catch (err) {
      return {
         error: {
            message: err instanceof Error ? err.message : 'Unknown error',
         },
      };
   }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (
   email: string
): Promise<{ error: AuthError | null }> => {
   try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
         redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
         return { error: { message: error.message, code: error.code } };
      }

      return { error: null };
   } catch (err) {
      return {
         error: {
            message: err instanceof Error ? err.message : 'Unknown error',
         },
      };
   }
};

/**
 * Get the current session
 */
export const getCurrentSession = async (): Promise<Session | null> => {
   try {
      const { data } = await supabase.auth.getSession();
      return data.session;
   } catch (err) {
      console.error('Error getting session:', err);
      return null;
   }
};

/**
 * Get the current user
 */
export const getCurrentUser = async (): Promise<User | null> => {
   try {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
         return null;
      }

      return {
         id: data.user.id,
         email: data.user.email || '',
         metadata: data.user.user_metadata,
      };
   } catch (err) {
      console.error('Error getting user:', err);
      return null;
   }
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (
   callback: (event: AuthChangeEvent, session: Session | null) => void
) => {
   const {
      data: { subscription },
   } = supabase.auth.onAuthStateChange(callback);

   return subscription;
};
