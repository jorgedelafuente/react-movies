import { queryOptions } from '@tanstack/react-query';
import { fetchPopularFilms, fetchTopRatedFilms, fetchUpcoming } from './films';

export const filmsPopularQueryOptions = queryOptions({
   queryKey: ['films-popular'],
   queryFn: () => fetchPopularFilms(),
});

export const filmsTopRatedQueryOptions = queryOptions({
   queryKey: ['films-topRated'],
   queryFn: () => fetchTopRatedFilms(),
});

export const filmsUpcoming = queryOptions({
   queryKey: ['films-upcoming'],
   queryFn: () => fetchUpcoming(),
});
