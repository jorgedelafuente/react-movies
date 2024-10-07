import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const createTestQueryClient = () => {
   return new QueryClient({
      defaultOptions: {
         queries: {
            retry: false,
            staleTime: 0,
         },
      },
   });
};

export const TestingQueryWrapper = ({ children }: { children: ReactNode }) => {
   const testQueryClient = createTestQueryClient();
   return (
      <QueryClientProvider client={testQueryClient}>
         {children}
      </QueryClientProvider>
   );
};
