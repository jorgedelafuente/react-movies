import { useState } from 'react';
import { AUTH_MODAL_MODE } from '@/types/auth.types';
import { useAuth } from '@/utils/hooks/useAuth';
import { Input } from '@/components/atoms/input/input.component';
import Button from '@/components/atoms/button/button.component';

const RegisterForm = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirm, setConfirm] = useState('');
   const [confirmError, setConfirmError] = useState('');

   const signUp = useAuth((s) => s.signUp);
   const isLoading = useAuth((s) => s.isLoading);
   const error = useAuth((s) => s.error);
   const setModalOpen = useAuth((s) => s.setModalOpen);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (password !== confirm) {
         setConfirmError('Passwords do not match');
         return;
      }

      setConfirmError('');
      signUp(email, password);
   };

   return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
         <Input
            id="register-email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            inputValue={email}
            handleOnChange={(e) => setEmail(e.target.value)}
         />
         <Input
            id="register-password"
            type="password"
            label="Password"
            placeholder="••••••••"
            inputValue={password}
            handleOnChange={(e) => setPassword(e.target.value)}
         />
         <Input
            id="register-confirm"
            type="password"
            label="Confirm password"
            placeholder="••••••••"
            inputValue={confirm}
            handleOnChange={(e) => setConfirm(e.target.value)}
            error={confirmError}
         />

         {error && <p className="text-sm text-red-500">{error.message}</p>}

         <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Creating account…' : 'Create account'}
         </Button>

         <p className="text-center text-sm text-copy">
            Already have an account?{' '}
            <button
               type="button"
               onClick={() => setModalOpen(true, AUTH_MODAL_MODE.LOGIN)}
               className="text-sky-500 hover:underline"
            >
               Sign in
            </button>
         </p>
      </form>
   );
};

export default RegisterForm;
