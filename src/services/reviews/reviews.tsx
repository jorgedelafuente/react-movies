import axios from 'redaxios';

import { tmdbBaseUrl } from '@/services/config';
import type { MediaType } from '@/types/media.types';
import {
   ReviewListSchema,
   sortReviewsNewestFirst,
} from '@/types/reviews.schemas';

const apiKey = import.meta.env.VITE_APIKEY;
axios.defaults.baseURL = tmdbBaseUrl;

/**
 * `/movie/{id}/reviews` and `/tv/{id}/reviews` return the same shape, so a
 * single fetcher keyed by media type serves both detail pages. Only the first
 * page is fetched; TMDB pages hold 20 and few titles have more than that.
 */
const reviewsPath = (mediaType: MediaType, id: number) =>
   `/${mediaType}/${id}/reviews${apiKey}&page=1`;

export const fetchMediaReviews = async (mediaType: MediaType, id: number) => {
   return axios.get(reviewsPath(mediaType, id)).then((res) => {
      const list = ReviewListSchema.parse(res.data);
      return { ...list, results: sortReviewsNewestFirst(list.results) };
   });
};
