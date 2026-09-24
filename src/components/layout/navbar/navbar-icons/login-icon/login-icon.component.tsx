import './login-icon.styles.css';

import AuthModal from '@/components/auth/auth-modal/auth-modal.component';
import { AUTH_MODAL_MODE } from '@/types/auth.types';
import { useAuth } from '@/utils/hooks/useAuth';

import NavIconButton from '../nav-icon-button/nav-icon-button.component';

/**
 * Account button. Signed out it is an outline figure that opens the sign-in
 * modal; signed in the figure fills with the accent tint and gains a small
 * accent presence dot, and the click opens the sign-out modal.
 */
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
         <NavIconButton
            label={user ? 'Sign out' : 'Sign in'}
            onClick={handleClick}
            tabIndex={tabIndex}
            data-signed-in={user ? '' : undefined}
         >
            <UserGlyph filled={Boolean(user)} />
            {user && <span aria-hidden="true" className="login-icon__status" />}
         </NavIconButton>
         <AuthModal />
      </>
   );
};

export default LoginIcon;

const UserGlyph = ({ filled }: { filled: boolean }) => {
   const tint = filled ? 'nav-icon-button__tint' : undefined;
   return (
      <svg
         aria-hidden="true"
         viewBox="0 0 24 24"
         className="nav-icon-button__icon"
      >
         <circle cx="12" cy="8" r="3.75" className={tint} />
         <path d="M5 20.5a7 7 0 0 1 14 0Z" className={tint} />
      </svg>
   );
};
