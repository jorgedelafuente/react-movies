import AuthModal from '@/components/auth/auth-modal/auth-modal.component';
import { AUTH_MODAL_MODE } from '@/types/auth.types';
import { useAuth } from '@/utils/hooks/useAuth';

const LoginIcon = ({ tabIndex }: { tabIndex?: number }) => {
   const user = useAuth((s) => s.user);
   const setModalOpen = useAuth((s) => s.setModalOpen);

   const handleClick = () => {
      if (user) {
         setModalOpen(true, AUTH_MODAL_MODE.LOGOUT);
      } else {
         setModalOpen(true, AUTH_MODAL_MODE.LOGIN);
      }
   };

   return (
      <>
         <button
            className="cursor-pointer"
            tabIndex={tabIndex}
            onClick={handleClick}
            aria-label={user ? 'Sign out' : 'Sign in'}
         >
            {user ? <LoggedInIcon /> : <LoggedOutIcon />}
         </button>
         <AuthModal />
      </>
   );
};

export default LoginIcon;

const LoggedOutIcon = () => (
   <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mr-2 h-6 w-6"
   >
      <circle cx="12" cy="8" r="3" className="fill-sky-400/20 stroke-sky-500" />
      <path d="M6 20a6 6 0 0 1 12 0" className="stroke-sky-500" />
   </svg>
);

const LoggedInIcon = () => (
   <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mr-2 h-6 w-6"
   >
      <circle cx="12" cy="8" r="3" className="fill-sky-500 stroke-sky-500" />
      <path d="M6 20a6 6 0 0 1 12 0" className="fill-sky-500 stroke-sky-500" />
   </svg>
);
