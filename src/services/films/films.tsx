import axios from 'redaxios';

import {
   FilmCreditsSchema,
   FilmInfoSchema,
   FilmListSchema,
   FilmRecommendationsSchema,
   FilmVideoListSchema,
} from '@/types/films.schemas';

export class FilmNotFoundError extends Error {}

const apiKey = import.meta.env.VITE_APIKEY;
axios.defaults.baseURL = 'https://api.themoviedb.org/3';

const paramOptions = {
   popular: () => `/movie/popular${apiKey}&language=en-US&page=1`,
   top_rated: () => `/movie/top_rated${apiKey}&language=en-US&page=1`,
   upcoming: () => `/movie/upcoming${apiKey}&language=en-US&page=1`,
   movieInfo: (filmId: number) => `movie/${filmId}${apiKey}&language=en-US`,
   movieVideo: (filmId: number) =>
      `movie/${filmId}/videos${apiKey}&language=en-US`,
   movieCredits: (filmId: number) =>
      `movie/${filmId}/credits${apiKey}&language=en-US`,
   movieRecommendations: (filmId: number) =>
      `movie/${filmId}/recommendations${apiKey}&language=en-US&page=1`,
   search: (searchQuery: string) =>
      `/search/movie${apiKey}&query=${encodeURIComponent(searchQuery)}`,
};

export const fetchPopularFilms = async () => {
   return axios
      .get(paramOptions.popular())
      .then((res) => FilmListSchema.parse(res.data).results);
};

export const fetchTopRatedFilms = async () => {
   return axios
      .get(paramOptions.top_rated())
      .then((res) => FilmListSchema.parse(res.data).results);
};

export const fetchUpcoming = async () => {
   return axios
      .get(paramOptions.upcoming())
      .then((res) => FilmListSchema.parse(res.data).results);
};

export const fetchFilm = async (filmId: number) => {
   const post = await axios
      .get(paramOptions.movieInfo(filmId))
      .then((res) => FilmInfoSchema.parse(res.data))
      .catch((err) => {
         if (err.status === 404) {
            throw new FilmNotFoundError(`Film with id "${filmId}" not found!`);
         }
         throw err;
      });

   return post;
};

export const fetchFilmVideo = async (filmId: number) => {
   const post = await axios
      .get(paramOptions.movieVideo(filmId))
      .then((res) => FilmVideoListSchema.parse(res.data))
      .catch((err) => {
         if (err.status === 404) {
            throw new FilmNotFoundError(`Film with id "${filmId}" not found!`);
         }
         throw err;
      });

   return post;
};

export const fetchFilmCredits = async (filmId: number) => {
   return axios
      .get(paramOptions.movieCredits(filmId))
      .then((res) => FilmCreditsSchema.parse(res.data));
};

export const fetchFilmRecommendations = async (filmId: number) => {
   return axios
      .get(paramOptions.movieRecommendations(filmId))
      .then((res) =>
         FilmRecommendationsSchema.parse(res.data).results.slice(0, 12)
      );
};

export const searchFilm = async (searchQuery: string) => {
   return axios
      .get(paramOptions.search(searchQuery))
      .then((res) => FilmListSchema.parse(res.data).results);
};
