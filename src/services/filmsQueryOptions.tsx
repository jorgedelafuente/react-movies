import { queryOptions } from '@tanstack/react-query';
import { fetchFilms } from './films';

export const filmsQueryOptions = queryOptions({
  queryKey: ['films'],
  queryFn: () => fetchFilms(),
});
