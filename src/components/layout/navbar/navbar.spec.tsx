import { render, screen } from '@testing-library/react';
import Navbar from './navbar.component';

describe('Navbar', () => {
   it('the navbar title is in the document', () => {
      render(
         <Navbar title="custom_title">
            <></>
         </Navbar>
      );
      expect(screen.getByText('custom_title')).toBeInTheDocument();
   });
});
