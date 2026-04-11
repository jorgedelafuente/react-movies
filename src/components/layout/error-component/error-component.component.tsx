import { useEffect } from 'react';
import {
   ErrorComponent as RouterErrorComponent,
   useRouter,
} from '@tanstack/react-router';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import type { ErrorComponentProps } from '@tanstack/react-router';

import { FilmNotFoundError } from '@/services/films/films';
import Container from '../container/container.component';

export function ErrorComponent({ error }: ErrorComponentProps) {
   const router = useRouter();
   if (error instanceof FilmNotFoundError) {
      return <div>{error.message}</div>;
   }
   const queryErrorResetBoundary = useQueryErrorResetBoundary();

   useEffect(() => {
      queryErrorResetBoundary.reset();
   }, [queryErrorResetBoundary]);

   return (
      <Container>
         <p className="mb-8 p-4 text-copy">Error...</p>
         <button
            onClick={() => {
               router.invalidate();
            }}
         >
            <span className="rounded-lg border-2 border-solid border-blue-700 p-4 text-copy hover:bg-blue-900 hover:text-slate-300">
               Retry
            </span>
         </button>
         <RouterErrorComponent error={error} />
      </Container>
   );
}
