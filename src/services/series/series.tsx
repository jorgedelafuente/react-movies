import axios from 'redaxios';

import { tmdbBaseUrl } from '@/services/config';
import { FilmCreditsSchema, FilmVideoListSchema } from '@/types/films.schemas';
import {
   SeriesInfoSchema,
   SeriesListSchema,
   SeriesRecommendationsSchema,
} from '@/types/series.schemas';

export class SeriesNotFoundError extends Error {}

const apiKey = import.meta.env.VITE_APIKEY;
axios.defaults.baseURL = tmdbBaseUrl;

const paramOptions = {
   popular: () => `/tv/popular${apiKey}&language=en-US&page=1`,
   top_rated: () => `/tv/top_rated${apiKey}&language=en-US&page=1`,
   on_the_air: () => `/tv/on_the_air${apiKey}&language=en-US&page=1`,
   seriesInfo: (seriesId: number) =>
      `/tv/${seriesId}${apiKey}&language=en-US&append_to_response=external_ids`,
   seriesVideo: (seriesId: number) =>
      `/tv/${seriesId}/videos${apiKey}&language=en-US`,
   seriesCredits: (seriesId: number) =>
      `/tv/${seriesId}/credits${apiKey}&language=en-US`,
   seriesRecommendations: (seriesId: number) =>
      `/tv/${seriesId}/recommendations${apiKey}&language=en-US&page=1`,
};

export const fetchPopularSeries = async () => {
   return axios
      .get(paramOptions.popular())
      .then((res) => SeriesListSchema.parse(res.data).results);
};

export const fetchTopRatedSeries = async () => {
   return axios
      .get(paramOptions.top_rated())
      .then((res) => SeriesListSchema.parse(res.data).results);
};

export const fetchOnTheAirSeries = async () => {
   return axios
      .get(paramOptions.on_the_air())
      .then((res) => SeriesListSchema.parse(res.data).results);
};

export const fetchSeries = async (seriesId: number) => {
   return axios
      .get(paramOptions.seriesInfo(seriesId))
      .then((res) => SeriesInfoSchema.parse(res.data))
      .catch((err) => {
         if (err.status === 404) {
            throw new SeriesNotFoundError(
               `Series with id "${seriesId}" not found!`
            );
         }
         throw err;
      });
};

export const fetchSeriesVideo = async (seriesId: number) => {
   return axios
      .get(paramOptions.seriesVideo(seriesId))
      .then((res) => FilmVideoListSchema.parse(res.data))
      .catch((err) => {
         if (err.status === 404) {
            throw new SeriesNotFoundError(
               `Series with id "${seriesId}" not found!`
            );
         }
         throw err;
      });
};

export const fetchSeriesCredits = async (seriesId: number) => {
   return axios
      .get(paramOptions.seriesCredits(seriesId))
      .then((res) => FilmCreditsSchema.parse(res.data));
};

export const fetchSeriesRecommendations = async (seriesId: number) => {
   return axios
      .get(paramOptions.seriesRecommendations(seriesId))
      .then((res) =>
         SeriesRecommendationsSchema.parse(res.data).results.slice(0, 12)
      );
};
