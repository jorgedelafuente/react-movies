import { ReactNode } from 'react';

export type ModalProps = {
   isOpen: boolean;
   onClose: () => void;
   children: ReactNode;
   title?: string;
   className?: string;
   closeOnBackdropClick?: boolean;
   showCloseButton?: boolean;
};
