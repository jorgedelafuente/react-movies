import { render, screen } from '@testing-library/react';

import About from './about.view';

describe('Renders About Page', () => {
   it('should render about page', () => {
      render(<About />);
      expect(screen.getByText(/tech stack/i)).toBeInTheDocument();
   });
});
