import { fireEvent, render, screen } from '@testing-library/react';
import Counter from './counter.component';

describe('Counter Component', () => {
   it('should renders Counter Component Title', () => {
      const screen = render(<Counter />);
      const title = screen.queryByText(
         'If you enjoyed this app please give us a thumbs up : Current count:'
      );
      expect(title).toBeInTheDocument();
   });

   it('should render Increment button', () => {
      const screen = render(<Counter />);
      const incrementButton = screen.getByRole('button', {
         name: '👍 Increment',
      });
      expect(incrementButton).toBeInTheDocument();
   });

   it('should render Decrement button', () => {
      const screen = render(<Counter />);
      const decrementButton = screen.getByRole('button', {
         name: '👎 Decrement',
      });
      expect(decrementButton).toBeInTheDocument();
   });

   it('should increments counter when increment is clicked', () => {
      const { container } = render(<Counter />);
      const incrementButton = screen.getByText('👍 Increment');
      fireEvent.click(incrementButton);
      const countVal = container.querySelector('span');
      expect(countVal?.textContent).toBe('1');
   });

   it('should decrement counter when decrement is clicked', () => {
      const screen = render(<Counter countValue={0} />);
      const incrementButton = screen.getByRole('button', {
         name: '👍 Increment',
      });
      const decrementButton = screen.getByRole('button', {
         name: '👎 Decrement',
      });
      const counterValue = screen.container.querySelector('span');
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);
      fireEvent.click(decrementButton);
      expect(counterValue).toHaveTextContent('2');
   });
});
