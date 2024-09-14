import { useEffect } from 'react';
import { ErrorComponent, useRouter } from '@tanstack/react-router';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import type { ErrorComponentProps } from '@tanstack/react-router';

import { FilmNotFoundError } from '@/services/films/films';

export function FilmErrorComponent({ error }: ErrorComponentProps) {
   const router = useRouter();
   if (error instanceof FilmNotFoundError) {
      return <div>{error.message}</div>;
   }
   const queryErrorResetBoundary = useQueryErrorResetBoundary();

   useEffect(() => {
      queryErrorResetBoundary.reset();
   }, [queryErrorResetBoundary]);

   return (
      <div>
         <button
            onClick={() => {
               router.invalidate();
            }}
         >
            retry
         </button>
         <ErrorComponent error={error} />
      </div>
   );
}
