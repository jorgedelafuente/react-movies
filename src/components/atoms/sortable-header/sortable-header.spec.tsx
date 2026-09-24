import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureAxe } from 'vitest-axe';

import SortableHeader from './sortable-header.component';

const axe = configureAxe({
   rules: {
      'color-contrast': { enabled: false },
   },
});

describe('SortableHeader', () => {
   it('exposes the sort state via aria-sort', () => {
      render(
         <table>
            <thead>
               <tr>
                  <SortableHeader sorted="asc" onSort={vi.fn()}>
                     Title
                  </SortableHeader>
               </tr>
            </thead>
         </table>
      );

      expect(screen.getByRole('columnheader')).toHaveAttribute(
         'aria-sort',
         'ascending'
      );
   });

   it('is reachable and activatable by keyboard', async () => {
      const onSort = vi.fn();
      render(
         <table>
            <thead>
               <tr>
                  <SortableHeader sorted={false} onSort={onSort}>
                     Title
                  </SortableHeader>
               </tr>
            </thead>
         </table>
      );

      await userEvent.tab();
      expect(screen.getByRole('button', { name: /title/i })).toHaveFocus();

      await userEvent.keyboard('{Enter}');
      expect(onSort).toHaveBeenCalledTimes(1);
   });

   it('has no accessibility violations', async () => {
      const { container } = render(
         <table>
            <thead>
               <tr>
                  <SortableHeader sorted={false} onSort={vi.fn()}>
                     Title
                  </SortableHeader>
               </tr>
            </thead>
         </table>
      );

      expect(await axe(container)).toHaveNoViolations();
   });
});
