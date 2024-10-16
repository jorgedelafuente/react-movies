import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithQueryContext } from '@/tests/test-utils';
import SearchInput from './search-input';

describe('Search Input', () => {
   beforeEach(() => {
      renderWithQueryContext(<SearchInput />);
   });
   afterEach(() => {
      cleanup();
   });

   it('search input should start with empty default state', () => {
      const { textContent } = screen.getByRole('searchbox');
      expect(textContent).toBe('');
   });

   it('search input value changes correctly', () => {
      const input = screen.getByPlaceholderText(/search/i);
      fireEvent.change(input, { target: { value: 'user input' } });
      expect(input).toHaveValue('user input');
   });

   it('search input does not accept backticks', async () => {
      const input = screen.getByRole('searchbox');
      await userEvent.type(input, '`te`st`');
      await waitFor(() => {
         expect(input).toHaveValue('test');
      });
   });
});
