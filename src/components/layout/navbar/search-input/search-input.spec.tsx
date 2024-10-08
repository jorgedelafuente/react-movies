import { afterEach, describe, expect, it } from 'vitest';
import {
   render,
   cleanup,
   fireEvent,
   screen,
   waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TestingQueryWrapper } from '@/tests/test-utils';
import SearchInput from './search-input';

describe('Search Input', () => {
   beforeEach(() => {
      render(
         <TestingQueryWrapper>
            <SearchInput />
         </TestingQueryWrapper>
      );
   });
   afterEach(() => {
      cleanup();
   });

   it('search input should start with empty default state', () => {
      const { textContent } = screen.getByTestId('custom-input');
      expect(textContent).toBe('');
   });

   it('search input value changes correctly', () => {
      const input = screen.getByTestId('custom-input') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'Search' } });
      expect(input.value).toBe('Search');
   });

   it('search input does not accept backticks', async () => {
      const input = screen.getByRole('searchbox') as HTMLInputElement;
      userEvent.type(input, '`te`st`');
      await waitFor(() => {
         expect(input.value).toBe('test');
      });
   });
});
