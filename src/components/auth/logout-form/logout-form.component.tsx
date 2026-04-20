import Button from '@/components/atoms/button/button.component';
import { useAuth } from '@/utils/hooks/useAuth';

const LogoutForm = () => {
   const signOut = useAuth((s) => s.signOut);
   const setModalOpen = useAuth((s) => s.setModalOpen);
   const isLoading = useAuth((s) => s.isLoading);

   return (
      <div className="flex flex-col gap-4">
         <p className="text-sm text-copy">Are you sure you want to sign out?</p>
         <div className="flex gap-3">
            <Button
               variant="primary"
               className="flex-1"
               onClick={async () => { await signOut(); setModalOpen(false); }}
               disabled={isLoading}
            >
               {isLoading ? 'Signing out…' : 'Sign out'}
            </Button>
            <Button
               variant="secondary"
               className="flex-1"
               onClick={() => setModalOpen(false)}
            >
               Cancel
            </Button>
         </div>
      </div>
   );
};

export default LogoutForm;
