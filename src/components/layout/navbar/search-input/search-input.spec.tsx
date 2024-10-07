import { afterEach, describe, expect, it } from 'vitest';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';
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

   it('search input does not accept backticks', () => {
      const input = screen.getByTestId('custom-input') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '`te`st`' } });
      expect(input.value).toBe('test');
   });
});
