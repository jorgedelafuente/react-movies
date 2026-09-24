import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithAxe } from '@/tests/test-utils';

import Select from './select.component';

const renderSelect = (onChange = vi.fn()) =>
   render(
      <Select id="year" label="Year" className="sm:w-32" onChange={onChange}>
         <option value="">Any year</option>
         <option value="1999">1999</option>
      </Select>
   );

describe('Select', () => {
   it('associates the label with the native select', () => {
      renderSelect();
      const select = screen.getByLabelText('Year');
      expect(select.tagName).toBe('SELECT');
      expect(select).toHaveAttribute('id', 'year');
      expect(screen.getByRole('option', { name: '1999' })).toBeInTheDocument();
   });

   it('passes native props through and reports changes', () => {
      const onChange = vi.fn();
      renderSelect(onChange);
      fireEvent.change(screen.getByLabelText('Year'), {
         target: { value: '1999' },
      });
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(screen.getByLabelText('Year')).toHaveValue('1999');
   });

   it('puts the wrapper class on the field, not the control, and hides the chevron', () => {
      const { container } = renderSelect();
      expect(container.firstElementChild).toHaveClass('sm:w-32');
      expect(screen.getByLabelText('Year')).not.toHaveClass('sm:w-32');
      const chevron = container.querySelector('svg');
      expect(chevron).toHaveAttribute('aria-hidden', 'true');
      expect(chevron).toHaveClass('pointer-events-none');
   });

   it('has no accessibility violations', async () => {
      const { violations } = await renderWithAxe(
         <Select id="year" label="Year">
            <option value="">Any year</option>
         </Select>
      );
      expect(violations).toHaveNoViolations();
   });
});
