import { fireEvent, render, screen } from '@testing-library/react';
import Counter from './counter.component';

describe('Counter Component', () => {
   it('Renders Counter Component Title', () => {
      render(<Counter />);
      const title = screen.queryByText(
         'If you enjoyed this app please give us a thumbs up : Current count:'
      );
      expect(title).toBeInTheDocument();
   });

   it('Renders Counter Component Increment', () => {
      render(<Counter />);
      expect(screen.getByText('👍 Increment')).toBeInTheDocument();
   });

   it('Renders Counter Component Decrement', () => {
      render(<Counter />);
      expect(screen.getByText('👎 Decrement')).toBeInTheDocument();
   });

   it('Increments counter when counter is clicked', () => {
      const { container } = render(<Counter />);
      const incrementButton = screen.getByText('👍 Increment');
      fireEvent.click(incrementButton);
      const countVal = container.querySelector('span');
      expect(countVal?.textContent).toBe('1');
   });

   it('Decrements counter when counter is clicked', () => {
      const { container } = render(<Counter />);
      const decrementButton = screen.getByText('👎 Decrement');
      fireEvent.click(decrementButton);
      const countVal = container.querySelector('span');
      expect(countVal).toHaveTextContent('-1');
   });
});
