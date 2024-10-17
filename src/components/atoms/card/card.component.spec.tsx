import { vi, afterEach } from 'vitest';
import { fireEvent, render, cleanup } from '@testing-library/react';
import Card from './card.component';

const handleButtonClick = () => {};
const mockHandler = vi.fn(handleButtonClick);

describe('Card Component', () => {
   afterEach(cleanup);

   it('Renders Card component with children', () => {
      const component = render(
         <Card>
            children{' '}
            <div style={{ color: 'rgb(255,0,0)' }}>
               <button
                  style={{ color: 'rgb(22, 22, 22)' }}
                  onClick={mockHandler}
               >
                  click me!
               </button>{' '}
            </div>
         </Card>
      );
      const card = component.container.querySelector('custom-card');
      expect(card).toBeVisible;
      expect(component.getByText('children')).toBeVisible;
      expect(component.getByText('click me!')).toBeVisible;

      const button = component.getByText('click me!');
      expect(component.getByText('click me!')).toHaveStyle(
         'color: rgb(22,22,22)'
      );
      expect(component.getByText('click me!').parentNode).toHaveStyle(
         'color: rgb(255,0,0)'
      );
      fireEvent.click(button);
      expect(mockHandler.mock.calls).toHaveLength(1);
      fireEvent.click(button);
      expect(mockHandler.mock.calls).toHaveLength(2);
      expect(mockHandler).toHaveBeenCalledTimes(2);
   });
});
