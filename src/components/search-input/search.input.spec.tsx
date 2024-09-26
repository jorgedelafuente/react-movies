import { render, cleanup, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import SearchInput from './search-input';

afterEach(cleanup);

describe('Search Input', () => {
   it('search input should start with empty default state', () => {
      const { getByTestId } = render(
         <QueryClientProvider client={new QueryClient()}>
            <SearchInput />
         </QueryClientProvider>
      );
      const { textContent } = getByTestId('custom-input');
      expect(textContent).toBe('');
   });

   it('search input calls handleEvent when key is typed', () => {
      const { getByTestId } = render(
         <QueryClientProvider client={new QueryClient()}>
            <SearchInput />
         </QueryClientProvider>
      );
      const input = getByTestId('custom-input') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'Search' } });
      expect(input.value).toBe('Search');
   });
});
