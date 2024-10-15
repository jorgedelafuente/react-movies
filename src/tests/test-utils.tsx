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

export const renderWithQueryContext = (
   ui: React.ReactNode,
   { ...options } = {}
) => {
   const testQueryClient = createTestQueryClient();

   const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={testQueryClient}>
         {children}
      </QueryClientProvider>
   );
   return render(ui, { wrapper: Wrapper, ...options });
};
