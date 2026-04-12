import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/utils/hooks/useAuth';
import { onAuthStateChange, getCurrentUser } from '@/services/supabase/auth';

type AuthProviderProps = {
   children: ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
   const { initialize, setUser, setSession } = useAuth();

   useEffect(() => {
      // Initialize auth state on mount
      initialize();

      // Set up auth state listener
      const subscription = onAuthStateChange(async (event, session) => {
         console.log('Auth state changed:', event);

         if (session) {
            // User signed in or session refreshed
            const user = await getCurrentUser();
            setUser(user);
            setSession(session);
         } else {
            // User signed out
            setUser(null);
            setSession(null);
         }
      });

      // Cleanup subscription on unmount
      return () => {
         subscription.unsubscribe();
      };
   }, []);

   return <>{children}</>;
};

export default AuthProvider;
