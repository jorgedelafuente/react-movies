import {
   fireEvent,
   render,
   screen,
   renderHook,
   waitFor,
} from '@testing-library/react';

import Counter, { useCounterHook } from './counter.component';

describe('Counter Component', () => {
   it('should renders Counter Component Title', () => {
      const screen = render(<Counter />);
      const titleQueryByText = screen.queryByText(
         'If you enjoyed this app please give us a thumbs up : Current count:'
      );
      const titleGetByText = screen.getByText(
         /if you enjoyed this app please give us a thumbs up : Current count:/i
      );
      expect(titleQueryByText).toBeInTheDocument();
      expect(titleGetByText).toBeInTheDocument();
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

describe('Test Custom Hook', async () => {
   it('should render initial count', () => {
      const { result } = renderHook(() => useCounterHook(1));
      expect(result.current.count).toBe(1);
   });
   it('should increment', async () => {
      const { result } = renderHook(() => useCounterHook(1));
      await waitFor(async () => {
         result.current.increment();
         result.current.increment();
         result.current.increment();
         result.current.increment();
      });
      expect(result.current.count).toBe(5);
   });
   it('should decrement', async () => {
      const { result } = renderHook(() => useCounterHook(1));
      await waitFor(async () => {
         result.current.decrement();
         result.current.decrement();
      });
      expect(result.current.count).toBe(-1);
   });
});
