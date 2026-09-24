import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithAxe } from '@/tests/test-utils';

import Chip from './chip.component';

describe('Chip', () => {
   it('is a toggle button when `selected` is given', () => {
      render(
         <>
            <Chip selected>Films</Chip>
            <Chip selected={false}>Series</Chip>
         </>
      );
      const films = screen.getByRole('button', { name: 'Films' });
      const series = screen.getByRole('button', { name: 'Series' });
      expect(films).toHaveAttribute('aria-pressed', 'true');
      expect(films).toHaveClass('border-accent', 'bg-accent/10', 'text-accent');
      expect(series).toHaveAttribute('aria-pressed', 'false');
      expect(series).toHaveClass('border-copy/30');
      expect(series).not.toHaveClass('bg-accent/10');
   });

   it('is a plain action button without `selected`, forwarding aria props', () => {
      render(
         <Chip aria-expanded={false} aria-controls="filters">
            Show filters
         </Chip>
      );
      const chip = screen.getByRole('button', { name: 'Show filters' });
      expect(chip).not.toHaveAttribute('aria-pressed');
      expect(chip).toHaveAttribute('aria-expanded', 'false');
      expect(chip).toHaveAttribute('aria-controls', 'filters');
      expect(chip).toHaveAttribute('type', 'button');
   });

   it('appends extra classes and fires onClick', () => {
      const onClick = vi.fn();
      render(
         <Chip className="mt-4 sm:hidden" onClick={onClick}>
            Toggle
         </Chip>
      );
      const chip = screen.getByRole('button', { name: 'Toggle' });
      expect(chip).toHaveClass('rounded-full', 'mt-4', 'sm:hidden');
      fireEvent.click(chip);
      expect(onClick).toHaveBeenCalledTimes(1);
   });

   it('has no accessibility violations', async () => {
      const { violations } = await renderWithAxe(
         <div>
            <Chip selected>Films</Chip>
            <Chip selected={false}>Series</Chip>
         </div>
      );
      expect(violations).toHaveNoViolations();
   });
});
