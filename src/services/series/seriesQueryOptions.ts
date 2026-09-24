import { queryOptions } from '@tanstack/react-query';

import {
   fetchSeason,
   fetchSeries,
   fetchSeriesCredits,
   fetchSeriesRecommendations,
   fetchSeriesVideo,
} from './series';

export const seriesQueryOptions = (seriesId: number) =>
   queryOptions({
      queryKey: ['series', { seriesId }],
      queryFn: () => fetchSeries(seriesId),
   });

export const seriesVideoQueryOptions = (seriesId: number) =>
   queryOptions({
      queryKey: ['series-video', { seriesId }],
      queryFn: () => fetchSeriesVideo(seriesId),
   });

export const seriesCreditsQueryOptions = (seriesId: number) =>
   queryOptions({
      queryKey: ['series-credits', { seriesId }],
      queryFn: () => fetchSeriesCredits(seriesId),
   });

export const seriesRecommendationsQueryOptions = (seriesId: number) =>
   queryOptions({
      queryKey: ['series-recommendations', { seriesId }],
      queryFn: () => fetchSeriesRecommendations(seriesId),
   });

export const seasonQueryOptions = (seriesId: number, seasonNumber: number) =>
   queryOptions({
      queryKey: ['series-season', { seriesId, seasonNumber }],
      queryFn: () => fetchSeason(seriesId, seasonNumber),
   });
