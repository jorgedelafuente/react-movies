import { render } from '@testing-library/react';

import FilmInfo from './film-info.view';
import { MOCK_FILM_INFO, MOCK_FILM_TRAILER } from '@/tests/__mocks__/mocks';

const MOCK_TITLE = 'Deadpool &amp; Wolverine';

describe('Film Info Component', () => {
   it('Film Info title is visible', () => {
      const { getByTestId } = render(
         <FilmInfo filmInfo={MOCK_FILM_INFO} filmTrailer={MOCK_FILM_TRAILER} />
      );
      const headingElement = getByTestId('film-info-title');
      expect(headingElement.innerHTML).toEqual(MOCK_TITLE);
   });
});
