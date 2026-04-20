import { useState } from 'react';

import Button from '@/components/atoms/button/button.component';
import { Input } from '@/components/atoms/input/input.component';
import { AUTH_MODAL_MODE } from '@/types/auth.types';
import { useAuth } from '@/utils/hooks/useAuth';

const LoginForm = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

   const signIn = useAuth((s) => s.signIn);
   const isLoading = useAuth((s) => s.isLoading);
   const error = useAuth((s) => s.error);
   const setModalOpen = useAuth((s) => s.setModalOpen);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      signIn(email, password);
   };

   return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
         <Input
            id="login-email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            inputValue={email}
            handleOnChange={(e) => setEmail(e.target.value)}
         />
         <Input
            id="login-password"
            type="password"
            label="Password"
            placeholder="••••••••"
            inputValue={password}
            handleOnChange={(e) => setPassword(e.target.value)}
         />

         {error && <p className="text-sm text-red-500">{error.message}</p>}

         <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in…' : 'Sign in'}
         </Button>

         <div className="flex flex-col items-center gap-1 text-sm text-copy">
            <button
               type="button"
               onClick={() => setModalOpen(true, AUTH_MODAL_MODE.RESET_PASSWORD)}
               className="hover:text-sky-500"
            >
               Forgot password?
            </button>
            <span>
               No account?{' '}
               <button
                  type="button"
                  onClick={() => setModalOpen(true, AUTH_MODAL_MODE.SIGNUP)}
                  className="text-sky-500 hover:underline"
               >
                  Register
               </button>
            </span>
         </div>
      </form>
   );
};

export default LoginForm;
