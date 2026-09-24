import { render, screen } from '@testing-library/react';

import { MOCK_RELEASE_DATES } from '@/tests/__mocks__/mocks';

import {
   CertificationBadge,
   ReleaseDatesList,
} from './release-dates.component';

// jsdom reports navigator.language as en-US, so US is the preferred region.
const results = MOCK_RELEASE_DATES.results;

describe('CertificationBadge', () => {
   it('shows the rating and region for the preferred region', () => {
      render(<CertificationBadge results={results} />);
      const badge = screen.getByTestId('certification-badge');
      expect(badge).toHaveTextContent('R');
      expect(badge).toHaveTextContent('US');
   });

   it('renders nothing when no release has a certification', () => {
      const { container } = render(
         <CertificationBadge results={[results[3]]} />
      );
      expect(container).toBeEmptyDOMElement();
   });

   it('renders nothing when release dates are absent', () => {
      const { container } = render(<CertificationBadge />);
      expect(container).toBeEmptyDOMElement();
   });
});

describe('ReleaseDatesList', () => {
   it('is collapsed by default and shows the row count', () => {
      render(<ReleaseDatesList results={results} />);
      const details = screen.getByText(/release dates/i).closest('details');
      expect(details).not.toHaveAttribute('open');
      expect(screen.getByText('(6)')).toBeInTheDocument();
   });

   it('renders one row per release with country, type, date and rating', () => {
      render(<ReleaseDatesList results={results} />);
      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(6);

      // preferred region (US) comes first, ordered by date
      expect(items[0]).toHaveTextContent('United States');
      expect(items[0]).toHaveTextContent('Premiere');
      expect(items[0]).toHaveTextContent('22 Jul 2024');
      expect(items[0]).toHaveTextContent('New York City, New York');
      expect(items[1]).toHaveTextContent('Theatrical');
      expect(items[1]).toHaveTextContent('R');
      expect(items[2]).toHaveTextContent('Digital');
   });

   it('renders nothing when there are no release dates', () => {
      const { container } = render(<ReleaseDatesList results={[]} />);
      expect(container).toBeEmptyDOMElement();
   });
});
