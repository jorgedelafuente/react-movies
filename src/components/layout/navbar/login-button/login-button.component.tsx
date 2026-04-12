import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/utils/hooks/useAuth';
import { AUTH_MODAL_MODE } from '@/types/auth.types';
import UserMenu from '../user-menu/user-menu.component';

const LoginButton = () => {
   const { user, setModalOpen } = useAuth();
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const menuRef = useRef<HTMLDivElement>(null);

   const handleClick = () => {
      if (user) {
         setIsMenuOpen(!isMenuOpen);
      } else {
         setModalOpen(true, AUTH_MODAL_MODE.LOGIN);
      }
   };

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            menuRef.current &&
            !menuRef.current.contains(event.target as Node)
         ) {
            setIsMenuOpen(false);
         }
      };

      if (isMenuOpen) {
         document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [isMenuOpen]);

   return (
      <div className="relative" ref={menuRef}>
         <button
            onClick={handleClick}
            className="0 flex cursor-pointer items-center gap-2 text-copy text-sky-500 transition-colors"
            aria-label={user ? 'User menu' : 'Login'}
         >
            {user ? (
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
               </svg>
            ) : (
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
               </svg>
            )}
         </button>

         {user && isMenuOpen && (
            <UserMenu onClose={() => setIsMenuOpen(false)} />
         )}
      </div>
   );
};

export default LoginButton;
