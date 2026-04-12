import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/utils/hooks/useAuth';
import { AUTH_MODAL_MODE } from '@/types/auth.types';
import Modal from '@/components/atoms/modal/modal.component';
import UserMenu from '../../user-menu/user-menu.component';

const AuthToggleIcon = () => {
   const {
      user,
      isModalOpen,
      modalMode,
      isLoading,
      error,
      signIn,
      setModalOpen,
      clearError,
   } = useAuth();
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
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

   const handleCloseModal = () => {
      setModalOpen(false, AUTH_MODAL_MODE.LOGIN);
      clearError();
      setPassword('');
   };

   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await signIn(email.trim(), password);
   };

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

         <Modal
            isOpen={!user && isModalOpen && modalMode === AUTH_MODAL_MODE.LOGIN}
            onClose={handleCloseModal}
            title="Login"
            className="max-w-lg"
         >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
               <label className="flex flex-col gap-1">
                  <span className="text-sm font-semibold">Email</span>
                  <input
                     type="email"
                     name="email"
                     autoComplete="email"
                     required
                     value={email}
                     onChange={(event) => setEmail(event.target.value)}
                     className="rounded border-2 border-secondary-background-color bg-primary-background-color px-3 py-2 text-copy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  />
               </label>

               <label className="flex flex-col gap-1">
                  <span className="text-sm font-semibold">Password</span>
                  <input
                     type="password"
                     name="password"
                     autoComplete="current-password"
                     required
                     minLength={6}
                     value={password}
                     onChange={(event) => setPassword(event.target.value)}
                     className="rounded border-2 border-secondary-background-color bg-primary-background-color px-3 py-2 text-copy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  />
               </label>

               {error ? (
                  <p role="alert" className="text-sm text-red-400">
                     {error.message}
                  </p>
               ) : null}

               <div className="mt-2 flex items-center justify-end gap-2">
                  <button
                     type="button"
                     onClick={handleCloseModal}
                     className="rounded border-2 border-secondary-background-color px-4 py-2 text-sm font-semibold text-copy transition-colors hover:bg-secondary-background-color"
                  >
                     Cancel
                  </button>
                  <button
                     type="submit"
                     disabled={isLoading}
                     className="rounded bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                     {isLoading ? 'Signing in...' : 'Sign in'}
                  </button>
               </div>
            </form>
         </Modal>
      </div>
   );
};

export default AuthToggleIcon;
