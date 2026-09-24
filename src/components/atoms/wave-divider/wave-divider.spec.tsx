import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithAxe } from '@/tests/test-utils';

import WaveDivider from './wave-divider.component';

describe('WaveDivider', () => {
   it('is decorative: hidden from assistive tech and never a focus target', () => {
      const { container } = render(<WaveDivider />);
      const root = container.firstElementChild as HTMLElement;
      expect(root).toHaveAttribute('aria-hidden', 'true');
      expect(root).toHaveClass('wave-divider');
      expect(root.querySelectorAll('svg path')).toHaveLength(3);
   });

   it('takes tint and corner classes from the consumer', () => {
      const { container } = render(
         <WaveDivider className="rounded-t-lg text-copy/25" />
      );
      expect(container.firstElementChild).toHaveClass(
         'wave-divider',
         'rounded-t-lg',
         'text-copy/25'
      );
      expect(container.firstElementChild).not.toHaveClass(
         'wave-divider--bottom'
      );
   });

   it('hangs from the bottom edge when asked', () => {
      const { container } = render(<WaveDivider edge="bottom" />);
      expect(container.firstElementChild).toHaveClass(
         'wave-divider',
         'wave-divider--bottom'
      );
   });

   it('has no accessibility violations', async () => {
      const { violations } = await renderWithAxe(<WaveDivider />);
      expect(violations).toHaveNoViolations();
   });
});
