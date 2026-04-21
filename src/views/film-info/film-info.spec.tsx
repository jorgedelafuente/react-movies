import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

import { MOCK_FILM_INFO, MOCK_FILM_TRAILER } from '@/tests/__mocks__/mocks';

import FilmInfo from './film-info.view';

const MOCK_TITLE = 'Deadpool &amp; Wolverine';

describe('Film Info Component', () => {
   it('Film Info title is visible', () => {
      const queryClient = new QueryClient();
      const { getByTestId } = render(
         <QueryClientProvider client={queryClient}>
            <FilmInfo filmInfo={MOCK_FILM_INFO} filmTrailer={MOCK_FILM_TRAILER} />
         </QueryClientProvider>
      );
      const headingElement = getByTestId('film-info-title');
      expect(headingElement.innerHTML).toEqual(MOCK_TITLE);
      queryClient.clear();
   });
});
