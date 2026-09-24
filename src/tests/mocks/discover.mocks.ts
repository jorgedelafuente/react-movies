import { MOCK_FILM_LIST } from './films.mocks';

export const MOCK_GENRES = {
   genres: [
      { id: 28, name: 'Action' },
      { id: 18, name: 'Drama' },
      { id: 878, name: 'Science Fiction' },
   ],
};

export const MOCK_DISCOVER_MOVIES = {
   page: 2,
   total_pages: 812,
   total_results: 16231,
   results: MOCK_FILM_LIST.results.slice(0, 4),
};
