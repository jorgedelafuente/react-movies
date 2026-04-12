import { useAuth } from '@/utils/hooks/useAuth';

type UserMenuProps = {
   onClose: () => void;
};

const UserMenu = ({ onClose }: UserMenuProps) => {
   const { user, signOut } = useAuth();

   const handleLogout = async () => {
      await signOut();
      onClose();
   };

   return (
      <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-md border-2 border-solid border-bold bg-neutral shadow-2xl">
         <div className="border-b-2 border-solid border-bold p-4">
            <p className="truncate text-sm font-medium text-copy">
               {user?.email}
            </p>
         </div>
         <div className="p-2">
            <button
               onClick={handleLogout}
               className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-copy transition-colors hover:bg-neutral-inverted hover:text-sky-500"
            >
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
               </svg>
               Log out
            </button>
         </div>
      </div>
   );
};

export default UserMenu;
