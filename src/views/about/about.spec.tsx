import About from './about.view';
import { render, screen } from '@testing-library/react';

describe('Renders About Page', () => {
   it('should render about page', () => {
      render(<About />);
      expect(screen.getByText(/tech stack/i)).toBeInTheDocument();
   });
});
