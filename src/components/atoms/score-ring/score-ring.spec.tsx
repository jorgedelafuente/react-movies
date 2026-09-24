import { render, screen, within } from '@testing-library/react';
import { configureAxe } from 'vitest-axe';

import ScoreRing from './score-ring.component';

const axe = configureAxe({
   rules: {
      'color-contrast': { enabled: false },
   },
});

describe('ScoreRing', () => {
   it('shows the score to one decimal, out of ten, with the vote count', () => {
      render(<ScoreRing score={7.677} votes={3046} />);

      const ring = screen.getByTestId('score-ring');
      expect(within(ring).getByText('7.7')).toBeInTheDocument();
      expect(within(ring).getByText('/ 10')).toBeInTheDocument();
      expect(within(ring).getByText('User score')).toBeInTheDocument();
      expect(within(ring).getByText('3,046 votes')).toBeInTheDocument();
   });

   it('fills the arc in proportion to the score', () => {
      render(<ScoreRing score={7.5} />);

      const arc = screen.getByTestId('score-ring-arc');
      expect(arc).toHaveAttribute('stroke-dasharray', '100');
      expect(Number(arc.getAttribute('stroke-dashoffset'))).toBeCloseTo(25);
   });

   it('leaves the vote line out when the count is unknown', () => {
      render(<ScoreRing score={8.2} />);

      expect(screen.queryByText(/votes/)).not.toBeInTheDocument();
      expect(screen.queryByText('Not yet rated')).not.toBeInTheDocument();
   });

   it('reads NR with an empty track when nobody has voted', () => {
      render(<ScoreRing score={0} votes={0} />);

      expect(screen.getByText('NR')).toBeInTheDocument();
      expect(screen.getByText('Not yet rated')).toBeInTheDocument();
      expect(screen.queryByTestId('score-ring-arc')).not.toBeInTheDocument();
      expect(screen.queryByText('0.0')).not.toBeInTheDocument();
   });

   it('takes a custom label', () => {
      render(<ScoreRing score={6.6} label="Season score" />);

      expect(screen.getByText('Season score')).toBeInTheDocument();
   });

   it('has no axe violations', async () => {
      const { container } = render(<ScoreRing score={7.677} votes={3046} />);

      expect(await axe(container)).toHaveNoViolations();
   });
});
