import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

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

export function renderWithClient(ui: React.ReactElement) {
   const testQueryClient = createTestQueryClient();
   const { rerender, ...result } = render(
      <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
   );
   return {
      ...result,
      rerender: (rerenderUi: React.ReactElement) =>
         rerender(
            <QueryClientProvider client={testQueryClient}>
               {rerenderUi}
            </QueryClientProvider>
         ),
   };
}

export function createWrapper() {
   const testQueryClient = createTestQueryClient();
   return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={testQueryClient}>
         {children}
      </QueryClientProvider>
   );
}
