import type {
   // User as SupabaseUser,
   Session as SupabaseSession,
} from '@supabase/supabase-js';

export const AUTH_MODAL_MODE = {
   LOGIN: 'login',
   SIGNUP: 'signup',
   RESET_PASSWORD: 'reset_password',
   LOGOUT: 'logout',
} as const;

export type AUTH_MODAL_MODE =
   (typeof AUTH_MODAL_MODE)[keyof typeof AUTH_MODAL_MODE];

export type User = {
   id: string;
   email: string;
   metadata?: Record<string, unknown>;
};

export type AuthSession = SupabaseSession;

export type AuthError = {
   message: string;
   code?: string;
};

export type AuthState = {
   user: User | null;
   session: AuthSession | null;
   isLoading: boolean;
   error: AuthError | null;
   isModalOpen: boolean;
   modalMode: AUTH_MODAL_MODE;
   // Actions
   signIn: (email: string, password: string) => Promise<void>;
   signUp: (email: string, password: string) => Promise<void>;
   signOut: () => Promise<void>;
   resetPassword: (email: string) => Promise<void>;
   setModalOpen: (isOpen: boolean, mode?: AUTH_MODAL_MODE) => void;
   clearError: () => void;
   initialize: () => Promise<void>;
   destroy: () => void;
   setUser: (user: User | null) => void;
   setSession: (session: AuthSession | null) => void;
};
