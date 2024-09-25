import { queryOptions } from '@tanstack/react-query';
import { fetchFilm, fetchFilmVideo } from './films';

export const filmQueryOptions = (filmId: number) =>
   queryOptions({
      queryKey: ['film', { filmId }],
      queryFn: () => fetchFilm(filmId),
   });

export const filmVideoQueryOptions = (filmId: number) =>
   queryOptions({
      queryKey: ['film-video', { filmId }],
      queryFn: () => fetchFilmVideo(filmId),
   });
