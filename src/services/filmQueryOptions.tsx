import { queryOptions } from '@tanstack/react-query';
import { fetchFilm } from './films';

export const filmQueryOptions = (filmId: string) =>
  queryOptions({
    queryKey: ['film', { filmId }],
    queryFn: () => fetchFilm(filmId),
  });
