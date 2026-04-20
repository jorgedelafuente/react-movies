import axios from 'redaxios';

import {
   FilmInfoSchema,
   FilmListSchema,
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
   search: (searchQuery: string) =>
      `/search/movie${apiKey}&query=${encodeURIComponent(searchQuery)}`,
};

export const fetchPopularFilms = async () => {
   await new Promise((res) => setTimeout(res, 500));
   return axios
      .get(paramOptions.popular())
      .then((res) => FilmListSchema.parse(res.data).results);
};

export const fetchTopRatedFilms = async () => {
   await new Promise((res) => setTimeout(res, 500));
   return axios
      .get(paramOptions.top_rated())
      .then((res) => FilmListSchema.parse(res.data).results);
};

export const fetchUpcoming = async () => {
   await new Promise((res) => setTimeout(res, 500));
   return axios
      .get(paramOptions.upcoming())
      .then((res) => FilmListSchema.parse(res.data).results);
};

export const fetchFilm = async (filmId: number) => {
   await new Promise((res) => setTimeout(res, 500));
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
   await new Promise((res) => setTimeout(res, 500));
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

export const searchFilm = async (searchQuery: string) => {
   await new Promise((res) => setTimeout(res, 500));
   return axios
      .get(paramOptions.search(searchQuery))
      .then((res) => FilmListSchema.parse(res.data).results);
};
