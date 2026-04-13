import { useState } from 'react';
import { AUTH_MODAL_MODE } from '@/types/auth.types';
import { useAuth } from '@/utils/hooks/useAuth';
import { Input } from '@/components/atoms/input/input.component';
import Button from '@/components/atoms/button/button.component';

const ResetPasswordForm = () => {
   const [email, setEmail] = useState('');
   const [sent, setSent] = useState(false);

   const resetPassword = useAuth((s) => s.resetPassword);
   const isLoading = useAuth((s) => s.isLoading);
   const error = useAuth((s) => s.error);
   const setModalOpen = useAuth((s) => s.setModalOpen);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await resetPassword(email);
      if (!error) setSent(true);
   };

   if (sent) {
      return (
         <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-copy">
               Check your inbox — a reset link has been sent to{' '}
               <span className="text-sky-500">{email}</span>.
            </p>
            <Button
               variant="secondary"
               onClick={() => setModalOpen(true, AUTH_MODAL_MODE.LOGIN)}
            >
               Back to sign in
            </Button>
         </div>
      );
   }

   return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
         <p className="text-sm text-copy">
            Enter your email and we'll send you a reset link.
         </p>

         <Input
            id="reset-email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            inputValue={email}
            handleOnChange={(e) => setEmail(e.target.value)}
         />

         {error && <p className="text-sm text-red-500">{error.message}</p>}

         <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Sending…' : 'Send reset link'}
         </Button>

         <Button
            variant="secondary"
            onClick={() => setModalOpen(true, AUTH_MODAL_MODE.LOGIN)}
         >
            Back to sign in
         </Button>
      </form>
   );
};

export default ResetPasswordForm;
