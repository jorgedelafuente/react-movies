import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureAxe } from 'vitest-axe';

import { renderWithQueryContext } from '@/tests/test-utils';
import SearchInput from './search-input.component';

const axe = configureAxe({
   rules: {
      // jsdom does not fully implement pseudo-element styles used by this rule.
      'color-contrast': { enabled: false },
   },
});

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

   it('has no accessibility violations on initial render', async () => {
      const { container } = renderWithQueryContext(<SearchInput />);
      const results = await axe(container);

      expect(results).toHaveNoViolations();
   });

   it('search input does not accept backticks', async () => {
      const input = screen.getByRole('searchbox');
      await userEvent.type(input, '`te`st`');
      await waitFor(() => {
         expect(input).toHaveValue('test');
      });
   });
});
