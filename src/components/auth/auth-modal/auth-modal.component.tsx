import Modal from '@/components/atoms/modal/modal.component';
import { AUTH_MODAL_MODE } from '@/types/auth.types';
import { useAuth } from '@/utils/hooks/useAuth';

import AuthModalContent from './auth-modal-content.component';

const TITLES: Record<AUTH_MODAL_MODE, string> = {
   [AUTH_MODAL_MODE.LOGIN]: 'Sign in',
   [AUTH_MODAL_MODE.SIGNUP]: 'Create account',
   [AUTH_MODAL_MODE.RESET_PASSWORD]: 'Reset password',
   [AUTH_MODAL_MODE.LOGOUT]: 'Sign out',
};

const AuthModal = () => {
   const isModalOpen = useAuth((s) => s.isModalOpen);
   const modalMode = useAuth((s) => s.modalMode);
   const setModalOpen = useAuth((s) => s.setModalOpen);

   return (
      <Modal
         isOpen={isModalOpen}
         onClose={() => setModalOpen(false)}
         title={TITLES[modalMode]}
      >
         <AuthModalContent mode={modalMode} />
      </Modal>
   );
};

export default AuthModal;
