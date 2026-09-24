import { queryOptions } from '@tanstack/react-query';

import {
   fetchFilm,
   fetchFilmCredits,
   fetchFilmRecommendations,
   fetchFilmVideo,
} from './films';

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

export const filmCreditsQueryOptions = (filmId: number) =>
   queryOptions({
      queryKey: ['film-credits', { filmId }],
      queryFn: () => fetchFilmCredits(filmId),
   });

export const filmRecommendationsQueryOptions = (filmId: number) =>
   queryOptions({
      queryKey: ['film-recommendations', { filmId }],
      queryFn: () => fetchFilmRecommendations(filmId),
   });
