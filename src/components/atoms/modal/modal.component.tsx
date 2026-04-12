import { useEffect, useRef } from 'react';
import { ModalProps } from './modal.types';

const Modal = ({
   isOpen,
   onClose,
   children,
   title,
   className = '',
   closeOnBackdropClick = true,
   showCloseButton = true,
}: ModalProps) => {
   const dialogRef = useRef<HTMLDialogElement>(null);

   useEffect(() => {
      const dialog = dialogRef.current;

      if (!dialog) {
         return;
      }

      if (isOpen && !dialog.open) {
         dialog.showModal();
      }

      if (!isOpen && dialog.open) {
         dialog.close();
      }
   }, [isOpen]);

   useEffect(() => {
      const dialog = dialogRef.current;

      if (!dialog) {
         return;
      }

      const handleCancel = (event: Event) => {
         event.preventDefault();
         onClose();
      };

      const handleClose = () => {
         if (isOpen) {
            onClose();
         }
      };

      dialog.addEventListener('cancel', handleCancel);
      dialog.addEventListener('close', handleClose);

      return () => {
         dialog.removeEventListener('cancel', handleCancel);
         dialog.removeEventListener('close', handleClose);
      };
   }, [isOpen, onClose]);

   const handleDialogClick = (event: React.MouseEvent<HTMLDialogElement>) => {
      if (!closeOnBackdropClick) {
         return;
      }

      if (event.target === event.currentTarget) {
         onClose();
      }
   };

   return (
      <dialog
         ref={dialogRef}
         onClick={handleDialogClick}
         aria-labelledby={title ? 'modal-title' : undefined}
         aria-modal="true"
         className="m-0 h-screen max-h-none w-screen max-w-none overflow-hidden bg-transparent p-0 backdrop:bg-black/60"
      >
         <div className="flex min-h-screen items-center justify-center p-4">
            <div
               className={`relative w-full max-w-md rounded-lg border-2 border-solid border-secondary-background-color bg-neutral p-6 text-copy shadow-2xl ${className}`.trim()}
            >
               {showCloseButton ? (
                  <button
                     type="button"
                     onClick={onClose}
                     className="absolute right-3 top-3 rounded p-1 text-copy transition-colors hover:text-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                     aria-label="Close modal"
                  >
                     x
                  </button>
               ) : null}

               {title ? (
                  <h2 id="modal-title" className="mb-4 text-xl font-bold">
                     {title}
                  </h2>
               ) : null}

               {children}
            </div>
         </div>
      </dialog>
   );
};

export type { ModalProps };
export default Modal;
