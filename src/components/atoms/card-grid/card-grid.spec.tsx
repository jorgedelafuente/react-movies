import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import CardGrid from './card-grid.component';

describe('CardGrid', () => {
   it('renders its children inside the centred grid', () => {
      render(
         <CardGrid>
            <article>one</article>
            <article>two</article>
         </CardGrid>
      );
      const grid = screen.getByText('one').parentElement;
      expect(grid).toHaveClass('card-grid');
      expect(grid?.children).toHaveLength(2);
   });

   it('appends spacing utilities without dropping the grid class', () => {
      render(
         <CardGrid className="mt-6">
            <span>card</span>
         </CardGrid>
      );
      expect(screen.getByText('card').parentElement).toHaveClass(
         'card-grid',
         'mt-6'
      );
   });
});
