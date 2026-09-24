import { queryOptions } from '@tanstack/react-query';

import {
   fetchOnTheAirSeries,
   fetchPopularSeries,
   fetchTopRatedSeries,
} from './series';

export const seriesPopularQueryOptions = queryOptions({
   queryKey: ['series-popular'],
   queryFn: () => fetchPopularSeries(),
});

export const seriesTopRatedQueryOptions = queryOptions({
   queryKey: ['series-topRated'],
   queryFn: () => fetchTopRatedSeries(),
});

export const seriesOnTheAirQueryOptions = queryOptions({
   queryKey: ['series-onTheAir'],
   queryFn: () => fetchOnTheAirSeries(),
});
