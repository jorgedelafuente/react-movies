import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithAxe } from '@/tests/test-utils';

import StickyTitle from './sticky-title.component';

describe('StickyTitle', () => {
   it('renders the title as the level-one heading of the page', () => {
      render(<StickyTitle>Fight Club</StickyTitle>);
      expect(
         screen.getByRole('heading', { level: 1, name: 'Fight Club' })
      ).toHaveClass('sticky-title');
   });

   it('exposes the visible title through the test id', () => {
      render(<StickyTitle testId="film-info-title">Fight Club</StickyTitle>);
      expect(screen.getByTestId('film-info-title')).toHaveTextContent(
         'Fight Club'
      );
   });

   it('renders a plain paragraph when the page already has its own heading', () => {
      render(
         <StickyTitle as="p" testId="season-info-title">
            Game of Thrones · Season 1
         </StickyTitle>
      );
      expect(screen.queryByRole('heading')).toBeNull();
      expect(screen.getByTestId('season-info-title').closest('p')).toHaveClass(
         'sticky-title'
      );
   });

   it('has no accessibility violations', async () => {
      const { violations } = await renderWithAxe(
         <StickyTitle>Fight Club</StickyTitle>
      );
      expect(violations).toHaveNoViolations();
   });
});
