import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithAxe } from '@/tests/test-utils';

import MediaImage from './media-image.component';

describe('MediaImage', () => {
   it('renders the TMDB image when a path is given', () => {
      render(<MediaImage path="/poster.jpg" alt="The Substance" />);
      const img = screen.getByRole('img', { name: 'The Substance' });
      expect(img.tagName).toBe('IMG');
      expect(img).toHaveAttribute(
         'src',
         'https://image.tmdb.org/t/p/w500//poster.jpg'
      );
      expect(screen.queryByTestId('media-image-skeleton')).toBeNull();
   });

   it('renders a labelled skeleton instead of a broken image when there is no path', () => {
      render(<MediaImage path={null} alt="The Substance" />);
      expect(document.querySelector('img')).toBeNull();
      const skeleton = screen.getByRole('img', { name: 'The Substance' });
      expect(skeleton).toBe(screen.getByTestId('media-image-skeleton'));
   });

   it('hides the skeleton from assistive tech when the image is decorative', () => {
      render(<MediaImage path={undefined} alt="" />);
      const skeleton = screen.getByTestId('media-image-skeleton');
      expect(skeleton).toHaveAttribute('aria-hidden', 'true');
      expect(skeleton).not.toHaveAttribute('role');
   });

   it('swaps to the skeleton when the image fails to load', () => {
      render(<MediaImage path="/missing.jpg" alt="Poster" />);
      fireEvent.error(screen.getByRole('img', { name: 'Poster' }));
      expect(document.querySelector('img')).toBeNull();
      expect(screen.getByTestId('media-image-skeleton')).toBeInTheDocument();
   });

   it('retries with a new path after a failure', () => {
      const { rerender } = render(
         <MediaImage path="/missing.jpg" alt="Poster" />
      );
      fireEvent.error(screen.getByRole('img', { name: 'Poster' }));
      expect(document.querySelector('img')).toBeNull();

      rerender(<MediaImage path="/found.jpg" alt="Poster" />);
      expect(document.querySelector('img')).toHaveAttribute(
         'src',
         'https://image.tmdb.org/t/p/w500//found.jpg'
      );
   });

   it('gives the skeleton the shared classes plus its own fallback classes', () => {
      render(
         <MediaImage
            path={null}
            alt=""
            className="w-full rounded-md"
            fallbackClassName="aspect-[1/1.5]"
         />
      );
      const skeleton = screen.getByTestId('media-image-skeleton');
      expect(skeleton).toHaveClass('w-full', 'rounded-md', 'aspect-[1/1.5]');
      expect(skeleton).toHaveClass('bg-subtle');
   });

   it('has no accessibility violations in either state', async () => {
      const withImage = await renderWithAxe(
         <MediaImage path="/poster.jpg" alt="Poster" />
      );
      expect(withImage.violations).toHaveNoViolations();
      withImage.unmount();

      const withSkeleton = await renderWithAxe(
         <MediaImage path={null} alt="Poster" />
      );
      expect(withSkeleton.violations).toHaveNoViolations();
   });
});
